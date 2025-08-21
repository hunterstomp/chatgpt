#!/usr/bin/env node

/**
 * Q10UX One-Click Upload System
 * Ultra-streamlined media processing - just drop and go!
 * 
 * Features:
 * - Zero configuration required
 * - Automatic project detection
 * - Instant processing and upload
 * - Smart defaults for everything
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const sharp = require('sharp');
const chokidar = require('chokidar');
const chalk = require('chalk');

const execAsync = promisify(exec);

class OneClickUpload {
    constructor() {
        this.config = {
            uploadsDir: './uploads',
            processedDir: './processed',
            autoStart: true,
            smartDefaults: true
        };
        
        this.processingQueue = [];
        this.isProcessing = false;
    }

    async init() {
        console.log(chalk.cyan.bold('🎨 Q10UX One-Click Upload'));
        console.log(chalk.gray('Drop files in uploads/ folder and they\'ll be processed automatically!\n'));
        
        await this.setupFolders();
        await this.startWatcher();
    }

    async setupFolders() {
        const folders = [this.config.uploadsDir, this.config.processedDir];
        
        for (const folder of folders) {
            try {
                await fs.mkdir(folder, { recursive: true });
                console.log(chalk.green(`✅ Created: ${folder}`));
            } catch (error) {
                // Folder already exists
            }
        }
    }

    async startWatcher() {
        console.log(chalk.blue(`📁 Watching: ${this.config.uploadsDir}`));
        console.log(chalk.gray('Drop files here and they\'ll be processed automatically...\n'));

        const watcher = chokidar.watch(this.config.uploadsDir, {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });

        watcher
            .on('add', async (filePath) => {
                console.log(chalk.green(`📥 New file: ${path.basename(filePath)}`));
                await this.processFile(filePath);
            })
            .on('change', async (filePath) => {
                console.log(chalk.yellow(`🔄 File changed: ${path.basename(filePath)}`));
                await this.processFile(filePath);
            });

        console.log(chalk.cyan('Press Ctrl+C to stop watching...'));
        
        process.on('SIGINT', () => {
            watcher.close();
            console.log(chalk.green('\n👋 Stopped watching folder'));
            process.exit(0);
        });
    }

    async processFile(filePath) {
        if (this.isProcessing) {
            this.processingQueue.push(filePath);
            return;
        }

        this.isProcessing = true;
        
        try {
            const ext = path.extname(filePath).toLowerCase();
            const fileName = path.basename(filePath, ext);
            
            // Auto-detect project and tags
            const project = this.autoDetectProject(fileName);
            const tags = this.autoDetectTags(fileName);
            
            console.log(chalk.blue(`🔍 Detected: ${project} | ${tags.join(', ')}`));
            
            // Process based on file type
            if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
                await this.processImage(filePath, project, tags);
            } else if (['.mp4', '.mov', '.avi'].includes(ext)) {
                await this.processVideo(filePath, project, tags);
            } else {
                console.log(chalk.yellow(`⚠️  Unsupported file type: ${ext}`));
            }
            
            // Move to processed folder
            const processedPath = path.join(this.config.processedDir, path.basename(filePath));
            await fs.rename(filePath, processedPath);
            console.log(chalk.green(`✅ Processed: ${path.basename(filePath)}`));
            
        } catch (error) {
            console.log(chalk.red(`❌ Error processing ${path.basename(filePath)}: ${error.message}`));
        } finally {
            this.isProcessing = false;
            
            // Process next file in queue
            if (this.processingQueue.length > 0) {
                const nextFile = this.processingQueue.shift();
                await this.processFile(nextFile);
            }
        }
    }

    autoDetectProject(fileName) {
        const projectKeywords = {
            'atmosfx': 'atmosfx-media-player',
            'tmobile': 'tmobile-how-to-switch',
            'office': 'office-live-workspaces',
            'microsoft': 'microsoft-office-365',
            'bmgf': 'bmgf',
            'att': 'att-international-roaming'
        };

        const lowerFileName = fileName.toLowerCase();
        for (const [keyword, project] of Object.entries(projectKeywords)) {
            if (lowerFileName.includes(keyword)) {
                return project;
            }
        }
        
        return 'general'; // Default project
    }

    autoDetectTags(fileName) {
        const tagKeywords = {
            'user-research': 'User Research',
            'research': 'User Research',
            'interview': 'User Research',
            'survey': 'User Research',
            'wireframe': 'Wireframes',
            'wireframes': 'Wireframes',
            'prototype': 'Prototypes',
            'prototypes': 'Prototypes',
            'design': 'Visual Design',
            'visual': 'Visual Design',
            'usability': 'Usability Testing',
            'testing': 'Usability Testing',
            'accessibility': 'Accessibility Testing',
            'a11y': 'Accessibility Testing'
        };

        const tags = [];
        const lowerFileName = fileName.toLowerCase();
        
        for (const [keyword, tag] of Object.entries(tagKeywords)) {
            if (lowerFileName.includes(keyword) && !tags.includes(tag)) {
                tags.push(tag);
            }
        }
        
        return tags.length > 0 ? tags : ['Screenshots'];
    }

    async processImage(filePath, project, tags) {
        const fileName = path.basename(filePath, path.extname(filePath));
        const outputDir = path.join(this.config.processedDir, project, fileName);
        
        await fs.mkdir(outputDir, { recursive: true });
        
        // Generate optimized sizes
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
            project: project,
            tags: tags,
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

    async processVideo(filePath, project, tags) {
        const fileName = path.basename(filePath, path.extname(filePath));
        const outputDir = path.join(this.config.processedDir, project, fileName);
        
        await fs.mkdir(outputDir, { recursive: true });
        
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
            project: project,
            tags: tags,
            processed: new Date().toISOString(),
            metadata: metadata,
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
}

// CLI Interface
async function main() {
    const uploader = new OneClickUpload();
    
    try {
        await uploader.init();
    } catch (error) {
        console.error(chalk.red('Error:', error.message));
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = OneClickUpload;
