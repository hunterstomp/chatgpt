import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MAP_PATH = process.argv[2] || "public/assets/image-remap.json";
const exts = new Set([".html",".md",".mdx",".css",".js",".mjs",".ts",".tsx"]);

if(!fs.existsSync(path.join(ROOT, MAP_PATH))){
  console.error("❌ Missing mapping file at", MAP_PATH);
  process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(path.join(ROOT, MAP_PATH), "utf-8"));

async function walk(dir){
  const dirents = await fs.promises.readdir(dir,{withFileTypes:true});
  for(const d of dirents){
    const full = path.join(dir,d.name);
    if(d.isDirectory()) await walk(full);
    else if(exts.has(path.extname(full))) await remap(full);
  }
}

async function remap(file){
  let text = await fs.promises.readFile(file,"utf-8");
  let changed = false;
  for(const {oldPath, newPath} of mapping){
    const esc = oldPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(esc, "g");
    if(re.test(text)){ text = text.replace(re, newPath); changed = true; }
  }
  if(changed){
    await fs.promises.writeFile(file, text, "utf-8");
    console.log("Updated:", file);
  }
}

await walk(ROOT);
console.log("✅ Remap complete");
