// Gallery Demo JavaScript

class GalleryDemo {
  constructor() {
    this.uploadedImages = [];
    this.currentProject = 'atmosfx';
    this.apiBaseUrl = 'http://localhost:3001/api';
    this.backgrounds = this.loadBackgrounds();
    this.currentLightboxIndex = 0;
    this.allImages = [];
    
    this.initializeEventListeners();
    this.initializeFlowDetection();
  }

  // Load available background gradients
  loadBackgrounds() {
    return [
      'Dark Gradient 01.png',
      'Dark Gradient 02.png', 
      'Dark Gradient 03.png',
      'Dark Gradient 04.png',
      'Dark Gradient 05.png',
      'Dark Gradient 06.png',
      'Dark Gradient 07.png',
      'Dark Gradient 08.png',
      'Dark Gradient 09.png',
      'Dark Gradient 10.png',
      'Dark Gradient 11.png',
      'Dark Gradient 12.png',
      'Dark Gradient 13.png',
      'Dark Gradient 14.png',
      'Dark Gradient 15.png',
      'Dark Gradient 16.png',
      'Dark Gradient 17.png',
      'Dark Gradient 18.png',
      'Dark Gradient 19.png',
      'Dark Gradient 20.png',
      'Dark Gradient 21.png',
      'Dark Gradient 22.png',
      'Dark Gradient 23.png',
      'Dark Gradient 24.png'
    ];
  }

  initializeEventListeners() {
    // File input change
    document.getElementById('demoFileInput').addEventListener('change', (e) => {
      this.handleFileSelection(e.target.files);
    });

    // Drag and drop
    const uploadZone = document.getElementById('uploadZoneDemo');
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      this.handleFileSelection(e.dataTransfer.files);
    });

    // Project selector change
    document.getElementById('demoProjectSelect').addEventListener('change', (e) => {
      this.currentProject = e.target.value;
      this.clearPreview();
    });

    // Initialize lightbox
    this.initLightbox();
  }

  initializeFlowDetection() {
    this.flowKeywords = {
      research: ['research', 'interview', 'survey', 'persona', 'journey', 'analysis', 'user', 'discovery', 'study'],
      ideation: ['sketch', 'wireframe', 'brainstorm', 'concept', 'flow', 'architecture', 'ideation', 'planning'],
      design: ['mockup', 'prototype', 'component', 'interface', 'visual', 'design', 'ui', 'ux', 'screen'],
      testing: ['test', 'usability', 'feedback', 'iteration', 'validation', 'performance', 'qa', 'user-testing'],
      implementation: ['spec', 'asset', 'handoff', 'launch', 'deploy', 'implementation', 'development', 'final'],
      results: ['metric', 'feedback', 'impact', 'lesson', 'roadmap', 'documentation', 'result', 'outcome'],
      screens: ['screen', 'desktop', 'mobile', 'tablet', 'detail', 'state', 'screenshot', 'view'],
      process: ['timeline', 'team', 'tool', 'methodology', 'challenge', 'summary', 'process', 'workflow']
    };
  }

  handleFileSelection(files) {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        this.showNotification(`Skipped ${file.name}: Not an image file`, 'warning');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      this.showNotification('No valid image files selected', 'error');
      return;
    }

    this.processDemoFiles(validFiles);
  }

  async processDemoFiles(files) {
    for (const file of files) {
      try {
        const imageObj = await this.createImageObject(file);
        this.uploadedImages.push(imageObj);
        this.addImageToPreview(imageObj);
      } catch (error) {
        console.error('Error processing file:', error);
        this.showNotification(`Error processing ${file.name}: ${error.message}`, 'error');
      }
    }

    this.showNotification(`Successfully processed ${files.length} images`, 'success');
  }

  async createImageObject(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageObj = {
          id: Date.now() + Math.random(),
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          flow: this.detectFlowCategory(file),
          preview: e.target.result,
          uploadedAt: new Date().toISOString()
        };
        resolve(imageObj);
      };
      reader.readAsDataURL(file);
    });
  }

  detectFlowCategory(file) {
    const lowerFilename = file.name.toLowerCase();
    
    for (const [flow, keywords] of Object.entries(this.flowKeywords)) {
      if (keywords.some(keyword => lowerFilename.includes(keyword))) {
        return flow;
      }
    }
    
    return 'screens'; // Default fallback
  }

  addImageToPreview(imageObj) {
    const gridId = `${imageObj.flow}Preview`;
    const grid = document.getElementById(gridId);
    
    if (!grid) return;

    const imageItem = document.createElement('div');
    imageItem.className = 'image-preview-item';
    imageItem.style.backgroundImage = `url(${imageObj.preview})`;
    imageItem.style.backgroundSize = 'cover';
    imageItem.style.backgroundPosition = 'center';
    imageItem.title = imageObj.name;

    grid.appendChild(imageItem);
  }

  clearPreview() {
    this.uploadedImages = [];
    
    // Clear all preview grids
    const grids = document.querySelectorAll('.image-preview-grid');
    grids.forEach(grid => {
      grid.innerHTML = '';
    });
  }

  // Gallery functionality
  async loadDemoGallery(project) {
    this.currentProject = project;
    
    // Update active button
    document.querySelectorAll('.gallery-controls .btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    try {
      const response = await fetch(`${this.apiBaseUrl}/gallery/${project}`);
      if (!response.ok) {
        throw new Error('Failed to load gallery data');
      }
      
      const galleryData = await response.json();
      this.renderGallery(galleryData);
      
    } catch (error) {
      console.error('Gallery loading error:', error);
      this.showDemoGallery();
    }
  }

  showDemoGallery() {
    const container = document.getElementById('gallery-container');
    container.innerHTML = '';

    const flows = [
      { key: 'research', title: 'Research & Discovery', icon: 'fas fa-search' },
      { key: 'ideation', title: 'Ideation & Concepts', icon: 'fas fa-lightbulb' },
      { key: 'design', title: 'Design & Prototyping', icon: 'fas fa-palette' },
      { key: 'testing', title: 'Testing & Validation', icon: 'fas fa-vial' },
      { key: 'implementation', title: 'Implementation & Handoff', icon: 'fas fa-cogs' },
      { key: 'results', title: 'Results & Impact', icon: 'fas fa-chart-line' },
      { key: 'screens', title: 'Additional Screenshots', icon: 'fas fa-desktop' },
      { key: 'process', title: 'Process Documentation', icon: 'fas fa-tasks' }
    ];

    flows.forEach((flow, index) => {
      const section = this.createFlowSection(flow, index);
      container.appendChild(section);
    });

    // Initialize lightbox
    this.initLightbox();
  }

  createFlowSection(flow, index) {
    const backgroundIndex = index % this.backgrounds.length;
    const background = this.backgrounds[backgroundIndex];
    
    const section = document.createElement('section');
    section.className = 'flow-section';
    section.style.backgroundImage = `url('/public/mamp-images/backgrounds/${background}')`;
    section.style.backgroundSize = 'cover';
    section.style.backgroundPosition = 'center';
    section.style.backgroundAttachment = 'fixed';

    // Generate demo images for this flow
    const demoImages = this.generateDemoImages(flow.key, 6);

    section.innerHTML = `
      <div class="flow-overlay">
        <div class="container">
          <div class="flow-header">
            <h2 class="flow-title">
              <i class="${flow.icon}"></i>
              ${flow.title}
            </h2>
            <p class="flow-subtitle">
              ${this.getFlowDescription(flow.key)} - ${demoImages.length} images
            </p>
          </div>
          
          <div class="gallery-grid" data-flow="${flow.key}">
            ${this.renderDemoGalleryGrid(demoImages)}
          </div>
        </div>
      </div>
    `;

    return section;
  }

  generateDemoImages(flow, count) {
    const images = [];
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

    for (let i = 1; i <= count; i++) {
      images.push({
        id: `${flow}-${i}`,
        url: `/public/mamp-images/fpo/${this.currentProject}-${i.toString().padStart(2, '0')}-${flow}-demo.webp`,
        thumbnailUrl: `/public/mamp-images/fpo/${this.currentProject}-${i.toString().padStart(2, '0')}-${flow}-demo-thumb.webp`,
        altText: `${flowTitles[flow]} - Demo Image ${i}`,
        caption: this.getFlowDescription(flow)
      });
    }

    return images;
  }

  renderDemoGalleryGrid(images) {
    return images.map((image, index) => `
      <div class="gallery-item" 
           data-lightbox="gallery" 
           data-lightbox-index="${index}"
           data-image-url="${image.url}"
           data-image-alt="${image.altText}">
        <div class="gallery-item-inner">
          <img src="${image.thumbnailUrl}" 
               alt="${image.altText}" 
               loading="lazy"
               class="gallery-thumbnail"
               onerror="this.src='/public/mamp-images/fpo/placeholder-thumb.webp'">
          <div class="gallery-overlay">
            <div class="gallery-caption">
              <h4>${image.caption}</h4>
              <p>${image.altText}</p>
            </div>
            <div class="gallery-actions">
              <button class="btn btn-light btn-sm" onclick="galleryDemo.openLightbox(${index})">
                <i class="fas fa-expand"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  getFlowDescription(flowKey) {
    const descriptions = {
      research: 'User research, interviews, surveys, and discovery insights',
      ideation: 'Brainstorming, wireframes, concepts, and architecture',
      design: 'Mockups, prototypes, components, and visual design',
      testing: 'Usability testing, feedback, iteration, and validation',
      implementation: 'Specifications, assets, handoff, and deployment',
      results: 'Metrics, impact analysis, lessons learned, and outcomes',
      screens: 'Interface screenshots, states, and detailed views',
      process: 'Timeline, methodology, tools, and process documentation'
    };
    return descriptions[flowKey] || 'Case study documentation';
  }

  // Lightbox functionality
  initLightbox() {
    // Add event listeners for lightbox
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.prevImage();
      if (e.key === 'ArrowRight') this.nextImage();
    });
  }

  openLightbox(index) {
    this.currentLightboxIndex = index;
    this.updateLightbox();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
  }

  prevImage() {
    if (this.allImages.length === 0) return;
    
    this.currentLightboxIndex = this.currentLightboxIndex > 0 
      ? this.currentLightboxIndex - 1 
      : this.allImages.length - 1;
    this.updateLightbox();
  }

  nextImage() {
    if (this.allImages.length === 0) return;
    
    this.currentLightboxIndex = this.currentLightboxIndex < this.allImages.length - 1 
      ? this.currentLightboxIndex + 1 
      : 0;
    this.updateLightbox();
  }

  updateLightbox() {
    if (this.allImages.length === 0) return;
    
    const image = this.allImages[this.currentLightboxIndex];
    
    document.getElementById('lightbox-image').src = image.url;
    document.getElementById('lightbox-image').alt = image.altText;
    document.getElementById('lightbox-title').textContent = image.caption;
    document.getElementById('lightbox-description').textContent = image.altText;
    document.getElementById('lightbox-counter').textContent = 
      `${this.currentLightboxIndex + 1} of ${this.allImages.length}`;
  }

  // Get all images from all flows
  getAllImages() {
    if (this.allImages.length === 0) return [];
    
    const allImages = [];
    document.querySelectorAll('.gallery-item').forEach(item => {
      allImages.push({
        url: item.dataset.imageUrl,
        altText: item.dataset.imageAlt,
        caption: item.querySelector('.gallery-caption h4').textContent
      });
    });
    
    this.allImages = allImages;
    return allImages;
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }
}

// Global functions for HTML onclick handlers
function selectDemoFiles() {
  document.getElementById('demoFileInput').click();
}

function loadDemoGallery(project) {
  galleryDemo.loadDemoGallery(project);
}

function openLightbox(index) {
  galleryDemo.openLightbox(index);
}

function closeLightbox() {
  galleryDemo.closeLightbox();
}

function prevImage() {
  galleryDemo.prevImage();
}

function nextImage() {
  galleryDemo.nextImage();
}

// Initialize the gallery demo
const galleryDemo = new GalleryDemo();

// Load initial demo gallery
document.addEventListener('DOMContentLoaded', () => {
  galleryDemo.showDemoGallery();
});
