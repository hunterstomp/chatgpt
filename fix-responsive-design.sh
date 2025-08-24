#!/bin/bash

echo "📱 FIXING RESPONSIVE DESIGN ISSUES"
echo "=================================="

# Add comprehensive responsive design fixes to q10ux.css
cat >> src/styles/q10ux.css << 'EOF'

/* ========================================
   RESPONSIVE DESIGN FIXES
   ======================================== */

/* Mobile Hero Section - Fix header overlap */
@media (max-width: 768px) {
  .hero-section {
    padding-top: 140px !important; /* Increased padding for mobile */
    min-height: 100vh;
    height: auto;
  }
  
  .hero-title {
    font-size: clamp(2rem, 6vw, 3.5rem) !important;
    margin-bottom: 1rem;
  }
  
  .hero-subtitle {
    font-size: clamp(1rem, 4vw, 1.5rem) !important;
    margin-bottom: 2rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .hero-buttons .btn {
    width: 100%;
    max-width: 280px;
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
}

/* Tablet Hero Section */
@media (min-width: 769px) and (max-width: 1024px) {
  .hero-section {
    padding-top: 120px !important;
  }
  
  .hero-title {
    font-size: clamp(2.5rem, 7vw, 4rem) !important;
  }
  
  .hero-subtitle {
    font-size: clamp(1.25rem, 4vw, 1.75rem) !important;
  }
}

/* Landscape Mobile - Extra padding needed */
@media (max-width: 768px) and (orientation: landscape) {
  .hero-section {
    padding-top: 160px !important;
    min-height: 100vh;
  }
  
  .hero-title {
    font-size: clamp(1.5rem, 5vw, 2.5rem) !important;
  }
  
  .hero-subtitle {
    font-size: clamp(0.9rem, 3vw, 1.25rem) !important;
  }
}

/* Portrait Mobile - Ensure proper spacing */
@media (max-width: 768px) and (orientation: portrait) {
  .hero-section {
    padding-top: 150px !important;
    min-height: 100vh;
  }
}

/* Mobile Navigation Improvements */
@media (max-width: 991.98px) {
  .q10ux-nav {
    padding: 0.5rem 1rem;
  }
  
  .q10ux-nav .navbar-brand {
    font-size: 1.1rem;
  }
  
  .q10ux-nav .navbar-nav .nav-link {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }
  
  .q10ux-nav .navbar-collapse {
    margin-top: 0.5rem;
    padding: 0.5rem;
  }
}

/* Extra Small Mobile */
@media (max-width: 576px) {
  .hero-section {
    padding-top: 130px !important;
  }
  
  .hero-title {
    font-size: clamp(1.75rem, 5vw, 2.5rem) !important;
  }
  
  .hero-subtitle {
    font-size: clamp(0.9rem, 3vw, 1.25rem) !important;
  }
  
  .q10ux-nav .navbar-brand {
    font-size: 1rem;
  }
  
  .q10ux-nav .navbar-nav .nav-link {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}

/* Ensure content is always readable */
.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  color: var(--text);
  padding: 2rem 1rem;
}

/* Fix for any remaining overlap issues */
body {
  padding-top: 0;
}

/* Ensure header stays on top */
.q10ux-nav {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1050 !important;
}

EOF

echo "✅ Responsive design fixes applied!"
echo "📱 Mobile, tablet, and landscape/portrait views should now work properly"
