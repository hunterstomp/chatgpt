#!/bin/bash

echo "Updating all case studies to use the new navigation template..."

# List of case study files to update
case_studies=(
    "src/case-studies/tmobile-idea-lab.html"
    "src/case-studies/att-international-roaming.html"
    "src/case-studies/atmosfx-ecommerce.html"
    "src/case-studies/bmgf-gallery.html"
    "src/case-studies/disney-vmc.html"
    "src/case-studies/microsoft-office-365.html"
)

# Update each case study
for file in "${case_studies[@]}"; do
    if [ -f "$file" ]; then
        echo "Updating $file..."
        
        # Replace the old navigation section with the new comment
        sed -i '' '/<!-- Case Study Navigation -->/,/<!-- Footer -->/c\
        <!-- Case Study Navigation will be loaded dynamically -->\
\
        <!-- Footer -->' "$file"
        
        # Add the navigation script before the existing scripts
        sed -i '' '/<!-- Q10UX Scripts -->/a\
    <!-- Case Study Navigation -->\
    <script src="../scripts/case-study-navigation.js"></script>' "$file"
        
        echo "✅ Updated $file"
    else
        echo "❌ File not found: $file"
    fi
done

echo "Navigation template update complete!"
