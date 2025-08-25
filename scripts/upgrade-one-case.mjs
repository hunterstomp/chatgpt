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
  title: data.title || "Case Study",
  client: data.client || "Client",
  role: data.role || "UX Designer",
  year: data.year || data.date || "2020",
  kpi: data.kpi || "Improved user experience and engagement",
  summary: data.summary || "UX case study with measurable outcomes.",
  tags: Array.isArray(data.tags) ? data.tags : (data.tags ? String(data.tags).split(/[;,]\s*|\n+/).filter(Boolean) : ["UX", "Design", "Research"]),
  outcomes: [
    "Improved user experience and engagement",
    "Enhanced visual design and accessibility", 
    "Streamlined user workflows and processes"
  ],
  gallery: Array.isArray(data.gallery) ? data.gallery : []
};

// opinionated starter sections (you can edit later)
const md = `
---
${YAML.stringify(fm)}---
## Objective
Create an engaging user experience that addresses specific user needs and business goals.

## My Role
Led UX design and research: user research, wireframing, prototyping, and visual design. Collaborated with stakeholders and development teams.

## Constraints
Timeline, technical limitations, and accessibility requirements.

## Process
1. **User Research** → understanding user needs and pain points
2. **Information Architecture** → organizing content and functionality
3. **Wireframing & Prototyping** → creating interactive prototypes
4. **Visual Design** → high-fidelity designs and design systems
5. **Testing & Iteration** → user testing and design refinement

## Results
- Improved user satisfaction and task completion rates
- Enhanced accessibility and usability
- Streamlined workflows and processes

${body ? "\n---\n\n<!-- Original body migrated below; review/edit as needed. -->\n\n" + body : ""}
`.trimStart();

fs.writeFileSync(file, md, "utf8");
console.log("✅ Upgraded:", file);
