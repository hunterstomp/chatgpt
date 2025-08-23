/**
 * Q10UX Optimized Gallery Component
 * Performance-optimized thumbnails with teaser captions and modal lightbox
 * 
 * Features:
 * - Lazy loading thumbnails
 * - Teaser captions (1-line)
 * - Modal full-screen preview
 * - Series/flow navigation (forward/backward)
 * - Keyboard navigation
 * - Touch/swipe support
 * - Performance optimizations
 */

class OptimizedGallery {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.options = {
            thumbnailSize: options.thumbnailSize || 200,
            thumbnailQuality: options.thumbnailQuality || 60,
            captionMaxLength: options.captionMaxLength || 60,
            seriesGrouping: options.seriesGrouping || 'flow', // 'flow', 'project', 'tags'
            enableKeyboard: options.enableKeyboard !== false,
            enableTouch: options.enableTouch !== false,
            preloadAdjacent: options.preloadAdjacent !== false,
            ...options
        };
        
        this.images = [];
        this.currentIndex = 0;
        this.series = [];
        this.isModalOpen = false;
        
        this.init();
    }

    init() {
        this.createModal();
        this.setupEventListeners();
        this.render();
    }

    setImages(images) {
        this.images = images.map(img => ({
            ...img,
            thumbnail: this.generateThumbnailUrl(img.url),
            teaserCaption: this.generateTeaserCaption(img.caption || img.title || ''),
            series: this.detectSeries(img)
        }));
        
        this.groupImagesBySeries();
        this.render();
    }

    generateThumbnailUrl(imageUrl) {
        // Generate optimized thumbnail URL
        // In a real implementation, this would use a CDN or image processing service
        try {
            const url = new URL(imageUrl, window.location.origin);
            url.searchParams.set('w', this.options.thumbnailSize);
            url.searchParams.set('h', this.options.thumbnailSize);
            url.searchParams.set('q', this.options.thumbnailQuality);
            url.searchParams.set('fit', 'cover');
            url.searchParams.set('format', 'webp');
            return url.toString();
        } catch (error) {
            // Fallback to original URL if URL parsing fails
            return imageUrl;
        }
    }

    generateTeaserCaption(caption) {
        if (!caption) return '';
        
        // Truncate to one line
        const truncated = caption.length > this.options.captionMaxLength 
            ? caption.substring(0, this.options.captionMaxLength - 3) + '...'
            : caption;
        
        return truncated;
    }

    detectSeries(image) {
        // Detect series based on filename patterns, tags, or metadata
        const fileName = image.url.split('/').pop().toLowerCase();
        
        // Common UX flow patterns
        const flowPatterns = {
            'research': ['research', 'interview', 'survey', 'persona', 'journey'],
            'design': ['wireframe', 'mockup', 'design', 'layout', 'prototype'],
            'testing': ['test', 'usability', 'feedback', 'validation'],
            'implementation': ['final', 'production', 'launch', 'deploy']
        };
        
        for (const [flow, keywords] of Object.entries(flowPatterns)) {
            if (keywords.some(keyword => fileName.includes(keyword))) {
                return flow;
            }
        }
        
        // Fallback to project-based grouping
        return image.project || 'general';
    }

    groupImagesBySeries() {
        const groups = {};
        
        this.images.forEach((image, index) => {
            const seriesKey = image.series;
            if (!groups[seriesKey]) {
                groups[seriesKey] = [];
            }
            groups[seriesKey].push({ ...image, originalIndex: index });
        });
        
        this.series = Object.entries(groups).map(([name, images]) => ({
            name,
            images,
            count: images.length
        }));
    }

    render() {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        
        this.series.forEach(series => {
            const seriesContainer = this.createSeriesContainer(series);
            this.container.appendChild(seriesContainer);
        });
    }

    createSeriesContainer(series) {
        const container = document.createElement('div');
        container.className = 'gallery-series';
        
        // Series header
        const header = document.createElement('div');
        header.className = 'series-header';
        header.innerHTML = `
            <h3 class="series-title">${this.formatSeriesTitle(series.name)}</h3>
            <span class="series-count">${series.count} images</span>
        `;
        container.appendChild(header);
        
        // Thumbnails grid
        const grid = document.createElement('div');
        grid.className = 'thumbnails-grid';
        
        series.images.forEach((image, index) => {
            const thumbnail = this.createThumbnail(image, series, index);
            grid.appendChild(thumbnail);
        });
        
        container.appendChild(grid);
        return container;
    }

    formatSeriesTitle(seriesName) {
        const titles = {
            'research': 'User Research',
            'design': 'Design Process',
            'testing': 'Usability Testing',
            'implementation': 'Final Implementation',
            'general': 'General Screenshots'
        };
        
        return titles[seriesName] || seriesName.charAt(0).toUpperCase() + seriesName.slice(1);
    }

    createThumbnail(image, series, seriesIndex) {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail-item';
        thumbnail.dataset.imageIndex = image.originalIndex;
        thumbnail.dataset.seriesName = series.name;
        thumbnail.dataset.seriesIndex = seriesIndex;
        
        // Lazy loading wrapper
        const lazyWrapper = document.createElement('div');
        lazyWrapper.className = 'lazy-wrapper';
        
        // Thumbnail image
        const img = document.createElement('img');
        img.className = 'thumbnail-image';
        img.loading = 'lazy';
        img.alt = image.teaserCaption || 'UX Design Image';
        
        // Use Intersection Observer for lazy loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = image.thumbnail;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        observer.observe(img);
        
        // Teaser caption
        const caption = document.createElement('div');
        caption.className = 'teaser-caption';
        caption.textContent = image.teaserCaption;
        
        // Loading placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'thumbnail-placeholder';
        placeholder.innerHTML = '<div class="loading-spinner"></div>';
        
        lazyWrapper.appendChild(placeholder);
        lazyWrapper.appendChild(img);
        lazyWrapper.appendChild(caption);
        
        thumbnail.appendChild(lazyWrapper);
        
        // Click handler
        thumbnail.addEventListener('click', () => {
            this.openModal(image.originalIndex, series.name);
        });
        
        return thumbnail;
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <div class="modal-info">
                        <h3 class="modal-title"></h3>
                        <span class="modal-counter"></span>
                    </div>
                    <button class="modal-close" aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div class="modal-content">
                    <button class="modal-nav modal-prev" aria-label="Previous image">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                    </button>
                    
                    <div class="modal-image-container">
                        <img class="modal-image" alt="">
                        <div class="modal-caption"></div>
                    </div>
                    
                    <button class="modal-nav modal-next" aria-label="Next image">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                    </button>
                </div>
                
                <div class="modal-footer">
                    <div class="modal-series-info"></div>
                    <div class="modal-actions">
                        <button class="modal-action modal-zoom" aria-label="Zoom">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </button>
                        <button class="modal-action modal-download" aria-label="Download">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7,10 12,15 17,10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modal = modal;
        
        // Modal event listeners
        this.modal.querySelector('.modal-overlay').addEventListener('click', () => this.closeModal());
        this.modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        this.modal.querySelector('.modal-prev').addEventListener('click', () => this.previousImage());
        this.modal.querySelector('.modal-next').addEventListener('click', () => this.nextImage());
        this.modal.querySelector('.modal-zoom').addEventListener('click', () => this.toggleZoom());
        this.modal.querySelector('.modal-download').addEventListener('click', () => this.downloadImage());
    }

    setupEventListeners() {
        // Keyboard navigation
        if (this.options.enableKeyboard) {
            document.addEventListener('keydown', (e) => {
                if (!this.isModalOpen) return;
                
                switch (e.key) {
                    case 'Escape':
                        this.closeModal();
                        break;
                    case 'ArrowLeft':
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                    case 'z':
                    case 'Z':
                        this.toggleZoom();
                        break;
                }
            });
        }
        
        // Touch/swipe support
        if (this.options.enableTouch) {
            let startX = 0;
            let startY = 0;
            
            this.modal.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });
            
            this.modal.addEventListener('touchend', (e) => {
                if (!this.isModalOpen) return;
                
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const diffX = startX - endX;
                const diffY = startY - endY;
                
                // Minimum swipe distance
                if (Math.abs(diffX) > 50 && Math.abs(diffY) < 100) {
                    if (diffX > 0) {
                        this.nextImage();
                    } else {
                        this.previousImage();
                    }
                }
            });
        }
    }

    openModal(imageIndex, seriesName) {
        this.currentIndex = imageIndex;
        this.currentSeries = seriesName;
        this.isModalOpen = true;
        
        this.updateModal();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Preload adjacent images
        if (this.options.preloadAdjacent) {
            this.preloadAdjacentImages();
        }
    }

    closeModal() {
        this.isModalOpen = false;
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateModal() {
        const image = this.images[this.currentIndex];
        if (!image) return;
        
        // Update image
        const modalImage = this.modal.querySelector('.modal-image');
        modalImage.src = image.url;
        modalImage.alt = image.caption || image.title || '';
        
        // Update caption
        const modalCaption = this.modal.querySelector('.modal-caption');
        modalCaption.textContent = image.caption || image.title || '';
        
        // Update title and counter
        const modalTitle = this.modal.querySelector('.modal-title');
        const modalCounter = this.modal.querySelector('.modal-counter');
        const currentSeries = this.series.find(s => s.name === this.currentSeries);
        const seriesIndex = currentSeries?.images.findIndex(img => img.originalIndex === this.currentIndex) || 0;
        
        modalTitle.textContent = image.title || this.formatSeriesTitle(this.currentSeries);
        modalCounter.textContent = `${seriesIndex + 1} of ${currentSeries?.count || 1}`;
        
        // Update series info
        const modalSeriesInfo = this.modal.querySelector('.modal-series-info');
        modalSeriesInfo.textContent = `${this.formatSeriesTitle(this.currentSeries)} • ${image.tags?.join(', ') || ''}`;
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const currentSeries = this.series.find(s => s.name === this.currentSeries);
        const seriesIndex = currentSeries?.images.findIndex(img => img.originalIndex === this.currentIndex) || 0;
        
        const prevButton = this.modal.querySelector('.modal-prev');
        const nextButton = this.modal.querySelector('.modal-next');
        
        prevButton.disabled = seriesIndex === 0;
        nextButton.disabled = seriesIndex === (currentSeries?.count - 1);
        
        prevButton.style.opacity = prevButton.disabled ? '0.3' : '1';
        nextButton.style.opacity = nextButton.disabled ? '0.3' : '1';
    }

    previousImage() {
        const currentSeries = this.series.find(s => s.name === this.currentSeries);
        const seriesIndex = currentSeries?.images.findIndex(img => img.originalIndex === this.currentIndex) || 0;
        
        if (seriesIndex > 0) {
            const prevImage = currentSeries.images[seriesIndex - 1];
            this.currentIndex = prevImage.originalIndex;
            this.updateModal();
        }
    }

    nextImage() {
        const currentSeries = this.series.find(s => s.name === this.currentSeries);
        const seriesIndex = currentSeries?.images.findIndex(img => img.originalIndex === this.currentIndex) || 0;
        
        if (seriesIndex < currentSeries.count - 1) {
            const nextImage = currentSeries.images[seriesIndex + 1];
            this.currentIndex = nextImage.originalIndex;
            this.updateModal();
        }
    }

    toggleZoom() {
        const modalImage = this.modal.querySelector('.modal-image');
        modalImage.classList.toggle('zoomed');
    }

    downloadImage() {
        const image = this.images[this.currentIndex];
        if (!image) return;
        
        const link = document.createElement('a');
        link.href = image.url;
        link.download = image.title || 'ux-image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    preloadAdjacentImages() {
        const currentSeries = this.series.find(s => s.name === this.currentSeries);
        const seriesIndex = currentSeries?.images.findIndex(img => img.originalIndex === this.currentIndex) || 0;
        
        // Preload next image
        if (seriesIndex < currentSeries.count - 1) {
            const nextImage = currentSeries.images[seriesIndex + 1];
            const img = new Image();
            img.src = nextImage.url;
        }
        
        // Preload previous image
        if (seriesIndex > 0) {
            const prevImage = currentSeries.images[seriesIndex - 1];
            const img = new Image();
            img.src = prevImage.url;
        }
    }

    // Public API methods
    addImage(image) {
        this.images.push({
            ...image,
            thumbnail: this.generateThumbnailUrl(image.url),
            teaserCaption: this.generateTeaserCaption(image.caption || image.title || ''),
            series: this.detectSeries(image)
        });
        
        this.groupImagesBySeries();
        this.render();
    }

    removeImage(imageIndex) {
        this.images.splice(imageIndex, 1);
        this.groupImagesBySeries();
        this.render();
    }

    updateImage(imageIndex, updates) {
        if (this.images[imageIndex]) {
            this.images[imageIndex] = { ...this.images[imageIndex], ...updates };
            this.groupImagesBySeries();
            this.render();
        }
    }

    destroy() {
        if (this.modal && this.modal.parentNode) {
            this.modal.parentNode.removeChild(this.modal);
        }
        
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OptimizedGallery;
} else {
    window.OptimizedGallery = OptimizedGallery;
}
