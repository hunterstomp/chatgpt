#!/bin/bash

echo "Renaming images for new case studies..."

# Create directories if they don't exist
mkdir -p src/public/mamp-images/disney
mkdir -p src/public/mamp-images/microsoft

# Copy and rename Disney VMC images
cd src/public/mamp-images/disney/

# Find and copy Disney images
find ../../../../Q10UXPortfolio/assets/images-organized/case-studies/ -name "*disney*" -type f | head -3 | while read -r file; do
    filename=$(basename "$file")
    if [[ $filename == *"disney-vmc"* ]]; then
        cp "$file" "case-studies-disney-disney-vmc.png"
    elif [[ $filename == *"disney"* ]]; then
        cp "$file" "case-studies-disney-disney-vmc-1.png"
    fi
done

# Copy additional Disney images for galleries
find ../../../../Q10UXPortfolio/assets/images-organized/case-studies/ -name "*disney*" -type f | head -6 | tail -3 | while read -r file; do
    filename=$(basename "$file")
    if [[ $filename == *"disney"* ]]; then
        cp "$file" "case-studies-disney-disney-vmc-2.png"
    fi
done

cd ../../

# Copy and rename Microsoft Office 365 images
cd src/public/mamp-images/microsoft/

# Find and copy Microsoft Office 365 images
find ../../../../Q10UXPortfolio/assets/images-organized/case-studies/ -name "*microsoft*" -type f | head -3 | while read -r file; do
    filename=$(basename "$file")
    if [[ $filename == *"office-365"* ]] || [[ $filename == *"office365"* ]]; then
        cp "$file" "case-studies-microsoft-microsoft-office-365.png"
    elif [[ $filename == *"microsoft"* ]]; then
        cp "$file" "case-studies-microsoft-microsoft-office-365-1.png"
    fi
done

# Copy additional Microsoft images for galleries
find ../../../../Q10UXPortfolio/assets/images-organized/case-studies/ -name "*microsoft*" -type f | head -6 | tail -3 | while read -r file; do
    filename=$(basename "$file")
    if [[ $filename == *"microsoft"* ]]; then
        cp "$file" "case-studies-microsoft-microsoft-office-365-2.png"
    fi
done

cd ../../

echo "Image renaming complete for new case studies."
