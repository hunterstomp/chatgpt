import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const disallowed = /(mobirise|mbr-|data-mobirise|Mobirise)/i;
const exts = new Set([".html",".css",".js"]);
const IGNORE = [
  path.join(ROOT, "archive"),
  path.join(ROOT, "src", "case-studies", "tmobile-how-to-switch", "index.html")
];
function isIgnored(p){ return IGNORE.some(ign => p === ign || p.startsWith(ign + path.sep)); }

let offenders = [];
function walk(dir){
  for(const e of fs.readdirSync(dir, {withFileTypes:true})){
    const p = path.join(dir, e.name);
    if(isIgnored(p)) continue;
    if(e.isDirectory()) walk(p);
    else if(exts.has(path.extname(e.name))){
      const txt = fs.readFileSync(p,"utf-8");
      if(disallowed.test(txt)) offenders.push(p);
    }
  }
}
walk(ROOT);

if(offenders.length){ console.error("❌ Mobirise artifacts detected in:", offenders); process.exit(2); }
console.log("✅ No Mobirise artifacts detected");
