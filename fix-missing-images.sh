#!/bin/bash

echo "Fixing missing images by using existing images..."

# Create directories if they don't exist
mkdir -p src/public/mamp-images/microsoft
mkdir -p src/public/mamp-images/tmobile

# Fix Microsoft Office Live images
echo "Fixing Microsoft Office Live images..."
cp "src/public/mamp-images/microsoft/office-live-design-1.jpg" "src/public/mamp-images/microsoft/office-live-design-1.jpg" 2>/dev/null || cp "src/public/mamp-images/5ol-1-1920x1234.jpg" "src/public/mamp-images/microsoft/office-live-design-1.jpg"
cp "src/public/mamp-images/microsoft/office-live-design-2.jpg" "src/public/mamp-images/microsoft/office-live-design-2.jpg" 2>/dev/null || cp "src/public/mamp-images/5ol-2-1920x1234.jpg" "src/public/mamp-images/microsoft/office-live-design-2.jpg"
cp "src/public/mamp-images/microsoft/office-live-design-3.jpg" "src/public/mamp-images/microsoft/office-live-design-3.jpg" 2>/dev/null || cp "src/public/mamp-images/5ol-1920x1234.jpg" "src/public/mamp-images/microsoft/office-live-design-3.jpg"

cp "src/public/mamp-images/microsoft/office-live-prototype-1.jpg" "src/public/mamp-images/microsoft/office-live-prototype-1.jpg" 2>/dev/null || cp "src/public/mamp-images/4-axureprototype-2000x1032.jpg" "src/public/mamp-images/microsoft/office-live-prototype-1.jpg"
cp "src/public/mamp-images/microsoft/office-live-prototype-2.jpg" "src/public/mamp-images/microsoft/office-live-prototype-2.jpg" 2>/dev/null || cp "src/public/mamp-images/5-axureprototype-1388x1316.jpg" "src/public/mamp-images/microsoft/office-live-prototype-2.jpg"
cp "src/public/mamp-images/microsoft/office-live-prototype-3.jpg" "src/public/mamp-images/microsoft/office-live-prototype-3.jpg" 2>/dev/null || cp "src/public/mamp-images/4-axureprototype-742x383.webp" "src/public/mamp-images/microsoft/office-live-prototype-3.jpg"

cp "src/public/mamp-images/microsoft/office-live-testing-1.jpg" "src/public/mamp-images/microsoft/office-live-testing-1.jpg" 2>/dev/null || cp "src/public/mamp-images/1-trello-heuristiceval-2000x1031.jpg" "src/public/mamp-images/microsoft/office-live-testing-1.jpg"
cp "src/public/mamp-images/microsoft/office-live-testing-2.jpg" "src/public/mamp-images/microsoft/office-live-testing-2.jpg" 2>/dev/null || cp "src/public/mamp-images/2-trello-detail-764x1271.jpg" "src/public/mamp-images/microsoft/office-live-testing-2.jpg"
cp "src/public/mamp-images/microsoft/office-live-testing-3.jpg" "src/public/mamp-images/microsoft/office-live-testing-3.jpg" 2>/dev/null || cp "src/public/mamp-images/3-trello-detail-764x1258.jpg" "src/public/mamp-images/microsoft/office-live-testing-3.jpg"

cp "src/public/mamp-images/microsoft/office-live-implementation-1.jpg" "src/public/mamp-images/microsoft/office-live-implementation-1.jpg" 2>/dev/null || cp "src/public/mamp-images/4-1820x784.png" "src/public/mamp-images/microsoft/office-live-implementation-1.jpg"
cp "src/public/mamp-images/microsoft/office-live-implementation-2.jpg" "src/public/mamp-images/microsoft/office-live-implementation-2.jpg" 2>/dev/null || cp "src/public/mamp-images/5-2000x1229.png" "src/public/mamp-images/microsoft/office-live-implementation-2.jpg"
cp "src/public/mamp-images/microsoft/office-live-implementation-3.jpg" "src/public/mamp-images/microsoft/office-live-implementation-3.jpg" 2>/dev/null || cp "src/public/mamp-images/6-howto-landing-2000x1287.jpg" "src/public/mamp-images/microsoft/office-live-implementation-3.jpg"

cp "src/public/mamp-images/microsoft/office-live-launch-1.jpg" "src/public/mamp-images/microsoft/office-live-launch-1.jpg" 2>/dev/null || cp "src/public/mamp-images/7-axure-how-to-1234x1307.jpg" "src/public/mamp-images/microsoft/office-live-launch-1.jpg"
cp "src/public/mamp-images/microsoft/office-live-launch-2.jpg" "src/public/mamp-images/microsoft/office-live-launch-2.jpg" 2>/dev/null || cp "src/public/mamp-images/8-axureaboutatmos-1261x1320.jpg" "src/public/mamp-images/microsoft/office-live-launch-2.jpg"
cp "src/public/mamp-images/microsoft/office-live-launch-3.jpg" "src/public/mamp-images/microsoft/office-live-launch-3.jpg" 2>/dev/null || cp "src/public/mamp-images/9-2000x1027.jpg" "src/public/mamp-images/microsoft/office-live-launch-3.jpg"

# Fix T-Mobile images
echo "Fixing T-Mobile images..."
cp "src/public/mamp-images/tmobile/tmobile-strategy-1.jpg" "src/public/mamp-images/tmobile/tmobile-strategy-1.jpg" 2>/dev/null || cp "src/public/mamp-images/0tmobile-1-1920x1234.jpg" "src/public/mamp-images/tmobile/tmobile-strategy-1.jpg"
cp "src/public/mamp-images/tmobile/tmobile-strategy-2.jpg" "src/public/mamp-images/tmobile/tmobile-strategy-2.jpg" 2>/dev/null || cp "src/public/mamp-images/0tmobile-2-1920x1234.jpg" "src/public/mamp-images/tmobile/tmobile-strategy-2.jpg"
cp "src/public/mamp-images/tmobile/tmobile-strategy-3.jpg" "src/public/mamp-images/tmobile/tmobile-strategy-3.jpg" 2>/dev/null || cp "src/public/mamp-images/0tmobile-2-1920x1234.jpeg" "src/public/mamp-images/tmobile/tmobile-strategy-3.jpg"

cp "src/public/mamp-images/tmobile/tmobile-ideation-1.jpg" "src/public/mamp-images/tmobile/tmobile-ideation-1.jpg" 2>/dev/null || cp "src/public/mamp-images/1-658x1260.png" "src/public/mamp-images/tmobile/tmobile-ideation-1.jpg"
cp "src/public/mamp-images/tmobile/tmobile-ideation-2.jpg" "src/public/mamp-images/tmobile/tmobile-ideation-2.jpg" 2>/dev/null || cp "src/public/mamp-images/1-658x1260-658x1260.png" "src/public/mamp-images/tmobile/tmobile-ideation-2.jpg"
cp "src/public/mamp-images/tmobile/tmobile-ideation-3.jpg" "src/public/mamp-images/tmobile/tmobile-ideation-3.jpg" 2>/dev/null || cp "src/public/mamp-images/1-trello-heuristiceval-2000x1031-800x412.jpg" "src/public/mamp-images/tmobile/tmobile-ideation-3.jpg"

cp "src/public/mamp-images/tmobile/tmobile-design-1.jpg" "src/public/mamp-images/tmobile/tmobile-design-1.jpg" 2>/dev/null || cp "src/public/mamp-images/2-trello-detail-764x1271-764x1271.jpg" "src/public/mamp-images/tmobile/tmobile-design-1.jpg"
cp "src/public/mamp-images/tmobile/tmobile-design-2.jpg" "src/public/mamp-images/tmobile/tmobile-design-2.jpg" 2>/dev/null || cp "src/public/mamp-images/3-trello-detail-764x1258-764x1258.jpg" "src/public/mamp-images/tmobile/tmobile-design-2.jpg"
cp "src/public/mamp-images/tmobile/tmobile-design-3.jpg" "src/public/mamp-images/tmobile/tmobile-design-3.jpg" 2>/dev/null || cp "src/public/mamp-images/4-axureprototype-2000x1032-800x413.jpg" "src/public/mamp-images/tmobile/tmobile-design-3.jpg"

cp "src/public/mamp-images/tmobile/tmobile-prototype-1.jpg" "src/public/mamp-images/tmobile/tmobile-prototype-1.jpg" 2>/dev/null || cp "src/public/mamp-images/5-axureprototype-1388x1316-800x759.jpg" "src/public/mamp-images/tmobile/tmobile-prototype-1.jpg"
cp "src/public/mamp-images/tmobile/tmobile-prototype-2.jpg" "src/public/mamp-images/tmobile/tmobile-prototype-2.jpg" 2>/dev/null || cp "src/public/mamp-images/6-howto-landing-2000x1287-800x515.jpg" "src/public/mamp-images/tmobile/tmobile-prototype-2.jpg"
cp "src/public/mamp-images/tmobile/tmobile-prototype-3.jpg" "src/public/mamp-images/tmobile/tmobile-prototype-3.jpg" 2>/dev/null || cp "src/public/mamp-images/7-axure-how-to-1234x1307-800x847.jpg" "src/public/mamp-images/tmobile/tmobile-prototype-3.jpg"

cp "src/public/mamp-images/tmobile/tmobile-testing-1.jpg" "src/public/mamp-images/tmobile/tmobile-testing-1.jpg" 2>/dev/null || cp "src/public/mamp-images/8-axureaboutatmos-1261x1320-800x837.jpg" "src/public/mamp-images/tmobile/tmobile-testing-1.jpg"
cp "src/public/mamp-images/tmobile/tmobile-testing-2.jpg" "src/public/mamp-images/tmobile/tmobile-testing-2.jpg" 2>/dev/null || cp "src/public/mamp-images/9-2000x1027-800x411.jpg" "src/public/mamp-images/tmobile/tmobile-testing-2.jpg"
cp "src/public/mamp-images/tmobile/tmobile-testing-3.jpg" "src/public/mamp-images/tmobile/tmobile-testing-3.jpg" 2>/dev/null || cp "src/public/mamp-images/10-1238x1318-800x852.jpg" "src/public/mamp-images/tmobile/tmobile-testing-3.jpg"

cp "src/public/mamp-images/tmobile/tmobile-implementation-1.jpg" "src/public/mamp-images/tmobile/tmobile-implementation-1.jpg" 2>/dev/null || cp "src/public/mamp-images/13-2000x1223-800x489.jpg" "src/public/mamp-images/tmobile/tmobile-implementation-1.jpg"
cp "src/public/mamp-images/tmobile/tmobile-implementation-2.jpg" "src/public/mamp-images/tmobile/tmobile-implementation-2.jpg" 2>/dev/null || cp "src/public/mamp-images/14-1326x1319-800x796.jpg" "src/public/mamp-images/tmobile/tmobile-implementation-2.jpg"
cp "src/public/mamp-images/tmobile/tmobile-implementation-3.jpg" "src/public/mamp-images/tmobile/tmobile-implementation-3.jpg" 2>/dev/null || cp "src/public/mamp-images/15-1257x831-800x529.jpg" "src/public/mamp-images/tmobile/tmobile-implementation-3.jpg"

cp "src/public/mamp-images/tmobile/tmobile-launch-1.jpg" "src/public/mamp-images/tmobile/tmobile-launch-1.jpg" 2>/dev/null || cp "src/public/mamp-images/17-1366x1318-800x772.jpg" "src/public/mamp-images/tmobile/tmobile-launch-1.jpg"
cp "src/public/mamp-images/tmobile/tmobile-launch-2.jpg" "src/public/mamp-images/tmobile/tmobile-launch-2.jpg" 2>/dev/null || cp "src/public/mamp-images/18-1255x1312-800x836.jpg" "src/public/mamp-images/tmobile/tmobile-launch-2.jpg"
cp "src/public/mamp-images/tmobile/tmobile-launch-3.jpg" "src/public/mamp-images/tmobile/tmobile-launch-3.jpg" 2>/dev/null || cp "src/public/mamp-images/21-1252x1319-800x843.jpg" "src/public/mamp-images/tmobile/tmobile-launch-3.jpg"

cp "src/public/mamp-images/tmobile/tmobile-chat-1.jpg" "src/public/mamp-images/tmobile/tmobile-chat-1.jpg" 2>/dev/null || cp "src/public/mamp-images/22-1144x1318-800x922.jpg" "src/public/mamp-images/tmobile/tmobile-chat-1.jpg"
cp "src/public/mamp-images/tmobile/tmobile-chat-2.jpg" "src/public/mamp-images/tmobile/tmobile-chat-2.jpg" 2>/dev/null || cp "src/public/mamp-images/24-821x1317-800x1283.jpg" "src/public/mamp-images/tmobile/tmobile-chat-2.jpg"

cp "src/public/mamp-images/tmobile/tmobile-store-1.jpg" "src/public/mamp-images/tmobile/tmobile-store-1.jpg" 2>/dev/null || cp "src/public/mamp-images/28-480x1315-480x1315.jpg" "src/public/mamp-images/tmobile/tmobile-store-1.jpg"
cp "src/public/mamp-images/tmobile/tmobile-store-2.jpg" "src/public/mamp-images/tmobile/tmobile-store-2.jpg" 2>/dev/null || cp "src/public/mamp-images/28-480x1315.jpg" "src/public/mamp-images/tmobile/tmobile-store-2.jpg"

echo "Image fixes complete!"
