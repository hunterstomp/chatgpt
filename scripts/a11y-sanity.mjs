import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const exts = new Set([".html",".md",".mdx"]);
const IGNORE = [ "archive", "node_modules", "logs", "processed", "uploads" ].map(p => path.join(ROOT, p));
const isIgnored = p => IGNORE.some(base => p === base || p.startsWith(base + path.sep));
let missingAlt=[], emptyTitle=[];
(function walk(dir){
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    const p = path.join(dir, ent.name); if(isIgnored(p)) continue;
    if(ent.isDirectory()) walk(p);
    else if(exts.has(path.extname(ent.name))){
      const t = fs.readFileSync(p, "utf-8");
      if(/<img(?![^>]*\balt=)[^>]*>/i.test(t)) missingAlt.push(p);
      if(/<title>\s*<\/title>/i.test(t))       emptyTitle.push(p);
    }
  }
})(ROOT);
if(missingAlt.length) console.warn("⚠️ Missing alt on <img> in:\n - " + missingAlt.join("\n - "));
if(emptyTitle.length) console.warn("⚠️ Empty <title> in:\n - " + emptyTitle.join("\n - "));
console.log("✅ A11y sanity complete");
