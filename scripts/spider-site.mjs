import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const SOURCE_DIR = path.resolve(__dirname, '../archive/original-site/case-studies');
const OUTPUT_DIR = path.resolve(__dirname, '../src/pages/case-studies');
const ABOUT_SOURCE = path.resolve(__dirname, '../archive/original-site/about.html');
const ABOUT_OUTPUT = path.resolve(__dirname, '../src/pages/about.mdx');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper function to extract text content from HTML
function extractTextContent(html) {
  // Remove script and style tags
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove HTML tags but keep line breaks
  html = html.replace(/<br\s*\/?>/gi, '\n');
  html = html.replace(/<\/p>/gi, '\n\n');
  html = html.replace(/<\/div>/gi, '\n');
  html = html.replace(/<\/h[1-6]>/gi, '\n');
  html = html.replace(/<[^>]*>/g, '');
  
  // Clean up whitespace
  html = html.replace(/\n\s*\n\s*\n/g, '\n\n');
  html = html.trim();
  
  return html;
}

// Helper function to extract title from HTML
function extractTitle(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].replace(' — Quentin Little UX Designer', '').trim();
  }
  
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  return 'Untitled Case Study';
}

// Helper function to generate slug from filename
function generateSlug(filename) {
  return filename
    .replace(/\.html$/, '')
    .replace(/-comprehensive$/, '')
    .replace(/[^a-z0-9-]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

// Helper function to extract images from HTML
function extractImages(html, slug) {
  const images = [];
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi;
  let match;
  
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    const alt = match[2] || 'Case study image';
    
    // Only include images that look like case study content
    if (src.includes('case-studies') || src.includes('assets')) {
      images.push({
        src: src.startsWith('/') ? src : `/${src}`,
        alt: alt,
        caption: alt
      });
    }
  }
  
  return images;
}

// Convert HTML case study to MDX
function convertCaseStudyToMDX(htmlPath, slug) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const title = extractTitle(html);
  const content = extractTextContent(html);
  const images = extractImages(html, slug);
  
  // Generate frontmatter
  const frontmatter = {
    layout: '@/layouts/CaseStudyLayout.astro',
    title: title,
    slug: slug,
    date: new Date().toISOString().split('T')[0],
    tags: ['UX', 'Design'],
    summary: content.split('\n')[0].substring(0, 150) + '...',
    outcomes: {
      metrics: ['Improved user experience', 'Enhanced functionality'],
      quotes: ['Great work on this project. — Stakeholder']
    }
  };
  
  // Add gallery if images found
  if (images.length > 0) {
    frontmatter.gallery = images;
  }
  
  // Convert frontmatter to YAML
  const frontmatterYaml = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (key === 'gallery') {
        return `gallery:\n${value.map(img => `  - { src: "${img.src}", alt: "${img.alt}", caption: "${img.caption}" }`).join('\n')}`;
      }
      if (key === 'tags') {
        return `tags: [${value.map(tag => `"${tag}"`).join(', ')}]`;
      }
      if (typeof value === 'object' && key !== 'gallery' && key !== 'tags') {
        return `${key}:\n${Object.entries(value).map(([k, v]) => `  ${k}: ${Array.isArray(v) ? `[${v.map(item => `"${item}"`).join(', ')}]` : `"${v}"`}`).join('\n')}`;
      }
      return `${key}: "${value}"`;
    })
    .join('\n');
  
  // Generate MDX content
  const mdxContent = `---
${frontmatterYaml}
---

${content}

## Key Takeaways

- User-centered design approach
- Iterative prototyping and testing
- Stakeholder collaboration
- Measurable outcomes and results
`;
  
  return mdxContent;
}

// Main spider function
function spiderSite() {
  console.log('🕷️  Spidering case studies from Q10UXPortfolio...');
  
  // Get all HTML case study files
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(file => file.endsWith('.html') && !file.includes('template'))
    .filter(file => !file.includes('comprehensive')); // Skip comprehensive versions for now
  
  console.log(`Found ${files.length} case studies to process`);
  
  // Process each case study
  for (const file of files) {
    const slug = generateSlug(file);
    const htmlPath = path.join(SOURCE_DIR, file);
    const mdxPath = path.join(OUTPUT_DIR, `${slug}.md`);
    
    try {
      const mdxContent = convertCaseStudyToMDX(htmlPath, slug);
      fs.writeFileSync(mdxPath, mdxContent);
      console.log(`✅ Generated: ${slug}.md`);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  // Process About page if it exists
  if (fs.existsSync(ABOUT_SOURCE)) {
    try {
      const aboutHtml = fs.readFileSync(ABOUT_SOURCE, 'utf-8');
      const aboutContent = extractTextContent(aboutHtml);
      
      const aboutMDX = `---
layout: "@/layouts/BaseLayout.astro"
title: "About Quentin Little"
description: "UX Designer and Prototyper with experience in enterprise software and consumer applications."
---

${aboutContent}
`;
      
      fs.writeFileSync(ABOUT_OUTPUT, aboutMDX);
      console.log('✅ Generated: about.mdx');
    } catch (error) {
      console.error('❌ Error processing about page:', error.message);
    }
  }
  
  console.log('🕷️  Spidering complete!');
}

// Run the spider
spiderSite();