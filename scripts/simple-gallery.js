#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class SimpleGalleryGenerator {
  constructor() {
    this.baseDir = path.join(__dirname, '..');
    this.imagesDir = path.join(this.baseDir, 'Q10UXPortfolio', 'assets', 'images');
    this.caseStudiesDir = path.join(this.baseDir, 'Q10UXPortfolio', 'case-studies');
    this.logosDir = path.join(this.baseDir, 'Q10UXPortfolio', 'assets', 'images', 'logos');
    
    if (!fs.existsSync(this.caseStudiesDir)) {
      fs.mkdirSync(this.caseStudiesDir, { recursive: true });
    }
  }

  getImageFiles() {
    if (!fs.existsSync(this.imagesDir)) {
      console.log('Images directory not found');
      return [];
    }

    const files = fs.readdirSync(this.imagesDir);
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });
  }

  categorizeImages() {
    const imageFiles = this.getImageFiles();
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
      
      if (lowerFile.includes('atmosfx') || lowerFile.includes('afx')) {
        projects.atmosfx.images.push(file);
      } else if (lowerFile.includes('tmobile') || lowerFile.includes('t-mobile')) {
        projects.tmobile.images.push(file);
      } else if (lowerFile.includes('disney') || lowerFile.includes('club-penguin')) {
        projects.disney.images.push(file);
      } else if (lowerFile.includes('bmgf') || lowerFile.includes('gates')) {
        projects.bmgf.images.push(file);
      } else if (lowerFile.includes('att')) {
        projects.att.images.push(file);
      } else if (lowerFile.includes('microsoft') || lowerFile.includes('office')) {
        projects.microsoft.images.push(file);
      } else {
        projects.other.images.push(file);
      }
    });

    return projects;
  }

  getProjectBackground(projectName) {
    const backgrounds = {
      'atmosfx': 'assets/images/backgrounds/atmosfx.webp',
      'tmobile': 'assets/images/backgrounds/tmobile-purchase.webp',
      'disney': 'assets/images/backgrounds/gates.webp', // Using gates as Disney background
      'bmgf': 'assets/images/backgrounds/gates.webp',
      'microsoft': 'assets/images/backgrounds/O365.webp',
      'att': 'assets/images/backgrounds/att.webp',
      'officelive': 'assets/images/backgrounds/officelive.webp',
      'tmobile-labs': 'assets/images/backgrounds/tmobile-labs.webp'
    };
    
    // Find matching background based on project name
    for (const [key, background] of Object.entries(backgrounds)) {
      if (projectName.toLowerCase().includes(key.toLowerCase())) {
        return background;
      }
    }
    
    // Default background for other projects
    return 'assets/images/backgrounds/atmosfx.webp';
  }

  generateCaseStudy(projectKey, project) {
    if (project.images.length === 0) return;

    let template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name} - UX Case Study | Q10UX Portfolio</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/css/lightbox.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <style>
    body {
      background: #0a0a0a;
      color: #ffffff;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .hero-section {
      background: linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(45, 45, 45, 0.8) 100%), url('../${this.getProjectBackground(project.name)}');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      padding: 4rem 0;
      margin-bottom: 3rem;
      position: relative;
      overflow: hidden;
      min-height: 100vh;
    }

    .section-title {
      color: #ffffff;
      margin-bottom: 1rem;
    }

    .section-subtitle {
      color: #b0b0b0;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin: 2rem 0;
    }

    .gallery-item {
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      transition: transform 0.3s ease;
    }

    .gallery-item:hover {
      transform: translateY(-5px);
    }

    .gallery-caption {
      padding: 1rem;
      background: #1a1a1a;
    }

    .gallery-caption h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      color: #ffffff;
    }

    .gallery-caption p {
      margin: 0;
      color: #b0b0b0;
      font-size: 0.9rem;
    }

    .project-description {
      color: #b0b0b0;
    }

    /* Comprehensive contrast improvements */
    .section-subtitle,
    .gallery-caption h4,
    .gallery-caption p,
    .project-description,
    .text-muted,
    .lead,
    .card-text,
    .card-body p,
    .card-body li,
    .list-group-item,
    .alert,
    .badge,
    .btn-text,
    .nav-link,
    .dropdown-item,
    .form-label,
    .form-text,
    .small,
    .text-secondary {
      color: #b0b0b0 !important;
    }

    h1, h2, h3, h4, h5, h6 {
      color: #ffffff !important;
    }

    .gallery-caption {
      background: #1a1a1a !important;
    }

    .gallery-caption h4 {
      color: #ffffff !important;
    }

    .gallery-caption p {
      color: #b0b0b0 !important;
    }
  </style>
</head>
<body>
  <div class="hero-section">
    <div class="container">
      <div class="hero-content text-center">
        <h1 class="display-4">${project.name}</h1>
        <p class="lead">UX Design Case Study</p>
        <div class="row text-center mt-4">
          <div class="col-md-4">
            <div class="stats-card">
              <i class="fas fa-images fa-2x text-primary mb-2"></i>
              <p class="mb-0">${project.images.length} Deliverables</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stats-card">
              <i class="fas fa-lightbulb fa-2x text-primary mb-2"></i>
              <p class="mb-0">User-Centered Design</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stats-card">
              <i class="fas fa-chart-line fa-2x text-primary mb-2"></i>
              <p class="mb-0">Impactful Solutions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container py-5">
    <section class="gallery-section section">
      <div class="container">
        <div class="section-header text-center">
          <h2 class="section-title">${project.name} - Design Deliverables</h2>
          <p class="section-subtitle">Explore the complete design process through wireframes, prototypes, and final designs</p>
        </div>
        <div class="gallery-grid">
`;

    project.images.forEach(image => {
      const imagePath = `../assets/images/${image}`;
      const title = image.replace(/\.(jpg|jpeg|png|webp)$/i, '').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      template += `
          <div class="gallery-item fade-in">
            <a href="${imagePath}" data-lightbox="${projectKey}-gallery" data-title="${title}">
              <img src="${imagePath}" alt="${title}" loading="lazy" style="width: 100%; height: 250px; object-fit: cover;">
            </a>
            <div class="gallery-caption">
              <h4>${title}</h4>
              <p>Design deliverable for ${project.name}</p>
            </div>
          </div>
      `;
    });

    template += `
        </div>
      </div>
    </section>

    <div class="text-center mt-5">
      <a href="../index.html" class="btn btn-primary">
        <i class="fas fa-arrow-left"></i> Back to Portfolio
      </a>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/js/lightbox.min.js"></script>
</body>
</html>`;

    const outputPath = path.join(this.caseStudiesDir, `${projectKey}-gallery.html`);
    fs.writeFileSync(outputPath, template);
    console.log(`✅ Generated: ${projectKey}-gallery.html (${project.images.length} images)`);
  }

  generateAll() {
    console.log('🚀 Starting simple gallery generation...');
    
    try {
      const projects = this.categorizeImages();
      
      Object.entries(projects).forEach(([key, project]) => {
        this.generateCaseStudy(key, project);
      });
      
      const totalImages = Object.values(projects).reduce((sum, project) => sum + project.images.length, 0);
      console.log(`\n✅ Gallery generation complete!`);
      console.log(`📊 Summary:`);
      console.log(`   - Total images: ${totalImages}`);
      console.log(`   - Projects: ${Object.keys(projects).filter(key => projects[key].images.length > 0).length}`);
      
    } catch (error) {
      console.error('❌ Error during gallery generation:', error);
    }
  }
}

if (require.main === module) {
  const generator = new SimpleGalleryGenerator();
  generator.generateAll();
}

module.exports = SimpleGalleryGenerator;
