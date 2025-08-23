const fs = require('fs');
const path = require('path');

// Define the case study order based on the directory structure
const caseStudyOrder = [
  'atmosfx-ecommerce',
  'atmosfx-media-player', 
  'att-international-roaming',
  'bmgf',
  'microsoft-office-365',
  'office-live-workspaces',
  'tmobile-how-to-switch',
  'tmobile-idea-lab'
];

// Navigation HTML template
function generateNavigationHTML(currentStudy, prevStudy, nextStudy) {
  const prevButton = prevStudy ? `
    <div class="col-md-4">
      <a href="/src/case-studies/${prevStudy}/" class="btn btn-nav-prev btn-lg w-100 text-start">
        <div class="nav-arrow nav-arrow-left">
          <i class="fas fa-arrow-left"></i>
        </div>
        <div class="nav-content">
          <small class="nav-label">Previous Study</small>
          <strong class="nav-title">${getStudyTitle(prevStudy).toUpperCase()}</strong>
        </div>
      </a>
    </div>
  ` : '<div class="col-md-4"></div>';

  const nextButton = nextStudy ? `
    <div class="col-md-4">
      <a href="/src/case-studies/${nextStudy}/" class="btn btn-nav-next btn-lg w-100 text-end">
        <div class="nav-content">
          <small class="nav-label">Next Study</small>
          <strong class="nav-title">${getStudyTitle(nextStudy).toUpperCase()}</strong>
        </div>
        <div class="nav-arrow nav-arrow-right">
          <i class="fas fa-arrow-right"></i>
        </div>
      </a>
    </div>
  ` : '<div class="col-md-4"></div>';

  return `
  <!-- Case Study Navigation -->
  <section class="case-study-navigation py-5">
    <div class="container">
      <div class="row justify-content-between align-items-center">
        ${prevButton}
        <div class="col-md-4 text-center">
          <a href="/src/case-studies/" class="btn btn-nav-center">
            <div class="nav-arrow nav-arrow-center">
              <i class="fas fa-th-large"></i>
            </div>
            <div class="nav-content">
              <strong class="nav-title">ALL CASE STUDIES</strong>
            </div>
          </a>
        </div>
        ${nextButton}
      </div>
    </div>
  </section>
`;
}

// CSS styles for navigation
const navigationCSS = `
  /* Case Study Navigation Styling */
  .case-study-navigation {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .case-study-navigation .btn {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    font-family: 'Roboto Condensed', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 80px;
    position: relative;
    overflow: hidden;
  }

  /* Previous Study Button - White Outline */
  .case-study-navigation .btn-nav-prev {
    border: 3px solid rgba(255, 255, 255, 0.8);
    color: #ffffff;
    background: transparent;
    text-align: left;
  }

  .case-study-navigation .btn-nav-prev:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #ffffff;
    color: #ffffff;
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(255, 255, 255, 0.2);
  }

  /* Center Button - Dark Fill */
  .case-study-navigation .btn-nav-center {
    border: 3px solid rgba(255, 255, 255, 0.3);
    color: #ffffff;
    background: rgba(0, 0, 0, 0.6);
    text-align: center;
    justify-content: center;
  }

  .case-study-navigation .btn-nav-center:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.5);
    color: #ffffff;
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  }

  /* Next Study Button - Accent Color */
  .case-study-navigation .btn-nav-next {
    border: 3px solid var(--accent-1, #00E5FF);
    color: var(--accent-1, #00E5FF);
    background: transparent;
    text-align: right;
  }

  .case-study-navigation .btn-nav-next:hover {
    background: var(--accent-1, #00E5FF);
    color: #000000;
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 229, 255, 0.4);
  }

  /* Navigation Content */
  .case-study-navigation .nav-content {
    flex: 1;
    z-index: 2;
  }

  .case-study-navigation .nav-label {
    font-size: 0.7rem;
    opacity: 0.8;
    font-weight: 400;
    display: block;
    margin-bottom: 0.25rem;
    color: inherit;
  }

  .case-study-navigation .nav-title {
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.2;
    color: inherit;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  /* Animated Arrows */
  .case-study-navigation .nav-arrow {
    font-size: 1.5rem;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }

  .case-study-navigation .nav-arrow-left {
    margin-right: 1rem;
  }

  .case-study-navigation .nav-arrow-right {
    margin-left: 1rem;
  }

  .case-study-navigation .nav-arrow-center {
    margin: 0 0.5rem;
    background: rgba(255, 255, 255, 0.15);
  }

  /* Arrow Animations */
  .case-study-navigation .btn:hover .nav-arrow-left {
    transform: translateX(-5px);
    background: rgba(255, 255, 255, 0.2);
  }

  .case-study-navigation .btn:hover .nav-arrow-right {
    transform: translateX(5px);
    background: rgba(255, 255, 255, 0.2);
  }

  .case-study-navigation .btn:hover .nav-arrow-center {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.25);
  }

  /* Pulse animation for arrows */
  @keyframes arrowPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .case-study-navigation .nav-arrow {
    animation: arrowPulse 2s ease-in-out infinite;
  }

  .case-study-navigation .btn:hover .nav-arrow {
    animation: none;
  }

  @media (max-width: 768px) {
    .case-study-navigation .row {
      gap: 1rem;
    }
    
    .case-study-navigation .col-md-4 {
      margin-bottom: 1rem;
    }
    
    .case-study-navigation .btn {
      padding: 1rem;
      font-size: 0.85rem;
      min-height: 70px;
    }

    .case-study-navigation .nav-title {
      font-size: 1rem;
    }

    .case-study-navigation .nav-arrow {
      font-size: 1.25rem;
      width: 35px;
      height: 35px;
    }
  }
`;

// Helper function to get study titles
function getStudyTitle(studySlug) {
  const titles = {
    'atmosfx-ecommerce': 'AtmosFX E-commerce',
    'atmosfx-media-player': 'AtmosFX Media Player',
    'att-international-roaming': 'AT&T International Roaming',
    'bmgf': 'Bill & Melinda Gates Foundation',
    'microsoft-office-365': 'Microsoft Office 365',
    'office-live-workspaces': 'Office Live Workspaces',
    'tmobile-how-to-switch': 'T-Mobile How to Switch',
    'tmobile-idea-lab': 'T-Mobile Idea Lab'
  };
  return titles[studySlug] || studySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Function to add navigation to a case study
function addNavigationToCaseStudy(studySlug) {
  const studyPath = path.join(__dirname, '..', 'src', 'case-studies', studySlug, 'index.html');
  
  if (!fs.existsSync(studyPath)) {
    console.log(`❌ Case study not found: ${studyPath}`);
    return;
  }

  const currentIndex = caseStudyOrder.indexOf(studySlug);
  const prevStudy = currentIndex > 0 ? caseStudyOrder[currentIndex - 1] : null;
  const nextStudy = currentIndex < caseStudyOrder.length - 1 ? caseStudyOrder[currentIndex + 1] : null;

  let content = fs.readFileSync(studyPath, 'utf8');

  // Check if navigation already exists
  if (content.includes('case-study-navigation')) {
    console.log(`⚠️  Navigation already exists in ${studySlug}`);
    return;
  }

  // Generate navigation HTML
  const navigationHTML = generateNavigationHTML(studySlug, prevStudy, nextStudy);

  // Insert navigation before footer
  const footerPattern = /(\s*<!-- Footer -->\s*<div id="footer-container"><\/div>)/;
  if (footerPattern.test(content)) {
    content = content.replace(footerPattern, `${navigationHTML}\n$1`);
  } else {
    // Fallback: insert before closing main tag
    const mainPattern = /(\s*<\/main>\s*)/;
    if (mainPattern.test(content)) {
      content = content.replace(mainPattern, `${navigationHTML}\n$1`);
    } else {
      console.log(`❌ Could not find insertion point in ${studySlug}`);
      return;
    }
  }

  // Add CSS if not already present
  if (!content.includes('case-study-navigation')) {
    const stylePattern = /(\s*<\/style>\s*)/;
    if (stylePattern.test(content)) {
      content = content.replace(stylePattern, `${navigationCSS}\n$1`);
    }
  }

  // Write the updated content
  fs.writeFileSync(studyPath, content, 'utf8');
  console.log(`✅ Added navigation to ${studySlug}`);
}

// Main execution
function main() {
  console.log('🚀 Adding navigation to all case studies...\n');
  
  caseStudyOrder.forEach(studySlug => {
    addNavigationToCaseStudy(studySlug);
  });
  
  console.log('\n✨ Navigation addition complete!');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { addNavigationToCaseStudy, generateNavigationHTML, navigationCSS };
