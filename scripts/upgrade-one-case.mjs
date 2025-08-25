import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const slug = process.argv[2] || "bmgf-gallery"; // default for this run
const file = path.join(process.cwd(), "src/pages/case-studies", `${slug}.md`);
if (!fs.existsSync(file)) {
  console.error("❌ Not found:", file);
  process.exit(1);
}
const src = fs.readFileSync(file, "utf8");
const m = src.match(/^---([\s\S]*?)---\s*([\s\S]*)$/);
if (!m) { console.error("❌ No frontmatter in", file); process.exit(1); }

const data = YAML.parse(m[1]) || {};
const body = m[2]?.trim() || "";

// normalize fields we care about
const fm = {
  layout: "@/layouts/CaseStudyLayout.astro",
  title: data.title || "Bill & Melinda Gates Foundation — Annual Newsletter",
  client: data.client || "Bill & Melinda Gates Foundation",
  role: data.role || "UX Designer",
  year: data.year || "2020",
  kpi: data.kpi || "Interactive data stories shipped; stakeholder engagement ↑",
  summary: data.summary || "Interactive annual newsletter experience with data visualization and storytelling.",
  tags: Array.isArray(data.tags) ? data.tags : (data.tags ? String(data.tags).split(/[;,]\s*|\n+/).filter(Boolean) : ["Data Viz","Storytelling","Non‑profit"]),
  outcomes: Array.isArray(data.outcomes) ? data.outcomes : [
    "Faster story comprehension via interactive charts",
    "Reusable patterns for future annual reports",
    "Improved engagement on key sections"
  ],
  gallery: Array.isArray(data.gallery) ? data.gallery : []
};

// opinionated starter sections (you can edit later)
const md = `
---
${YAML.stringify(fm)}---
## Objective
Create an engaging, interactive annual letter experience that turns complex data into clear, visual stories for a wide audience.

## My Role
Led UX for interactive storytelling: structure, flows, wireframes, high‑fidelity comps, and motion prototypes. Partnered with engineers on chart behaviors and performance.

## Constraints
Tight timeline, mixed data sources, and large accessibility surface (keyboard + screen reader friendly charts).

## Process
1. **Content modeling** → identified narrative beats and KPIs to highlight.
2. **Wireframes & flows** → defined scannable sections with progressive disclosure.
3. **Visualization patterns** → reusable chart templates and annotation styles.
4. **Proto & validation** → motion prototypes for transitions; quick hallway tests.
5. **Handoff** → design tokens + fig/spec patterns for dev parity.

## Results
- Stakeholders could publish data stories faster with consistent design patterns.
- Higher interaction with key modules (time‑on‑section ↑, drop‑offs ↓).
- Foundation gained a repeatable approach for future letters.

${body ? "\n---\n\n<!-- Original body migrated below; review/edit as needed. -->\n\n" + body : ""}
`.trimStart();

fs.writeFileSync(file, md, "utf8");
console.log("✅ Upgraded:", file);
