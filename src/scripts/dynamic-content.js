/**
 * Dynamic Content Management for Q10UX Case Studies
 * Handles show/hide logic, process flow numbering, and dummy image management
 */

class DynamicContentManager {
    constructor() {
        this.contentSections = new Map();
        this.processFlows = new Map();
        this.dummyImages = new Map();
        this.init();
    }

    init() {
        this.scanContent();
        this.setupEventListeners();
        this.updateProcessFlows();
    }

    /**
     * Scan the page for content sections, process flows, and dummy images
     */
    scanContent() {
        // Scan for content sections
        document.querySelectorAll('.content-section').forEach(section => {
            const sectionId = section.id || this.generateId();
            this.contentSections.set(sectionId, {
                element: section,
                hasContent: this.checkContentAvailability(section),
                isVisible: !section.classList.contains('hidden')
            });
        });

        // Scan for process flows
        document.querySelectorAll('.process-flow').forEach(flow => {
            const flowId = flow.id || this.generateId();
            this.processFlows.set(flowId, {
                element: flow,
                steps: Array.from(flow.querySelectorAll('.process-step')),
                visibleSteps: 0
            });
        });

        // Scan for dummy images
        document.querySelectorAll('.dummy-image').forEach(img => {
            const imgId = img.id || this.generateId();
            this.dummyImages.set(imgId, {
                element: img,
                isVisible: !img.classList.contains('hidden')
            });
        });
    }

    /**
     * Check if a section has meaningful content
     */
    checkContentAvailability(section) {
        const textContent = section.textContent.trim();
        const images = section.querySelectorAll('img:not(.dummy-image)');
        const videos = section.querySelectorAll('video');
        const iframes = section.querySelectorAll('iframe');
        
        // Check for meaningful text content (more than just whitespace)
        const hasText = textContent.length > 50;
        
        // Check for media content
        const hasMedia = images.length > 0 || videos.length > 0 || iframes.length > 0;
        
        // Check for interactive elements
        const hasInteractive = section.querySelectorAll('button, a, form, .interactive').length > 0;
        
        return hasText || hasMedia || hasInteractive;
    }

    /**
     * Show or hide a content section
     */
    toggleSection(sectionId, forceState = null) {
        const section = this.contentSections.get(sectionId);
        if (!section) return;

        const newState = forceState !== null ? forceState : !section.isVisible;
        
        if (newState) {
            section.element.classList.remove('hidden');
            section.element.classList.add('visible');
            section.isVisible = true;
        } else {
            section.element.classList.add('hidden');
            section.element.classList.remove('visible');
            section.isVisible = false;
        }

        // Update process flows if this section contains any
        this.updateProcessFlows();
        
        // Dispatch custom event
        this.dispatchEvent('sectionToggled', { sectionId, isVisible: newState });
    }

    /**
     * Show or hide a dummy image
     */
    toggleDummyImage(imageId, forceState = null) {
        const image = this.dummyImages.get(imageId);
        if (!image) return;

        const newState = forceState !== null ? forceState : !image.isVisible;
        
        if (newState) {
            image.element.classList.remove('hidden');
            image.isVisible = true;
        } else {
            image.element.classList.add('hidden');
            image.isVisible = false;
        }

        // Dispatch custom event
        this.dispatchEvent('dummyImageToggled', { imageId, isVisible: newState });
    }

    /**
     * Update process flow numbering based on visible steps
     */
    updateProcessFlows() {
        this.processFlows.forEach((flow, flowId) => {
            let visibleCount = 0;
            
            flow.steps.forEach((step, index) => {
                const isVisible = !step.classList.contains('hidden');
                
                if (isVisible) {
                    visibleCount++;
                    step.style.counterIncrement = 'process-step';
                } else {
                    step.style.counterIncrement = 'none';
                }
            });
            
            flow.visibleSteps = visibleCount;
            
            // Update flow counter
            flow.element.style.setProperty('--visible-steps', visibleCount);
        });
    }

    /**
     * Auto-hide sections with no content
     */
    autoHideEmptySections() {
        this.contentSections.forEach((section, sectionId) => {
            if (!section.hasContent) {
                this.toggleSection(sectionId, false);
            }
        });
    }

    /**
     * Show all sections (for testing)
     */
    showAllSections() {
        this.contentSections.forEach((section, sectionId) => {
            this.toggleSection(sectionId, true);
        });
    }

    /**
     * Hide all dummy images
     */
    hideAllDummyImages() {
        this.dummyImages.forEach((image, imageId) => {
            this.toggleDummyImage(imageId, false);
        });
    }

    /**
     * Get content status for admin panel
     */
    getContentStatus() {
        const status = {
            sections: {},
            processFlows: {},
            dummyImages: {}
        };

        this.contentSections.forEach((section, sectionId) => {
            status.sections[sectionId] = {
                hasContent: section.hasContent,
                isVisible: section.isVisible,
                elementId: section.element.id
            };
        });

        this.processFlows.forEach((flow, flowId) => {
            status.processFlows[flowId] = {
                totalSteps: flow.steps.length,
                visibleSteps: flow.visibleSteps,
                elementId: flow.element.id
            };
        });

        this.dummyImages.forEach((image, imageId) => {
            status.dummyImages[imageId] = {
                isVisible: image.isVisible,
                elementId: image.element.id
            };
        });

        return status;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for admin panel commands
        window.addEventListener('message', (event) => {
            if (event.data.type === 'dynamicContent') {
                this.handleAdminCommand(event.data);
            }
        });

        // Listen for content changes
        const observer = new MutationObserver(() => {
            this.scanContent();
            this.updateProcessFlows();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    /**
     * Handle admin panel commands
     */
    handleAdminCommand(command) {
        switch (command.action) {
            case 'toggleSection':
                this.toggleSection(command.sectionId, command.state);
                break;
            case 'toggleDummyImage':
                this.toggleDummyImage(command.imageId, command.state);
                break;
            case 'autoHideEmpty':
                this.autoHideEmptySections();
                break;
            case 'showAll':
                this.showAllSections();
                break;
            case 'hideAllDummy':
                this.hideAllDummyImages();
                break;
            case 'getStatus':
                return this.getContentStatus();
        }
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'dynamic-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Dispatch custom events
     */
    dispatchEvent(type, detail) {
        const event = new CustomEvent('dynamicContent:' + type, { detail });
        window.dispatchEvent(event);
    }
}

// Initialize the dynamic content manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dynamicContentManager = new DynamicContentManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicContentManager;
}