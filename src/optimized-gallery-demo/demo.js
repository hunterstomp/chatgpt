/**
 * Q10UX Optimized Gallery Demo
 * Showcases the performance-optimized gallery with interactive tour
 */

class GalleryDemo {
    constructor() {
        this.gallery = null;
        this.tour = null;
        this.performanceMetrics = {
            loadTime: 0,
            imagesLoaded: 0,
            bandwidthSaved: 0,
            fps: 60
        };
        
        this.init();
    }

    init() {
        this.setupGallery();
        this.setupTour();
        this.setupControls();
        this.setupPerformanceTracking();
        this.loadDemoImages();
        this.setupEventListeners();
    }

    setupGallery() {
        const container = document.getElementById('optimizedGallery');
        if (!container) return;

        this.gallery = new OptimizedGallery(container, {
            thumbnailSize: 200,
            thumbnailQuality: 60,
            captionMaxLength: 60,
            seriesGrouping: 'flow',
            enableKeyboard: true,
            enableTouch: true,
            preloadAdjacent: true
        });
    }

    setupTour() {
        this.tour = new InteractiveTour({
            autoPlay: false,
            autoPlayDelay: 4000,
            showProgress: true,
            enableKeyboard: true,
            enableTouch: true
        });

        // Add tour trigger button
        this.addTourButton();
    }

    addTourButton() {
        const header = document.querySelector('.demo-header');
        if (!header) return;

        const tourButton = document.createElement('button');
        tourButton.className = 'btn btn-primary tour-trigger';
        tourButton.innerHTML = '<i class="fas fa-play"></i> Start Tour';
        tourButton.style.position = 'absolute';
        tourButton.style.top = '1rem';
        tourButton.style.right = '1rem';
        tourButton.style.zIndex = '1000';

        tourButton.addEventListener('click', () => {
            this.tour.start();
        });

        header.style.position = 'relative';
        header.appendChild(tourButton);
    }

    setupControls() {
        // Gallery options
        const optionButtons = document.querySelectorAll('[data-option]');
        optionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                optionButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                this.updateGalleryOptions(e.target.dataset.option);
            });
        });

        // Series grouping
        const seriesSelect = document.getElementById('seriesGrouping');
        if (seriesSelect) {
            seriesSelect.addEventListener('change', (e) => {
                this.updateSeriesGrouping(e.target.value);
            });
        }
    }

    updateGalleryOptions(option) {
        if (!this.gallery) return;

        const options = {
            performance: {
                thumbnailSize: 150,
                thumbnailQuality: 50,
                preloadAdjacent: false
            },
            quality: {
                thumbnailSize: 300,
                thumbnailQuality: 80,
                preloadAdjacent: true
            },
            balanced: {
                thumbnailSize: 200,
                thumbnailQuality: 60,
                preloadAdjacent: true
            }
        };

        const newOptions = options[option];
        if (newOptions) {
            Object.assign(this.gallery.options, newOptions);
            this.gallery.render();
            this.updatePerformanceDisplay();
        }
    }

    updateSeriesGrouping(grouping) {
        if (!this.gallery) return;

        this.gallery.options.seriesGrouping = grouping;
        this.gallery.groupImagesBySeries();
        this.gallery.render();
    }

    setupPerformanceTracking() {
        // Track load times
        this.startTime = performance.now();
        
        // Track FPS
        this.setupFPSTracking();
        
        // Track bandwidth savings
        this.calculateBandwidthSavings();
    }

    setupFPSTracking() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const countFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                this.performanceMetrics.fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
                this.updatePerformanceDisplay();
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(countFPS);
        };
        
        requestAnimationFrame(countFPS);
    }

    calculateBandwidthSavings() {
        // Simulate bandwidth savings calculation
        const originalSize = 1024 * 1024; // 1MB per image
        const optimizedSize = 200 * 200 * 4 * 0.6; // Optimized thumbnail size
        const savings = originalSize - optimizedSize;
        
        this.performanceMetrics.bandwidthSaved = Math.round(savings / 1024); // KB
    }

    updatePerformanceDisplay() {
        const loadTimeEl = document.getElementById('loadTime');
        const imagesLoadedEl = document.getElementById('imagesLoaded');
        const bandwidthSavedEl = document.getElementById('bandwidthSaved');
        const fpsEl = document.getElementById('fps');

        if (loadTimeEl) {
            loadTimeEl.textContent = `${this.performanceMetrics.loadTime}ms`;
        }
        if (imagesLoadedEl) {
            imagesLoadedEl.textContent = this.performanceMetrics.imagesLoaded;
        }
        if (bandwidthSavedEl) {
            bandwidthSavedEl.textContent = `${this.performanceMetrics.bandwidthSaved}KB`;
        }
        if (fpsEl) {
            fpsEl.textContent = this.performanceMetrics.fps;
        }
    }

    loadDemoImages() {
        // Demo images with UX flow patterns
        const demoImages = [
            {
                url: 'https://via.placeholder.com/1200x800/00d4ff/ffffff?text=User+Research',
                title: 'User Research Phase',
                caption: 'Initial user interviews and persona development for mobile banking app',
                project: 'Mobile Banking UX',
                tags: ['research', 'interviews', 'personas'],
                series: 'research'
            },
            {
                url: 'https://via.placeholder.com/1200x800/00ff88/ffffff?text=Journey+Mapping',
                title: 'Customer Journey Map',
                caption: 'End-to-end user journey mapping for account opening process',
                project: 'Mobile Banking UX',
                tags: ['journey', 'mapping', 'process'],
                series: 'research'
            },
            {
                url: 'https://via.placeholder.com/1200x800/ffaa00/ffffff?text=Wireframes',
                title: 'Low-Fidelity Wireframes',
                caption: 'Initial wireframe concepts for the main dashboard interface',
                project: 'Mobile Banking UX',
                tags: ['wireframes', 'dashboard', 'layout'],
                series: 'design'
            },
            {
                url: 'https://via.placeholder.com/1200x800/ff6b6b/ffffff?text=Mockups',
                title: 'High-Fidelity Mockups',
                caption: 'Detailed mockups with visual design and component specifications',
                project: 'Mobile Banking UX',
                tags: ['mockups', 'visual', 'components'],
                series: 'design'
            },
            {
                url: 'https://via.placeholder.com/1200x800/4ecdc4/ffffff?text=Prototype',
                title: 'Interactive Prototype',
                caption: 'Clickable prototype demonstrating user flows and interactions',
                project: 'Mobile Banking UX',
                tags: ['prototype', 'interactive', 'flows'],
                series: 'design'
            },
            {
                url: 'https://via.placeholder.com/1200x800/45b7d1/ffffff?text=Usability+Testing',
                title: 'Usability Testing Session',
                caption: 'User testing results and feedback analysis for prototype validation',
                project: 'Mobile Banking UX',
                tags: ['testing', 'usability', 'feedback'],
                series: 'testing'
            },
            {
                url: 'https://via.placeholder.com/1200x800/96ceb4/ffffff?text=Final+Design',
                title: 'Final Production Design',
                caption: 'Completed design system and production-ready assets',
                project: 'Mobile Banking UX',
                tags: ['final', 'production', 'assets'],
                series: 'implementation'
            },
            {
                url: 'https://via.placeholder.com/1200x800/feca57/ffffff?text=Launch+Results',
                title: 'Post-Launch Analytics',
                caption: 'Performance metrics and user engagement data after launch',
                project: 'Mobile Banking UX',
                tags: ['analytics', 'metrics', 'launch'],
                series: 'implementation'
            }
        ];

        if (this.gallery) {
            this.gallery.setImages(demoImages);
            this.performanceMetrics.imagesLoaded = demoImages.length;
            this.performanceMetrics.loadTime = Math.round(performance.now() - this.startTime);
            this.updatePerformanceDisplay();
        }
    }

    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + T to start tour
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                this.tour.start();
            }
            
            // Ctrl/Cmd + G to focus gallery
            if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
                e.preventDefault();
                document.getElementById('optimizedGallery')?.focus();
            }
        });

        // Performance monitoring
        window.addEventListener('load', () => {
            this.performanceMetrics.loadTime = Math.round(performance.now() - this.startTime);
            this.updatePerformanceDisplay();
        });

        // Resize handling
        window.addEventListener('resize', () => {
            if (this.gallery) {
                this.gallery.render();
            }
        });
    }

    // Public API methods
    startTour() {
        this.tour.start();
    }

    stopTour() {
        this.tour.end();
    }

    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }

    updateGalleryImages(images) {
        if (this.gallery) {
            this.gallery.setImages(images);
            this.performanceMetrics.imagesLoaded = images.length;
            this.updatePerformanceDisplay();
        }
    }
}

// Initialize demo when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.galleryDemo = new GalleryDemo();
});

// Add some fun interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add floating action button for quick tour access
    const fab = document.createElement('button');
    fab.className = 'floating-tour-btn';
    fab.innerHTML = '<i class="fas fa-magic"></i>';
    fab.title = 'Start Interactive Tour (Ctrl+T)';
    fab.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00d4ff, #00ff88);
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    fab.addEventListener('mouseenter', () => {
        fab.style.transform = 'scale(1.1)';
        fab.style.boxShadow = '0 6px 30px rgba(0, 212, 255, 0.4)';
    });
    
    fab.addEventListener('mouseleave', () => {
        fab.style.transform = 'scale(1)';
        fab.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.3)';
    });
    
    fab.addEventListener('click', () => {
        if (window.galleryDemo) {
            window.galleryDemo.startTour();
        }
    });
    
    document.body.appendChild(fab);

    // Add performance indicator
    const perfIndicator = document.createElement('div');
    perfIndicator.className = 'performance-indicator';
    perfIndicator.innerHTML = `
        <div class="perf-dot"></div>
        <span class="perf-text">Performance: Excellent</span>
    `;
    perfIndicator.style.cssText = `
        position: fixed;
        top: 1rem;
        left: 1rem;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1000;
    `;
    
    const perfDot = perfIndicator.querySelector('.perf-dot');
    perfDot.style.cssText = `
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #00ff88;
        animation: pulse 2s infinite;
    `;
    
    document.body.appendChild(perfIndicator);

    // Add CSS for pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .floating-tour-btn:hover {
            transform: scale(1.1) !important;
        }
    `;
    document.head.appendChild(style);
});
