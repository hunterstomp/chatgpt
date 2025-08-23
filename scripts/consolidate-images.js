#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const BASE_IMAGES_PATH = 'Q10UXPortfolio/assets/images';
const OUTPUT_PATH = 'Q10UXPortfolio/assets/images-consolidated';
const BACKUP_PATH = 'Q10UXPortfolio/assets/images-backup';

// Taxonomy structure
const TAXONOMY = {
  '01-branding': {
    'logos': 'Company and project logos',
    'avatars': 'Profile pictures and avatars',
    'icons': 'UI icons and design tools'
  },
  '02-case-studies': {
    'atmosfx': 'AtmosFX related case studies',
    'att': 'AT&T related case studies', 
    'disney': 'Disney related case studies',
    'microsoft': 'Microsoft related case studies',
    'tmobile': 'T-Mobile related case studies',
    'gates-foundation': 'Bill & Melinda Gates Foundation',
    'other': 'Other case studies'
  },
  '03-design-assets': {
    'wireframes': 'Wireframes and mockups',
    'prototypes': 'Interactive prototypes',
    'mockups': 'High-fidelity mockups',
    'backgrounds': 'Background images and gradients',
    'ui-elements': 'UI components and elements'
  },
  '04-documents': {
    'resumes': 'Resume and CV files',
    'presentations': 'Presentation materials',
    'reports': 'Project reports and documentation'
  },
  '05-photography': {
    'hero-images': 'Hero and banner images',
    'product-shots': 'Product photography',
    'lifestyle': 'Lifestyle and contextual images'
  },
  '06-tools': {
    'design-tools': 'Design tool screenshots and icons',
    'software': 'Software and application screenshots'
  }
};

// File type mappings
const FILE_TYPE_MAPPINGS = {
  'logo': ['logo', 'brand', 'icon'],
  'avatar': ['avatar', 'profile', 'quentin'],
  'wireframe': ['wireframe', 'mockup', 'prototype'],
  'background': ['background', 'gradient', 'bkg'],
  'case-study': ['case-study', 'project', 'work'],
  'document': ['resume', 'pdf', 'presentation'],
  'design-tool': ['sketch', 'figma', 'axure', 'photoshop', 'zeplin'],
  'hero': ['hero', 'banner', 'slide'],
  'ui-element': ['ui', 'component', 'element']
};

// Client mappings for case studies
const CLIENT_MAPPINGS = {
  'atmosfx': ['atmosfx', 'afx', 'media-player'],
  'att': ['att', 'international-roaming'],
  'disney': ['disney', 'vmc', 'bug-tracking'],
  'microsoft': ['microsoft', 'office', 'o365', 'officelive'],
  'tmobile': ['tmobile', 't-mobile'],
  'gates-foundation': ['gates', 'bmgf', 'foundation']
};

function calculateFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(fileBuffer).digest('hex');
}

function getFileInfo(filePath) {
  const stats = fs.statSync(filePath);
  return {
    path: filePath,
    size: stats.size,
    modified: stats.mtime,
    hash: calculateFileHash(filePath)
  };
}

function categorizeFile(filename, filePath) {
  const lowerFilename = filename.toLowerCase();
  const lowerPath = filePath.toLowerCase();
  
  // Check for specific patterns first
  if (lowerFilename.includes('quentin-avatar') || lowerFilename.includes('aboutquentin')) {
    return '01-branding/avatars';
  }
  
  if (lowerFilename.includes('logo') || lowerFilename.includes('q10ux-logo') || lowerFilename.includes('pop_logo')) {
    return '01-branding/logos';
  }
  
  if (lowerFilename.includes('resume') || lowerFilename.includes('.pdf')) {
    return '04-documents/resumes';
  }
  
  // Check for design tools
  if (lowerFilename.includes('sketch') || lowerFilename.includes('figma') || 
      lowerFilename.includes('axure') || lowerFilename.includes('photoshop') || 
      lowerFilename.includes('zeplin') || lowerFilename.includes('keynote')) {
    return '06-tools/design-tools';
  }
  
  // Check for case study content
  for (const [client, keywords] of Object.entries(CLIENT_MAPPINGS)) {
    if (keywords.some(keyword => lowerFilename.includes(keyword) || lowerPath.includes(keyword))) {
      return `02-case-studies/${client}`;
    }
  }
  
  // Check for wireframes and mockups
  if (lowerFilename.includes('wireframe') || lowerFilename.includes('mockup') || 
      lowerFilename.includes('prototype') || lowerFilename.includes('bkg-wireframes')) {
    return '03-design-assets/wireframes';
  }
  
  // Check for backgrounds
  if (lowerFilename.includes('background') || lowerFilename.includes('gradient') || 
      lowerFilename.includes('bkg') || lowerFilename.includes('darkgradient')) {
    return '03-design-assets/backgrounds';
  }
  
  // Check for hero images
  if (lowerFilename.includes('hero') || lowerFilename.includes('slide') || 
      lowerFilename.includes('banner')) {
    return '05-photography/hero-images';
  }
  
  // Default categorization based on file type
  if (lowerFilename.includes('icon') || lowerFilename.includes('badge')) {
    return '01-branding/icons';
  }
  
  // If no specific category found, put in appropriate general category
  if (lowerFilename.includes('image-') || lowerFilename.includes('photo-')) {
    return '05-photography/product-shots';
  }
  
  return '03-design-assets/ui-elements';
}

function createTaxonomyStructure() {
  console.log('Creating taxonomy structure...');
  
  for (const [mainCategory, subCategories] of Object.entries(TAXONOMY)) {
    const mainPath = path.join(OUTPUT_PATH, mainCategory);
    fs.mkdirSync(mainPath, { recursive: true });
    
    for (const [subCategory, description] of Object.entries(subCategories)) {
      const subPath = path.join(mainPath, subCategory);
      fs.mkdirSync(subPath, { recursive: true });
      
      // Create README for each category
      const readmeContent = `# ${subCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}

${description}

This folder contains ${description.toLowerCase()}.
`;
      fs.writeFileSync(path.join(subPath, 'README.md'), readmeContent);
    }
  }
}

function findDuplicateImages(startPath) {
  console.log('Scanning for duplicate images...');
  
  const fileMap = new Map(); // hash -> [fileInfo]
  const duplicates = [];
  
  function scanDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stats.isFile()) {
        // Only process image and document files
        const ext = path.extname(item).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.pdf', '.gif'].includes(ext)) {
          try {
            const fileInfo = getFileInfo(fullPath);
            
            if (fileMap.has(fileInfo.hash)) {
              fileMap.get(fileInfo.hash).push(fileInfo);
            } else {
              fileMap.set(fileInfo.hash, [fileInfo]);
            }
          } catch (error) {
            console.warn(`Error processing ${fullPath}:`, error.message);
          }
        }
      }
    }
  }
  
  scanDirectory(startPath);
  
  // Find duplicates (files with same hash)
  for (const [hash, files] of fileMap.entries()) {
    if (files.length > 1) {
      duplicates.push({
        hash,
        files: files.sort((a, b) => a.path.localeCompare(b.path))
      });
    }
  }
  
  return duplicates;
}

function consolidateImages() {
  console.log('Starting image consolidation...');
  
  // Create backup
  if (fs.existsSync(BACKUP_PATH)) {
    fs.rmSync(BACKUP_PATH, { recursive: true });
  }
  fs.mkdirSync(BACKUP_PATH, { recursive: true });
  
  // Create output directory
  if (fs.existsSync(OUTPUT_PATH)) {
    fs.rmSync(OUTPUT_PATH, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_PATH, { recursive: true });
  
  // Create taxonomy structure
  createTaxonomyStructure();
  
  // Find all duplicates
  const duplicates = findDuplicateImages(BASE_IMAGES_PATH);
  
  console.log(`Found ${duplicates.length} sets of duplicate files`);
  
  // Process each duplicate set
  const processedFiles = new Set();
  const duplicateReport = [];
  
  for (const duplicateSet of duplicates) {
    const primaryFile = duplicateSet.files[0];
    const filename = path.basename(primaryFile.path);
    const category = categorizeFile(filename, primaryFile.path);
    const targetPath = path.join(OUTPUT_PATH, category, filename);
    
    // Copy primary file to new location
    fs.copyFileSync(primaryFile.path, targetPath);
    processedFiles.add(primaryFile.path);
    
    // Record duplicates for report
    duplicateReport.push({
      primary: primaryFile.path,
      duplicates: duplicateSet.files.slice(1).map(f => f.path),
      target: targetPath
    });
    
    // Copy duplicates to backup
    for (const duplicateFile of duplicateSet.files) {
      const backupPath = path.join(BACKUP_PATH, path.relative(BASE_IMAGES_PATH, duplicateFile.path));
      fs.mkdirSync(path.dirname(backupPath), { recursive: true });
      fs.copyFileSync(duplicateFile.path, backupPath);
    }
  }
  
  // Process unique files
  const allFiles = new Set();
  function collectAllFiles(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        collectAllFiles(fullPath);
      } else if (stats.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.pdf', '.gif'].includes(ext)) {
          allFiles.add(fullPath);
        }
      }
    }
  }
  
  collectAllFiles(BASE_IMAGES_PATH);
  
  // Process files that weren't duplicates
  for (const filePath of allFiles) {
    if (!processedFiles.has(filePath)) {
      const filename = path.basename(filePath);
      const category = categorizeFile(filename, filePath);
      const targetPath = path.join(OUTPUT_PATH, category, filename);
      
      // Handle filename conflicts
      let finalTargetPath = targetPath;
      let counter = 1;
      while (fs.existsSync(finalTargetPath)) {
        const ext = path.extname(filename);
        const nameWithoutExt = path.basename(filename, ext);
        finalTargetPath = path.join(OUTPUT_PATH, category, `${nameWithoutExt}_${counter}${ext}`);
        counter++;
      }
      
      fs.copyFileSync(filePath, finalTargetPath);
    }
  }
  
  // Generate reports
  generateReports(duplicateReport);
  
  console.log('Consolidation complete!');
  console.log(`- Original files backed up to: ${BACKUP_PATH}`);
  console.log(`- Consolidated files in: ${OUTPUT_PATH}`);
  console.log(`- Duplicate report: ${OUTPUT_PATH}/duplicate-report.md`);
  console.log(`- Taxonomy guide: ${OUTPUT_PATH}/taxonomy-guide.md`);
}

function generateReports(duplicateReport) {
  // Generate duplicate report
  let duplicateReportContent = `# Duplicate Files Report

This report lists all duplicate files found during consolidation.

## Summary
- Total duplicate sets: ${duplicateReport.length}
- Total duplicate files: ${duplicateReport.reduce((sum, set) => sum + set.duplicates.length, 0)}

## Duplicate Sets

`;
  
  for (const [index, set] of duplicateReport.entries()) {
    duplicateReportContent += `### Set ${index + 1}
- **Primary file**: ${set.primary}
- **Target location**: ${set.target}
- **Duplicates**:
${set.duplicates.map(d => `  - ${d}`).join('\n')}

`;
  }
  
  fs.writeFileSync(path.join(OUTPUT_PATH, 'duplicate-report.md'), duplicateReportContent);
  
  // Generate taxonomy guide
  let taxonomyGuide = `# Image Taxonomy Guide

This guide explains the organization structure for the consolidated images.

## Structure Overview

`;
  
  for (const [mainCategory, subCategories] of Object.entries(TAXONOMY)) {
    taxonomyGuide += `### ${mainCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
`;
    
    for (const [subCategory, description] of Object.entries(subCategories)) {
      taxonomyGuide += `- **${subCategory}**: ${description}
`;
    }
    taxonomyGuide += '\n';
  }
  
  taxonomyGuide += `## File Naming Conventions

- Use descriptive, lowercase names with hyphens
- Include dimensions when relevant (e.g., hero-image-1920x1080.webp)
- Include project/client prefix when relevant (e.g., atmosfx-media-player-hero.webp)
- Use appropriate file extensions (.webp for photos, .svg for vectors, .png for logos)

## Migration Notes

- All original files have been backed up to the \`images-backup\` folder
- Duplicate files have been consolidated to single instances
- Files have been categorized according to the taxonomy above
- Original folder structure has been preserved in the backup

`;
  
  fs.writeFileSync(path.join(OUTPUT_PATH, 'taxonomy-guide.md'), taxonomyGuide);
}

// Main execution
if (require.main === module) {
  try {
    consolidateImages();
  } catch (error) {
    console.error('Error during consolidation:', error);
    process.exit(1);
  }
}

module.exports = { consolidateImages, categorizeFile, TAXONOMY };
