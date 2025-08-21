const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SanityIntegration = require('./sanity-integration');
const { UXFlowManager } = require('./ux-flows');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'q10ux-admin-secret-key';

// Initialize Sanity integration
const sanity = new SanityIntegration();

// Initialize UX Flow Manager
const flowManager = new UXFlowManager();

// Admin credentials (use environment variables in production)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // "password"

// NDA Access Codes (in production, store in database)
const NDA_CODES = {
  'NDA2024': { name: '2024 NDA Access', expires: '2025-12-31' },
  'CONFIDENTIAL': { name: 'Confidential Access', expires: '2025-06-30' },
  'INTERNAL': { name: 'Internal Use Only', expires: '2025-12-31' }
};

// UX Deliverables/Phases for bulk tagging
const UX_DELIVERABLES = {
  // Research Phase
  'user-research': { name: 'User Research', phase: 'research', tags: ['interviews', 'surveys', 'personas', 'journey-maps'] },
  'competitive-analysis': { name: 'Competitive Analysis', phase: 'research', tags: ['benchmarking', 'market-research', 'swot'] },
  'user-personas': { name: 'User Personas', phase: 'research', tags: ['demographics', 'psychographics', 'behavioral'] },
  
  // Ideation Phase
  'information-architecture': { name: 'Information Architecture', phase: 'ideation', tags: ['sitemap', 'taxonomy', 'navigation'] },
  'user-flows': { name: 'User Flows', phase: 'ideation', tags: ['journey', 'workflow', 'process-flow'] },
  'wireframes': { name: 'Wireframes', phase: 'ideation', tags: ['low-fidelity', 'sketches', 'layout'] },
  
  // Design Phase
  'visual-design': { name: 'Visual Design', phase: 'design', tags: ['mockups', 'high-fidelity', 'branding'] },
  'prototypes': { name: 'Prototypes', phase: 'design', tags: ['interactive', 'clickable', 'user-testing'] },
  'design-systems': { name: 'Design Systems', phase: 'design', tags: ['components', 'style-guide', 'tokens'] },
  
  // Testing Phase
  'usability-testing': { name: 'Usability Testing', phase: 'testing', tags: ['user-testing', 'feedback', 'iterations'] },
  'accessibility-testing': { name: 'Accessibility Testing', phase: 'testing', tags: ['wcag', 'screen-reader', 'keyboard-nav'] },
  'performance-testing': { name: 'Performance Testing', phase: 'testing', tags: ['load-time', 'optimization', 'metrics'] },
  
  // Implementation Phase
  'handoff': { name: 'Design Handoff', phase: 'implementation', tags: ['specs', 'assets', 'documentation'] },
  'development-support': { name: 'Development Support', phase: 'implementation', tags: ['qa', 'bug-fixes', 'iterations'] },
  
  // Results Phase
  'analytics': { name: 'Analytics & Metrics', phase: 'results', tags: ['conversion', 'engagement', 'kpis'] },
  'user-feedback': { name: 'User Feedback', phase: 'results', tags: ['reviews', 'satisfaction', 'nps'] },
  
  // Additional Screenshots
  'screenshots': { name: 'Screenshots', phase: 'screens', tags: ['final-design', 'responsive', 'states'] },
  'process-docs': { name: 'Process Documentation', phase: 'process', tags: ['methodology', 'timeline', 'lessons'] }
};

// Middleware
app.use(cors({
  origin: 'http://localhost:8001',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// Data storage (simple JSON files for now - can be upgraded to database later)
const DATA_DIR = path.join(__dirname, 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const IMAGES_FILE = path.join(DATA_DIR, 'images.json');
const NDA_SESSIONS_FILE = path.join(DATA_DIR, 'nda-sessions.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Load data
async function loadData() {
  try {
    const projectsData = await fs.readFile(PROJECTS_FILE, 'utf8');
    const imagesData = await fs.readFile(IMAGES_FILE, 'utf8');
    const ndaSessionsData = await fs.readFile(NDA_SESSIONS_FILE, 'utf8');
    return {
      projects: JSON.parse(projectsData),
      images: JSON.parse(imagesData),
      ndaSessions: JSON.parse(ndaSessionsData)
    };
  } catch {
    return {
      projects: {},
      images: {},
      ndaSessions: {}
    };
  }
}

// Save data
async function saveData(data) {
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(data.projects, null, 2));
  await fs.writeFile(IMAGES_FILE, JSON.stringify(data.images, null, 2));
  await fs.writeFile(NDA_SESSIONS_FILE, JSON.stringify(data.ndaSessions, null, 2));
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// NDA Access middleware
function checkNDAAccess(req, res, next) {
  const ndaCode = req.headers['x-nda-code'] || req.query.ndaCode;
  
  if (!ndaCode) {
    return res.status(403).json({ 
      error: 'NDA access required',
      message: 'This content requires NDA authorization',
      requiresNDA: true
    });
  }

  const ndaInfo = NDA_CODES[ndaCode];
  if (!ndaInfo) {
    return res.status(403).json({ 
      error: 'Invalid NDA code',
      message: 'The provided NDA code is not valid',
      requiresNDA: true
    });
  }

  const today = new Date();
  const expiryDate = new Date(ndaInfo.expires);
  
  if (today > expiryDate) {
    return res.status(403).json({ 
      error: 'NDA expired',
      message: 'The NDA access has expired',
      requiresNDA: true
    });
  }

  req.ndaCode = ndaCode;
  req.ndaInfo = ndaInfo;
  next();
}

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 100
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'), false);
    }
    cb(null, true);
  }
});

// Enhanced image processing with multiple sizes
async function processImageWithSizes(file, projectId, baseName, timestamp) {
  const uploadDir = path.join(__dirname, 'uploads', projectId);
  await fs.mkdir(uploadDir, { recursive: true });

  // Generate multiple sizes for different use cases
  const sizes = {
    full: { width: 1920, height: 1080, suffix: 'full' },
    large: { width: 1200, height: 800, suffix: 'large' },
    medium: { width: 800, height: 600, suffix: 'medium' },
    thumbnail: { width: 400, height: 300, suffix: 'thumb' },
    preview: { width: 200, height: 150, suffix: 'preview' }
  };

  const processedImages = {};

  for (const [size, config] of Object.entries(sizes)) {
    const filename = `${baseName}-${timestamp}-${config.suffix}.webp`;
    const filepath = path.join(uploadDir, filename);

    try {
      let sharpInstance = sharp(file.buffer);

      if (size === 'thumbnail' || size === 'preview') {
        // For thumbnails, use cover to maintain aspect ratio
        sharpInstance = sharpInstance.resize(config.width, config.height, {
          fit: 'cover',
          position: 'center'
        });
      } else {
        // For larger images, use inside to maintain aspect ratio
        sharpInstance = sharpInstance.resize(config.width, config.height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Optimize based on size
      const quality = size === 'preview' ? 70 : size === 'thumbnail' ? 80 : 85;
      const effort = size === 'preview' ? 2 : size === 'thumbnail' ? 4 : 6;

      await sharpInstance
        .webp({ quality, effort })
        .toFile(filepath);

      const stats = await fs.stat(filepath);
      processedImages[size] = {
        filename,
        path: filepath,
        url: `/uploads/${projectId}/${filename}`,
        size: stats.size,
        width: config.width,
        height: config.height
      };
    } catch (error) {
      console.error(`Error processing ${size} image:`, error);
      throw error;
    }
  }

  return processedImages;
}

// Enhanced flow detection with UX deliverables
function detectFlowAndTags(filename) {
  const lowerFilename = filename.toLowerCase();
  
  // Check for specific UX deliverables first
  for (const [key, deliverable] of Object.entries(UX_DELIVERABLES)) {
    if (lowerFilename.includes(key.replace('-', ' ')) || 
        lowerFilename.includes(deliverable.name.toLowerCase())) {
      return {
        flow: deliverable.phase,
        tags: deliverable.tags,
        deliverable: key,
        deliverableName: deliverable.name
      };
    }
  }

  // Fallback to keyword-based detection
  const flowKeywords = {
    research: ['research', 'interview', 'survey', 'persona', 'journey', 'analysis', 'user', 'discovery', 'study', 'competitive'],
    ideation: ['sketch', 'wireframe', 'brainstorm', 'concept', 'flow', 'architecture', 'ideation', 'planning', 'sitemap'],
    design: ['mockup', 'prototype', 'component', 'interface', 'visual', 'design', 'ui', 'ux', 'screen', 'high-fidelity'],
    testing: ['test', 'usability', 'feedback', 'iteration', 'validation', 'performance', 'qa', 'user-testing', 'accessibility'],
    implementation: ['spec', 'asset', 'handoff', 'launch', 'deploy', 'implementation', 'development', 'final'],
    results: ['metric', 'feedback', 'impact', 'lesson', 'roadmap', 'documentation', 'result', 'outcome', 'analytics'],
    screens: ['screen', 'desktop', 'mobile', 'tablet', 'detail', 'state', 'screenshot', 'view'],
    process: ['timeline', 'team', 'tool', 'methodology', 'challenge', 'summary', 'process', 'workflow']
  };

  for (const [flow, keywords] of Object.entries(flowKeywords)) {
    if (keywords.some(keyword => lowerFilename.includes(keyword))) {
      return {
        flow,
        tags: [flow, 'ux-design'],
        deliverable: 'general',
        deliverableName: 'General UX Work'
      };
    }
  }

  return {
    flow: 'screens',
    tags: ['screenshots', 'ux-design'],
    deliverable: 'screenshots',
    deliverableName: 'Screenshots'
  };
}

// Routes

// Admin login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { username, role: 'admin' } });
});

// Get UX deliverables for bulk tagging
app.get('/api/admin/ux-deliverables', authenticateToken, (req, res) => {
  res.json(UX_DELIVERABLES);
});

// Get all projects (admin only)
app.get('/api/admin/projects', authenticateToken, async (req, res) => {
  try {
    const data = await loadData();
    res.json(Object.values(data.projects));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// Create/update project
app.post('/api/admin/projects', authenticateToken, async (req, res) => {
  try {
    const { id, title, description, slug, status = 'draft', ndaRequired = false, ndaCode = null, flowPrivacy = {} } = req.body;
    const projectId = id || uuidv4();
    
    const data = await loadData();
    data.projects[projectId] = {
      id: projectId,
      title,
      description,
      slug,
      status,
      ndaRequired,
      ndaCode,
      flowPrivacy, // Object with flow names as keys and privacy settings as values
      createdAt: data.projects[projectId]?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await saveData(data);
    res.json(data.projects[projectId]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save project' });
  }
});

// Upload images for project with enhanced processing
app.post('/api/admin/projects/:projectId/images', authenticateToken, upload.array('images', 100), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { flow = 'screens', ndaRequired = false, bulkTag = null } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const data = await loadData();
    if (!data.projects[projectId]) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const results = [];
    const errors = [];

    for (const file of req.files) {
      try {
        const imageId = uuidv4();
        const timestamp = Date.now();
        const baseName = path.basename(file.originalname, path.extname(file.originalname));
        
        // Enhanced flow and tag detection
        const detection = bulkTag ? 
          { flow: bulkTag, tags: [bulkTag, 'ux-design'], deliverable: bulkTag, deliverableName: UX_DELIVERABLES[bulkTag]?.name || bulkTag } :
          detectFlowAndTags(file.originalname);

        // Process image with multiple sizes
        const processedImages = await processImageWithSizes(file, projectId, baseName, timestamp);

        // Get original image metadata
        const metadata = await sharp(file.buffer).metadata();

        const imageData = {
          id: imageId,
          projectId,
          originalName: file.originalname,
          flow: detection.flow,
          tags: detection.tags,
          deliverable: detection.deliverable,
          deliverableName: detection.deliverableName,
          ndaRequired: ndaRequired === 'true' || ndaRequired === true,
          sizes: processedImages,
          metadata: {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            hasAlpha: metadata.hasAlpha,
            hasProfile: metadata.hasProfile,
            isOpaque: metadata.isOpaque
          },
          uploadedAt: new Date().toISOString(),
          altText: `${detection.deliverableName} - ${baseName}`,
          caption: `${detection.deliverableName} documentation`
        };

        data.images[imageId] = imageData;
        results.push(imageData);

      } catch (error) {
        errors.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }

    await saveData(data);

    res.json({
      success: true,
      message: `Uploaded ${results.length} images successfully`,
      data: {
        successful: results,
        failed: errors
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Upload failed', message: error.message });
  }
});

// Bulk tag images
app.post('/api/admin/projects/:projectId/bulk-tag', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { imageIds, deliverable, tags, flow } = req.body;

    if (!imageIds || imageIds.length === 0) {
      return res.status(400).json({ error: 'No images selected' });
    }

    const data = await loadData();
    if (!data.projects[projectId]) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updatedImages = [];
    const errors = [];

    for (const imageId of imageIds) {
      try {
        const image = data.images[imageId];
        if (!image || image.projectId !== projectId) {
          errors.push({ imageId, error: 'Image not found or not in project' });
          continue;
        }

        // Update image with new tags
        image.flow = flow || image.flow;
        image.tags = tags || image.tags;
        image.deliverable = deliverable || image.deliverable;
        image.deliverableName = UX_DELIVERABLES[deliverable]?.name || image.deliverableName;
        image.updatedAt = new Date().toISOString();

        updatedImages.push(image);
      } catch (error) {
        errors.push({ imageId, error: error.message });
      }
    }

    await saveData(data);

    res.json({
      success: true,
      message: `Updated ${updatedImages.length} images successfully`,
      data: {
        successful: updatedImages,
        failed: errors
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Bulk tagging failed', message: error.message });
  }
});

// Get project images (admin only)
app.get('/api/admin/projects/:projectId/images', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const data = await loadData();
    
    const projectImages = Object.values(data.images).filter(img => img.projectId === projectId);
    
    // Group by flow
    const flows = {
      research: [],
      ideation: [],
      design: [],
      testing: [],
      implementation: [],
      results: [],
      screens: [],
      process: []
    };

    projectImages.forEach(img => {
      if (flows[img.flow]) {
        flows[img.flow].push(img);
      } else {
        flows.screens.push(img);
      }
    });

    res.json({
      projectId,
      flows,
      totalImages: projectImages.length
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to load images' });
  }
});

// Delete image
app.delete('/api/admin/images/:imageId', authenticateToken, async (req, res) => {
  try {
    const { imageId } = req.params;
    const data = await loadData();
    
    const image = data.images[imageId];
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete all size variants
    try {
      for (const size of Object.values(image.sizes)) {
        await fs.unlink(size.path);
      }
    } catch (fileError) {
      console.log('File deletion error:', fileError);
    }

    // Remove from data
    delete data.images[imageId];
    await saveData(data);

    res.json({ success: true, message: 'Image deleted' });

  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Public API for frontend gallery with NDA protection
app.get('/api/gallery/:projectSlug', async (req, res) => {
  try {
    const { projectSlug } = req.params;
    const data = await loadData();
    
    const project = Object.values(data.projects).find(p => p.slug === projectSlug && p.status === 'published');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if project requires NDA
    if (project.ndaRequired) {
      const ndaCode = req.headers['x-nda-code'] || req.query.ndaCode;
      
      if (!ndaCode) {
        return res.status(403).json({ 
          error: 'NDA access required',
          message: 'This project requires NDA authorization',
          requiresNDA: true,
          projectTitle: project.title
        });
      }

      const ndaInfo = NDA_CODES[ndaCode];
      if (!ndaInfo) {
        return res.status(403).json({ 
          error: 'Invalid NDA code',
          message: 'The provided NDA code is not valid',
          requiresNDA: true,
          projectTitle: project.title
        });
      }

      const today = new Date();
      const expiryDate = new Date(ndaInfo.expires);
      
      if (today > expiryDate) {
        return res.status(403).json({ 
          error: 'NDA expired',
          message: 'The NDA access has expired',
          requiresNDA: true,
          projectTitle: project.title
        });
      }
    }

    const projectImages = Object.values(data.images).filter(img => img.projectId === project.id);
    
    // Filter images based on NDA requirements and flow privacy
    const filteredImages = projectImages.filter(img => {
      // If project requires NDA, check if user has access
      if (project.ndaRequired) {
        const ndaCode = req.headers['x-nda-code'] || req.query.ndaCode;
        if (!ndaCode || !NDA_CODES[ndaCode]) {
          return false;
        }
      }

      // Check flow-level privacy
      if (project.flowPrivacy && project.flowPrivacy[img.flow]) {
        const flowPrivacy = project.flowPrivacy[img.flow];
        if (flowPrivacy.ndaRequired) {
          const ndaCode = req.headers['x-nda-code'] || req.query.ndaCode;
          if (!ndaCode || !NDA_CODES[ndaCode]) {
            return false;
          }
        }
      }

      return true;
    });
    
    const flows = {
      research: [],
      ideation: [],
      design: [],
      testing: [],
      implementation: [],
      results: [],
      screens: [],
      process: []
    };

    filteredImages.forEach(img => {
      if (flows[img.flow]) {
        flows[img.flow].push(img);
      } else {
        flows.screens.push(img);
      }
    });

    res.json({
      project: {
        ...project,
        ndaRequired: project.ndaRequired,
        ndaCode: project.ndaRequired ? project.ndaCode : null
      },
      flows,
      totalImages: filteredImages.length,
      hasNDAProtection: project.ndaRequired || Object.values(project.flowPrivacy || {}).some(fp => fp.ndaRequired)
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to load gallery' });
  }
});

// Get public project list (filtered by NDA)
app.get('/api/projects', async (req, res) => {
  try {
    const data = await loadData();
    const ndaCode = req.headers['x-nda-code'] || req.query.ndaCode;
    
    const publicProjects = Object.values(data.projects).filter(project => {
      if (project.status !== 'published') return false;
      
      // If project requires NDA, check access
      if (project.ndaRequired) {
        if (!ndaCode || !NDA_CODES[ndaCode]) return false;
        
        const today = new Date();
        const expiryDate = new Date(NDA_CODES[ndaCode].expires);
        if (today > expiryDate) return false;
      }
      
      return true;
    });

    res.json(publicProjects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      slug: project.slug,
      ndaRequired: project.ndaRequired,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    })));

  } catch (error) {
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// Validate NDA code
app.post('/api/validate-nda', async (req, res) => {
  try {
    const { ndaCode } = req.body;
    
    if (!ndaCode) {
      return res.status(400).json({ error: 'NDA code required' });
    }

    const ndaInfo = NDA_CODES[ndaCode];
    if (!ndaInfo) {
      return res.status(403).json({ 
        error: 'Invalid NDA code',
        valid: false
      });
    }

    const today = new Date();
    const expiryDate = new Date(ndaInfo.expires);
    
    if (today > expiryDate) {
      return res.status(403).json({ 
        error: 'NDA expired',
        valid: false,
        expired: true
      });
    }

    res.json({
      valid: true,
      ndaInfo: {
        name: ndaInfo.name,
        expires: ndaInfo.expires
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to validate NDA' });
  }
});

// Publish image series to case study (with automatic Sanity sync)
app.post('/api/admin/publish-series', authenticateToken, async (req, res) => {
  try {
    const { projectId, seriesTitle, seriesDescription, images, flowType } = req.body;
    
    if (!projectId || !seriesTitle || !images || !Array.isArray(images)) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  const data = await loadData();
  
  // Check if project exists
  if (!data.projects[projectId]) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const project = data.projects[projectId];
  const seriesId = uuidv4();
  const timestamp = new Date().toISOString();

  // Create series object with flow type
  const series = {
    id: seriesId,
    title: seriesTitle,
    description: seriesDescription,
    projectId: projectId,
    flowType: flowType || 'general', // Research, Design, Testing, Results, etc.
    createdAt: timestamp,
    updatedAt: timestamp,
    images: images.map((img, index) => ({
      id: img.id || uuidv4(),
      name: img.name,
      description: img.description || '',
      order: index + 1,
      width: img.width,
      height: img.height,
      optimized: img.optimized || false,
      aiGenerated: img.aiGenerated || false,
      createdAt: timestamp
    }))
  };

  // Add series to project
  if (!project.series) {
    project.series = {};
  }
  project.series[seriesId] = series;
  project.updatedAt = timestamp;

  // Save updated data locally
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(data.projects, null, 2));

  // AUTOMATIC SANITY SYNC
  let sanityResult = null;
  if (sanity.isReady()) {
    try {
      console.log('🔄 Syncing to Sanity...');
      
      // Upload images to Sanity
      const sanityImages = [];
      for (const img of images) {
        const imagePath = path.join(__dirname, '..', 'uploads', 'processed', img.name);
        const sanityImage = await sanity.uploadImage(imagePath, {
          title: img.name,
          description: img.description || '',
          alt: img.description || img.name
        });
        
        if (sanityImage) {
          sanityImages.push({
            ...img,
            sanityId: sanityImage.sanityId,
            sanityUrl: sanityImage.url
          });
        }
      }

      // Create or update case study in Sanity
      const caseStudyData = {
        title: project.title,
        slug: project.slug || project.id,
        description: project.description || '',
        status: 'published',
        ndaRequired: project.ndaRequired || false,
        ndaCode: project.ndaCode || null,
        client: project.client || '',
        projectType: 'ux-design',
        technologies: project.tags || [],
        duration: project.duration || '',
        teamSize: project.teamSize || '',
        role: project.role || '',
        results: project.results || '',
        challenges: project.challenges || '',
        process: project.process || ''
      };

      let sanityCaseStudyId = await sanity.createCaseStudy(caseStudyData);
      
      // If case study exists, get its ID
      if (!sanityCaseStudyId) {
        const existingCaseStudies = await sanity.getCaseStudies();
        const existing = existingCaseStudies.find(cs => cs.slug === caseStudyData.slug);
        sanityCaseStudyId = existing?._id;
      }

      // Add image series to case study
      if (sanityCaseStudyId && sanityImages.length > 0) {
        const seriesData = {
          title: seriesTitle,
          description: seriesDescription,
          flowType: flowType || 'general',
          images: sanityImages,
          order: Object.keys(project.series || {}).length + 1
        };

        await sanity.addImageSeries(sanityCaseStudyId, seriesData);
        sanityResult = { success: true, caseStudyId: sanityCaseStudyId };
        console.log('✅ Successfully synced to Sanity');
      }

    } catch (sanityError) {
      console.error('⚠️  Sanity sync failed:', sanityError.message);
      sanityResult = { success: false, error: sanityError.message };
    }
  } else {
    console.log('ℹ️  Sanity not configured, skipping sync');
  }

  console.log(`✅ Series "${seriesTitle}" published to project "${project.title}"`);

  res.json({
    success: true,
    series: {
      id: seriesId,
      title: seriesTitle,
      projectId: projectId,
      projectTitle: project.title,
      imageCount: images.length,
      createdAt: timestamp
    },
    sanity: sanityResult
  });

  } catch (error) {
    console.error('Error publishing series:', error);
    res.status(500).json({ error: 'Failed to publish series' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Sanity status check
app.get('/api/sanity-status', (req, res) => {
  res.json({
    sanity: sanity.getConfigStatus(),
    timestamp: new Date().toISOString()
  });
});

// Get available UX flows
app.get('/api/flows', (req, res) => {
  res.json({
    flows: flowManager.getAllFlows(),
    mainFlows: flowManager.getMainFlows(),
    timestamp: new Date().toISOString()
  });
});

// Get flow suggestions for filename
app.get('/api/flows/suggest/:filename', (req, res) => {
  const { filename } = req.params;
  const suggestedFlow = flowManager.suggestFlowFromFilename(filename);
  const flowInfo = flowManager.getFlowById(suggestedFlow);
  
  res.json({
    filename,
    suggestedFlow,
    flowInfo,
    displayName: flowManager.getFlowDisplayName(suggestedFlow),
    icon: flowManager.getFlowIcon(suggestedFlow),
    color: flowManager.getFlowColor(suggestedFlow)
  });
});

// Generate live preview of case study
app.get('/api/preview/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const data = await loadData();
    
    if (!data.projects[projectId]) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = data.projects[projectId];
    
    // Organize series by flow type
    const flowsData = {};
    if (project.series) {
      Object.values(project.series).forEach(series => {
        const flowType = series.flowType || 'gallery';
        if (!flowsData[flowType]) {
          flowsData[flowType] = [];
        }
        flowsData[flowType].push(series);
      });
    }

    // Sort series within each flow by order
    Object.keys(flowsData).forEach(flowType => {
      flowsData[flowType].sort((a, b) => {
        const orderA = flowManager.getFlowOrder(flowType);
        const orderB = flowManager.getFlowOrder(b.flowType || 'gallery');
        return orderA - orderB;
      });
    });

    const previewData = {
      project: {
        id: projectId,
        title: project.title,
        description: project.description,
        client: project.client,
        status: project.status,
        ndaRequired: project.ndaRequired,
        ndaCode: project.ndaCode,
        tags: project.tags || [],
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      },
      flows: flowsData,
      flowManager: {
        availableFlows: flowManager.getAllFlows(),
        mainFlows: flowManager.getMainFlows()
      },
      previewUrl: `/src/preview/${projectId}/`,
      timestamp: new Date().toISOString()
    };

    res.json(previewData);

  } catch (error) {
    console.error('Error generating preview:', error);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

// Initialize and start server
async function startServer() {
  await ensureDataDir();
  
  app.listen(PORT, () => {
    console.log(`🚀 Q10UX Admin Server running on port ${PORT}`);
    console.log(`🔐 Admin login: admin / password`);
    console.log(`🛡️  NDA Protection: Enabled`);
    console.log(`🏷️  Bulk Tagging: Enabled`);
    console.log(`⚡ Performance Optimized: Multiple image sizes`);
    console.log(`📁 Data directory: ${DATA_DIR}`);
    console.log(`🌐 Frontend URL: http://localhost:8001`);
  });
}

startServer().catch(console.error);
