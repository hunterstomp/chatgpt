import fs from "node:fs";
import path from "node:path";

const ROOTS = ["src/pages"];
const BAD_EXT = [/\.bak$/i, /\.tmp$/i, /~$/];
let offenders = [];

function walk(dir){
  for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (BAD_EXT.some(rx => rx.test(e.name))) offenders.push(p);
  }
}
ROOTS.forEach(walk);

if (offenders.length) {
  console.error("❌ Orphan backup files found:");
  offenders.forEach(f => console.error(" -", f));
  process.exit(2);
}
console.log("✅ No orphan backups in src/pages");
