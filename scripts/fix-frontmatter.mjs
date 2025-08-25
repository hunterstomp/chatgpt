import fs from "fs";
import path from "path";
import YAML from "yaml";

// Where your case studies live
const ROOT = path.join(process.cwd(), "src/pages/case-studies");

function normalizeYaml(yamlText) {
  try {
    const data = YAML.parse(yamlText);
    // force gallery to be array
    if (data.gallery && !Array.isArray(data.gallery)) {
      data.gallery = [data.gallery];
    }
    // force tags to array
    if (data.tags && !Array.isArray(data.tags)) {
      data.tags = String(data.tags).split(/[, ]+/).filter(Boolean);
    }
    return YAML.stringify(data);
  } catch (err) {
    console.error("⚠️ YAML parse failed, leaving original", err.message);
    return yamlText;
  }
}

for (const file of fs.readdirSync(ROOT)) {
  if (!file.match(/\.mdx?$/)) continue;
  const full = path.join(ROOT, file);
  const text = fs.readFileSync(full, "utf8");
  const match = text.match(/^---([\s\S]*?)---/);
  if (!match) continue;

  const oldYaml = match[1];
  const newYaml = normalizeYaml(oldYaml);

  if (oldYaml !== newYaml) {
    const fixed = `---\n${newYaml}---${text.slice(match[0].length)}`;
    fs.writeFileSync(full, fixed, "utf8");
    console.log("✅ Fixed frontmatter:", file);
  }
}
console.log("✨ Frontmatter normalization complete.");
