const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class UploadController {
  constructor() {
    this.uploadDir = path.join(__dirname, '../uploads');
    this.ensureUploadDir();
  }

  async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  // Flow detection based on filename
  detectFlow(filename) {
    const lowerFilename = filename.toLowerCase();
    
    const flowKeywords = {
      research: ['research', 'interview', 'survey', 'persona', 'journey', 'analysis', 'user', 'discovery', 'study'],
      ideation: ['sketch', 'wireframe', 'brainstorm', 'concept', 'flow', 'architecture', 'ideation', 'planning'],
      design: ['mockup', 'prototype', 'component', 'interface', 'visual', 'design', 'ui', 'ux', 'screen'],
      testing: ['test', 'usability', 'feedback', 'iteration', 'validation', 'performance', 'qa', 'user-testing'],
      implementation: ['spec', 'asset', 'handoff', 'launch', 'deploy', 'implementation', 'development', 'final'],
      results: ['metric', 'feedback', 'impact', 'lesson', 'roadmap', 'documentation', 'result', 'outcome'],
      screens: ['screen', 'desktop', 'mobile', 'tablet', 'detail', 'state', 'screenshot', 'view'],
      process: ['timeline', 'team', 'tool', 'methodology', 'challenge', 'summary', 'process', 'workflow']
    };

    for (const [flow, keywords] of Object.entries(flowKeywords)) {
      if (keywords.some(keyword => lowerFilename.includes(keyword))) {
        return flow;
      }
    }

    return 'screens'; // Default fallback
  }

  // Process and optimize image
  async processImage(file, project) {
    const flow = this.detectFlow(file.originalname);
    const uniqueId = uuidv4();
    const timestamp = Date.now();
    
    // Create project directory
    const projectDir = path.join(this.uploadDir, project);
    await fs.mkdir(projectDir, { recursive: true });

    // Generate filenames
    const originalExt = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, originalExt);
    
    const fullSizeName = `${baseName}-${timestamp}-full.webp`;
    const thumbnailName = `${baseName}-${timestamp}-thumb.webp`;
    
    const fullSizePath = path.join(projectDir, fullSizeName);
    const thumbnailPath = path.join(projectDir, thumbnailName);

    try {
      // Process full-size image (max 1920x1080)
      await sharp(file.buffer)
        .resize(1920, 1080, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .webp({ quality: 85, effort: 6 })
        .toFile(fullSizePath);

      // Generate thumbnail (400x300)
      await sharp(file.buffer)
        .resize(400, 300, { 
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 80, effort: 4 })
        .toFile(thumbnailPath);

      // Get image metadata
      const metadata = await sharp(file.buffer).metadata();

      return {
        id: uniqueId,
        originalName: file.originalname,
        flow: flow,
        project: project,
        fullSize: {
          filename: fullSizeName,
          path: fullSizePath,
          url: `/uploads/${project}/${fullSizeName}`,
          size: (await fs.stat(fullSizePath)).size,
          width: metadata.width,
          height: metadata.height
        },
        thumbnail: {
          filename: thumbnailName,
          path: thumbnailPath,
          url: `/uploads/${project}/${thumbnailName}`,
          size: (await fs.stat(thumbnailPath)).size
        },
        uploadedAt: new Date().toISOString(),
        altText: this.generateAltText(baseName, flow),
        caption: this.generateCaption(baseName, flow)
      };

    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  // Generate alt text for accessibility
  generateAltText(filename, flow) {
    const flowTitles = {
      research: 'User Research',
      ideation: 'Ideation',
      design: 'Design',
      testing: 'Testing',
      implementation: 'Implementation',
      results: 'Results',
      screens: 'Screenshots',
      process: 'Process'
    };

    const flowTitle = flowTitles[flow] || 'Case Study';
    return `${flowTitle} - ${filename.replace(/[-_]/g, ' ')}`;
  }

  // Generate caption
  generateCaption(filename, flow) {
    const flowDescriptions = {
      research: 'Research and discovery phase',
      ideation: 'Ideation and concept development',
      design: 'Design and prototyping',
      testing: 'Testing and validation',
      implementation: 'Implementation and handoff',
      results: 'Results and impact',
      screens: 'Interface screenshots',
      process: 'Process documentation'
    };

    return flowDescriptions[flow] || 'Case study image';
  }

  // Handle single file upload
  async uploadSingle(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const project = req.body.project;
      if (!project) {
        return res.status(400).json({ error: 'Project name required' });
      }

      const result = await this.processImage(req.file, project);
      
      res.json({
        success: true,
        message: 'Image uploaded and processed successfully',
        data: result
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        error: 'Upload failed', 
        message: error.message 
      });
    }
  }

  // Handle multiple file uploads
  async uploadMultiple(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const project = req.body.project;
      if (!project) {
        return res.status(400).json({ error: 'Project name required' });
      }

      const results = [];
      const errors = [];

      for (const file of req.files) {
        try {
          const result = await this.processImage(file, project);
          results.push(result);
        } catch (error) {
          errors.push({
            filename: file.originalname,
            error: error.message
          });
        }
      }

      res.json({
        success: true,
        message: `Processed ${results.length} images successfully`,
        data: {
          successful: results,
          failed: errors
        }
      });

    } catch (error) {
      console.error('Bulk upload error:', error);
      res.status(500).json({ 
        error: 'Bulk upload failed', 
        message: error.message 
      });
    }
  }

  // Get upload statistics
  async getStats(req, res) {
    try {
      const project = req.params.project;
      const projectDir = path.join(this.uploadDir, project);

      try {
        await fs.access(projectDir);
      } catch {
        return res.json({
          project: project,
          totalImages: 0,
          flows: {},
          totalSize: 0
        });
      }

      const files = await fs.readdir(projectDir);
      const imageFiles = files.filter(file => file.endsWith('.webp'));
      
      const flows = {};
      let totalSize = 0;

      for (const file of imageFiles) {
        const filePath = path.join(projectDir, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;

        // Extract flow from filename or use default
        const flow = this.detectFlow(file);
        flows[flow] = (flows[flow] || 0) + 1;
      }

      res.json({
        project: project,
        totalImages: imageFiles.length,
        flows: flows,
        totalSize: totalSize,
        formattedSize: this.formatBytes(totalSize)
      });

    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ 
        error: 'Failed to get statistics', 
        message: error.message 
      });
    }
  }

  // Format bytes to human readable
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

module.exports = new UploadController();
