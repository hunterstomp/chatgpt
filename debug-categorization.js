const fs = require('fs');
const path = require('path');

// Simple categorization test
const imagesDir = path.join(__dirname, 'assets', 'images');
const files = fs.readdirSync(imagesDir);
const imageFiles = files.filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
});

console.log('Total image files:', imageFiles.length);

const projects = {
  atmosfx: { name: 'AtmosFX', images: [] },
  tmobile: { name: 'T-Mobile', images: [] },
  disney: { name: 'Disney', images: [] },
  bmgf: { name: 'Bill & Melinda Gates Foundation', images: [] },
  att: { name: 'AT&T', images: [] },
  microsoft: { name: 'Microsoft', images: [] },
  other: { name: 'Other Projects', images: [] }
};

imageFiles.forEach(file => {
  const lowerFile = file.toLowerCase();
  
  if (lowerFile.includes('atmosfx') || lowerFile.includes('afx') || lowerFile.includes('trello')) {
    projects.atmosfx.images.push(file);
  } else if (lowerFile.includes('tmobile') || lowerFile.includes('t-mobile') || 
             lowerFile.includes('how to') || lowerFile.includes('howto') || 
             lowerFile.includes('switch') || lowerFile.includes('landing') || 
             lowerFile.includes('6_-_howto')) {
    console.log(`T-Mobile: ${file}`);
    projects.tmobile.images.push(file);
  } else if (lowerFile.includes('disney') || lowerFile.includes('club-penguin') || lowerFile.includes('bugs')) {
    projects.disney.images.push(file);
  } else if (lowerFile.includes('bmgf') || lowerFile.includes('gates') || lowerFile.includes('20_share_widget')) {
    projects.bmgf.images.push(file);
  } else if (lowerFile.includes('att') || lowerFile.includes('international') || lowerFile.includes('roaming')) {
    projects.att.images.push(file);
  } else if (lowerFile.includes('microsoft') || lowerFile.includes('office') || 
             lowerFile.includes('identity') || lowerFile.includes('federation') ||
             lowerFile.includes('ol-') || lowerFile.includes('office live')) {
    projects.microsoft.images.push(file);
  } else {
    projects.other.images.push(file);
  }
});

console.log('\nProject counts:');
Object.entries(projects).forEach(([key, project]) => {
  console.log(`${key}: ${project.images.length} images`);
  if (project.images.length > 0 && project.images.length <= 5) {
    console.log(`  ${project.images.join(', ')}`);
  }
});
