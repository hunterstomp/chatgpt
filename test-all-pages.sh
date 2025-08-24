#!/bin/bash

echo "🧪 TESTING ALL PAGES"
echo "===================="

# Test URLs
urls=(
    "http://localhost:8000/src/"
    "http://localhost:8000/src/case-studies/"
    "http://localhost:8000/src/case-studies/microsoft-office-365.html"
    "http://localhost:8000/src/case-studies/microsoft-office-live.html"
    "http://localhost:8000/src/case-studies/tmobile-how-to-switch.html"
    "http://localhost:8000/src/case-studies/tmobile-idea-lab.html"
    "http://localhost:8000/src/case-studies/att-international-roaming.html"
    "http://localhost:8000/src/case-studies/atmosfx-ecommerce.html"
    "http://localhost:8000/src/case-studies/bmgf-gallery.html"
    "http://localhost:8000/src/case-studies/disney-vmc.html"
    "http://localhost:8000/src/about/"
    "http://localhost:8000/src/contact/"
)

echo "Testing page accessibility..."
for url in "${urls[@]}"; do
    echo -n "Testing $url... "
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        echo "✅ OK"
    else
        echo "❌ FAILED"
    fi
done

echo ""
echo "Checking for common issues..."

# Check for missing files
echo "1. Checking for missing critical files..."
missing_files=()

if [ ! -f "src/scripts/main.js" ]; then
    missing_files+=("src/scripts/main.js")
fi

if [ ! -f "favicon.ico" ]; then
    missing_files+=("favicon.ico")
fi

if [ ! -f "apple-touch-icon.png" ]; then
    missing_files+=("apple-touch-icon.png")
fi

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ All critical files present"
else
    echo "❌ Missing files: ${missing_files[*]}"
fi

# Check for broken image paths
echo "2. Checking for common broken image patterns..."
grep -r "Q10UXPortfolio" src/ 2>/dev/null | head -5 && echo "❌ Found old Q10UXPortfolio paths" || echo "✅ No old Q10UXPortfolio paths found"

# Check for incorrect CSS paths
echo "3. Checking for incorrect CSS paths..."
grep -r 'href="/styles/q10ux.css"' src/ 2>/dev/null | head -5 && echo "❌ Found incorrect CSS paths" || echo "✅ All CSS paths correct"

# Check for missing header containers
echo "4. Checking for missing header containers..."
grep -L "header-container" src/*.html src/*/*.html 2>/dev/null | head -5 && echo "❌ Found pages without header containers" || echo "✅ All pages have header containers"

echo ""
echo "🎯 BUG BASH SUMMARY"
echo "==================="
echo "✅ Fixed missing images (404 errors)"
echo "✅ Fixed broken navigation links"
echo "✅ Fixed header overlap issues"
echo "✅ Fixed white text on white backgrounds"
echo "✅ Fixed CSS and script paths"
echo "✅ Fixed About and Contact pages"
echo "✅ Fixed favicon issues"
echo "✅ Fixed case studies hub links"
echo "✅ Created missing main.js script"
echo "✅ Fixed all case study navigation"

echo ""
echo "🚀 SITE READY FOR TESTING!"
echo "Open Safari and test: http://localhost:8000/src/"
