#!/bin/bash

echo "🔄 Updating case study images..."

# Update Microsoft case study
sed -i '' 's|<div class="placeholder-image mb-3" style="height: 200px; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; color: #666;">|<img src="/public/mamp-images/microsoft/office-live-strategy-1.jpg" alt="User personas" class="gallery-image mb-3" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius);">|g' src/case-studies/microsoft-office-live.html

sed -i '' 's|<div class="placeholder-image mb-3" style="height: 200px; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; color: #666;">|<img src="/public/mamp-images/microsoft/office-live-strategy-2.jpg" alt="Business alignment" class="gallery-image mb-3" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius);">|g' src/case-studies/microsoft-office-live.html

sed -i '' 's|<div class="placeholder-image" style="height: 200px; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; color: #666;">|<img src="/public/mamp-images/microsoft/office-live-strategy-3.jpg" alt="Feature roadmap" class="gallery-image" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius);">|g' src/case-studies/microsoft-office-live.html

# Update T-Mobile case study
sed -i '' 's|<div class="placeholder-image mb-3" style="height: 200px; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; color: #666;">|<img src="/public/mamp-images/tmobile/tmobile-research-1.jpg" alt="Customer journey mapping" class="gallery-image mb-3" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius);">|g' src/case-studies/tmobile-how-to-switch.html

sed -i '' 's|<div class="placeholder-image mb-3" style="height: 200px; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; color: #666;">|<img src="/public/mamp-images/tmobile/tmobile-research-2.jpg" alt="Pain point analysis" class="gallery-image mb-3" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius);">|g' src/case-studies/tmobile-how-to-switch.html

sed -i '' 's|<div class="placeholder-image" style="height: 200px; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; color: #666;">|<img src="/public/mamp-images/tmobile/tmobile-research-3.jpg" alt="User research findings" class="gallery-image" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius);">|g' src/case-studies/tmobile-how-to-switch.html

echo "✅ Case study images updated!"
