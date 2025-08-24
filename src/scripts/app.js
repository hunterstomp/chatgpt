// Q10UX App Scripts
document.addEventListener('DOMContentLoaded', function() {
    
    // Hero Slideshow
    // initHeroSlideshow(); // Disabled to prevent background fading
    
    // Lightbox
    initLightbox();
    
    // Logo Marquee
    initLogoMarquee();
    
    // Accessibility Enhancements
    initAccessibility();
    
    // Smooth Scrolling
    initSmoothScrolling();
});

// Hero Slideshow Functionality
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const slideInterval = 4000; // 4 seconds per slide
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Start slideshow
    setInterval(nextSlide, slideInterval);
    
    // Preload images for smooth transitions
    slides.forEach(slide => {
        const bgImage = slide.style.backgroundImage.replace('url(', '').replace(')', '').replace(/"/g, '');
        const img = new Image();
        img.src = bgImage;
    });
}

// Lightbox Functionality
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.querySelector('#lightbox-caption .caption-text');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const closeBtn = document.getElementById('lightbox-close');
    
    let currentImages = [];
    let currentIndex = 0;
    
    // Portfolio images should navigate to case studies, not open lightbox
    // Removed click handlers that were preventing navigation
    
    function openLightbox(clickedImg) {
        // Get all images in the portfolio section
        const portfolioSection = clickedImg.closest('.portfolio-section');
        const images = portfolioSection ? 
            portfolioSection.querySelectorAll('.portfolio-image img') : 
            document.querySelectorAll('.portfolio-image img');
        
        currentImages = Array.from(images).map(img => ({
            src: img.src,
            alt: img.alt || 'Portfolio image',
            caption: generateImageCaption(img)
        }));
        
        currentIndex = Array.from(images).indexOf(clickedImg);
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function generateImageCaption(img) {
        const alt = img.alt;
        const title = img.title;
        
        if (title) return title;
        if (alt && alt !== 'Portfolio image' && alt !== '') return alt;
        
        // Generate caption from portfolio card context
        const portfolioCard = img.closest('.portfolio-card');
        if (portfolioCard) {
            const title = portfolioCard.querySelector('.portfolio-title');
            if (title) {
                return `${title.textContent} - Portfolio showcase`;
            }
        }
        
        return 'Portfolio showcase image';
    }
    
    function updateLightboxImage() {
        const currentImg = currentImages[currentIndex];
        
        lightboxImage.src = currentImg.src;
        lightboxImage.alt = currentImg.alt;
        lightboxCaption.textContent = currentImg.caption;
        lightboxCounter.textContent = `${currentIndex + 1} of ${currentImages.length}`;
        
        // Show/hide navigation buttons
        prevBtn.style.display = currentImages.length > 1 ? 'flex' : 'none';
        nextBtn.style.display = currentImages.length > 1 ? 'flex' : 'none';
    }
    
    function nextImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightboxImage();
    }
    
    function prevImage() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightboxImage();
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        }
    });
}

// Logo Marquee Functionality
function initLogoMarquee() {
    const marquee = document.getElementById('logo-marquee');
    if (!marquee) return;
    
    // Pause on hover
    marquee.addEventListener('mouseenter', () => {
        marquee.style.animationPlayState = 'paused';
    });
    
    marquee.addEventListener('mouseleave', () => {
        marquee.style.animationPlayState = 'running';
    });
}

// Accessibility Enhancements
function initAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(skipLink.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Focus indicators
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Reduced motion support
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition', '0.1s ease');
        document.documentElement.style.setProperty('--transition-fast', '0.05s ease');
        
        // Disable animations
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.portfolio-card, .logo-item').forEach(el => {
        observer.observe(el);
    });
});
