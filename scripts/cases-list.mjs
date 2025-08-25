// scripts/cases-list.mjs
import fs from "node:fs";
import path from "node:path";

const CASE_DIR = path.join(process.cwd(), "src", "pages", "case-studies");

function readFrontmatter(filePath) {
  const txt = fs.readFileSync(filePath, "utf-8");
  const m = txt.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const yaml = m[1];
  const out = {};
  for (const line of yaml.split("\n")) {
    const kv = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*)\s*$/);
    if (!kv) continue;
    const key = kv[1];
    let val = kv[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

if (!fs.existsSync(CASE_DIR)) {
  console.error("Missing case-studies dir:", CASE_DIR);
  process.exit(1);
}

const files = fs.readdirSync(CASE_DIR)
  .filter(f => f.endsWith(".md"))
  .sort();

console.log("#  Status     Slug                       Title");
console.log("-".repeat(80));
files.forEach((f,i)=>{
  const fp = path.join(CASE_DIR,f);
  const fm = readFrontmatter(fp);
  const status = (fm.status||"draft").toLowerCase();
  const badge = status==="published" ? "✅ pub" : status==="hidden" ? "🙈 hid" : "📝 drf";
  console.log(String(i+1).padStart(2," "), badge.padEnd(9), (fm.slug||f).padEnd(25), fm.title||"(no title)");
});

console.log("\nTip: run `npm run approve` to flip statuses interactively.");
