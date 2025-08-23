/**
 * Q10UX Interactive Tour System
 * Visual guide through the portfolio system - no reading required!
 * 
 * Features:
 * - Step-by-step visual guidance
 * - Interactive highlights and animations
 * - Progress tracking
 * - Skip/resume functionality
 * - Touch-friendly navigation
 * - Auto-play option
 */

class InteractiveTour {
    constructor(options = {}) {
        this.options = {
            autoPlay: options.autoPlay || false,
            autoPlayDelay: options.autoPlayDelay || 5000,
            showProgress: options.showProgress !== false,
            enableKeyboard: options.enableKeyboard !== false,
            enableTouch: options.enableTouch !== false,
            ...options
        };
        
        this.currentStep = 0;
        this.isActive = false;
        this.isAutoPlaying = false;
        this.steps = [];
        this.overlay = null;
        this.tooltip = null;
        this.progress = null;
        
        this.init();
    }

    init() {
        this.defineTourSteps();
        this.createOverlay();
        this.createTooltip();
        this.createProgress();
        this.setupEventListeners();
        
        // Debug: Log tour initialization
        console.log('Tour initialized with', this.steps.length, 'steps');
    }

    defineTourSteps() {
        // Detect current page to show relevant steps
        const currentPath = window.location.pathname;
        const isUploadPage = currentPath.includes('instant-upload');
        const isDemoPage = currentPath.includes('optimized-gallery-demo');
        const isMainPage = currentPath.includes('/src/') && !isUploadPage && !isDemoPage;

        this.steps = [
            {
                id: 'welcome',
                title: 'Welcome to Q10UX! 🎨',
                description: 'Your professional UX portfolio with AI-powered features',
                target: 'body',
                position: 'center',
                action: 'highlight',
                animation: 'fadeIn'
            }
        ];

        // Add page-specific steps
        if (isUploadPage) {
            this.steps.push(
                {
                    id: 'instant-upload',
                    title: 'Instant Upload ⚡',
                    description: 'Just drop files here and everything happens automatically!',
                    target: '#uploadZone',
                    position: 'bottom',
                    action: 'pulse',
                    animation: 'bounce'
                },
                {
                    id: 'smart-detection',
                    title: 'Smart Detection 🧠',
                    description: 'AI automatically detects your project and tags from filenames',
                    target: '#uploadZone',
                    position: 'top',
                    action: 'highlight',
                    animation: 'slideIn'
                },
                {
                    id: 'folder-support',
                    title: 'Folder Support 📁',
                    description: 'Supports nested folders with automatic project and phase detection',
                    target: '#uploadZone',
                    position: 'center',
                    action: 'glow',
                    animation: 'fadeIn'
                }
            );
        }

        if (isDemoPage) {
            this.steps.push(
                {
                    id: 'gallery-navigation',
                    title: 'Intuitive Navigation 👆',
                    description: 'Click thumbnails to view full-screen with series navigation',
                    target: '#optimizedGallery',
                    position: 'top',
                    action: 'highlight',
                    animation: 'pulse'
                },
                {
                    id: 'modal-features',
                    title: 'Rich Modal Experience 🖼️',
                    description: 'Keyboard shortcuts, touch gestures, and zoom controls',
                    target: '#optimizedGallery',
                    position: 'center',
                    action: 'demo',
                    animation: 'scaleIn',
                    demoAction: () => this.demoModalFeatures()
                },
                {
                    id: 'ai-captions',
                    title: 'AI-Generated Captions 🤖',
                    description: 'Automatic contextual captions for thumbnails and lightbox',
                    target: '#optimizedGallery',
                    position: 'bottom',
                    action: 'typewriter',
                    animation: 'slideIn'
                },
                {
                    id: 'performance-metrics',
                    title: 'Real-time Performance 📊',
                    description: 'Live metrics showing load times, bandwidth savings, and FPS',
                    target: '.demo-metrics',
                    position: 'top',
                    action: 'count-up',
                    animation: 'slideIn'
                }
            );
        }

        if (isMainPage) {
            this.steps.push(
                {
                    id: 'portfolio-showcase',
                    title: 'Portfolio Showcase 🎯',
                    description: 'Professional UX case studies with optimized presentation',
                    target: '.hero-section',
                    position: 'center',
                    action: 'highlight',
                    animation: 'fadeIn'
                },
                {
                    id: 'case-studies',
                    title: 'Case Studies 📋',
                    description: 'Detailed UX process documentation with interactive galleries',
                    target: '.portfolio-section',
                    position: 'top',
                    action: 'pulse',
                    animation: 'slideIn'
                },
                {
                    id: 'responsive-design',
                    title: 'Responsive & Accessible ♿',
                    description: 'Works perfectly on all devices with accessibility features',
                    target: 'body',
                    position: 'center',
                    action: 'responsive-demo',
                    animation: 'fadeIn',
                    demoAction: () => this.demoResponsive()
                }
            );
        }

        // Add completion step
        this.steps.push({
            id: 'completion',
            title: 'You\'re All Set! 🎉',
            description: 'Start uploading your UX work and watch the magic happen!',
            target: 'body',
            position: 'center',
            action: 'celebration',
            animation: 'confetti'
        });
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'tour-overlay';
        this.overlay.innerHTML = `
            <div class="tour-backdrop">
                <div class="tour-hint">Click anywhere to dismiss tour</div>
            </div>
            <div class="tour-highlight"></div>
        `;
        document.body.appendChild(this.overlay);
    }

    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tour-tooltip';
        this.tooltip.innerHTML = `
            <div class="tooltip-header">
                <h3 class="tooltip-title"></h3>
                <button class="tooltip-close" aria-label="Close tour">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="tooltip-content">
                <p class="tooltip-description"></p>
            </div>
            <div class="tooltip-footer">
                <div class="tooltip-actions">
                    <button class="tooltip-action tooltip-prev" aria-label="Previous step">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                    </button>
                    <button class="tooltip-action tooltip-next" aria-label="Next step">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                    </button>
                </div>
                <div class="tooltip-controls">
                    <button class="tooltip-skip">Skip Tour</button>
                    <button class="tooltip-autoplay">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(this.tooltip);
    }

    createProgress() {
        this.progress = document.createElement('div');
        this.progress.className = 'tour-progress';
        this.progress.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">
                <span class="progress-current">1</span>
                <span class="progress-separator">/</span>
                <span class="progress-total">0</span>
            </div>
        `;
        document.body.appendChild(this.progress);
    }

    setupEventListeners() {
        // Tooltip controls
        this.tooltip.querySelector('.tooltip-close').addEventListener('click', () => this.end());
        this.tooltip.querySelector('.tooltip-prev').addEventListener('click', () => this.previous());
        this.tooltip.querySelector('.tooltip-next').addEventListener('click', () => this.next());
        this.tooltip.querySelector('.tooltip-skip').addEventListener('click', () => this.end());
        this.tooltip.querySelector('.tooltip-autoplay').addEventListener('click', () => this.toggleAutoPlay());

        // Overlay click to dismiss
        this.overlay.addEventListener('click', (e) => {
            // Only dismiss if clicking the backdrop, not the highlight area
            if (e.target.classList.contains('tour-backdrop')) {
                this.end();
            }
        });

        // Keyboard navigation
        if (this.options.enableKeyboard) {
            document.addEventListener('keydown', (e) => {
                if (!this.isActive) return;
                
                switch (e.key) {
                    case 'Escape':
                        this.end();
                        break;
                    case 'ArrowLeft':
                        this.previous();
                        break;
                    case 'ArrowRight':
                        this.next();
                        break;
                    case ' ':
                        e.preventDefault();
                        this.toggleAutoPlay();
                        break;
                }
            });
        }

        // Touch gestures
        if (this.options.enableTouch) {
            let startX = 0;
            let startY = 0;
            
            this.tooltip.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });
            
            this.tooltip.addEventListener('touchend', (e) => {
                if (!this.isActive) return;
                
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const diffX = startX - endX;
                const diffY = startY - endY;
                
                if (Math.abs(diffX) > 50 && Math.abs(diffY) < 100) {
                    if (diffX > 0) {
                        this.next();
                    } else {
                        this.previous();
                    }
                }
            });
        }
    }

    start() {
        console.log('Starting tour with', this.steps.length, 'steps');
        
        this.isActive = true;
        this.currentStep = 0;
        
        // Update progress total after steps are defined
        this.progress.querySelector('.progress-total').textContent = this.steps.length;
        
        this.show();
        this.showStep(0);
        
        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }

    show() {
        console.log('Showing tour elements');
        console.log('Overlay:', this.overlay);
        console.log('Tooltip:', this.tooltip);
        console.log('Progress:', this.progress);
        
        // Ensure elements are visible
        this.overlay.style.display = 'block';
        this.tooltip.style.display = 'block';
        this.progress.style.display = 'block';
        
        this.overlay.classList.add('active');
        this.tooltip.classList.add('active');
        this.progress.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Force a reflow to ensure visibility
        this.overlay.offsetHeight;
        this.tooltip.offsetHeight;
        this.progress.offsetHeight;
    }

    hide() {
        this.overlay.classList.remove('active');
        this.tooltip.classList.remove('active');
        this.progress.classList.remove('active');
        document.body.style.overflow = '';
    }

    showStep(stepIndex) {
        const step = this.steps[stepIndex];
        if (!step) {
            console.log('No step found for index:', stepIndex);
            return;
        }

        console.log('Showing step:', step.id, 'Target:', step.target);

        // Update tooltip content
        this.tooltip.querySelector('.tooltip-title').textContent = step.title;
        this.tooltip.querySelector('.tooltip-description').textContent = step.description;

        // Position tooltip with delay to ensure DOM is ready
        setTimeout(() => {
            this.positionTooltip(step);
        }, 100);

        // Highlight target element
        this.highlightTarget(step);

        // Update progress
        this.updateProgress(stepIndex);

        // Execute demo action if present
        if (step.demoAction) {
            step.demoAction();
        }

        // Apply animation
        this.applyAnimation(step.animation);

        // Update navigation buttons
        this.updateNavigationButtons(stepIndex);
    }

    positionTooltip(step) {
        console.log('Positioning tooltip for target:', step.target);
        
        const target = document.querySelector(step.target);
        if (!target) {
            console.log('Target not found, using fallback positioning');
            // Fallback to body if target not found
            const top = (window.innerHeight - 200) / 2;
            const left = (window.innerWidth - 350) / 2;
            
            this.tooltip.style.top = `${top}px`;
            this.tooltip.style.left = `${left}px`;
            this.tooltip.style.display = 'block';
            return;
        }

        const targetRect = target.getBoundingClientRect();
        console.log('Target rect:', targetRect);
        
        // Use fixed dimensions for tooltip if getBoundingClientRect fails
        const tooltipWidth = 350;
        const tooltipHeight = 200;
        
        let top, left;
        
        switch (step.position) {
            case 'top':
                top = targetRect.top - tooltipHeight - 20;
                left = targetRect.left + (targetRect.width - tooltipWidth) / 2;
                break;
            case 'bottom':
                top = targetRect.bottom + 20;
                left = targetRect.left + (targetRect.width - tooltipWidth) / 2;
                break;
            case 'left':
                top = targetRect.top + (targetRect.height - tooltipHeight) / 2;
                left = targetRect.left - tooltipWidth - 20;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height - tooltipHeight) / 2;
                left = targetRect.right + 20;
                break;
            case 'center':
            default:
                top = (window.innerHeight - tooltipHeight) / 2;
                left = (window.innerWidth - tooltipWidth) / 2;
                break;
        }

        // Ensure tooltip stays within viewport
        top = Math.max(20, Math.min(top, window.innerHeight - tooltipHeight - 20));
        left = Math.max(20, Math.min(left, window.innerWidth - tooltipWidth - 20));

        console.log('Final position:', { top, left });
        
        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.display = 'block';
    }

    highlightTarget(step) {
        const target = document.querySelector(step.target);
        const highlight = this.overlay.querySelector('.tour-highlight');
        
        if (!target) {
            // Hide highlight if target not found
            highlight.style.display = 'none';
            return;
        }

        highlight.style.display = 'block';
        const targetRect = target.getBoundingClientRect();
        
        highlight.style.top = `${targetRect.top}px`;
        highlight.style.left = `${targetRect.left}px`;
        highlight.style.width = `${targetRect.width}px`;
        highlight.style.height = `${targetRect.height}px`;
        
        // Apply action effect
        this.applyAction(step.action, target);
    }

    applyAction(action, target) {
        // Remove previous action classes
        target.classList.remove('tour-pulse', 'tour-glow', 'tour-highlight', 'tour-typewriter');
        
        switch (action) {
            case 'pulse':
                target.classList.add('tour-pulse');
                break;
            case 'glow':
                target.classList.add('tour-glow');
                break;
            case 'highlight':
                target.classList.add('tour-highlight');
                break;
            case 'typewriter':
                target.classList.add('tour-typewriter');
                this.typewriterEffect(target);
                break;
        }
    }

    applyAnimation(animation) {
        this.tooltip.className = `tour-tooltip tour-animation-${animation}`;
    }

    updateProgress(stepIndex) {
        const progress = ((stepIndex + 1) / this.steps.length) * 100;
        this.progress.querySelector('.progress-fill').style.width = `${progress}%`;
        this.progress.querySelector('.progress-current').textContent = stepIndex + 1;
    }

    updateNavigationButtons(stepIndex) {
        const prevButton = this.tooltip.querySelector('.tooltip-prev');
        const nextButton = this.tooltip.querySelector('.tooltip-next');
        
        prevButton.disabled = stepIndex === 0;
        nextButton.disabled = stepIndex === this.steps.length - 1;
        
        prevButton.style.opacity = prevButton.disabled ? '0.3' : '1';
        nextButton.style.opacity = nextButton.disabled ? '0.3' : '1';
    }

    next() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.showStep(this.currentStep);
        } else {
            this.end();
        }
    }

    previous() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }

    toggleAutoPlay() {
        if (this.isAutoPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }

    startAutoPlay() {
        this.isAutoPlaying = true;
        this.tooltip.querySelector('.tooltip-autoplay').innerHTML = '<i class="fas fa-pause"></i>';
        this.autoPlayInterval = setInterval(() => {
            if (this.currentStep < this.steps.length - 1) {
                this.next();
            } else {
                this.stopAutoPlay();
            }
        }, this.options.autoPlayDelay);
    }

    stopAutoPlay() {
        this.isAutoPlaying = false;
        this.tooltip.querySelector('.tooltip-autoplay').innerHTML = '<i class="fas fa-play"></i>';
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    end() {
        this.isActive = false;
        this.stopAutoPlay();
        this.hide();
        
        // Remove all tour classes
        document.querySelectorAll('.tour-pulse, .tour-glow, .tour-highlight, .tour-typewriter')
            .forEach(el => {
                el.classList.remove('tour-pulse', 'tour-glow', 'tour-highlight', 'tour-typewriter');
            });
    }

    // Demo actions
    demoModalFeatures() {
        // Simulate opening a modal
        const demoModal = document.createElement('div');
        demoModal.className = 'demo-modal';
        demoModal.innerHTML = `
            <div class="demo-modal-content">
                <h3>Modal Demo</h3>
                <p>This shows the full-screen modal with navigation controls.</p>
                <div class="demo-controls">
                    <button class="demo-btn">← Previous</button>
                    <button class="demo-btn">Next →</button>
                </div>
            </div>
        `;
        document.body.appendChild(demoModal);
        
        setTimeout(() => {
            if (demoModal.parentNode) {
                demoModal.parentNode.removeChild(demoModal);
            }
        }, 3000);
    }

    demoResponsive() {
        // Simulate responsive breakpoints
        const demo = document.createElement('div');
        demo.className = 'demo-responsive';
        demo.innerHTML = `
            <div class="responsive-demo">
                <div class="screen desktop">Desktop</div>
                <div class="screen tablet">Tablet</div>
                <div class="screen mobile">Mobile</div>
            </div>
        `;
        document.body.appendChild(demo);
        
        setTimeout(() => {
            if (demo.parentNode) {
                demo.parentNode.removeChild(demo);
            }
        }, 4000);
    }

    typewriterEffect(target) {
        const text = target.textContent;
        target.textContent = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                target.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }

    // Public API
    restart() {
        this.end();
        setTimeout(() => this.start(), 100);
    }

    goToStep(stepIndex) {
        if (stepIndex >= 0 && stepIndex < this.steps.length) {
            this.currentStep = stepIndex;
            this.showStep(stepIndex);
        }
    }

    destroy() {
        this.end();
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
        }
        if (this.progress && this.progress.parentNode) {
            this.progress.parentNode.removeChild(this.progress);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractiveTour;
} else {
    window.InteractiveTour = InteractiveTour;
}
