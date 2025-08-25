import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const ROOT = "src/pages/case-studies";
const FM = /^---([\s\S]*?)---/;

const items = [];
for (const f of fs.readdirSync(ROOT).filter(n=>/\.(md|mdx)$/i.test(n))) {
  const full = path.join(ROOT, f);
  const m = fs.readFileSync(full,"utf8").match(FM);
  if (!m) continue;
  const fm = YAML.parse(m[1]) || {};
  const slug = fm.slug || f.replace(/\.(md|mdx)$/i,"");
  items.push({
    title: fm.title || slug,
    client: fm.client || "",
    href: `/case-studies/${slug}/`,
    year: fm.date || ""
  });
}
items.sort((a,b)=>(String(b.year).localeCompare(String(a.year))));

const astro = `---
export const entries = ${JSON.stringify(items, null, 2)};
---

<nav class="relative">
  <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
    {entries.map(e => (
      <li class="rounded-lg bg-white/5 hover:bg-white/10 transition">
        <a class="block p-3" href={e.href}>
          <p class="text-sm opacity-70">{e.client}</p>
          <p class="font-medium">{e.title}</p>
          {e.year && <p class="text-xs opacity-60 mt-0.5">{e.year}</p>}
        </a>
      </li>
    ))}
  </ul>
</nav>
`;

fs.writeFileSync("src/components/CaseStudyNavigation.astro", astro, "utf8");
console.log("✔ CaseStudyNavigation.astro rebuilt");
