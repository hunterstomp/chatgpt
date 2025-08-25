import fs from "fs";
import path from "path";
import YAML from "yaml";

const ROOT = path.join(process.cwd(), "src/pages/case-studies");
const FM_RE = /^---([\s\S]*?)---/;

function toArray(val) {
  if (Array.isArray(val)) return val;
  if (val == null || val === "") return [];
  // split csv-ish strings, trim empties
  return String(val).split(/[\n,;]+/).map(s=>s.trim()).filter(Boolean);
}

function normalizeText(s) {
  if (typeof s !== "string") return s;
  // normalize smart quotes + whitespace
  return s
    .replace(/[""]/g, '"')   // smart double quotes → "
    .replace(/['']/g, "'")   // smart single quotes → '
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeYaml(text) {
  const data = YAML.parse(text);

  // arrays that sometimes come mangled
  data.tags = toArray(data.tags);
  data.skills = toArray(data.skills);
  data.outcomes = toArray(data.outcomes).map(normalizeText);
  data.quotes = toArray(data.quotes).map(normalizeText);

  // gallery -> array of {src,alt,caption}
  if (data.gallery && !Array.isArray(data.gallery)) data.gallery = [data.gallery];
  if (Array.isArray(data.gallery)) {
    data.gallery = data.gallery
      .filter(Boolean)
      .map(g => {
        if (typeof g === "string") return { src: g.trim() };
        return {
          src: normalizeText(g.src || ""),
          alt: normalizeText(g.alt || ""),
          caption: normalizeText(g.caption || g.title || "")
        };
      })
      .filter(g => g.src);
  }

  // normalize strings
  ["title","client","role","summary","slug","date"].forEach(k=>{
    if (k in data && data[k]!=null) data[k] = String(data[k]).trim();
  });

  return YAML.stringify(data);
}

let changed = 0, scanned = 0;
if (!fs.existsSync(ROOT)) {
  console.error("❌ Folder not found:", ROOT);
  process.exit(1);
}

for (const name of fs.readdirSync(ROOT)) {
  if (!/\.(md|mdx)$/i.test(name)) continue;
  const full = path.join(ROOT, name);
  const src = fs.readFileSync(full, "utf8");
  const m = src.match(FM_RE);
  scanned++;
  if (!m) continue;

  const oldYaml = m[1];
  let newYaml;
  try {
    newYaml = normalizeYaml(oldYaml);
  } catch (e) {
    console.error("⚠️  YAML parse failed in", name, "-", e.message);
    continue;
  }

  if (oldYaml !== newYaml) {
    const out = `---\n${newYaml}---${src.slice(m[0].length)}`;
    fs.writeFileSync(full, out, "utf8");
    console.log("✅ Fixed frontmatter:", name);
    changed++;
  }
}

console.log(`✨ Frontmatter normalization complete. Scanned ${scanned}, changed ${changed}.`);
