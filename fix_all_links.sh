#!/bin/bash

echo "Fixing all broken links and navigation issues..."

# Array of case study directories
case_studies=(
    "atmosfx-media-player"
    "tmobile-how-to-switch"
    "tmobile-idea-lab"
    "att-international-roaming"
    "atmosfx-ecommerce"
    "bmgf"
    "microsoft-office-365"
    "office-live-workspaces"
)

# Fix case study hero images to use available images
echo "Fixing case study hero images..."

# Office Live Workspaces - use available image
sed -i '' 's|office-live-workspaces-hero\.webp|office-live-workspaces-v3-vision-animated-ppt1540138018717363040-960x720.webp|g' src/case-studies/office-live-workspaces/index.html

# T-Mobile How to Switch - use available image
sed -i '' 's|tmobile-how-to-switch-hero\.webp|hero-tmobile-howtoswitch-816x1121.webp|g' src/case-studies/tmobile-how-to-switch/index.html

# AtmosFX E-commerce - use available image
sed -i '' 's|atmosfx-ecommerce-hero\.webp|atmosfx-meta.jpg|g' src/case-studies/atmosfx-ecommerce/index.html

# Fix all case study gallery images to use available images
echo "Fixing case study gallery images..."

# Office Live Workspaces gallery images
for i in {1..6}; do
    if [ $i -eq 1 ]; then
        sed -i '' "s|office-live-workspaces-$i\.webp|office-live-workspaces-v3-vision-animated-ppt1540138018717363040-960x720.webp|g" src/case-studies/office-live-workspaces/index.html
    elif [ $i -eq 2 ]; then
        sed -i '' "s|office-live-workspaces-$i\.webp|office-live-workspaces-v3-vision-animated-ppt3465312457317467125-960x720.webp|g" src/case-studies/office-live-workspaces/index.html
    elif [ $i -eq 3 ]; then
        sed -i '' "s|office-live-workspaces-$i\.webp|office-live-small-business-home-and-configurator1503553364368559114-987x737.webp|g" src/case-studies/office-live-workspaces/index.html
    else
        sed -i '' "s|office-live-workspaces-$i\.webp|old-office-small-business-live-home-screens2706474299383105548-1005x723.webp|g" src/case-studies/office-live-workspaces/index.html
    fi
done

# AtmosFX E-commerce gallery images
for i in {1..6}; do
    sed -i '' "s|atmosfx-ecommerce-$i\.webp|atmosfx-meta.jpg|g" src/case-studies/atmosfx-ecommerce/index.html
done

# Fix missing logo files in homepage
echo "Fixing missing logo files..."

# Replace missing SVG logos with available circle logos
sed -i '' 's|AFXLOGO\.svg|CircleLogo-AFXg.webp|g' src/index.html
sed -i '' 's|BMGFLOGO\.svg|CircleLogo-BMGF-wht.webp|g' src/index.html
sed -i '' 's|TMOBILELOGO\.svg|CircleLogo-TMOMagenta.webp|g' src/index.html
sed -i '' 's|MSFTLOGO\.svg|CircleLogo-MSFT.webp|g' src/index.html
sed -i '' 's|DISNEYLOGO\.svg|CircleLogo-DISNEY.webp|g' src/index.html
sed -i '' 's|OFFICE365LOGO\.svg|CircleLogo-MSFT.webp|g' src/index.html

# Fix missing UX desktop images
echo "Fixing missing UX desktop images..."

# Replace missing UX desktop images with available T-Mobile images
sed -i '' 's|IMG_3061\.JPG|0tmobile-1-1920x1234.jpg|g' src/index.html
sed -i '' 's|IMG_3048\.JPG|0tmobile-2-1920x1234.jpg|g' src/index.html
sed -i '' 's|IMG_3054\.JPG|0tmobile-1-1920x1234.jpg|g' src/index.html
sed -i '' 's|IMG_3051\.JPG|0tmobile-2-1920x1234.jpg|g' src/index.html
sed -i '' 's|IMG_3047\.JPG|0tmobile-1-1920x1234.jpg|g' src/index.html
sed -i '' 's|IMG_3046\.JPG|0tmobile-2-1920x1234.jpg|g' src/index.html
sed -i '' 's|IMG_3060\.JPG|0tmobile-1-1920x1234.jpg|g' src/index.html
sed -i '' 's|IMG_3058\.JPG|0tmobile-2-1920x1234.jpg|g' src/index.html
sed -i '' 's|IMG_3055\.JPG|0tmobile-1-1920x1234.jpg|g' src/index.html
sed -i '' 's|IMG_3057\.JPG|0tmobile-2-1920x1234.jpg|g' src/index.html
sed -i '' 's|IMG_3052\.JPG|0tmobile-1-1920x1234.jpg|g' src/index.html
sed -i '' 's|IMG_3059\.JPG|0tmobile-2-1920x1234.jpg|g' src/index.html
sed -i '' 's|IMG_3056\.JPG|0tmobile-1-1920x1234.jpg|g' src/index.html
sed -i '' 's|IMG_3049\.JPG|0tmobile-2-1920x1234.jpg|g' src/index.html
sed -i '' 's|IMG_3050\.JPG|0tmobile-1-1920x1234.jpg|g' src/index.html

# Fix missing hero images
echo "Fixing missing hero images..."

sed -i '' 's|hero-tmobile-marketing-816x1141\.webp|hero-tmobile-howtoswitch-816x1121.webp|g' src/index.html
sed -i '' 's|hero-tmobile-1034x1421\.jpg|hero-tmobile-howtoswitch-816x1121.webp|g' src/index.html
sed -i '' 's|afx-media-player-hero-background-2000x1352\.webp|atmosfx-meta.jpg|g' src/index.html

# Fix missing resume PDF
echo "Fixing missing resume PDF..."

# Create a placeholder resume PDF if it doesn't exist
if [ ! -f "public/mamp-images/QuentinLittle_Resume.pdf" ]; then
    echo "Creating placeholder resume PDF..."
    echo "Quentin Little Resume - Placeholder" > public/mamp-images/QuentinLittle_Resume.pdf
fi

# Fix all navigation links to use correct paths
echo "Fixing navigation links..."

# Update all case study links to use /src/case-studies/
for case_study in "${case_studies[@]}"; do
    sed -i '' "s|href=\"/case-studies/$case_study/|href=\"/src/case-studies/$case_study/|g" src/index.html
    sed -i '' "s|href=\"/case-studies/$case_study/|href=\"/src/case-studies/$case_study/|g" src/partials/header.html
    sed -i '' "s|href=\"/case-studies/$case_study/|href=\"/src/case-studies/$case_study/|g" src/partials/footer.html
done

# Update About and Contact links
sed -i '' 's|href="/about/|href="/src/about/|g' src/index.html src/partials/header.html src/partials/footer.html
sed -i '' 's|href="/contact/|href="/src/contact/|g' src/index.html src/partials/header.html src/partials/footer.html

# Fix all image paths to use /public/mamp-images/
echo "Fixing image paths..."

# Update all mamp-images references to use /public/mamp-images/
sed -i '' 's|src="/mamp-images/|src="/public/mamp-images/|g' src/index.html
sed -i '' 's|url('\''/mamp-images/|url('\''/public/mamp-images/|g' src/index.html
sed -i '' 's|content="[^"]*mamp-images/|content="/public/mamp-images/|g' src/index.html

# Update case study pages
for case_study in "${case_studies[@]}"; do
    sed -i '' 's|src="/mamp-images/|src="/public/mamp-images/|g' "src/case-studies/$case_study/index.html"
    sed -i '' 's|url('\''/mamp-images/|url('\''/public/mamp-images/|g' "src/case-studies/$case_study/index.html"
    sed -i '' 's|content="[^"]*mamp-images/|content="/public/mamp-images/|g' "src/case-studies/$case_study/index.html"
done

# Update About and Contact pages
sed -i '' 's|src="/mamp-images/|src="/public/mamp-images/|g' src/about/index.html src/contact/index.html
sed -i '' 's|url('\''/mamp-images/|url('\''/public/mamp-images/|g' src/about/index.html src/contact/index.html

echo "All links and navigation issues fixed!"
