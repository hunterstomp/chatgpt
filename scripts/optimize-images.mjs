import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(fileURLToPath(new URL("..", import.meta.url)), "public", "assets");
const PHOTO = new Set([".jpg",".jpeg",".png",".tif",".tiff",".bmp"]);

async function walk(dir){
  const dirents = await fs.promises.readdir(dir,{withFileTypes:true});
  for(const d of dirents){
    const full = path.join(dir,d.name);
    if(d.isDirectory()) await walk(full);
    else await process(full);
  }
}
async function process(file){
  const ext = path.extname(file).toLowerCase();
  if(!PHOTO.has(ext)) return;
  const base = file.slice(0, -ext.length);
  const img = sharp(file, { failOn: "none" });
  const { width } = await img.metadata();
  const targets = [480, 768, 1024, 1600].filter(w => !width || w < width);
  await img.webp({ quality: 82 }).toFile(`${base}.webp`);
  for(const w of targets){
    await img.resize({ width: w }).webp({ quality: 80 }).toFile(`${base}.${w}.webp`);
  }
  console.log("Optimized:", path.basename(file));
}

if (!fs.existsSync(ROOT)) {
  console.error("❌ Missing directory", ROOT, "— create public/assets and try again.");
  process.exit(1);
}

await walk(ROOT);
console.log("✅ Image optimization complete");
