import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const ROOT = "src/pages/case-studies";
const FM = /^---([\s\S]*?)---/;

const files = fs.readdirSync(ROOT).filter(n => /\.(md|mdx)$/i.test(n));
let updated = 0;

for (const name of files) {
  const full = path.join(ROOT, name);
  const src = fs.readFileSync(full, "utf8");
  const m = src.match(FM);
  if (!m) continue;

  const fmText = m[1];
  const body = src.slice(m[0].length);
  let data = YAML.parse(fmText) || {};

  // find first gallery image
  let firstImg = "";
  const gallery = Array.isArray(data.gallery) ? data.gallery : [];
  for (const g of gallery) {
    const s = (typeof g === "string" ? g : g?.src) || "";
    if (s) { firstImg = s; break; }
  }

  // add hero if missing
  if (!data.hero && firstImg) {
    data.hero = { image: firstImg, alt: data.title || "", overlay: 65 };
  }

  // add stats (only fill blanks)
  data.stats = Array.isArray(data.stats) ? data.stats : [];
  const have = new Set(data.stats.map(s => (s?.label || "").toLowerCase()));

  const addIfMissing = (label, value) => {
    if (!value || have.has(label.toLowerCase())) return;
    data.stats.push({ label, value });
    have.add(label.toLowerCase());
  };

  addIfMissing("Role", data.role || "UX Designer");
  addIfMissing("Duration", data.date ? String(data.date) : "");
  if (data.impact) addIfMissing("Impact", String(data.impact));

  // add CTAs (non‑destructive)
  data.ctas = Array.isArray(data.ctas) ? data.ctas : [];
  const hasScroll = data.ctas.some(c => (c?.href || "").startsWith("#process"));
  if (!hasScroll) data.ctas.push({ label: "Scroll to Process", href: "#process", kind: "secondary" });
  if (data.video && !data.ctas.some(c => c.href === data.video)) {
    data.ctas.unshift({ label: "Watch Video", href: data.video });
  }

  const out = `---\n${YAML.stringify(data)}---${body}`;
  if (out !== src) {
    fs.writeFileSync(full, out, "utf8");
    console.log("✔ updated", name);
    updated++;
  }
}

console.log(`\nDone. ${updated}/${files.length} files updated.`);
