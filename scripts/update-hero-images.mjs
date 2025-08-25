/**
 * Update Hero Images — automatically populate hero image arrays
 * from extracted images for home and case studies hub pages
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUB = path.join(ROOT, "public/assets");
const HOME_PAGE = path.join(ROOT, "src/pages/index.astro");
const CASE_HUB_PAGE = path.join(ROOT, "src/pages/case-studies/index.astro");

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => /\.(webp|png|jpe?g|gif|svg)$/i.test(f))
    .map(f => `/assets/${path.relative(PUB, path.join(dir, f)).replace(/\\/g, '/')}`);
}

function updateHeroImages() {
  // Get hero images for home page
  const heroDir = path.join(PUB, "hero");
  const homeHeroImages = listImages(heroDir).slice(0, 6);
  
  // Get hero images for case studies hub
  const hubDir = path.join(PUB, "cases-hub");
  const hubHeroImages = listImages(hubDir).slice(0, 3);
  
  // If no hub images, use some from hero
  const finalHubImages = hubHeroImages.length > 0 ? hubHeroImages : homeHeroImages.slice(0, 3);
  
  // Update home page
  if (fs.existsSync(HOME_PAGE)) {
    let homeContent = fs.readFileSync(HOME_PAGE, "utf8");
    
    // Find and replace heroImages array
    const heroImagesRe = /const heroImages = \[([\s\S]*?)\];/;
    const newHeroImages = `const heroImages = [\n  ${homeHeroImages.map(img => `"${img}"`).join(",\n  ")}\n];`;
    
    if (heroImagesRe.test(homeContent)) {
      homeContent = homeContent.replace(heroImagesRe, newHeroImages);
      fs.writeFileSync(HOME_PAGE, homeContent, "utf8");
      console.log("✔ Updated home page hero images:", homeHeroImages.length);
    } else {
      console.log("⚠️  Could not find heroImages array in home page");
    }
  }
  
  // Update case studies hub page
  if (fs.existsSync(CASE_HUB_PAGE)) {
    let hubContent = fs.readFileSync(CASE_HUB_PAGE, "utf8");
    
    // Find and replace heroImages array
    const heroImagesRe = /const heroImages = \[([\s\S]*?)\];/;
    const newHubHeroImages = `const heroImages = [\n  ${finalHubImages.map(img => `"${img}"`).join(",\n  ")}\n];`;
    
    if (heroImagesRe.test(hubContent)) {
      hubContent = hubContent.replace(heroImagesRe, newHubHeroImages);
      fs.writeFileSync(CASE_HUB_PAGE, hubContent, "utf8");
      console.log("✔ Updated case studies hub hero images:", finalHubImages.length);
    } else {
      console.log("⚠️  Could not find heroImages array in case studies hub page");
    }
  }
  
  console.log("\n✨ Hero images updated successfully!");
}

updateHeroImages();
