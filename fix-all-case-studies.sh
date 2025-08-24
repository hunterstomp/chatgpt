#!/bin/bash

echo "Fixing all case studies..."

# List of case study files to fix
case_studies=(
    "src/case-studies/microsoft-office-365.html"
    "src/case-studies/bmgf-gallery.html"
    "src/case-studies/tmobile-idea-lab.html"
    "src/case-studies/att-international-roaming.html"
    "src/case-studies/atmosfx-ecommerce.html"
    "src/case-studies/disney-vmc.html"
)

# Fix each case study
for file in "${case_studies[@]}"; do
    if [ -f "$file" ]; then
        echo "Fixing $file..."
        
        # Fix CSS path
        sed -i '' 's|href="/styles/q10ux.css"|href="../styles/q10ux.css"|g' "$file"
        
        # Fix script path
        sed -i '' 's|src="/scripts/main.js"|src="../scripts/main.js"|g' "$file"
        
        # Add header container if missing
        if ! grep -q "header-container" "$file"; then
            sed -i '' '/<!-- Header -->/a\
    <div id="header-container"></div>' "$file"
        fi
        
        # Add navigation script if missing
        if ! grep -q "case-study-navigation.js" "$file"; then
            sed -i '' '/<!-- Custom Scripts -->/a\
    <!-- Case Study Navigation -->\
    <script src="../scripts/case-study-navigation.js"></script>' "$file"
        fi
        
        echo "✅ Fixed $file"
    else
        echo "❌ File not found: $file"
    fi
done

echo "All case studies fixed!"
