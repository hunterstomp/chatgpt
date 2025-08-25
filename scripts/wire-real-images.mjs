#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const CASE_STUDIES_DIR = path.join(projectRoot, 'src/pages/case-studies');
const ARCHIVE_IMAGES_DIR = path.join(projectRoot, 'archive/original-site/assets/images');
const PUBLIC_ASSETS_DIR = path.join(projectRoot, 'public/assets');

// Image mapping for case studies - updated with actual available images
const CASE_STUDY_IMAGE_MAPPING = {
  'bmgf-gallery': {
    sourceDir: 'bill-melinda-gates-foundation',
    heroImages: ['annual-newsletter-hero.webp'],
    galleryImages: [
      'annual-newsletter-hero.webp'
    ]
  },
  'atmosfx-ecommerce': {
    sourceDir: 'atmosfx',
    heroImages: ['ecommerce-redesign-hero.webp'],
    galleryImages: [
      'ecommerce-redesign-hero.webp'
    ]
  },
  'atmosfx-media-player': {
    sourceDir: 'atmosfx',
    heroImages: ['media-player-hero.webp'],
    galleryImages: [
      'media-player-hero.webp'
    ]
  },
  'tmobile-gallery': {
    sourceDir: 't-mobile',
    heroImages: ['idea-labs-hero.webp', 'marketing-campaign-hero.png'],
    galleryImages: [
      'idea-labs-hero.webp',
      'marketing-campaign-hero.png',
      'plans-comparison-hero.webp',
      'first-bill.png',
      'plan-selection.png',
      'account-setup.png'
    ]
  },
  'tmobile-how-to-switch': {
    sourceDir: 't-mobile',
    heroImages: ['how-to-join-us-hero.webp', 'purchase-simplicity-hero.webp'],
    galleryImages: [
      'how-to-join-us-hero.webp',
      'purchase-simplicity-hero.webp',
      'detailed-comparison.png',
      'plans-overview.png',
      'mobile-experience.png',
      'checkout-form.png'
    ]
  },
  'microsoft-liveworkspace': {
    sourceDir: 'microsoft',
    heroImages: ['office-live-hero.webp', 'office365-hero.webp'],
    galleryImages: [
      'office-live-hero.webp',
      'office365-hero.webp',
      'work-essentials-hero.webp'
    ]
  }
};

// About page images
const ABOUT_IMAGES = {
  sourceDir: 'q10ux',
  heroImages: ['avatar.png', 'Avatar2.png'],
  galleryImages: [
    'avatar.png',
    'Avatar2.png',
    'q10-bulb.webp',
    'q10ux logo.png'
  ]
};

// Home page hero images - using actual available images
const HOME_HERO_IMAGES = [
  'bill-melinda-gates-foundation/annual-newsletter-hero.webp',
  'atmosfx/ecommerce-redesign-hero.webp',
  'q10ux/avatar.png'
];

// Case studies hub hero images
const CASE_STUDIES_HUB_HERO_IMAGES = [
  'bill-melinda-gates-foundation/annual-newsletter-hero.webp',
  'atmosfx/media-player-hero.webp',
  't-mobile/idea-labs-hero.webp'
];

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function copyImage(sourcePath, destPath) {
  try {
    await fs.copyFile(sourcePath, destPath);
    console.log(`✅ Copied: ${path.basename(sourcePath)}`);
    return true;
  } catch (error) {
    console.log(`❌ Failed to copy: ${path.basename(sourcePath)} - ${error.message}`);
    return false;
  }
}

async function findImageInDirectory(dirPath, imageName) {
  try {
    const files = await fs.readdir(dirPath);
    // Try exact match first
    if (files.includes(imageName)) {
      return path.join(dirPath, imageName);
    }
    
    // Try with different extensions
    const nameWithoutExt = path.parse(imageName).name;
    for (const file of files) {
      if (file.startsWith(nameWithoutExt + '.')) {
        return path.join(dirPath, file);
      }
    }
    
    // Try case-insensitive match
    for (const file of files) {
      if (file.toLowerCase().includes(nameWithoutExt.toLowerCase())) {
        return path.join(dirPath, file);
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

async function createPlaceholderImage(destPath, width = 800, height = 600, color = '#4F46E5') {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">Image Placeholder</text>
  </svg>`;
  
  await fs.writeFile(destPath, svg);
  console.log(`📝 Created placeholder: ${path.basename(destPath)}`);
}

async function processCaseStudyImages() {
  console.log('🖼️  Processing case study images...');
  
  for (const [slug, config] of Object.entries(CASE_STUDY_IMAGE_MAPPING)) {
    const caseStudyDir = path.join(PUBLIC_ASSETS_DIR, 'case-studies', slug);
    await ensureDirectoryExists(caseStudyDir);
    
    const sourceDir = path.join(ARCHIVE_IMAGES_DIR, config.sourceDir);
    
    // Copy hero images
    for (const heroImage of config.heroImages) {
      const sourcePath = await findImageInDirectory(sourceDir, heroImage);
      if (sourcePath) {
        const destPath = path.join(caseStudyDir, `hero-${path.basename(sourcePath)}`);
        await copyImage(sourcePath, destPath);
      } else {
        console.log(`⚠️  Hero image not found: ${heroImage}`);
      }
    }
    
    // Copy gallery images
    for (const galleryImage of config.galleryImages) {
      const sourcePath = await findImageInDirectory(sourceDir, galleryImage);
      if (sourcePath) {
        const destPath = path.join(caseStudyDir, path.basename(sourcePath));
        await copyImage(sourcePath, destPath);
      } else {
        console.log(`⚠️  Gallery image not found: ${galleryImage}`);
      }
    }
  }
}

async function processAboutImages() {
  console.log('👤 Processing about page images...');
  
  const aboutDir = path.join(PUBLIC_ASSETS_DIR, 'about');
  await ensureDirectoryExists(aboutDir);
  
  const sourceDir = path.join(ARCHIVE_IMAGES_DIR, ABOUT_IMAGES.sourceDir);
  
  // Copy hero images
  for (const heroImage of ABOUT_IMAGES.heroImages) {
    const sourcePath = await findImageInDirectory(sourceDir, heroImage);
    if (sourcePath) {
      const destPath = path.join(aboutDir, path.basename(sourcePath));
      await copyImage(sourcePath, destPath);
    } else {
      console.log(`⚠️  About hero image not found: ${heroImage}`);
    }
  }
  
  // Copy gallery images
  for (const galleryImage of ABOUT_IMAGES.galleryImages) {
    const sourcePath = await findImageInDirectory(sourceDir, galleryImage);
    if (sourcePath) {
      const destPath = path.join(aboutDir, path.basename(sourcePath));
      await copyImage(sourcePath, destPath);
    } else {
      console.log(`⚠️  About gallery image not found: ${galleryImage}`);
    }
  }
}

async function processHeroImages() {
  console.log('🎯 Processing hero images...');
  
  const heroDir = path.join(PUBLIC_ASSETS_DIR, 'hero');
  await ensureDirectoryExists(heroDir);
  
  // Copy home hero images
  for (const imagePath of HOME_HERO_IMAGES) {
    const sourcePath = path.join(ARCHIVE_IMAGES_DIR, imagePath);
    if (await fs.access(sourcePath).then(() => true).catch(() => false)) {
      const destPath = path.join(heroDir, path.basename(imagePath));
      await copyImage(sourcePath, destPath);
    } else {
      console.log(`⚠️  Home hero image not found: ${imagePath}`);
    }
  }
  
  // Copy case studies hub hero images
  for (const imagePath of CASE_STUDIES_HUB_HERO_IMAGES) {
    const sourcePath = path.join(ARCHIVE_IMAGES_DIR, imagePath);
    if (await fs.access(sourcePath).then(() => true).catch(() => false)) {
      const destPath = path.join(heroDir, `hub-${path.basename(imagePath)}`);
      await copyImage(sourcePath, destPath);
    } else {
      console.log(`⚠️  Hub hero image not found: ${imagePath}`);
    }
  }
}

async function updateCaseStudyFrontmatter() {
  console.log('📝 Updating case study frontmatter...');
  
  const caseStudyFiles = await glob('src/pages/case-studies/*.md');
  
  for (const filePath of caseStudyFiles) {
    const content = await fs.readFile(filePath, 'utf-8');
    const slug = path.basename(filePath, '.md');
    
    if (!CASE_STUDY_IMAGE_MAPPING[slug]) {
      console.log(`⚠️  No image mapping for: ${slug}`);
      continue;
    }
    
    // Parse frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      console.log(`⚠️  No frontmatter found in: ${slug}`);
      continue;
    }
    
    let frontmatter = frontmatterMatch[1];
    const config = CASE_STUDY_IMAGE_MAPPING[slug];
    
    // Build gallery array
    const galleryImages = [];
    const caseStudyDir = path.join(PUBLIC_ASSETS_DIR, 'case-studies', slug);
    
    try {
      const files = await fs.readdir(caseStudyDir);
      for (const file of files) {
        if (file.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
          const imagePath = `/assets/case-studies/${slug}/${file}`;
          const alt = file.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          galleryImages.push({
            src: imagePath,
            alt: alt,
            caption: alt
          });
        }
      }
    } catch (error) {
      console.log(`⚠️  Could not read case study directory: ${slug}`);
    }
    
    // Update or add gallery field
    if (galleryImages.length > 0) {
      const galleryYaml = `gallery:\n${galleryImages.map(img => `  - src: "${img.src}"\n    alt: "${img.alt}"\n    caption: "${img.caption}"`).join('\n')}`;
      
      if (frontmatter.includes('gallery:')) {
        // Replace existing gallery
        frontmatter = frontmatter.replace(/gallery:\s*\n(?:  -.*\n)*/, galleryYaml);
      } else {
        // Add gallery at the end
        frontmatter += `\n${galleryYaml}`;
      }
      
      // Update the file
      const newContent = content.replace(/^---\n[\s\S]*?\n---/, `---\n${frontmatter}\n---`);
      await fs.writeFile(filePath, newContent);
      console.log(`✅ Updated frontmatter for: ${slug}`);
    } else {
      console.log(`⚠️  No images found for: ${slug}`);
    }
  }
}

async function updateHomePageHero() {
  console.log('🏠 Updating home page hero images...');
  
  const homePagePath = 'src/pages/index.astro';
  const content = await fs.readFile(homePagePath, 'utf-8');
  
  // Build hero images array from available images
  const heroImages = [];
  const heroDir = path.join(PUBLIC_ASSETS_DIR, 'hero');
  
  try {
    const files = await fs.readdir(heroDir);
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
        heroImages.push(`/assets/hero/${file}`);
      }
    }
  } catch (error) {
    console.log('⚠️  Could not read hero directory');
  }
  
  // Fallback to default images if none found
  if (heroImages.length === 0) {
    heroImages.push(
      '/assets/placeholders/hero-placeholder.svg',
      '/assets/placeholders/hero-placeholder.svg',
      '/assets/placeholders/hero-placeholder.svg'
    );
  }
  
  // Update the hero images array in the file
  const heroImagesArray = `const heroImages = [\n  ${heroImages.map(img => `"${img}"`).join(',\n  ')}\n];`;
  
  let newContent = content;
  if (content.includes('const heroImages = [')) {
    newContent = content.replace(/const heroImages = \[[\s\S]*?\];/, heroImagesArray);
  } else {
    // Add after the imports
    const importEnd = content.indexOf('---', content.indexOf('---') + 3);
    newContent = content.slice(0, importEnd) + '\n\n' + heroImagesArray + '\n' + content.slice(importEnd);
  }
  
  await fs.writeFile(homePagePath, newContent);
  console.log('✅ Updated home page hero images');
}

async function updateCaseStudiesHubHero() {
  console.log('📚 Updating case studies hub hero images...');
  
  const hubPagePath = 'src/pages/case-studies/index.astro';
  const content = await fs.readFile(hubPagePath, 'utf-8');
  
  // Build hero images array from available hub images
  const heroImages = [];
  const heroDir = path.join(PUBLIC_ASSETS_DIR, 'hero');
  
  try {
    const files = await fs.readdir(heroDir);
    for (const file of files) {
      if (file.startsWith('hub-') && file.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
        heroImages.push(`/assets/hero/${file}`);
      }
    }
  } catch (error) {
    console.log('⚠️  Could not read hero directory');
  }
  
  // Fallback to default images if none found
  if (heroImages.length === 0) {
    heroImages.push(
      '/assets/placeholders/hero-placeholder.svg',
      '/assets/placeholders/hero-placeholder.svg'
    );
  }
  
  // Update the hero images array in the file
  const heroImagesArray = `const heroImages = [\n  ${heroImages.map(img => `"${img}"`).join(',\n  ')}\n];`;
  
  let newContent = content;
  if (content.includes('const heroImages = [')) {
    newContent = content.replace(/const heroImages = \[[\s\S]*?\];/, heroImagesArray);
  } else {
    // Add after the imports
    const importEnd = content.indexOf('---', content.indexOf('---') + 3);
    newContent = content.slice(0, importEnd) + '\n\n' + heroImagesArray + '\n' + content.slice(importEnd);
  }
  
  await fs.writeFile(hubPagePath, newContent);
  console.log('✅ Updated case studies hub hero images');
}

async function updateFeaturedCaseStudies() {
  console.log('⭐ Updating featured case studies component...');
  
  const componentPath = 'src/components/FeaturedCaseStudies.astro';
  const content = await fs.readFile(componentPath, 'utf-8');
  
  // Update the fallback image path
  const updatedContent = content.replace(
    '/assets/images/placeholder.jpg',
    '/assets/placeholders/case-study-placeholder.svg'
  );
  
  await fs.writeFile(componentPath, updatedContent);
  console.log('✅ Updated featured case studies component');
}

async function createPlaceholderImages() {
  console.log('🎨 Creating placeholder images...');
  
  const placeholderDir = path.join(PUBLIC_ASSETS_DIR, 'placeholders');
  await ensureDirectoryExists(placeholderDir);
  
  // Create case study placeholder
  await createPlaceholderImage(
    path.join(placeholderDir, 'case-study-placeholder.svg'),
    800, 600, '#4F46E5'
  );
  
  // Create hero placeholder
  await createPlaceholderImage(
    path.join(placeholderDir, 'hero-placeholder.svg'),
    1200, 800, '#7C3AED'
  );
  
  // Create about placeholder
  await createPlaceholderImage(
    path.join(placeholderDir, 'about-placeholder.svg'),
    600, 800, '#059669'
  );
}

async function main() {
  console.log('🚀 Starting image wiring process...\n');
  
  try {
    await processCaseStudyImages();
    await processAboutImages();
    await processHeroImages();
    await updateCaseStudyFrontmatter();
    await updateHomePageHero();
    await updateCaseStudiesHubHero();
    await updateFeaturedCaseStudies();
    await createPlaceholderImages();
    
    console.log('\n🎉 Image wiring complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Check: http://localhost:4327/');
    console.log('3. Verify images are loading correctly');
    console.log('4. Test case study galleries');
    
  } catch (error) {
    console.error('❌ Error during image wiring:', error);
    process.exit(1);
  }
}

main();
