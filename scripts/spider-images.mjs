/**
 * Q10UX Spider Images — one click:
 * - Reads .webarchive files from ./webarchives/*.webarchive
 * - Extracts HTML + resources via macOS `plutil`, falls back to fetching live pages
 * - Saves images to /public/assets/{about|case-studies/<slug>}
 * - Updates frontmatter `gallery: [{src,alt,caption}]` in src/pages/case-studies/*.md(x)
 *
 * Usage:
 *   node scripts/spider-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { JSDOM } from "jsdom";
import * as YAML from "yaml";
import pkg from "tiny-case";
const { kebabCase } = pkg;

const ROOT = process.cwd();
const WEBARCH = path.join(ROOT, "webarchives");
const CASE_DIR = path.join(ROOT, "src/pages/case-studies");
const PUB = path.join(ROOT, "public/assets");
const ABOUT_DIR = path.join(PUB, "about");
const CS_DIR = path.join(PUB, "case-studies");
const FM_RE = /^---([\s\S]*?)---\s*/;

const LIVE = "https://portfolio.q10ux.com";

const sleep = (ms)=> new Promise(r=>setTimeout(r,ms));

// --- utils
function ensureDir(p){ fs.mkdirSync(p, {recursive:true}); }
function safeName(urlOrFile){
  const base = path.basename(urlOrFile).split("?")[0].split("#")[0];
  return base.replace(/[^\w.\-]+/g,"-");
}
function guessAltFromSrc(src){
  const n = safeName(src).replace(/\.(webp|png|jpe?g|gif|svg)$/i,"");
  return n.replace(/[-_]+/g," ").trim();
}
function slugify(s){ return kebabCase(String(s||"").trim()) || "untitled"; }

function listFiles(dir, extRe){
  if(!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f=>extRe.test(f)).map(f=>path.join(dir,f));
}

async function fetchText(url){
  const res = await fetch(url,{headers:{'user-agent':'Q10UX-Spider/1.0'}});
  if(!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return await res.text();
}

async function fetchBuffer(url){
  const res = await fetch(url,{headers:{'user-agent':'Q10UX-Spider/1.0'}});
  if(!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// --- .webarchive -> HTML + resource map
function extractWebarchive(waFile){
  // plutil to XML, then pull WebMainResource + WebSubresources
  const xmlPath = waFile + ".xml";
  try{
    execSync(`plutil -convert xml1 -o "${xmlPath}" "${waFile}"`, {stdio:"pipe"});
  }catch(e){
    return null; // not macOS or plutil missing
  }
  const xml = fs.readFileSync(xmlPath,"utf8");
  fs.unlinkSync(xmlPath);
  // naive parses (good enough here)
  const mainRe = /<key>WebMainResource<\/key>[\s\S]*?<key>WebResourceData<\/key>\s*<data>([\s\S]*?)<\/data>[\s\S]*?<key>WebResourceURL<\/key>\s*<string>(.*?)<\/string>/;
  const subReG = /<dict>[\s\S]*?<key>WebResourceURL<\/key>\s*<string>(.*?)<\/string>[\s\S]*?<key>WebResourceData<\/key>\s*<data>([\s\S]*?)<\/data>[\s\S]*?<\/dict>/g;

  const m = xml.match(mainRe);
  if(!m) return null;
  const mainHtml = Buffer.from(m[1].replace(/\s+/g,""), "base64").toString("utf8");
  const mainUrl = m[2];

  const resources = new Map();
  let sm;
  while((sm = subReG.exec(xml))){
    const url = sm[1];
    const data = Buffer.from(sm[2].replace(/\s+/g,""), "base64");
    resources.set(url, data);
  }
  return { html: mainHtml, url: mainUrl, resources };
}

// write image buffer to disk and return public path
function writeImage(buf, outDir, originalUrl){
  ensureDir(outDir);
  const name = safeName(originalUrl);
  const out = path.join(outDir, name);
  fs.writeFileSync(out, buf);
  const pub = out.replace(PUB, "").replace(/\\/g,"/");
  return pub.startsWith("/") ? pub : "/"+pub;
}

// from DOM, collect images (screens + thumbs)
function collectImagesFromDom(html, baseHref){
  const dom = new JSDOM(html);
  const d = dom.window.document;
  const imgs = [...d.querySelectorAll("img")];
  // prefer significant images (hero, galleries)
  const ranked = imgs.map(img=>{
    const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
    const alt = (img.getAttribute("alt") || "").trim();
    const w = parseInt(img.getAttribute("width")||"0",10);
    const h = parseInt(img.getAttribute("height")||"0",10);
    const cls = img.className || "";
    let score = 0;
    if(/hero|banner|cover/i.test(cls+src)) score += 5;
    if(w*h >= 600*400) score += 3;
    if(/\.(png|jpe?g|webp)$/i.test(src)) score += 1;
    return {src, alt, score};
  }).filter(x=>x.src);
  // normalize to absolute URL
  const toAbs = (s)=>{
    if(/^https?:\/\//i.test(s)) return s;
    if(s.startsWith("//")) return "https:"+s;
    if(s.startsWith("/")) return LIVE + s;
    try{ return new URL(s, baseHref||LIVE).toString(); }catch{ return s; }
  };
  return ranked
    .sort((a,b)=>b.score-a.score)
    .map(r=>({ url: toAbs(r.src), alt: r.alt || guessAltFromSrc(r.src) }));
}

// update or insert gallery frontmatter in case study file
function updateCaseFrontmatter(file, gallery){
  const raw = fs.readFileSync(file,"utf8");
  const m = raw.match(FM_RE);
  const body = m ? raw.slice(m[0].length) : raw;
  const data = m ? (YAML.parse(m[1])||{}) : {};

  data.gallery = (gallery||[]).map(g=>({
    src: g.src,
    alt: g.alt || "",
    caption: g.caption || ""
  }));

  const out = `---\n${YAML.stringify(data)}---\n${body}`;
  fs.writeFileSync(file, out, "utf8");
}

// map a page title to an existing case study file by "slug likeness"
function findCaseFileByTitle(title){
  const slug = slugify(title).replace(/-case-study$/,"");
  const files = listFiles(CASE_DIR, /\.(md|mdx)$/i);
  const direct = files.find(f=> path.basename(f).toLowerCase().startsWith(slug));
  if (direct) return direct;
  // fuzzy: contains slug
  return files.find(f=> path.basename(f).toLowerCase().includes(slug)) || null;
}

// main
async function run(){
  ensureDir(CS_DIR); ensureDir(ABOUT_DIR);
  const waFiles = listFiles(WEBARCH, /\.webarchive$/i);

  if(waFiles.length===0){
    console.log("ℹ️  No .webarchive files found in ./webarchives. Falling back to live fetch.");
  }

  // seed list from webarchives or live portfolio
  const seeds = [
    { url: `${LIVE}/`, kind: "home", outDir: path.join(PUB, "hero"), titleHint: "Home" },
    { url: `${LIVE}/about.html`, kind: "about", outDir: ABOUT_DIR, titleHint: "About" },
    { url: `${LIVE}/case-studies.html`, kind: "hub", outDir: path.join(PUB,"cases-hub"), titleHint: "Case Studies" },
    // a few common slugs; script will extract more links from the hub if possible
    { url: `${LIVE}/tmobile-how-to-switch.html`, kind:"case" },
    { url: `${LIVE}/microsoft-office-365-new.html`, kind:"case" },
    { url: `${LIVE}/bmgf.html`, kind:"case" },
    { url: `${LIVE}/afx-ecommerce.html`, kind:"case" },
    { url: `${LIVE}/atmosfx-media-player.html`, kind:"case" },
    { url: `${LIVE}/disney-club-penguin.html`, kind:"case" },
  ];

  // Try to replace seeds with local .webarchive content when filenames match
  const byName = new Map(waFiles.map(f => [slugify(path.basename(f, ".webarchive")), f]));

  // Process each seed
  for (const seed of seeds){
    let html = "", base = seed.url, resMap = null;
    // if a matching webarchive exists, extract first
    const key = slugify(path.basename(seed.url).replace(/\.(html?)?$/i,"")) || seed.kind;
    const wa = byName.get(key);
    if (wa){
      console.log("🗂  Extracting from webarchive:", path.basename(wa));
      const out = extractWebarchive(wa);
      if(out){ html = out.html; base = out.url || base; resMap = out.resources; }
    }

    if(!html){
      try{
        console.log("🌐 Fetching live:", seed.url);
        html = await fetchText(seed.url);
        await sleep(200);
      }catch(e){
        console.warn("⚠️  Fetch failed", seed.url, e.message);
        continue;
      }
    }

    const images = collectImagesFromDom(html, base).slice(0, 24); // reasonable cap
    if(images.length===0){
      console.log("… no images detected on", seed.url);
      continue;
    }

    // determine destination and (for cases) target MD file
    if(seed.kind === "about"){
      ensureDir(ABOUT_DIR);
      const gallery = [];
      for(const im of images){
        try{
          let buf = resMap?.get(im.url);
          if(!buf) buf = await fetchBuffer(im.url);
          const pub = writeImage(buf, ABOUT_DIR, im.url);
          gallery.push({src: pub, alt: im.alt});
        }catch(e){ console.warn("img fail", im.url, e.message); }
      }
      // write a simple about hero set (optional: you can render this in about.mdx)
      const jsonPath = path.join(ABOUT_DIR, "images.json");
      fs.writeFileSync(jsonPath, JSON.stringify(gallery,null,2));
      console.log("✔ about images:", gallery.length);
    } else if(seed.kind === "case"){
      // pull a reasonable subset for hero + gallery
      const titleMatch = html.match(/<title>(.*?)<\/title>/i) || html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const title = titleMatch ? titleMatch[1].replace(/[\n\r]+/g," ").trim() : path.basename(seed.url);
      const caseFile = findCaseFileByTitle(title) || findCaseFileByTitle(seed.url) ;
      if(!caseFile){
        console.log("… no local case file matched for", title, "— skipping FM update (images still saved).");
      }

      const caseSlug = caseFile ? path.basename(caseFile).replace(/\.(md|mdx)$/i,"") : slugify(title);
      const outDir = path.join(CS_DIR, caseSlug);
      ensureDir(outDir);

      const gallery = [];
      for (const im of images){
        try{
          let buf = resMap?.get(im.url);
          if(!buf) buf = await fetchBuffer(im.url);
          const pub = writeImage(buf, outDir, im.url);
          gallery.push({src: pub, alt: im.alt});
        }catch(e){ console.warn("img fail", im.url, e.message); }
      }

      if(caseFile){
        updateCaseFrontmatter(caseFile, gallery);
        console.log("✔ updated gallery in", path.relative(ROOT, caseFile), "images:", gallery.length);
      } else {
        console.log("✔ saved images to", path.relative(ROOT, outDir));
      }
    } else if(seed.kind === "home" || seed.kind === "hub"){
      const heroDir = seed.outDir || path.join(PUB, seed.kind==="home"?"hero":"hub");
      ensureDir(heroDir);
      let c = 0;
      for (const im of images.slice(0,6)){
        try{
          let buf = resMap?.get(im.url);
          if(!buf) buf = await fetchBuffer(im.url);
          writeImage(buf, heroDir, im.url);
          c++;
        }catch(e){ console.warn("img fail", im.url, e.message); }
      }
      console.log(`✔ ${seed.kind} images:`, c);
    }
  }

  console.log("\n✨ Spider complete: images linked and galleries written where matched.");
  console.log("If any case didn't match, rename the .md/.mdx to include a recognizable piece of its title and rerun.");
}
run().catch(err=>{ console.error(err); process.exit(1); });
