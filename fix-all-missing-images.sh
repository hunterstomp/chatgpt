#!/bin/bash

echo "🖼️ FIXING ALL MISSING IMAGES"
echo "============================"

# Fix Microsoft Office Live design images
echo "1. Fixing Microsoft Office Live design images..."
cd src/public/mamp-images/microsoft
rm -f office-live-design-1.jpg office-live-design-2.jpg office-live-design-3.jpg
cp office-live-research-1.jpg office-live-design-1.jpg
cp office-live-research-2.jpg office-live-design-2.jpg
cp office-live-research-3.jpg office-live-design-3.jpg
cd ../../../..

# Fix case studies hub missing images
echo "2. Fixing case studies hub images..."
cd src/public/mamp-images
# Create missing hero images by copying existing ones
cp hero-o365-1034x1421.jpg microsoft/hero-o365-1034x1421.jpg 2>/dev/null || echo "Microsoft Office 365 hero already exists"
cp hero-olw-1034x1421.jpg microsoft/hero-olw-1034x1421.jpg 2>/dev/null || echo "Microsoft Office Live hero already exists"
cp hero-tmobile-howtoswitch-816x1121.webp t-mobile/hero-tmobile-howtoswitch-816x1121.webp 2>/dev/null || echo "T-Mobile hero already exists"
cp hero-att-1034x1421.jpg att/hero-att-1034x1421.jpg 2>/dev/null || echo "AT&T hero already exists"
cd ../..

# Fix missing logo images
echo "3. Fixing missing logo images..."
cd src/public/mamp-images/logos
cp CircleLogo-MSFT.webp CircleLogo-Microsoft.webp 2>/dev/null || echo "Microsoft logo already exists"
cp CircleLogo-TMOMagenta.webp CircleLogo-TMobile.webp 2>/dev/null || echo "T-Mobile logo already exists"
cd ../../..

# Fix case studies hub image paths
echo "4. Fixing case studies hub image paths..."
sed -i '' 's|hero-att-1034x142atmosfx-meta.jpg|hero-att-1034x1421.jpg|g' src/case-studies/index.html
sed -i '' 's|microsoft/hero-o365-1034x1421.jpg|hero-o365-1034x1421.jpg|g' src/case-studies/index.html
sed -i '' 's|microsoft/hero-olw-1034x1421.jpg|hero-olw-1034x1421.jpg|g' src/case-studies/index.html
sed -i '' 's|t-mobile/hero-tmobile-howtoswitch-816x1121.webp|hero-tmobile-howtoswitch-816x1121.webp|g' src/case-studies/index.html

echo "✅ All missing images fixed!"
