#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const SOURCE_PATH = 'Q10UXPortfolio/assets/images';
const OUTPUT_PATH = 'Q10UXPortfolio/assets/images-organized';
const CAPTIONS_FILE = 'Q10UXPortfolio/assets/images-organized/image-captions.json';

// Enhanced taxonomy with AI-friendly descriptions
const TAXONOMY = {
  'branding': {
    'logos': 'Company and project logos, brand identities',
    'avatars': 'Profile pictures, headshots, personal branding',
    'icons': 'UI icons, badges, design system elements'
  },
  'case-studies': {
    'atmosfx': 'AtmosFX e-commerce and media player case studies',
    'att': 'AT&T international roaming case studies',
    'disney': 'Disney VMC and bug tracking case studies',
    'microsoft': 'Microsoft Office and collaboration case studies',
    'tmobile': 'T-Mobile mobile app and service case studies',
    'gates-foundation': 'Bill & Melinda Gates Foundation case studies',
    'other': 'Other client and project case studies'
  },
  'design-assets': {
    'wireframes': 'Low-fidelity wireframes and sketches',
    'mockups': 'High-fidelity mockups and prototypes',
    'backgrounds': 'Background images, gradients, textures',
    'ui-elements': 'UI components, buttons, forms, layouts'
  },
  'documents': {
    'resumes': 'Resume files, CV documents, professional credentials',
    'presentations': 'Presentation slides, pitch decks, project overviews'
  },
  'photography': {
    'hero-images': 'Hero banners, landing page images, featured visuals',
    'product-shots': 'Product photography, interface screenshots, detail shots'
  },
  'tools': {
    'design-tools': 'Design software screenshots, tool interfaces',
    'software': 'Application screenshots, software demos, technical visuals'
  }
};

// AI Vision prompts for different categories
const AI_PROMPTS = {
  'branding': {
    'logos': 'Analyze this logo design. Describe the visual style, colors, typography, and brand personality. Focus on design elements that make it memorable and effective.',
    'avatars': 'Analyze this profile image. Describe the professional appearance, style, mood, and how it represents personal branding.',
    'icons': 'Analyze this icon design. Describe the visual style, meaning, usability, and how it fits into a design system.'
  },
  'case-studies': {
    'atmosfx': 'Analyze this UX case study image. Describe the design process, user interface elements, user experience flow, and key design decisions.',
    'att': 'Analyze this UX case study image. Describe the design process, user interface elements, user experience flow, and key design decisions.',
    'disney': 'Analyze this UX case study image. Describe the design process, user interface elements, user experience flow, and key design decisions.',
    'microsoft': 'Analyze this UX case study image. Describe the design process, user interface elements, user experience flow, and key design decisions.',
    'tmobile': 'Analyze this UX case study image. Describe the design process, user interface elements, user experience flow, and key design decisions.',
    'gates-foundation': 'Analyze this UX case study image. Describe the design process, user interface elements, user experience flow, and key design decisions.',
    'other': 'Analyze this UX case study image. Describe the design process, user interface elements, user experience flow, and key design decisions.'
  },
  'design-assets': {
    'wireframes': 'Analyze this wireframe. Describe the layout structure, user flow, information architecture, and key interface elements.',
    'mockups': 'Analyze this mockup. Describe the visual design, user interface elements, interaction patterns, and design decisions.',
    'backgrounds': 'Analyze this background image. Describe the visual style, mood, colors, and how it could be used in design.',
    'ui-elements': 'Analyze this UI element. Describe the component type, visual design, interaction patterns, and usability considerations.'
  },
  'documents': {
    'resumes': 'Analyze this resume document. Describe the layout, typography, content structure, and professional presentation.',
    'presentations': 'Analyze this presentation slide. Describe the content, layout, visual design, and communication effectiveness.'
  },
  'photography': {
    'hero-images': 'Analyze this hero image. Describe the visual impact, mood, composition, and how it could engage users.',
    'product-shots': 'Analyze this product image. Describe the subject, composition, lighting, and how it showcases the product or interface.'
  },
  'tools': {
    'design-tools': 'Analyze this design tool interface. Describe the software, features shown, workflow, and design capabilities.',
    'software': 'Analyze this software interface. Describe the application, features, user interface, and functionality shown.'
  }
};

function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9\s\-_\.]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .toLowerCase()
    .trim();
}

function generateFriendlyName(originalName, category, subcategory) {
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  
  // Remove common prefixes and suffixes
  let cleanName = nameWithoutExt
    .replace(/^(0-9]+-)/, '') // Remove leading numbers and hyphens
    .replace(/-[0-9]+$/, '') // Remove trailing numbers
    .replace(/^[0-9]+/, '') // Remove leading numbers
    .replace(/_/g, '-') // Replace underscores with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
  
  // Add category prefix for better organization
  const prefix = `${category}-${subcategory}`;
  
  // Generate a friendly name
  let friendlyName = cleanName;
  
  // If the name is too generic, add context
  if (cleanName.length < 3 || /^[0-9]+$/.test(cleanName)) {
    friendlyName = `${prefix}-${Date.now()}`;
  }
  
  return sanitizeFilename(`${prefix}-${friendlyName}${ext}`);
}

function categorizeFile(filename, filePath) {
  const lowerFilename = filename.toLowerCase();
  const lowerPath = filePath.toLowerCase();
  
  // Branding files
  if (lowerFilename.includes('quentin-avatar') || lowerFilename.includes('aboutquentin')) {
    return 'branding/avatars';
  }
  
  if (lowerFilename.includes('logo') || lowerFilename.includes('q10ux-logo') || lowerFilename.includes('pop_logo')) {
    return 'branding/logos';
  }
  
  if (lowerFilename.includes('icon') || lowerFilename.includes('badge')) {
    return 'branding/icons';
  }
  
  // Documents
  if (lowerFilename.includes('resume') || lowerFilename.includes('.pdf')) {
    return 'documents/resumes';
  }
  
  if (lowerFilename.includes('slide') || lowerFilename.includes('presentation')) {
    return 'documents/presentations';
  }
  
  // Design tools
  if (lowerFilename.includes('sketch') || lowerFilename.includes('figma') || 
      lowerFilename.includes('axure') || lowerFilename.includes('photoshop') || 
      lowerFilename.includes('zeplin') || lowerFilename.includes('keynote')) {
    return 'tools/design-tools';
  }
  
  // Case studies
  if (lowerFilename.includes('atmosfx') || lowerFilename.includes('afx') || lowerPath.includes('atmosfx')) {
    return 'case-studies/atmosfx';
  }
  
  if (lowerFilename.includes('att') || lowerFilename.includes('international-roaming') || lowerPath.includes('att')) {
    return 'case-studies/att';
  }
  
  if (lowerFilename.includes('disney') || lowerFilename.includes('vmc') || lowerPath.includes('disney')) {
    return 'case-studies/disney';
  }
  
  if (lowerFilename.includes('microsoft') || lowerFilename.includes('office') || 
      lowerFilename.includes('o365') || lowerPath.includes('microsoft')) {
    return 'case-studies/microsoft';
  }
  
  if (lowerFilename.includes('tmobile') || lowerFilename.includes('t-mobile') || lowerPath.includes('tmobile')) {
    return 'case-studies/tmobile';
  }
  
  if (lowerFilename.includes('gates') || lowerFilename.includes('bmgf') || lowerPath.includes('gates')) {
    return 'case-studies/gates-foundation';
  }
  
  // Design assets
  if (lowerFilename.includes('wireframe') || lowerFilename.includes('mockup') || 
      lowerFilename.includes('prototype') || lowerFilename.includes('bkg-wireframes')) {
    return 'design-assets/wireframes';
  }
  
  if (lowerFilename.includes('background') || lowerFilename.includes('gradient') || 
      lowerFilename.includes('bkg') || lowerFilename.includes('darkgradient')) {
    return 'design-assets/backgrounds';
  }
  
  if (lowerFilename.includes('hero') || lowerFilename.includes('banner')) {
    return 'photography/hero-images';
  }
  
  if (lowerFilename.includes('image-') || lowerFilename.includes('photo-')) {
    return 'photography/product-shots';
  }
  
  if (lowerFilename.includes('screen') || lowerFilename.includes('shot')) {
    return 'tools/software';
  }
  
  // Default
  return 'design-assets/ui-elements';
}

async function generateAICaption(imagePath, category, subcategory) {
  // This would integrate with an AI vision service like OpenAI's Vision API
  // For now, we'll create a structured caption based on the file analysis
  
  const filename = path.basename(imagePath);
  const ext = path.extname(imagePath).toLowerCase();
  const stats = fs.statSync(imagePath);
  
  // Generate a descriptive caption based on category and file characteristics
  let caption = '';
  
  switch (category) {
    case 'branding':
      switch (subcategory) {
        case 'logos':
          caption = `Logo design showcasing brand identity and visual style`;
          break;
        case 'avatars':
          caption = `Professional profile image for personal branding`;
          break;
        case 'icons':
          caption = `UI icon design for interface and design system`;
          break;
      }
      break;
      
    case 'case-studies':
      caption = `UX case study showing design process and user experience for ${subcategory} project`;
      break;
      
    case 'design-assets':
      switch (subcategory) {
        case 'wireframes':
          caption = `Wireframe showing layout structure and user flow`;
          break;
        case 'mockups':
          caption = `High-fidelity mockup demonstrating visual design and interactions`;
          break;
        case 'backgrounds':
          caption = `Background design element for visual enhancement`;
          break;
        case 'ui-elements':
          caption = `UI component design for user interface`;
          break;
      }
      break;
      
    case 'documents':
      switch (subcategory) {
        case 'resumes':
          caption = `Professional resume document`;
          break;
        case 'presentations':
          caption = `Presentation slide for project communication`;
          break;
      }
      break;
      
    case 'photography':
      switch (subcategory) {
        case 'hero-images':
          caption = `Hero image for engaging user experience`;
          break;
        case 'product-shots':
          caption = `Product or interface photography`;
          break;
      }
      break;
      
    case 'tools':
      switch (subcategory) {
        case 'design-tools':
          caption = `Design software interface and workflow`;
          break;
        case 'software':
          caption = `Software application screenshot`;
          break;
      }
      break;
  }
  
  // Add technical details
  caption += ` (${ext.toUpperCase().substring(1)} format, ${Math.round(stats.size / 1024)}KB)`;
  
  return caption;
}

async function organizeImages() {
  console.log('🎨 Starting Enhanced Image Organization...');
  
  const captions = {};
  const processedFiles = [];
  
  // Process all image files
  const imageFiles = fs.readdirSync(SOURCE_PATH).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.pdf', '.gif'].includes(ext);
  });
  
  console.log(`📁 Found ${imageFiles.length} image files to organize`);
  
  for (const file of imageFiles) {
    const sourcePath = path.join(SOURCE_PATH, file);
    const category = categorizeFile(file, sourcePath);
    const [mainCategory, subCategory] = category.split('/');
    
    // Generate friendly filename
    const friendlyName = generateFriendlyName(file, mainCategory, subCategory);
    const targetPath = path.join(OUTPUT_PATH, category, friendlyName);
    
    // Handle filename conflicts
    let finalTargetPath = targetPath;
    let counter = 1;
    while (fs.existsSync(finalTargetPath)) {
      const ext = path.extname(friendlyName);
      const nameWithoutExt = path.basename(friendlyName, ext);
      finalTargetPath = path.join(OUTPUT_PATH, category, `${nameWithoutExt}-${counter}${ext}`);
      counter++;
    }
    
    try {
      // Copy file to new location
      fs.copyFileSync(sourcePath, finalTargetPath);
      
      // Generate AI caption
      const caption = await generateAICaption(sourcePath, mainCategory, subCategory);
      
      // Store caption
      const relativePath = path.relative(OUTPUT_PATH, finalTargetPath);
      captions[relativePath] = {
        originalName: file,
        friendlyName: path.basename(finalTargetPath),
        category: mainCategory,
        subcategory: subCategory,
        caption: caption,
        aiPrompt: AI_PROMPTS[mainCategory]?.[subCategory] || 'Analyze this image for UX design context',
        fileSize: fs.statSync(sourcePath).size,
        processedAt: new Date().toISOString()
      };
      
      processedFiles.push({
        original: file,
        new: path.basename(finalTargetPath),
        category: category,
        path: relativePath
      });
      
      console.log(`✅ Organized: ${file} → ${path.basename(finalTargetPath)} (${category})`);
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  // Save captions to JSON file
  fs.writeFileSync(CAPTIONS_FILE, JSON.stringify(captions, null, 2));
  
  // Generate summary report
  const summary = {
    totalFiles: imageFiles.length,
    processedFiles: processedFiles.length,
    categories: {},
    captionsGenerated: Object.keys(captions).length,
    processedAt: new Date().toISOString()
  };
  
  // Count files by category
  processedFiles.forEach(file => {
    const category = file.category;
    summary.categories[category] = (summary.categories[category] || 0) + 1;
  });
  
  // Save summary
  fs.writeFileSync(path.join(OUTPUT_PATH, 'organization-summary.json'), JSON.stringify(summary, null, 2));
  
  console.log('\n🎉 Organization Complete!');
  console.log(`📊 Summary:`);
  console.log(`   - Total files processed: ${summary.processedFiles}`);
  console.log(`   - Captions generated: ${summary.captionsGenerated}`);
  console.log(`   - Organized structure: ${OUTPUT_PATH}`);
  console.log(`   - Captions file: ${CAPTIONS_FILE}`);
  console.log(`   - Summary report: ${OUTPUT_PATH}/organization-summary.json`);
  
  console.log('\n📁 Category breakdown:');
  Object.entries(summary.categories).forEach(([category, count]) => {
    console.log(`   - ${category}: ${count} files`);
  });
  
  return { captions, processedFiles, summary };
}

// Main execution
if (require.main === module) {
  organizeImages().catch(console.error);
}

module.exports = { organizeImages, categorizeFile, generateFriendlyName, generateAICaption, TAXONOMY };
