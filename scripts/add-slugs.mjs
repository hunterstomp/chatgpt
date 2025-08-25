/**
 * Add slug fields to case study frontmatter
 */
import fs from "node:fs";
import path from "node:path";
import * as YAML from "yaml";

const CASE_DIR = path.join(process.cwd(), "src/pages/case-studies");
const FM_RE = /^---([\s\S]*?)---\s*/;

function addSlugs() {
  const files = fs.readdirSync(CASE_DIR).filter(f => f.endsWith('.md'));
  
  for (const file of files) {
    const filePath = path.join(CASE_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract frontmatter
    const match = content.match(FM_RE);
    if (!match) continue;
    
    const frontmatter = YAML.parse(match[1]);
    
    // Add slug if it doesn't exist
    if (!frontmatter.slug) {
      const slug = file.replace(/\.md$/, '');
      frontmatter.slug = slug;
      
      // Update the content
      const newFrontmatter = YAML.stringify(frontmatter);
      const newContent = content.replace(FM_RE, `---\n${newFrontmatter}---\n`);
      
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Added slug "${slug}" to ${file}`);
    } else {
      console.log(`ℹ️  ${file} already has slug: ${frontmatter.slug}`);
    }
  }
}

addSlugs();
