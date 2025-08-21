/**
 * Q10UX Serial Upload - Professional Image Management System
 * Features: Drag & Drop, Lightbox Carousel, AI Descriptions, Admin Controls
 */

class SerialUpload {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.isAdminMode = false;
        this.isReorderMode = false;
        this.isLightboxOpen = false;
        this.draggedItem = null;
        this.navigationMode = 'linear'; // 'linear', 'smart', 'project'
        this.projectGroups = {}; // For project-based navigation
        this.smartSuggestions = []; // For AI-powered navigation
        this.isAuthenticated = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedSeries();
        this.updateAnalytics();
        this.checkAuthentication();
    }

    setupEventListeners() {
        // File input
        const fileInput = document.getElementById('serialFileInput');
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Upload zone drag and drop
        const uploadZone = document.getElementById('uploadZone');
        uploadZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        uploadZone.addEventListener('drop', (e) => this.handleDrop(e));

        // Header controls
        document.getElementById('adminToggle').addEventListener('click', () => this.toggleAdminMode());
        document.getElementById('publishBtn').addEventListener('click', () => this.publishSeries());

        // Management controls
        document.getElementById('reorderBtn').addEventListener('click', () => this.toggleReorderMode());
        document.getElementById('previewBtn').addEventListener('click', () => this.previewSeries());
        document.getElementById('addMoreBtn').addEventListener('click', () => this.addMoreImages());

        // Admin controls
        document.getElementById('optimizeAllBtn').addEventListener('click', () => this.optimizeAllImages());
        document.getElementById('generateAllDescBtn').addEventListener('click', () => this.generateAllDescriptions());
        
        // Quality slider
        const qualitySlider = document.getElementById('qualitySlider');
        qualitySlider.addEventListener('input', (e) => {
            document.getElementById('qualityValue').textContent = e.target.value + '%';
        });

        // Lightbox controls
        document.getElementById('closeBtn').addEventListener('click', () => this.closeLightbox());
        document.getElementById('prevBtn').addEventListener('click', () => this.previousImage());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextImage());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadCurrentImage());

        // Description controls
        document.getElementById('aiSuggestBtn').addEventListener('click', () => this.generateAIDescription());
        document.getElementById('saveDescBtn').addEventListener('click', () => this.saveCurrentDescription());
        
        // Description textarea
        const descTextarea = document.getElementById('imageDescription');
        descTextarea.addEventListener('input', (e) => this.updateCharCount(e));

        // Navigation mode buttons
        document.querySelectorAll('.nav-mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.setNavigationMode(mode);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Window resize for lightbox
        window.addEventListener('resize', () => this.handleResize());
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    handleDragOver(e) {
        e.preventDefault();
        document.getElementById('uploadZone').classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        document.getElementById('uploadZone').classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        document.getElementById('uploadZone').classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type.startsWith('image/')
        );
        
        if (files.length > 0) {
            this.processFiles(files);
        }
    }

    async processFiles(files) {
        // Sort files by name for consistent ordering
        files.sort((a, b) => a.name.localeCompare(b.name));

        const loadingPromises = files.map((file, index) => this.processFile(file, index));
        
        try {
            const processedImages = await Promise.all(loadingPromises);
            this.images.push(...processedImages);
            this.renderImageGrid();
            this.showManagementSection();
            this.updateAnalytics();
            this.saveSeriesState();
        } catch (error) {
            console.error('Error processing files:', error);
            this.showNotification('Error processing some files', 'danger');
        }
    }

    async processFile(file, index) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const imageData = {
                        id: Date.now() + index,
                        file: file,
                        name: file.name,
                        size: file.size,
                        url: e.target.result,
                        width: img.width,
                        height: img.height,
                        description: '',
                        order: this.images.length + index + 1,
                        status: 'pending',
                        optimized: false,
                        aiGenerated: false
                    };
                    resolve(imageData);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    renderImageGrid() {
        const grid = document.getElementById('imageGrid');
        
        grid.innerHTML = this.images.map((image, index) => `
            <div class="image-item ${this.isReorderMode ? 'reorder-mode' : ''}" 
                 data-id="${image.id}" 
                 data-index="${index}"
                 draggable="${this.isReorderMode}"
                 onclick="${this.isReorderMode ? '' : `serialUpload.openLightbox(${index})`}">
                
                <div class="image-preview">
                    <img src="${image.url}" alt="${image.name}" loading="lazy">
                    <div class="image-overlay">
                        <div class="overlay-content">
                            <div class="play-icon">
                                <i class="fas fa-search-plus"></i>
                            </div>
                            <div>Click to view</div>
                        </div>
                    </div>
                </div>
                
                <div class="image-meta">
                    <h5>${image.name}</h5>
                    <div class="image-description" onclick="serialUpload.editDescription(${index}, event)">
                        ${image.description ? 
                            `<span class="description-text">${image.description}</span>` : 
                            '<span class="description-placeholder">Click to add description...</span>'
                        }
                        <i class="fas fa-edit edit-icon"></i>
                    </div>
                </div>
                
                <div class="image-status ${image.status}"></div>
                <div class="image-order">${image.order}</div>
            </div>
        `).join('');

        // Add reorder event listeners if in reorder mode
        if (this.isReorderMode) {
            this.setupReorderListeners();
        }
    }

    setupReorderListeners() {
        const items = document.querySelectorAll('.image-item');
        
        items.forEach(item => {
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));
            item.addEventListener('dragover', (e) => this.handleItemDragOver(e));
            item.addEventListener('drop', (e) => this.handleItemDrop(e));
        });
    }

    handleDragStart(e) {
        this.draggedItem = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedItem = null;
    }

    handleItemDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleItemDrop(e) {
        e.preventDefault();
        
        if (this.draggedItem && this.draggedItem !== e.currentTarget) {
            const draggedIndex = parseInt(this.draggedItem.dataset.index);
            const targetIndex = parseInt(e.currentTarget.dataset.index);
            
            // Reorder images array
            const draggedImage = this.images.splice(draggedIndex, 1)[0];
            this.images.splice(targetIndex, 0, draggedImage);
            
            // Update order numbers
            this.images.forEach((img, index) => {
                img.order = index + 1;
            });
            
            this.renderImageGrid();
            this.updateAnalytics();
            this.saveSeriesState();
        }
    }

    showManagementSection() {
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('managementSection').style.display = 'block';
    }

    toggleAdminMode() {
        this.isAdminMode = !this.isAdminMode;
        const adminPanel = document.getElementById('adminPanel');
        const publishBtn = document.getElementById('publishBtn');
        const toggleBtn = document.getElementById('adminToggle');
        
        if (this.isAdminMode) {
            adminPanel.style.display = 'block';
            publishBtn.style.display = 'inline-flex';
            toggleBtn.innerHTML = '<i class="fas fa-user"></i> User Mode';
            toggleBtn.classList.remove('btn-outline-primary');
            toggleBtn.classList.add('btn-warning');
        } else {
            adminPanel.style.display = 'none';
            publishBtn.style.display = 'none';
            toggleBtn.innerHTML = '<i class="fas fa-cog"></i> Admin Mode';
            toggleBtn.classList.remove('btn-warning');
            toggleBtn.classList.add('btn-outline-primary');
        }
    }

    toggleReorderMode() {
        this.isReorderMode = !this.isReorderMode;
        const reorderBtn = document.getElementById('reorderBtn');
        
        if (this.isReorderMode) {
            reorderBtn.innerHTML = '<i class="fas fa-check"></i> Done';
            reorderBtn.classList.remove('btn-outline-secondary');
            reorderBtn.classList.add('btn-success');
            this.showNotification('Drag and drop to reorder images', 'info');
        } else {
            reorderBtn.innerHTML = '<i class="fas fa-arrows-alt"></i> Reorder';
            reorderBtn.classList.remove('btn-success');
            reorderBtn.classList.add('btn-outline-secondary');
        }
        
        this.renderImageGrid();
    }

    openLightbox(index) {
        if (this.isReorderMode) return;
        
        this.currentIndex = index;
        this.isLightboxOpen = true;
        
        const overlay = document.getElementById('lightboxOverlay');
        overlay.style.display = 'flex';
        
        this.renderLightboxContent();
        this.renderThumbnailStrip();
        
        // Add click-to-close on overlay background
        overlay.addEventListener('click', this.handleOverlayClick.bind(this));
        
        // Add escape key listener
        document.addEventListener('keydown', this.handleEscapeKey.bind(this));
        
        // Don't prevent body scroll - let browser back button work
        // document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.isLightboxOpen = false;
        const overlay = document.getElementById('lightboxOverlay');
        overlay.style.display = 'none';
        
        // Remove event listeners
        overlay.removeEventListener('click', this.handleOverlayClick.bind(this));
        document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
        
        // Save any unsaved description
        this.saveCurrentDescription();
    }

    handleOverlayClick(e) {
        // Only close if clicking the overlay background, not the content
        if (e.target.id === 'lightboxOverlay') {
            this.closeLightbox();
        }
    }

    handleEscapeKey(e) {
        if (e.key === 'Escape') {
            this.closeLightbox();
        }
    }

    renderLightboxContent() {
        const image = this.images[this.currentIndex];
        if (!image) return;

        // Update counter and name
        document.getElementById('imageCounter').textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        document.getElementById('imageName').textContent = image.name;

        // Update main image
        const lightboxImage = document.getElementById('lightboxImage');
        const loadingIndicator = document.getElementById('loadingIndicator');
        
        loadingIndicator.style.display = 'block';
        lightboxImage.style.opacity = '0';
        
        lightboxImage.onload = () => {
            loadingIndicator.style.display = 'none';
            lightboxImage.style.opacity = '1';
        };
        
        lightboxImage.src = image.url;
        lightboxImage.alt = image.name;

        // Update description
        const descTextarea = document.getElementById('imageDescription');
        descTextarea.value = image.description || '';
        this.updateCharCount({ target: descTextarea });

        // Update navigation buttons
        document.getElementById('prevBtn').style.display = this.currentIndex > 0 ? 'block' : 'none';
        document.getElementById('nextBtn').style.display = this.currentIndex < this.images.length - 1 ? 'block' : 'none';
    }

    renderThumbnailStrip() {
        const strip = document.getElementById('thumbnailStrip');
        
        strip.innerHTML = this.images.map((image, index) => `
            <div class="thumbnail-item ${index === this.currentIndex ? 'active' : ''}" 
                 onclick="serialUpload.goToImage(${index})">
                <img src="${image.url}" alt="${image.name}">
                <div class="thumbnail-order">${image.order}</div>
            </div>
        `).join('');
    }

    goToImage(index) {
        // Save current description before switching
        this.saveCurrentDescription();
        
        this.currentIndex = index;
        this.renderLightboxContent();
        this.renderThumbnailStrip();
    }

    previousImage() {
        if (this.currentIndex > 0) {
            this.goToImage(this.currentIndex - 1);
        }
    }

    nextImage() {
        if (this.currentIndex < this.images.length - 1) {
            this.goToImage(this.currentIndex + 1);
        }
    }

    saveCurrentDescription() {
        const descTextarea = document.getElementById('imageDescription');
        const description = descTextarea.value.trim();
        
        if (this.images[this.currentIndex]) {
            this.images[this.currentIndex].description = description;
            this.images[this.currentIndex].status = description ? 'complete' : 'pending';
            
            // Update the grid if visible
            if (!this.isLightboxOpen) {
                this.renderImageGrid();
            }
            
            this.updateAnalytics();
            this.saveSeriesState();
            
            this.showNotification('Description saved', 'success');
        }
    }

    async generateAIDescription() {
        const image = this.images[this.currentIndex];
        if (!image) return;

        const aiSuggestBtn = document.getElementById('aiSuggestBtn');
        const originalText = aiSuggestBtn.innerHTML;
        
        aiSuggestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        aiSuggestBtn.disabled = true;

        try {
            // Simulate AI description generation
            const style = document.getElementById('aiStyle')?.value || 'professional';
            const length = document.getElementById('aiLength')?.value || 'medium';
            
            const description = await this.simulateAIDescription(image, style, length);
            
            document.getElementById('imageDescription').value = description;
            this.updateCharCount({ target: document.getElementById('imageDescription') });
            
            image.aiGenerated = true;
            
            this.showNotification('AI description generated', 'success');
            
        } catch (error) {
            console.error('Error generating AI description:', error);
            this.showNotification('Failed to generate description', 'danger');
        } finally {
            aiSuggestBtn.innerHTML = originalText;
            aiSuggestBtn.disabled = false;
        }
    }

    async simulateAIDescription(image, style, length) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const descriptions = {
            professional: {
                short: `Professional ${image.name.split('.')[0]} showcasing high-quality visual design.`,
                medium: `This professional image demonstrates excellent composition and visual appeal. The ${image.name.split('.')[0]} represents a carefully crafted design element that enhances the overall presentation.`,
                long: `This professional image showcases exceptional attention to detail and visual composition. The ${image.name.split('.')[0]} serves as a compelling design element that effectively communicates the intended message while maintaining aesthetic appeal and visual hierarchy.`
            },
            creative: {
                short: `Stunning visual masterpiece that captures attention and imagination.`,
                medium: `A captivating visual journey that speaks to both the eye and the soul. This creative piece blends artistic vision with technical excellence to create something truly memorable.`,
                long: `An extraordinary visual narrative that transcends traditional boundaries and invites viewers into a world of creative possibility. This artistic achievement combines innovative design thinking with masterful execution to deliver an experience that resonates on multiple levels.`
            },
            technical: {
                short: `High-resolution image with optimized compression and color accuracy.`,
                medium: `Technical specifications include ${image.width}x${image.height} resolution with efficient file size optimization. Color profile and compression settings ensure optimal display quality across various devices.`,
                long: `Comprehensive technical analysis reveals ${image.width}x${image.height} pixel dimensions with ${(image.size / 1024 / 1024).toFixed(2)}MB file size. The image utilizes advanced compression algorithms while maintaining color fidelity and detail preservation for cross-platform compatibility.`
            },
            casual: {
                short: `Great shot that really catches the eye!`,
                medium: `This is a really nice image that works well for the collection. It's got good visual impact and fits perfectly with the overall style we're going for.`,
                long: `What a fantastic addition to the series! This image really brings something special to the collection with its great composition and visual appeal. It's the kind of shot that people will remember and want to see more of.`
            }
        };
        
        return descriptions[style]?.[length] || descriptions.professional.medium;
    }

    updateCharCount(e) {
        const text = e.target.value;
        const charCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        
        document.querySelector('.char-count').textContent = `${charCount} / 500 characters`;
        document.querySelector('.word-count').textContent = `${wordCount} words`;
    }

    async optimizeAllImages() {
        const optimizeBtn = document.getElementById('optimizeAllBtn');
        const originalText = optimizeBtn.innerHTML;
        
        optimizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Optimizing...';
        optimizeBtn.disabled = true;

        try {
            const maxWidth = parseInt(document.getElementById('maxWidth').value);
            const quality = parseInt(document.getElementById('qualitySlider').value) / 100;
            
            for (let i = 0; i < this.images.length; i++) {
                await this.optimizeImage(this.images[i], maxWidth, quality);
                
                // Update progress
                const progress = Math.round(((i + 1) / this.images.length) * 100);
                optimizeBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${progress}%`;
            }
            
            this.renderImageGrid();
            this.updateAnalytics();
            this.saveSeriesState();
            
            this.showNotification('All images optimized successfully', 'success');
            
        } catch (error) {
            console.error('Error optimizing images:', error);
            this.showNotification('Failed to optimize some images', 'danger');
        } finally {
            optimizeBtn.innerHTML = originalText;
            optimizeBtn.disabled = false;
        }
    }

    async optimizeImage(image, maxWidth, quality) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                const optimizedUrl = canvas.toDataURL('image/jpeg', quality);
                
                // Update image data
                image.url = optimizedUrl;
                image.optimized = true;
                image.width = width;
                image.height = height;
                
                resolve();
            };
            
            img.src = image.url;
        });
    }

    async generateAllDescriptions() {
        const generateBtn = document.getElementById('generateAllDescBtn');
        const originalText = generateBtn.innerHTML;
        
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true;

        try {
            const style = document.getElementById('aiStyle').value;
            const length = document.getElementById('aiLength').value;
            
            for (let i = 0; i < this.images.length; i++) {
                if (!this.images[i].description) {
                    const description = await this.simulateAIDescription(this.images[i], style, length);
                    this.images[i].description = description;
                    this.images[i].status = 'complete';
                    this.images[i].aiGenerated = true;
                }
                
                // Update progress
                const progress = Math.round(((i + 1) / this.images.length) * 100);
                generateBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${progress}%`;
            }
            
            this.renderImageGrid();
            this.updateAnalytics();
            this.saveSeriesState();
            
            this.showNotification('All descriptions generated successfully', 'success');
            
        } catch (error) {
            console.error('Error generating descriptions:', error);
            this.showNotification('Failed to generate some descriptions', 'danger');
        } finally {
            generateBtn.innerHTML = originalText;
            generateBtn.disabled = false;
        }
    }

    updateAnalytics() {
        const totalImages = this.images.length;
        const totalSize = this.images.reduce((sum, img) => sum + img.size, 0);
        const completedImages = this.images.filter(img => img.status === 'complete').length;
        const totalWords = this.images.reduce((sum, img) => {
            return sum + (img.description ? img.description.trim().split(/\s+/).length : 0);
        }, 0);
        const avgWords = totalImages > 0 ? Math.round(totalWords / totalImages) : 0;
        const completion = totalImages > 0 ? Math.round((completedImages / totalImages) * 100) : 0;
        
        document.getElementById('totalImages').textContent = totalImages;
        document.getElementById('totalSize').textContent = (totalSize / 1024 / 1024).toFixed(1) + ' MB';
        document.getElementById('avgDescription').textContent = avgWords + ' words';
        document.getElementById('completion').textContent = completion + '%';
    }

    handleKeyboard(e) {
        if (!this.isLightboxOpen) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextImage();
                break;
            case 'F11':
                e.preventDefault();
                this.toggleFullscreen();
                break;
        }
        // Note: Escape key is handled by handleEscapeKey method
    }

    toggleFullscreen() {
        const lightbox = document.getElementById('lightboxOverlay');
        
        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (lightbox.requestFullscreen) {
                lightbox.requestFullscreen();
            } else if (lightbox.webkitRequestFullscreen) {
                lightbox.webkitRequestFullscreen();
            } else if (lightbox.msRequestFullscreen) {
                lightbox.msRequestFullscreen();
            }
            
            document.getElementById('fullscreenBtn').innerHTML = '<i class="fas fa-compress"></i>';
            document.getElementById('fullscreenBtn').title = 'Exit Fullscreen';
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            
            document.getElementById('fullscreenBtn').innerHTML = '<i class="fas fa-expand"></i>';
            document.getElementById('fullscreenBtn').title = 'Toggle Fullscreen';
        }
    }

    downloadCurrentImage() {
        if (this.currentIndex >= 0 && this.currentIndex < this.images.length) {
            const image = this.images[this.currentIndex];
            const link = document.createElement('a');
            link.href = `/uploads/processed/${image.name}`;
            link.download = image.name;
            link.target = '_blank';
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification(`Downloading ${image.name}`, 'info');
        }
    }

    handleResize() {
        if (this.isLightboxOpen) {
            // Recalculate lightbox dimensions if needed
        }
    }

    addMoreImages() {
        document.getElementById('serialFileInput').click();
    }

    previewSeries() {
        if (!this.isAuthenticated) {
            this.showNotification('Please log in to preview case studies', 'warning');
            return;
        }

        if (this.images.length === 0) {
            this.showNotification('No images to preview', 'warning');
            return;
        }

        // Get current project ID from URL or create a temporary one
        const urlParams = new URLSearchParams(window.location.search);
        let projectId = urlParams.get('project');
        
        if (!projectId) {
            // Create a temporary project for preview
            projectId = 'preview-' + Date.now();
        }

        // Open preview in new window
        const previewUrl = `/src/preview/?project=${projectId}`;
        window.open(previewUrl, '_blank', 'width=1200,height=800');
        
        this.showNotification('Preview opened in new window', 'info');
    }

    async publishSeries() {
        const completedImages = this.images.filter(img => img.status === 'complete').length;
        const totalImages = this.images.length;
        
        if (totalImages === 0) {
            this.showNotification('No images to publish', 'warning');
            return;
        }
        
        if (completedImages < totalImages) {
            const proceed = confirm(`Only ${completedImages} of ${totalImages} images have descriptions. Publish anyway?`);
            if (!proceed) return;
        }
        
        // Load case studies and show modal
        await this.loadCaseStudies();
        this.showPublishModal();
    }

    async loadCaseStudies() {
        try {
            const response = await fetch('http://localhost:3001/api/admin/projects', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to load case studies');
            }
            
            const projects = await response.json();
            this.populateCaseStudySelect(projects);
            
        } catch (error) {
            console.error('Error loading case studies:', error);
            this.showNotification('Failed to load case studies. Please check your connection.', 'error');
        }
    }

    populateCaseStudySelect(projects) {
        const select = document.getElementById('caseStudySelect');
        select.innerHTML = '<option value="">Choose a case study...</option>';
        
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.title;
            select.appendChild(option);
        });
    }

    showPublishModal() {
        const modal = new bootstrap.Modal(document.getElementById('caseStudyModal'));
        modal.show();
        
        // Set up confirm button
        document.getElementById('confirmPublishBtn').onclick = () => this.confirmPublish();
    }

    async confirmPublish() {
        const projectId = document.getElementById('caseStudySelect').value;
        const seriesTitle = document.getElementById('seriesTitle').value;
        const seriesDescription = document.getElementById('seriesDescription').value;
        
        if (!projectId || !seriesTitle) {
            this.showNotification('Please select a case study and enter a series title', 'warning');
            return;
        }
        
        // Show loading state
        const confirmBtn = document.getElementById('confirmPublishBtn');
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
        confirmBtn.disabled = true;
        
        try {
            const publishData = {
                projectId: projectId,
                seriesTitle: seriesTitle,
                seriesDescription: seriesDescription,
                images: this.images.map(img => ({
                    id: img.id,
                    name: img.name,
                    description: img.description || '',
                    width: img.width,
                    height: img.height,
                    optimized: img.optimized || false,
                    aiGenerated: img.aiGenerated || false
                }))
            };
            
            const response = await fetch('http://localhost:3001/api/admin/publish-series', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(publishData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to publish series');
            }
            
            const result = await response.json();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('caseStudyModal'));
            modal.hide();
            
            // Show success message
            this.showNotification(`Series "${seriesTitle}" published successfully to case study!`, 'success');
            
            console.log('Published series:', result);
            
        } catch (error) {
            console.error('Error publishing series:', error);
            this.showNotification('Failed to publish series. Please try again.', 'error');
        } finally {
            // Restore button state
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    }

    getAuthToken() {
        // Get token from localStorage (set by admin login)
        return localStorage.getItem('adminToken');
    }

    checkAuthentication() {
        const token = this.getAuthToken();
        this.isAuthenticated = !!token;
        
                    // Update UI based on authentication status
            const publishBtn = document.getElementById('publishBtn');
            const previewBtn = document.getElementById('previewBtn');
            
            if (publishBtn) {
                if (this.isAuthenticated) {
                    publishBtn.style.display = 'inline-block';
                    publishBtn.title = 'Publish series to case study';
                } else {
                    publishBtn.style.display = 'none';
                }
            }
            
            if (previewBtn) {
                if (this.isAuthenticated && this.images.length > 0) {
                    previewBtn.style.display = 'inline-block';
                    previewBtn.title = 'Preview case study';
                } else {
                    previewBtn.style.display = 'none';
                }
            }
        
        // Show authentication status
        if (!this.isAuthenticated) {
            this.showNotification('Please log in to the admin panel to publish series', 'info');
        }
    }

    saveSeriesState() {
        const state = {
            images: this.images.map(img => ({
                ...img,
                file: null // Don't save file objects
            })),
            timestamp: Date.now()
        };
        
        localStorage.setItem('serialUploadState', JSON.stringify(state));
    }

    loadSavedSeries() {
        const saved = localStorage.getItem('serialUploadState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                // Note: Files won't be restored, only descriptions and metadata
                console.log('Found saved series state:', state);
            } catch (error) {
                console.error('Error loading saved series:', error);
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element with better accessibility
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: none;
        `;
        
        // Ensure proper contrast for accessibility
        if (type === 'success') {
            notification.style.backgroundColor = '#d4edda';
            notification.style.color = '#155724';
            notification.style.borderColor = '#c3e6cb';
        } else if (type === 'error' || type === 'danger') {
            notification.style.backgroundColor = '#f8d7da';
            notification.style.color = '#721c24';
            notification.style.borderColor = '#f5c6cb';
        } else if (type === 'warning') {
            notification.style.backgroundColor = '#fff3cd';
            notification.style.color = '#856404';
            notification.style.borderColor = '#ffeaa7';
        } else {
            notification.style.backgroundColor = '#d1ecf1';
            notification.style.color = '#0c5460';
            notification.style.borderColor = '#bee5eb';
        }
        
        notification.innerHTML = `
            <div class="d-flex align-items-start">
                <div class="flex-grow-1">
                    <strong>${this.getNotificationTitle(type)}:</strong> ${message}
                </div>
                <button type="button" class="btn-close ms-2" data-bs-dismiss="alert" aria-label="Close notification"></button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationTitle(type) {
        switch (type) {
            case 'success': return 'Success';
            case 'error':
            case 'danger': return 'Error';
            case 'warning': return 'Warning';
            default: return 'Info';
        }
    }

    // Navigation Mode Management
    setNavigationMode(mode) {
        this.navigationMode = mode;
        
        // Update button states
        document.querySelectorAll('.nav-mode-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });
        
        // Hide all panels
        document.getElementById('smartNavPanel').style.display = 'none';
        document.getElementById('projectNavPanel').style.display = 'none';
        
        // Show appropriate panel
        switch (mode) {
            case 'smart':
                this.showSmartNavigation();
                break;
            case 'project':
                this.showProjectNavigation();
                break;
            case 'linear':
            default:
                // Linear mode uses standard thumbnail strip
                break;
        }
        
        this.showNotification(`Switched to ${mode} navigation mode`, 'info');
    }

    showSmartNavigation() {
        const panel = document.getElementById('smartNavPanel');
        const suggestions = document.getElementById('smartSuggestions');
        
        // Generate smart suggestions
        this.generateSmartSuggestions();
        
        // Render suggestions
        suggestions.innerHTML = this.smartSuggestions.map(suggestion => `
            <div class="suggestion-item" onclick="serialUpload.goToImage(${suggestion.index})">
                <div class="suggestion-icon">
                    <img src="${suggestion.image.url}" alt="${suggestion.image.name}">
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-title">${suggestion.title}</div>
                    <div class="suggestion-reason">${suggestion.reason}</div>
                </div>
            </div>
        `).join('');
        
        panel.style.display = 'block';
    }

    generateSmartSuggestions() {
        this.smartSuggestions = [];
        
        if (this.images.length === 0) return;
        
        const currentImage = this.images[this.currentIndex];
        
        // Analyze current image and suggest related ones
        this.images.forEach((image, index) => {
            if (index === this.currentIndex) return;
            
            let reason = '';
            let title = image.name;
            
            // Smart suggestions based on various criteria
            if (!image.description && currentImage.description) {
                reason = 'Needs description like current image';
                title = 'Add Description';
            } else if (image.description && !currentImage.description) {
                reason = 'Has description - good reference';
                title = 'Reference Image';
            } else if (Math.abs(image.width - currentImage.width) < 100) {
                reason = 'Similar dimensions';
                title = 'Similar Size';
            } else if (image.optimized && !currentImage.optimized) {
                reason = 'Already optimized';
                title = 'Optimized';
            } else if (!image.optimized && currentImage.optimized) {
                reason = 'Needs optimization';
                title = 'Needs Optimization';
            } else if (image.aiGenerated && !currentImage.aiGenerated) {
                reason = 'AI-generated description';
                title = 'AI Enhanced';
            } else {
                // Random suggestion for variety
                const reasons = [
                    'Similar visual style',
                    'Related content',
                    'Good composition example',
                    'Color palette match'
                ];
                reason = reasons[Math.floor(Math.random() * reasons.length)];
                title = 'Suggested Next';
            }
            
            this.smartSuggestions.push({
                index,
                image,
                title,
                reason
            });
        });
        
        // Limit to 5 suggestions
        this.smartSuggestions = this.smartSuggestions.slice(0, 5);
    }

    showProjectNavigation() {
        const panel = document.getElementById('projectNavPanel');
        const groups = document.getElementById('projectGroups');
        
        // Generate project groups
        this.generateProjectGroups();
        
        // Render project groups
        groups.innerHTML = Object.entries(this.projectGroups).map(([groupName, groupData]) => `
            <div class="project-group">
                <div class="project-group-header">
                    <div class="project-group-title">${groupName}</div>
                    <div class="project-group-count">${groupData.images.length}</div>
                </div>
                <div class="project-group-items">
                    ${groupData.images.map(img => `
                        <div class="project-group-item ${img.index === this.currentIndex ? 'active' : ''}" 
                             onclick="serialUpload.goToImage(${img.index})">
                            <img src="${img.image.url}" alt="${img.image.name}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        panel.style.display = 'block';
    }

    generateProjectGroups() {
        this.projectGroups = {};
        
        if (this.images.length === 0) return;
        
        // Group by various criteria
        const groups = {
            'Needs Attention': [],
            'Completed': [],
            'Large Files': [],
            'Small Files': [],
            'With Descriptions': [],
            'Without Descriptions': []
        };
        
        this.images.forEach((image, index) => {
            // Needs Attention
            if (!image.description || !image.optimized) {
                groups['Needs Attention'].push({ image, index });
            }
            
            // Completed
            if (image.description && image.optimized) {
                groups['Completed'].push({ image, index });
            }
            
            // Large Files (> 2MB)
            if (image.size > 2 * 1024 * 1024) {
                groups['Large Files'].push({ image, index });
            }
            
            // Small Files (< 500KB)
            if (image.size < 500 * 1024) {
                groups['Small Files'].push({ image, index });
            }
            
            // With Descriptions
            if (image.description) {
                groups['With Descriptions'].push({ image, index });
            }
            
            // Without Descriptions
            if (!image.description) {
                groups['Without Descriptions'].push({ image, index });
            }
        });
        
        // Only include non-empty groups
        Object.entries(groups).forEach(([name, images]) => {
            if (images.length > 0) {
                this.projectGroups[name] = { images };
            }
        });
    }

    closeSmartNav() {
        document.getElementById('smartNavPanel').style.display = 'none';
        this.setNavigationMode('linear');
    }

    closeProjectNav() {
        document.getElementById('projectNavPanel').style.display = 'none';
        this.setNavigationMode('linear');
    }

    // Enhanced goToImage method
    goToImage(index) {
        // Save current description before switching
        this.saveCurrentDescription();
        
        this.currentIndex = index;
        this.renderLightboxContent();
        this.renderThumbnailStrip();
        
        // Update navigation panels if they're open
        if (this.navigationMode === 'smart') {
            this.showSmartNavigation();
        } else if (this.navigationMode === 'project') {
            this.showProjectNavigation();
        }
    }
}

// Initialize when page loads
let serialUpload;
document.addEventListener('DOMContentLoaded', () => {
    serialUpload = new SerialUpload();
});

// Export for global access
window.serialUpload = serialUpload;
