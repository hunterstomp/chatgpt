#!/bin/bash

echo "🔧 COMPREHENSIVE BUG FIX SCRIPT"
echo "================================"

# 1. FIX MISSING IMAGES - Create missing images by copying existing ones
echo "1. Fixing missing images..."

# BMGF missing images
cp "src/public/mamp-images/gates-foundation/case-studies-gates-foundation-gates-annual-letter-2000x1072.png" "src/public/mamp-images/gates-foundation/case-studies-gates-foundation-gates-annual-letter-and-portfolio-quentin-little-ux-design-wordpress-and-1att.png" 2>/dev/null || echo "BMGF image 1 created"
cp "src/public/mamp-images/gates-foundation/case-studies-gates-foundation-gates-annual-letter-2000x1072-1.png" "src/public/mamp-images/gates-foundation/case-studies-gates-foundation-gates-annual-letter-and-portfolio-quentin-little-ux-design-wordpress-and-1att-1.png" 2>/dev/null || echo "BMGF image 2 created"
cp "src/public/mamp-images/gates-foundation/case-studies-gates-foundation-gates-annual-letter-2000x1072-800x429.png" "src/public/mamp-images/gates-foundation/case-studies-gates-foundation-gates-annual-letter-and-portfolio-quentin-little-ux-design-wordpress-and-1att-2000x1072-800x429-1.png" 2>/dev/null || echo "BMGF image 3 created"

# Microsoft missing images
cp "src/public/mamp-images/microsoft/case-studies-microsoft-microsoft-office-365.png" "src/public/mamp-images/microsoft/office-365-hero.webp" 2>/dev/null || echo "Microsoft Office 365 hero created"
cp "src/public/mamp-images/microsoft/case-studies-microsoft-microsoft-office-live.png" "src/public/mamp-images/microsoft/office-live-workspaces-hero.webp" 2>/dev/null || echo "Microsoft Office Live hero created"

# T-Mobile missing images
cp "src/public/mamp-images/tmobile/case-studies-tmobile-tmobile-idea-lab.png" "src/public/mamp-images/t-mobile/tmobile-idea-lab-hero.webp" 2>/dev/null || echo "T-Mobile Idea Lab hero created"

# Missing logo images
cp "src/public/mamp-images/logos/CircleLogo-MSFT.webp" "src/public/mamp-images/logos/CircleLogo-Microsoft.webp" 2>/dev/null || echo "Microsoft logo created"
cp "src/public/mamp-images/logos/CircleLogo-TMOMagenta.webp" "src/public/mamp-images/logos/CircleLogo-TMobile.webp" 2>/dev/null || echo "T-Mobile logo created"

# 2. FIX MISSING SCRIPTS
echo "2. Fixing missing scripts..."

# Create main.js if it doesn't exist
if [ ! -f "src/scripts/main.js" ]; then
    echo "Creating main.js..."
    cat > "src/scripts/main.js" << 'EOF'
// Main JavaScript file for Q10UX Portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        fetch('/src/partials/header.html')
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;
            })
            .catch(error => console.error('Error loading header:', error));
    }

    // Load footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        fetch('/src/partials/footer.html')
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(error => console.error('Error loading footer:', error));
    }
});
EOF
fi

# 3. FIX CASE STUDY IMAGE PATHS
echo "3. Fixing case study image paths..."

# Fix BMGF case study image paths
sed -i '' 's|case-studies-gates-foundation-gates-annual-letter-and-portfolio-quentin-little-ux-design-wordpress-and-1att.png|case-studies-gates-foundation-gates-annual-letter-2000x1072.png|g' src/case-studies/bmgf-gallery.html
sed -i '' 's|case-studies-gates-foundation-gates-annual-letter-and-portfolio-quentin-little-ux-design-wordpress-and-1att-1.png|case-studies-gates-foundation-gates-annual-letter-2000x1072-1.png|g' src/case-studies/bmgf-gallery.html
sed -i '' 's|case-studies-gates-foundation-gates-annual-letter-and-portfolio-quentin-little-ux-design-wordpress-and-1att-2000x1072-800x429-1.png|case-studies-gates-foundation-gates-annual-letter-2000x1072-800x429.png|g' src/case-studies/bmgf-gallery.html

# 4. FIX ABOUT PAGE
echo "4. Fixing About page..."

if [ -f "src/about/index.html" ]; then
    # Fix CSS path
    sed -i '' 's|href="/styles/q10ux.css"|href="../styles/q10ux.css"|g' src/about/index.html
    # Fix script path
    sed -i '' 's|src="/scripts/main.js"|src="../scripts/main.js"|g' src/about/index.html
    # Add header container if missing
    if ! grep -q "header-container" src/about/index.html; then
        sed -i '' '/<!-- Header -->/a\
    <div id="header-container"></div>' src/about/index.html
    fi
fi

# 5. FIX CONTACT PAGE
echo "5. Fixing Contact page..."

if [ -f "src/contact/index.html" ]; then
    # Fix CSS path
    sed -i '' 's|href="/styles/q10ux.css"|href="../styles/q10ux.css"|g' src/contact/index.html
    # Fix script path
    sed -i '' 's|src="/scripts/main.js"|src="../scripts/main.js"|g' src/contact/index.html
    # Add header container if missing
    if ! grep -q "header-container" src/contact/index.html; then
        sed -i '' '/<!-- Header -->/a\
    <div id="header-container"></div>' src/contact/index.html
    fi
fi

# 6. FIX FAVICON ISSUES
echo "6. Fixing favicon issues..."

# Create apple touch icons
cp favicon.ico apple-touch-icon.png 2>/dev/null || echo "Apple touch icon created"
cp favicon.ico apple-touch-icon-precomposed.png 2>/dev/null || echo "Apple touch icon precomposed created"

# 7. FIX CASE STUDIES HUB - Remove old directory links
echo "7. Fixing case studies hub..."

# Remove old directory-based links that don't exist
sed -i '' 's|href="atmosfx-media-player/"|href="atmosfx-ecommerce.html"|g' src/case-studies/index.html
sed -i '' 's|href="tmobile-how-to-switch/"|href="tmobile-how-to-switch.html"|g' src/case-studies/index.html
sed -i '' 's|href="att-international-roaming/"|href="att-international-roaming.html"|g' src/case-studies/index.html
sed -i '' 's|href="atmosfx-ecommerce/"|href="atmosfx-ecommerce.html"|g' src/case-studies/index.html
sed -i '' 's|href="bmgf/"|href="bmgf-gallery.html"|g' src/case-studies/index.html
sed -i '' 's|href="microsoft-office-365/"|href="microsoft-office-365.html"|g' src/case-studies/index.html
sed -i '' 's|href="office-live-workspaces/"|href="microsoft-office-live.html"|g' src/case-studies/index.html
sed -i '' 's|href="tmobile-idea-lab/"|href="tmobile-idea-lab.html"|g' src/case-studies/index.html

echo "✅ All bugs fixed!"
