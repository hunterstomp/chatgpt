import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const exts = new Set([".html",".md",".mdx"]);

let missingAlt = [];
let emptyTitle = [];

function walk(dir){
  for(const ent of fs.readdirSync(dir, {withFileTypes:true})){
    const p = path.join(dir, ent.name);
    if(ent.isDirectory()) walk(p);
    else if(exts.has(path.extname(ent.name))){
      const txt = fs.readFileSync(p, "utf-8");
      if(/<img(?![^>]*\balt=)[^>]*>/i.test(txt)) missingAlt.push(p);
      if(/<title>\s*<\/title>/i.test(txt))     emptyTitle.push(p);
    }
  }
}
walk(ROOT);

if(missingAlt.length)  console.warn("⚠️ Missing alt on <img> in:\n - " + missingAlt.join("\n - "));
if(emptyTitle.length)  console.warn("⚠️ Empty <title> in:\n - " + emptyTitle.join("\n - "));
console.log("✅ A11y sanity complete");
