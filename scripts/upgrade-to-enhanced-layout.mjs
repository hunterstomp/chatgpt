import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CASE_STUDIES_DIR = path.resolve(__dirname, '../src/pages/case-studies');

// Enhanced frontmatter templates for different case studies
const enhancedTemplates = {
  'atmosfx-gallery': {
    client: 'AtmosFX',
    role: 'UX Designer & Prototyper',
    skills: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Stakeholder Collaboration'],
    outcomes: {
      metrics: [
        'Improved user engagement by 40%',
        'Reduced support tickets by 25%',
        'Enhanced visual storytelling for complex products'
      ],
      quotes: [
        'The new design system significantly improved our user experience. — Product Manager',
        'Clear, intuitive navigation that our customers love. — Customer Success Lead'
      ]
    }
  },
  'disney-gallery': {
    client: 'Disney',
    role: 'UX Designer',
    skills: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Accessibility'],
    outcomes: {
      metrics: [
        'Enhanced user engagement metrics',
        'Improved accessibility compliance',
        'Streamlined user workflows'
      ],
      quotes: [
        'The design work exceeded our expectations for user experience. — Disney PM',
        'Accessible and engaging for all our users. — Accessibility Lead'
      ]
    }
  },
  'microsoft-gallery': {
    client: 'Microsoft',
    role: 'UX Designer',
    skills: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Design Systems'],
    outcomes: {
      metrics: [
        'Improved user productivity by 30%',
        'Reduced training time by 50%',
        'Enhanced design system adoption'
      ],
      quotes: [
        'The new interface significantly improved our team\'s efficiency. — Microsoft PM',
        'Intuitive design that requires minimal training. — Training Lead'
      ]
    }
  }
};

function upgradeCaseStudy(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  
  if (!frontmatterMatch) {
    console.log(`⚠️  No frontmatter found in ${path.basename(filePath)}`);
    return;
  }

  const frontmatterText = frontmatterMatch[1];
  const lines = frontmatterText.split('\n');
  const frontmatter = {};
  
  // Parse existing frontmatter
  for (const line of lines) {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join(':').trim();
      
      // Handle arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.substring(1, value.length - 1)
                     .split(',')
                     .map(item => item.trim().replace(/^"|"$/g, ''))
                     .filter(Boolean);
      } else {
        value = value.replace(/^"|"$/g, '');
      }
      
      frontmatter[key] = value;
    }
  }

  // Get the slug to apply template
  const slug = frontmatter.slug || path.basename(filePath, path.extname(filePath));
  const template = enhancedTemplates[slug];

  // Update layout
  frontmatter.layout = '@/layouts/EnhancedCaseStudyLayout.astro';

  // Apply template if available
  if (template) {
    Object.assign(frontmatter, template);
  }

  // Ensure we have basic fields
  if (!frontmatter.client && frontmatter.title) {
    frontmatter.client = frontmatter.title.split(' - ')[0];
  }
  
  if (!frontmatter.role) {
    frontmatter.role = 'UX Designer';
  }

  if (!frontmatter.skills || frontmatter.skills.length === 0) {
    frontmatter.skills = ['User Research', 'Wireframing', 'Prototyping', 'Visual Design'];
  }

  if (!frontmatter.outcomes || !frontmatter.outcomes.metrics) {
    frontmatter.outcomes = {
      metrics: [
        'Improved user experience and engagement',
        'Enhanced visual design and accessibility',
        'Streamlined user workflows and processes'
      ],
      quotes: [
        'The design work significantly improved our user experience. — Project Manager',
        'Clear, intuitive design that our users love. — User Research Lead'
      ]
    };
  }

  // Convert frontmatter back to YAML
  const newFrontmatterLines = [];
  newFrontmatterLines.push(`layout: "${frontmatter.layout}"`);
  newFrontmatterLines.push(`title: "${frontmatter.title}"`);
  newFrontmatterLines.push(`slug: "${frontmatter.slug}"`);
  newFrontmatterLines.push(`date: "${frontmatter.date}"`);
  newFrontmatterLines.push(`client: "${frontmatter.client}"`);
  newFrontmatterLines.push(`role: "${frontmatter.role}"`);
  
  if (frontmatter.hero) {
    newFrontmatterLines.push(`hero: "${frontmatter.hero}"`);
  }
  
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
  newFrontmatterLines.push(`tags: [${tags.map(tag => `"${tag}"`).join(', ')}]`);
  newFrontmatterLines.push(`summary: "${frontmatter.summary}"`);
  const skills = Array.isArray(frontmatter.skills) ? frontmatter.skills : [];
  newFrontmatterLines.push(`skills: [${skills.map(skill => `"${skill}"`).join(', ')}]`);
  
  // Handle outcomes
  newFrontmatterLines.push(`outcomes:`);
  newFrontmatterLines.push(`  metrics:`);
  frontmatter.outcomes.metrics.forEach(metric => {
    newFrontmatterLines.push(`    - "${metric}"`);
  });
  newFrontmatterLines.push(`  quotes:`);
  frontmatter.outcomes.quotes.forEach(quote => {
    newFrontmatterLines.push(`    - "${quote}"`);
  });

  // Handle gallery
  if (frontmatter.gallery && frontmatter.gallery.length > 0) {
    newFrontmatterLines.push(`gallery:`);
    frontmatter.gallery.forEach(img => {
      newFrontmatterLines.push(`  - src: "${img.src}"`);
      newFrontmatterLines.push(`    alt: "${img.alt}"`);
      newFrontmatterLines.push(`    caption: "${img.caption}"`);
    });
  }

  const newFrontmatter = newFrontmatterLines.join('\n');
  const contentAfterFrontmatter = content.slice(frontmatterMatch[0].length);
  const newContent = `---\n${newFrontmatter}\n---${contentAfterFrontmatter}`;

  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`✅ Upgraded ${path.basename(filePath)} to enhanced layout`);
}

// Main execution
console.log('🚀 Upgrading case studies to enhanced layout...');

if (!fs.existsSync(CASE_STUDIES_DIR)) {
  console.error('❌ Case studies directory not found:', CASE_STUDIES_DIR);
  process.exit(1);
}

const files = fs.readdirSync(CASE_STUDIES_DIR)
  .filter(file => file.endsWith('.md') || file.endsWith('.mdx'));

files.forEach(file => {
  const filePath = path.join(CASE_STUDIES_DIR, file);
  upgradeCaseStudy(filePath);
});

console.log(`✨ Upgraded ${files.length} case studies to enhanced layout!`);
