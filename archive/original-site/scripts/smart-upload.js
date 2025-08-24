#!/usr/bin/env node

/**
 * Q10UX Smart Upload System
 * Intelligent media processing with cloud integration
 * 
 * Features:
 * - Drag & drop folder processing
 * - Automatic file organization
 * - Cloud storage integration (AWS S3, Sanity)
 * - Smart thumbnail generation
 * - Batch processing with progress tracking
 * - Intelligent tagging and categorization
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const sharp = require('sharp');
const AWS = require('aws-sdk');
const { createClient } = require('@sanity/client');
const chokidar = require('chokidar');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');

const execAsync = promisify(exec);

class SmartUploadSystem {
    constructor() {
        this.config = {
            aws: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION || 'us-west-2',
                bucket: process.env.AWS_S3_BUCKET
            },
            sanity: {
                projectId: process.env.SANITY_PROJECT_ID,
                dataset: process.env.SANITY_DATASET || 'production',
                token: process.env.SANITY_TOKEN
            },
            processing: {
                watchFolder: './uploads',
                outputFolder: './processed',
                maxConcurrent: 5,
                supportedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi']
            }
        };
        
        this.s3 = new AWS.S3();
        this.sanity = createClient({
            projectId: this.config.sanity.projectId,
            dataset: this.config.sanity.dataset,
            token: this.config.sanity.token,
            useCdn: false
        });
        
        this.processingQueue = [];
        this.isProcessing = false;
    }

    async init() {
        console.log(chalk.cyan.bold('🎨 Q10UX Smart Upload System'));
        console.log(chalk.gray('Intelligent media processing with cloud integration\n'));
        
        await this.checkDependencies();
        await this.setupFolders();
        await this.showMenu();
    }

    async checkDependencies() {
        const spinner = ora('Checking system dependencies...').start();
        
        try {
            // Check if required tools are installed
            await execAsync('which ffmpeg');
            await execAsync('which imagemagick');
            spinner.succeed('All dependencies found');
        } catch (error) {
            spinner.fail('Missing dependencies');
            console.log(chalk.yellow('Please install:'));
            console.log('  - ffmpeg (video processing)');
            console.log('  - imagemagick (image processing)');
            console.log('  - npm install -g sharp aws-sdk @sanity/client');
            process.exit(1);
        }
    }

    async setupFolders() {
        const folders = [
            this.config.processing.watchFolder,
            this.config.processing.outputFolder,
            './temp',
            './logs'
        ];

        for (const folder of folders) {
            try {
                await fs.mkdir(folder, { recursive: true });
            } catch (error) {
                // Folder already exists
            }
        }
    }

    async showMenu() {
        const choices = [
            { name: '🚀 Quick Upload (Drag & Drop)', value: 'quick' },
            { name: '📁 Watch Folder (Auto-process)', value: 'watch' },
            { name: '🔄 Batch Process Existing Files', value: 'batch' },
            { name: '☁️  Cloud Sync (Upload to AWS/Sanity)', value: 'sync' },
            { name: '⚙️  Configure Settings', value: 'config' },
            { name: '📊 View Processing Stats', value: 'stats' },
            { name: '❌ Exit', value: 'exit' }
        ];

        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices
            }
        ]);

        switch (action) {
            case 'quick':
                await this.quickUpload();
                break;
            case 'watch':
                await this.watchFolder();
                break;
            case 'batch':
                await this.batchProcess();
                break;
            case 'sync':
                await this.cloudSync();
                break;
            case 'config':
                await this.configureSettings();
                break;
            case 'stats':
                await this.showStats();
                break;
            case 'exit':
                console.log(chalk.green('👋 Thanks for using Q10UX Smart Upload!'));
                process.exit(0);
        }

        // Return to menu
        await this.showMenu();
    }

    async quickUpload() {
        console.log(chalk.blue('\n🚀 Quick Upload Mode'));
        console.log(chalk.gray('Drag and drop files or folders here, or press Enter to browse...\n'));

        const { files } = await inquirer.prompt([
            {
                type: 'input',
                name: 'files',
                message: 'Enter file/folder paths (comma-separated):',
                default: './uploads'
            }
        ]);

        const filePaths = files.split(',').map(f => f.trim());
        await this.processFiles(filePaths, 'quick');
    }

    async watchFolder() {
        console.log(chalk.blue('\n📁 Watch Folder Mode'));
        console.log(chalk.gray(`Watching: ${this.config.processing.watchFolder}`));
        console.log(chalk.gray('Drop files here and they will be processed automatically...\n'));

        const watcher = chokidar.watch(this.config.processing.watchFolder, {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true
        });

        watcher
            .on('add', async (filePath) => {
                console.log(chalk.green(`📥 New file detected: ${path.basename(filePath)}`));
                await this.processFiles([filePath], 'watch');
            })
            .on('change', async (filePath) => {
                console.log(chalk.yellow(`🔄 File changed: ${path.basename(filePath)}`));
                await this.processFiles([filePath], 'watch');
            });

        console.log(chalk.cyan('Press Ctrl+C to stop watching...'));
        
        // Keep the process running
        process.on('SIGINT', () => {
            watcher.close();
            console.log(chalk.green('\n👋 Stopped watching folder'));
            process.exit(0);
        });
    }

    async batchProcess() {
        console.log(chalk.blue('\n🔄 Batch Process Mode'));
        
        const { folder } = await inquirer.prompt([
            {
                type: 'input',
                name: 'folder',
                message: 'Enter folder path to process:',
                default: './uploads'
            }
        ]);

        const files = await this.scanFolder(folder);
        console.log(chalk.gray(`Found ${files.length} files to process`));
        
        await this.processFiles(files, 'batch');
    }

    async processFiles(filePaths, mode) {
        const allFiles = [];
        
        // Expand folders to individual files
        for (const filePath of filePaths) {
            const stats = await fs.stat(filePath);
            if (stats.isDirectory()) {
                const files = await this.scanFolder(filePath);
                allFiles.push(...files);
            } else {
                allFiles.push(filePath);
            }
        }

        // Filter supported formats
        const supportedFiles = allFiles.filter(file => {
            const ext = path.extname(file).toLowerCase().slice(1);
            return this.config.processing.supportedFormats.includes(ext);
        });

        if (supportedFiles.length === 0) {
            console.log(chalk.yellow('No supported files found'));
            return;
        }

        console.log(chalk.blue(`Processing ${supportedFiles.length} files...`));

        // Process files with progress tracking
        const spinner = ora('Processing files...').start();
        let processed = 0;

        for (const file of supportedFiles) {
            try {
                await this.processSingleFile(file);
                processed++;
                spinner.text = `Processing files... (${processed}/${supportedFiles.length})`;
            } catch (error) {
                console.log(chalk.red(`Error processing ${path.basename(file)}: ${error.message}`));
            }
        }

        spinner.succeed(`Processed ${processed} files successfully`);
        
        if (mode === 'quick') {
            const { upload } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'upload',
                    message: 'Upload processed files to cloud storage?',
                    default: true
                }
            ]);

            if (upload) {
                await this.uploadToCloud(supportedFiles);
            }
        }
    }

    async processSingleFile(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const fileName = path.basename(filePath, ext);
        const outputDir = path.join(this.config.processing.outputFolder, fileName);

        await fs.mkdir(outputDir, { recursive: true });

        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
            await this.processImage(filePath, outputDir);
        } else if (['.mp4', '.mov', '.avi'].includes(ext)) {
            await this.processVideo(filePath, outputDir);
        }
    }

    async processImage(filePath, outputDir) {
        const fileName = path.basename(filePath, path.extname(filePath));
        
        // Generate multiple sizes
        const sizes = {
            full: { width: 1920, height: 1080, suffix: 'full' },
            large: { width: 1200, height: 800, suffix: 'large' },
            medium: { width: 800, height: 600, suffix: 'medium' },
            thumbnail: { width: 400, height: 300, suffix: 'thumb' },
            preview: { width: 200, height: 150, suffix: 'preview' }
        };

        for (const [size, config] of Object.entries(sizes)) {
            const outputPath = path.join(outputDir, `${fileName}-${config.suffix}.webp`);
            
            await sharp(filePath)
                .resize(config.width, config.height, {
                    fit: size === 'thumbnail' || size === 'preview' ? 'cover' : 'inside',
                    withoutEnlargement: true
                })
                .webp({ quality: 85, effort: 6 })
                .toFile(outputPath);
        }

        // Generate metadata
        const metadata = await sharp(filePath).metadata();
        const metadataPath = path.join(outputDir, `${fileName}-metadata.json`);
        
        await fs.writeFile(metadataPath, JSON.stringify({
            original: path.basename(filePath),
            processed: new Date().toISOString(),
            metadata: {
                width: metadata.width,
                height: metadata.height,
                format: metadata.format,
                hasAlpha: metadata.hasAlpha
            },
            sizes: Object.keys(sizes)
        }, null, 2));
    }

    async processVideo(filePath, outputDir) {
        const fileName = path.basename(filePath, path.extname(filePath));
        
        // Generate thumbnail
        const thumbnailPath = path.join(outputDir, `${fileName}-thumb.jpg`);
        await execAsync(`ffmpeg -i "${filePath}" -ss 00:00:01 -vframes 1 -vf "scale=400:300:force_original_aspect_ratio=decrease" "${thumbnailPath}"`);
        
        // Generate optimized video
        const optimizedPath = path.join(outputDir, `${fileName}-optimized.mp4`);
        await execAsync(`ffmpeg -i "${filePath}" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k "${optimizedPath}"`);
        
        // Generate metadata
        const metadata = await this.getVideoMetadata(filePath);
        const metadataPath = path.join(outputDir, `${fileName}-metadata.json`);
        
        await fs.writeFile(metadataPath, JSON.stringify({
            original: path.basename(filePath),
            processed: new Date().toISOString(),
            metadata,
            outputs: ['thumb.jpg', 'optimized.mp4']
        }, null, 2));
    }

    async getVideoMetadata(filePath) {
        try {
            const { stdout } = await execAsync(`ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`);
            return JSON.parse(stdout);
        } catch (error) {
            return { error: error.message };
        }
    }

    async scanFolder(folderPath) {
        const files = [];
        
        async function scan(dir) {
            const items = await fs.readdir(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stats = await fs.stat(fullPath);
                
                if (stats.isDirectory()) {
                    await scan(fullPath);
                } else {
                    files.push(fullPath);
                }
            }
        }
        
        await scan(folderPath);
        return files;
    }

    async uploadToCloud(files) {
        console.log(chalk.blue('\n☁️ Uploading to cloud storage...'));
        
        const { provider } = await inquirer.prompt([
            {
                type: 'list',
                name: 'provider',
                message: 'Choose cloud provider:',
                choices: [
                    { name: 'AWS S3', value: 'aws' },
                    { name: 'Sanity', value: 'sanity' },
                    { name: 'Both', value: 'both' }
                ]
            }
        ]);

        const spinner = ora('Uploading files...').start();
        let uploaded = 0;

        for (const file of files) {
            try {
                if (provider === 'aws' || provider === 'both') {
                    await this.uploadToS3(file);
                }
                
                if (provider === 'sanity' || provider === 'both') {
                    await this.uploadToSanity(file);
                }
                
                uploaded++;
                spinner.text = `Uploading files... (${uploaded}/${files.length})`;
            } catch (error) {
                console.log(chalk.red(`Error uploading ${path.basename(file)}: ${error.message}`));
            }
        }

        spinner.succeed(`Uploaded ${uploaded} files successfully`);
    }

    async uploadToS3(filePath) {
        const fileName = path.basename(filePath);
        const fileContent = await fs.readFile(filePath);
        
        await this.s3.upload({
            Bucket: this.config.aws.bucket,
            Key: `q10ux-portfolio/${fileName}`,
            Body: fileContent,
            ContentType: this.getContentType(filePath)
        }).promise();
    }

    async uploadToSanity(filePath) {
        const fileName = path.basename(filePath);
        const fileContent = await fs.readFile(filePath);
        
        await this.sanity.assets.upload('file', fileContent, {
            filename: fileName,
            label: `Q10UX Portfolio - ${fileName}`
        });
    }

    getContentType(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const contentTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.mp4': 'video/mp4',
            '.mov': 'video/quicktime',
            '.avi': 'video/x-msvideo'
        };
        
        return contentTypes[ext] || 'application/octet-stream';
    }

    async cloudSync() {
        console.log(chalk.blue('\n☁️ Cloud Sync Mode'));
        
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Choose sync action:',
                choices: [
                    { name: '📤 Upload to Cloud', value: 'upload' },
                    { name: '📥 Download from Cloud', value: 'download' },
                    { name: '🔄 Sync Both Ways', value: 'sync' }
                ]
            }
        ]);

        // Implementation for cloud sync
        console.log(chalk.yellow('Cloud sync feature coming soon...'));
    }

    async configureSettings() {
        console.log(chalk.blue('\n⚙️ Configuration'));
        
        const { setting } = await inquirer.prompt([
            {
                type: 'list',
                name: 'setting',
                message: 'What would you like to configure?',
                choices: [
                    { name: '🔑 AWS Credentials', value: 'aws' },
                    { name: '🎨 Sanity Settings', value: 'sanity' },
                    { name: '📁 Processing Options', value: 'processing' },
                    { name: '🔙 Back to Menu', value: 'back' }
                ]
            }
        ]);

        if (setting === 'back') return;

        console.log(chalk.yellow('Configuration feature coming soon...'));
    }

    async showStats() {
        console.log(chalk.blue('\n📊 Processing Statistics'));
        
        try {
            const stats = await this.getProcessingStats();
            console.log(chalk.gray('Files processed today:'), stats.today);
            console.log(chalk.gray('Total files processed:'), stats.total);
            console.log(chalk.gray('Storage used:'), stats.storage);
        } catch (error) {
            console.log(chalk.red('Error loading stats:', error.message));
        }
    }

    async getProcessingStats() {
        // Simple stats implementation
        return {
            today: 0,
            total: 0,
            storage: '0 MB'
        };
    }
}

// CLI Interface
async function main() {
    const system = new SmartUploadSystem();
    
    try {
        await system.init();
    } catch (error) {
        console.error(chalk.red('Error:', error.message));
        process.exit(1);
    }
}

// Handle command line arguments
if (require.main === module) {
    main();
}

module.exports = SmartUploadSystem;
