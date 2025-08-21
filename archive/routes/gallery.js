const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();

// Get gallery data for a project
router.get('/:project', async (req, res) => {
  try {
    const project = req.params.project;
    const uploadDir = path.join(__dirname, '../uploads', project);

    try {
      await fs.access(uploadDir);
    } catch {
      return res.json({
        project: project,
        flows: {},
        totalImages: 0
      });
    }

    const files = await fs.readdir(uploadDir);
    const imageFiles = files.filter(file => file.endsWith('.webp'));
    
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

    for (const file of imageFiles) {
      if (file.includes('-thumb.webp')) continue; // Skip thumbnails
      
      const filePath = path.join(uploadDir, file);
      const stats = await fs.stat(filePath);
      
      // Extract flow from filename
      const flow = detectFlowFromFilename(file);
      
      const imageData = {
        id: file.replace('.webp', ''),
        filename: file,
        thumbnail: file.replace('-full.webp', '-thumb.webp'),
        url: `/uploads/${project}/${file}`,
        thumbnailUrl: `/uploads/${project}/${file.replace('-full.webp', '-thumb.webp')}`,
        size: stats.size,
        uploadedAt: stats.mtime,
        altText: generateAltText(file, flow),
        caption: generateCaption(file, flow)
      };

      if (flows[flow]) {
        flows[flow].push(imageData);
      } else {
        flows.screens.push(imageData); // Default to screens
      }
    }

    // Sort images by upload date
    Object.keys(flows).forEach(flow => {
      flows[flow].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    });

    res.json({
      project: project,
      flows: flows,
      totalImages: imageFiles.filter(f => f.includes('-full.webp')).length
    });

  } catch (error) {
    console.error('Gallery error:', error);
    res.status(500).json({ 
      error: 'Failed to get gallery data', 
      message: error.message 
    });
  }
});

// Helper functions
function detectFlowFromFilename(filename) {
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

  return 'screens';
}

function generateAltText(filename, flow) {
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
  const cleanName = filename.replace(/[-_]/g, ' ').replace('.webp', '');
  return `${flowTitle} - ${cleanName}`;
}

function generateCaption(filename, flow) {
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

module.exports = router;
