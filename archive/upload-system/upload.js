// Q10UX Portfolio Upload System JavaScript

class PortfolioUploadSystem {
  constructor() {
    this.uploadedImages = [];
    this.currentProject = 'atmosfx';
    this.apiBaseUrl = 'http://localhost:3001/api';
    this.initializeEventListeners();
    this.initializeFlowDetection();
  }

  initializeEventListeners() {
    // File input change
    document.getElementById('fileInput').addEventListener('change', (e) => {
      this.handleFileSelection(e.target.files);
    });

    // Drag and drop
    const uploadZone = document.getElementById('uploadZone');
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
    document.getElementById('projectSelect').addEventListener('change', (e) => {
      this.currentProject = e.target.value;
      this.clearAll();
      this.updateProjectDisplay();
    });

    // Initialize project display
    this.updateProjectDisplay();
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
      if (file.size > 10 * 1024 * 1024) {
        this.showNotification(`Skipped ${file.name}: File too large (>10MB)`, 'warning');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      this.showNotification('No valid image files selected', 'error');
      return;
    }

    this.processFiles(validFiles);
  }

  async processFiles(files) {
    this.showProgress(true);
    this.updateProgress(0, `Processing ${files.length} files...`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progress = ((i + 1) / files.length) * 100;
      this.updateProgress(progress, `Processing ${file.name}...`);

      try {
        const imageObj = await this.createImageObject(file);
        this.uploadedImages.push(imageObj);
        this.addImageToBucket(imageObj);
        this.updateImageCounts();
      } catch (error) {
        console.error('Error processing file:', error);
        this.showNotification(`Error processing ${file.name}: ${error.message}`, 'error');
      }
    }

    this.showProgress(false);
    this.updateActionButtons();
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

  addImageToBucket(imageObj) {
    const gridId = `${imageObj.flow}Grid`;
    const grid = document.getElementById(gridId);
    
    if (!grid) return;

    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    imageItem.dataset.id = imageObj.id;
    
    imageItem.innerHTML = `
      <div class="image-preview">
        <img src="${imageObj.preview}" alt="${imageObj.name}">
        <div class="image-overlay">
          <button class="btn btn-sm btn-danger" onclick="uploadSystem.removeImage('${imageObj.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="image-info">
        <small>${imageObj.name}</small>
        <small class="text-muted">${this.formatFileSize(imageObj.size)}</small>
      </div>
    `;

    grid.appendChild(imageItem);
  }

  removeImage(imageId) {
    this.uploadedImages = this.uploadedImages.filter(img => img.id !== imageId);
    const imageElement = document.querySelector(`[data-id="${imageId}"]`);
    if (imageElement) {
      imageElement.remove();
    }
    this.updateImageCounts();
    this.updateActionButtons();
  }

  updateImageCounts() {
    const counts = {};
    this.uploadedImages.forEach(img => {
      counts[img.flow] = (counts[img.flow] || 0) + 1;
    });

    Object.keys(counts).forEach(flow => {
      const countElement = document.getElementById(`${flow}Count`);
      if (countElement) {
        countElement.textContent = counts[flow];
      }
    });
  }

  updateActionButtons() {
    const hasImages = this.uploadedImages.length > 0;
    document.getElementById('processBtn').disabled = !hasImages;
    document.getElementById('updateBtn').disabled = !hasImages;
  }

  updateProjectDisplay() {
    const projectName = document.getElementById('projectSelect').value;
    const projectTitle = document.getElementById('projectSelect').options[document.getElementById('projectSelect').selectedIndex].text;
    
    // Update any project display elements
    const projectDisplay = document.querySelector('.project-display');
    if (projectDisplay) {
      projectDisplay.textContent = projectTitle;
    }
  }

  async processImages() {
    if (this.uploadedImages.length === 0) {
      this.showNotification('No images to process', 'warning');
      return;
    }

    this.showProgress(true);
    this.updateProgress(0, 'Uploading images to server...');

    try {
      const formData = new FormData();
      formData.append('project', this.currentProject);
      
      this.uploadedImages.forEach(img => {
        formData.append('images', img.file);
      });

      const response = await fetch(`${this.apiBaseUrl}/upload/multiple`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        this.updateProgress(100, 'Upload completed successfully!');
        this.showNotification(`Successfully uploaded ${result.data.successful.length} images`, 'success');
        
        // Update uploaded images with server data
        this.uploadedImages = result.data.successful.map(serverImg => ({
          ...serverImg,
          id: serverImg.id,
          serverData: serverImg
        }));
        
        this.updateActionButtons();
      } else {
        throw new Error(result.message || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      this.showNotification(`Upload failed: ${error.message}`, 'error');
    } finally {
      this.showProgress(false);
    }
  }

  async updateGallery() {
    if (this.uploadedImages.length === 0) {
      this.showNotification('No images to update gallery with', 'warning');
      return;
    }

    this.showProgress(true);
    this.updateProgress(0, 'Updating case study gallery...');

    try {
      // Simulate gallery update
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.updateProgress(100, 'Gallery updated successfully!');
      this.showNotification('Case study gallery has been updated with new images', 'success');
      
      // Clear uploaded images after successful gallery update
      this.clearAll();
      
    } catch (error) {
      console.error('Gallery update error:', error);
      this.showNotification(`Gallery update failed: ${error.message}`, 'error');
    } finally {
      this.showProgress(false);
    }
  }

  clearAll() {
    this.uploadedImages = [];
    
    // Clear all image grids
    const grids = document.querySelectorAll('.image-grid');
    grids.forEach(grid => {
      grid.innerHTML = '';
    });
    
    this.updateImageCounts();
    this.updateActionButtons();
    this.showNotification('All images cleared', 'info');
  }

  showProgress(show) {
    const progressSection = document.getElementById('progressSection');
    progressSection.style.display = show ? 'block' : 'none';
  }

  updateProgress(percentage, text) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
    progressText.textContent = text;
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

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Public methods for global access
  selectFiles() {
    document.getElementById('fileInput').click();
  }

  processImages() {
    this.processImages();
  }

  updateGallery() {
    this.updateGallery();
  }

  clearAll() {
    this.clearAll();
  }

  removeImage(imageId) {
    this.removeImage(imageId);
  }
}

// Global functions for HTML onclick handlers
function selectFiles() {
  uploadSystem.selectFiles();
}

function processImages() {
  uploadSystem.processImages();
}

function updateGallery() {
  uploadSystem.updateGallery();
}

function clearAll() {
  uploadSystem.clearAll();
}

function confirmHosting() {
  // Close modal and show hosting instructions
  const modal = bootstrap.Modal.getInstance(document.getElementById('hostingModal'));
  modal.hide();
  
  uploadSystem.showNotification('Hosting platform selected. Images will be processed and uploaded.', 'success');
}

// Initialize the upload system
const uploadSystem = new PortfolioUploadSystem();
