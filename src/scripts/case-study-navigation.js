// Case Study Navigation Handler
class CaseStudyNavigation {
    constructor() {
        this.navigationContainer = null;
        this.caseStudies = [
            {
                id: 'microsoft-office-365',
                title: 'Microsoft Office 365',
                file: 'microsoft-office-365.html'
            },
            {
                id: 'microsoft-office-live',
                title: 'Microsoft Office Live',
                file: 'microsoft-office-live.html'
            },
            {
                id: 'tmobile-how-to-switch',
                title: 'T-Mobile How to Switch',
                file: 'tmobile-how-to-switch.html'
            },
            {
                id: 'tmobile-idea-lab',
                title: 'T-Mobile Idea Lab',
                file: 'tmobile-idea-lab.html'
            },
            {
                id: 'att-international-roaming',
                title: 'AT&T International Roaming',
                file: 'att-international-roaming.html'
            },
            {
                id: 'atmosfx-ecommerce',
                title: 'AtmosFX E-commerce',
                file: 'atmosfx-ecommerce.html'
            },
            {
                id: 'bmgf-gallery',
                title: 'Bill & Melinda Gates Foundation',
                file: 'bmgf-gallery.html'
            },
            {
                id: 'disney-vmc',
                title: 'Disney VMC',
                file: 'disney-vmc.html'
            }
        ];
    }

    // Get current case study ID from URL
    getCurrentCaseStudyId() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        return filename.replace('.html', '');
    }

    // Find case study by ID
    findCaseStudy(id) {
        return this.caseStudies.find(cs => cs.id === id);
    }

    // Get previous and next case studies
    getNavigationLinks(currentId) {
        const currentIndex = this.caseStudies.findIndex(cs => cs.id === currentId);
        if (currentIndex === -1) return { previous: null, next: null };

        const previousIndex = currentIndex === 0 ? this.caseStudies.length - 1 : currentIndex - 1;
        const nextIndex = currentIndex === this.caseStudies.length - 1 ? 0 : currentIndex + 1;

        return {
            previous: this.caseStudies[previousIndex],
            current: this.caseStudies[currentIndex],
            next: this.caseStudies[nextIndex]
        };
    }

    // Load navigation template
    async loadNavigationTemplate() {
        try {
            const response = await fetch('/src/partials/case-study-navigation.html');
            const template = await response.text();
            return template;
        } catch (error) {
            console.error('Error loading navigation template:', error);
            return this.getFallbackNavigation();
        }
    }

    // Get fallback navigation if template fails to load
    getFallbackNavigation() {
        return `
        <section class="py-5 bg-dark">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="d-flex justify-content-between align-items-center">
                            <a href="#" class="btn btn-outline-light btn-lg">
                                <i class="fas fa-arrow-left me-2"></i>
                                Previous Case Study
                            </a>
                            <span class="text-light fw-bold">Case Study Navigation</span>
                            <a href="#" class="btn btn-outline-light btn-lg">
                                Next Case Study
                                <i class="fas fa-arrow-right ms-2"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        `;
    }

    // Populate template with navigation data
    populateTemplate(template, navigationData) {
        return template
            .replace('{{PREVIOUS_LINK}}', navigationData.previous ? navigationData.previous.file : '#')
            .replace('{{CURRENT_TITLE}}', navigationData.current ? navigationData.current.title : 'Case Study')
            .replace('{{NEXT_LINK}}', navigationData.next ? navigationData.next.file : '#');
    }

    // Initialize navigation
    async init() {
        const currentId = this.getCurrentCaseStudyId();
        const navigationData = this.getNavigationLinks(currentId);
        
        if (!navigationData.current) {
            console.warn('Current case study not found in navigation list');
            return;
        }

        // Load and populate template
        const template = await this.loadNavigationTemplate();
        const populatedTemplate = this.populateTemplate(template, navigationData);

        // Insert navigation before footer
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            const navigationElement = document.createElement('div');
            navigationElement.innerHTML = populatedTemplate;
            footerContainer.parentNode.insertBefore(navigationElement.firstElementChild, footerContainer);
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const navigation = new CaseStudyNavigation();
    navigation.init();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CaseStudyNavigation;
}
