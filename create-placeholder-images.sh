#!/bin/bash

echo "Creating placeholder images for missing case study images..."

# Create directories if they don't exist
mkdir -p src/public/mamp-images/microsoft
mkdir -p src/public/mamp-images/tmobile
mkdir -p src/public/mamp-images/att
mkdir -p src/public/mamp-images/atmosfx
mkdir -p src/public/mamp-images/gates-foundation
mkdir -p src/public/mamp-images/disney

# Use existing images as placeholders for missing ones
echo "Creating placeholder images..."

# T-Mobile placeholders (these should already exist, but let's make sure)
cp "src/public/mamp-images/tmobile/tmobile-research-1.jpg" "src/public/mamp-images/tmobile/tmobile-strategy-1.jpg" 2>/dev/null || echo "tmobile-strategy-1.jpg already exists"
cp "src/public/mamp-images/tmobile/tmobile-research-2.jpg" "src/public/mamp-images/tmobile/tmobile-strategy-2.jpg" 2>/dev/null || echo "tmobile-strategy-2.jpg already exists"
cp "src/public/mamp-images/tmobile/tmobile-research-3.jpg" "src/public/mamp-images/tmobile/tmobile-strategy-3.jpg" 2>/dev/null || echo "tmobile-strategy-3.jpg already exists"

# Microsoft placeholders
cp "src/public/mamp-images/microsoft/case-studies-microsoft-microsoft-office-365.png" "src/public/mamp-images/microsoft/office-live-design-1.jpg" 2>/dev/null || echo "office-live-design-1.jpg already exists"
cp "src/public/mamp-images/microsoft/case-studies-microsoft-microsoft-office-365.png" "src/public/mamp-images/microsoft/office-live-design-2.jpg" 2>/dev/null || echo "office-live-design-2.jpg already exists"
cp "src/public/mamp-images/microsoft/case-studies-microsoft-microsoft-office-365.png" "src/public/mamp-images/microsoft/office-live-design-3.jpg" 2>/dev/null || echo "office-live-design-3.jpg already exists"

# AT&T placeholders - use any existing image
cp "src/public/mamp-images/hero-att-1034x1421.jpg" "src/public/mamp-images/att/att-roaming-1.jpg" 2>/dev/null || echo "att-roaming-1.jpg already exists"
cp "src/public/mamp-images/hero-att-1034x1421.jpg" "src/public/mamp-images/att/att-roaming-2.jpg" 2>/dev/null || echo "att-roaming-2.jpg already exists"
cp "src/public/mamp-images/hero-att-1034x1421.jpg" "src/public/mamp-images/att/att-roaming-3.jpg" 2>/dev/null || echo "att-roaming-3.jpg already exists"

# AtmosFX placeholders - use any existing image
cp "src/public/mamp-images/atmosfx-meta.jpg" "src/public/mamp-images/atmosfx/atmosfx-ecommerce-1.jpg" 2>/dev/null || echo "atmosfx-ecommerce-1.jpg already exists"
cp "src/public/mamp-images/atmosfx-meta.jpg" "src/public/mamp-images/atmosfx/atmosfx-ecommerce-2.jpg" 2>/dev/null || echo "atmosfx-ecommerce-2.jpg already exists"
cp "src/public/mamp-images/atmosfx-meta.jpg" "src/public/mamp-images/atmosfx/atmosfx-ecommerce-3.jpg" 2>/dev/null || echo "atmosfx-ecommerce-3.jpg already exists"

# Gates Foundation placeholders - use any existing image
cp "src/public/mamp-images/hero-bmgf-1276x1754.jpg" "src/public/mamp-images/gates-foundation/bmgf-gallery-1.jpg" 2>/dev/null || echo "bmgf-gallery-1.jpg already exists"
cp "src/public/mamp-images/hero-bmgf-1276x1754.jpg" "src/public/mamp-images/gates-foundation/bmgf-gallery-2.jpg" 2>/dev/null || echo "bmgf-gallery-2.jpg already exists"
cp "src/public/mamp-images/hero-bmgf-1276x1754.jpg" "src/public/mamp-images/gates-foundation/bmgf-gallery-3.jpg" 2>/dev/null || echo "bmgf-gallery-3.jpg already exists"

# Disney placeholders - use any existing image
cp "src/public/mamp-images/hero-disney-1034x1421.jpg" "src/public/mamp-images/disney/disney-vmc-1.jpg" 2>/dev/null || echo "disney-vmc-1.jpg already exists"
cp "src/public/mamp-images/hero-disney-1034x1421.jpg" "src/public/mamp-images/disney/disney-vmc-2.jpg" 2>/dev/null || echo "disney-vmc-2.jpg already exists"
cp "src/public/mamp-images/hero-disney-1034x1421.jpg" "src/public/mamp-images/disney/disney-vmc-3.jpg" 2>/dev/null || echo "disney-vmc-3.jpg already exists"

echo "Placeholder images created!"
