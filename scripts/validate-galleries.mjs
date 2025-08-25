import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASE_DIR = "src/pages/case-studies";
const PUB = "public";

let bad = 0;

for (const f of fs.readdirSync(CASE_DIR).filter(x => x.endsWith(".md"))) {
  const p = path.join(CASE_DIR, f);
  const txt = fs.readFileSync(p, "utf-8");
  
  const m = txt.match(/gallery:\s*\n([\s\S]*?)(\n[a-z]|$)/i);
  if (!m) continue;
  
  const lines = m[1].split("\n").map(s => s.trim()).filter(Boolean);
  
  for (const line of lines) {
    const sm = line.match(/src:\s*"(.*?)"/);
    if (!sm) continue;
    
    const rel = sm[1].replace(/^\/+/, ""); // strip leading slash
    const file = path.join(PUB, rel);
    
    if (!fs.existsSync(file)) {
      console.log(`❌ ${f}: ${rel}`);
      bad++;
    }
  }
}

console.log(bad ? `\n${bad} missing asset(s)` : "✅ All gallery assets found");
process.exit(bad ? 1 : 0);
