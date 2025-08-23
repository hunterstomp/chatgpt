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
        
        if (this.images.length === 0) {
            this.container.innerHTML = `
                <div class="optimized-gallery-empty">
                    <i class="fas fa-image"></i>
                    <p>No images available</p>
                </div>
            `;
            return;
        }
        
        // Create gallery grid
        const grid = document.createElement('div');
        grid.className = 'optimized-gallery';
        
        this.images.forEach((image, index) => {
            const item = this.createGalleryItem(image, index);
            grid.appendChild(item);
        });
        
        this.container.appendChild(grid);
    }

    createGalleryItem(image, index) {
        const item = document.createElement('div');
        item.className = 'optimized-gallery-item';
        item.dataset.imageIndex = index;
        
        // Create image element
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.alt = image.teaserCaption || image.caption || 'UX Design Image';
        
        // Use Intersection Observer for lazy loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    img.src = image.thumbnail || image.url;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        observer.observe(img);
        
        // Create caption
        const caption = document.createElement('div');
        caption.className = 'optimized-gallery-caption';
        caption.textContent = image.teaserCaption || image.caption || '';
        
        // Add click handler
        item.addEventListener('click', () => {
            this.openModal(index);
        });
        
        // Add keyboard support
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openModal(index);
            }
        });
        
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View ${image.caption || 'image'} ${index + 1} of ${this.images.length}`);
        
        item.appendChild(img);
        item.appendChild(caption);
        
        return item;
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'optimized-gallery-modal';
        modal.innerHTML = `
            <div class="optimized-gallery-modal-content">
                <button class="optimized-gallery-modal-close" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
                
                <button class="optimized-gallery-modal-btn modal-prev" aria-label="Previous image">
                    <i class="fas fa-chevron-left"></i>
                </button>
                
                <img class="optimized-gallery-modal-image" alt="">
                
                <button class="optimized-gallery-modal-btn modal-next" aria-label="Next image">
                    <i class="fas fa-chevron-right"></i>
                </button>
                
                <div class="optimized-gallery-modal-caption"></div>
                <div class="optimized-gallery-modal-meta"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modal = modal;
        
        // Modal event listeners
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
        this.modal.querySelector('.optimized-gallery-modal-close').addEventListener('click', () => this.closeModal());
        this.modal.querySelector('.modal-prev').addEventListener('click', () => this.previousImage());
        this.modal.querySelector('.modal-next').addEventListener('click', () => this.nextImage());
        
        // Double click to zoom
        this.modal.querySelector('.optimized-gallery-modal-image').addEventListener('dblclick', () => this.toggleZoom());
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

    openModal(imageIndex) {
        this.currentIndex = imageIndex;
        this.isModalOpen = true;
        
        this.updateModal();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
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
        const modalImage = this.modal.querySelector('.optimized-gallery-modal-image');
        modalImage.src = image.url;
        modalImage.alt = image.caption || image.title || '';
        
        // Update caption
        const modalCaption = this.modal.querySelector('.optimized-gallery-modal-caption');
        modalCaption.textContent = image.caption || image.title || '';
        
        // Update meta info
        const modalMeta = this.modal.querySelector('.optimized-gallery-modal-meta');
        modalMeta.textContent = `${this.currentIndex + 1} of ${this.images.length}`;
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Preload adjacent images
        if (this.options.preloadAdjacent) {
            this.preloadAdjacentImages();
        }
    }

    updateNavigationButtons() {
        const prevButton = this.modal.querySelector('.modal-prev');
        const nextButton = this.modal.querySelector('.modal-next');
        
        prevButton.disabled = this.currentIndex === 0;
        nextButton.disabled = this.currentIndex === this.images.length - 1;
        
        prevButton.style.opacity = prevButton.disabled ? '0.3' : '1';
        nextButton.style.opacity = nextButton.disabled ? '0.3' : '1';
    }

    previousImage() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateModal();
        }
    }

    nextImage() {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.updateModal();
        }
    }

    toggleZoom() {
        const modalImage = this.modal.querySelector('.optimized-gallery-modal-image');
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
        // Preload next image
        if (this.currentIndex < this.images.length - 1) {
            const nextImage = this.images[this.currentIndex + 1];
            const img = new Image();
            img.src = nextImage.url;
        }
        
        // Preload previous image
        if (this.currentIndex > 0) {
            const prevImage = this.images[this.currentIndex - 1];
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
