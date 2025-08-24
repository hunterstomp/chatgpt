#!/bin/bash

echo "🔤 FIXING CASE STUDY FONTS"
echo "=========================="

# List of case studies to fix
case_studies=(
    "src/case-studies/microsoft-office-365.html"
    "src/case-studies/microsoft-office-live.html"
    "src/case-studies/tmobile-how-to-switch.html"
    "src/case-studies/tmobile-idea-lab.html"
    "src/case-studies/att-international-roaming.html"
    "src/case-studies/atmosfx-ecommerce.html"
    "src/case-studies/bmgf-gallery.html"
    "src/case-studies/disney-vmc.html"
)

# Google Fonts link to add
fonts_link='    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Manrope:wght@600&family=Permanent+Marker&family=Roboto+Condensed:wght@400;700&family=Barlow+Condensed:wght@400;600&display=swap" rel="stylesheet">'

for file in "${case_studies[@]}"; do
    if [ -f "$file" ]; then
        echo "Fixing fonts in $file..."
        
        # Check if Google Fonts already exists
        if ! grep -q "fonts.googleapis.com" "$file"; then
            # Add Google Fonts after Bootstrap CSS
            sed -i '' '/<!-- Bootstrap CSS -->/a\
'"$fonts_link"'
' "$file"
            echo "✅ Added Google Fonts to $file"
        else
            echo "✅ Google Fonts already present in $file"
        fi
        
        # Also fix any missing main.js script
        if ! grep -q "main.js" "$file"; then
            sed -i '' '/<!-- Custom Scripts -->/a\
    <script src="../scripts/main.js"></script>' "$file"
            echo "✅ Added main.js to $file"
        fi
        
    else
        echo "❌ File not found: $file"
    fi
done

echo ""
echo "🎨 FONT FIXES COMPLETED!"
echo "All case studies now have proper Google Fonts and main.js scripts."
