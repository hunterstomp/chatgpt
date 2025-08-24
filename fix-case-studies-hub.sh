#!/bin/bash

echo "Fixing case studies hub page..."

# Fix the case studies hub page
file="src/case-studies/index.html"

if [ -f "$file" ]; then
    echo "Fixing $file..."
    
    # Fix image paths - replace old Q10UXPortfolio paths with new ones
    sed -i '' 's|../../Q10UXPortfolio/assets/images/|/public/mamp-images/|g' "$file"
    
    # Fix logo paths
    sed -i '' 's|../../Q10UXPortfolio/assets/images/logos/|/public/mamp-images/logos/|g' "$file"
    
    # Fix case study links to point to .html files
    sed -i '' 's|href="atmosfx-media-player/"|href="atmosfx-ecommerce.html"|g' "$file"
    sed -i '' 's|href="tmobile-how-to-switch/"|href="tmobile-how-to-switch.html"|g' "$file"
    sed -i '' 's|href="att-international-roaming/"|href="att-international-roaming.html"|g' "$file"
    sed -i '' 's|href="atmosfx-ecommerce/"|href="atmosfx-ecommerce.html"|g' "$file"
    sed -i '' 's|href="bmgf/"|href="bmgf-gallery.html"|g' "$file"
    sed -i '' 's|href="microsoft-office-365/"|href="microsoft-office-365.html"|g' "$file"
    sed -i '' 's|href="office-live-workspaces/"|href="microsoft-office-live.html"|g' "$file"
    sed -i '' 's|href="tmobile-idea-lab/"|href="tmobile-idea-lab.html"|g' "$file"
    
    # Fix specific image names to use existing images
    sed -i '' 's|0-AtmosFX.png|atmosfx-meta.jpg|g' "$file"
    sed -i '' 's|1-Trello-HeuristicEval.jpg|hero-tmobile-howtoswitch-816x1121.webp|g' "$file"
    sed -i '' 's|10.jpg|hero-att-1034x1421.jpg|g' "$file"
    sed -i '' 's|1.jpg|atmosfx-meta.jpg|g' "$file"
    sed -i '' 's|2015-gates-annual-letter-and-portfolio-quentin-little-ux-design-wordpress-and-1att-2000x1072.png|hero-bmgf-1276x1754.jpg|g' "$file"
    sed -i '' 's|office-365-hero.webp|hero-o365-1034x1421.jpg|g' "$file"
    sed -i '' 's|office-live-workspaces-hero.webp|hero-olw-1034x1421.jpg|g' "$file"
    sed -i '' 's|tmobile-idea-lab-hero.webp|hero-tmobile-howtoswitch-816x1121.webp|g' "$file"
    
    # Fix logo names to use existing logos
    sed -i '' 's|CircleLogo-AFX-wht.webp|CircleLogo-AFXg.webp|g' "$file"
    sed -i '' 's|CircleLogo-Microsoft.webp|CircleLogo-MSFT.webp|g' "$file"
    sed -i '' 's|CircleLogo-TMobile.webp|CircleLogo-TMOMagenta.webp|g' "$file"
    
    echo "✅ Fixed $file"
else
    echo "❌ File not found: $file"
fi

echo "Case studies hub page fixed!"
