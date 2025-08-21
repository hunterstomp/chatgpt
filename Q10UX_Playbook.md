# Q10UX Playbook (Option C: Hybrid Markdown + YAML)
**Version:** 1.0  
**Owner:** Quent (Q10 UX Design)  
**Scope:** This playbook governs **all code/content** in the Q10UX portfolio site. It's optimized for **high-contrast, accessible, Mobirise‑free** output and **repeatable workflows in Cursor**.

---

## 0) Brand System (Accessible-First)
### Typography
- **H1:** Inter **Bold** · 72px/1.05 · letter-spacing: -0.015em
- **Hero subtitle:** SF Pro **Semibold** · 20px/1.4
- **H2:** Manrope **Semibold** · 40–48px/1.2
- **H3:** Permanent Marker · 28–32px/1.2 (sparingly, for headings/callouts)
- **Body:** Inter Regular 16–18px/1.55
- **Monospace (code):** JetBrains Mono or SF Mono 14–16px/1.5
- **Rules:**
  - Always set **system fallbacks**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
  - Don’t hardcode pixel sizes for mobile; use `clamp()` when possible.

### Color & Contrast (AA/AAA targets)
- **Neutral:** `--bg: #0B0B0B`, `--surface: #141414`, `--text: #FFFFFF`
- **Accents (AA on dark):**  
  - `--accent-1: #00E5FF` (cyan)  
  - `--accent-2: #FF3366` (magenta-red)  
  - `--accent-3: #FFD166` (warm yellow)
- **Borders / Muted:** `--muted: #2A2A2A`, `--muted-text: #C9C9C9`
- Ensure **contrast ≥ 4.5:1 for body** and **≥ 3:1 for large text**. Never rely on color alone.

### Spacing & Grid
- Base unit: **8px** (use multiples).
- Content max width: **1200–1320px**.
- Section padding: **clamp(32px, 6vw, 96px)**.

---

## 1) HTML/CSS Baseline (High-Contrast Starter)
Create `src/styles/q10ux.css` with these primitives:

```css
:root {
  --bg:#0B0B0B; --surface:#141414; --text:#FFFFFF;
  --accent-1:#00E5FF; --accent-2:#FF3366; --accent-3:#FFD166;
  --muted:#2A2A2A; --muted-text:#C9C9C9;
  --radius: 16px; --shadow: 0 8px 24px rgba(0,0,0,.35);
}

* { box-sizing:border-box }
html { scroll-behavior:smooth }
body {
  margin:0; color:var(--text); background:var(--bg);
  font: 16px/1.55 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility;
}
a { color: var(--accent-1); text-decoration: none }
a:focus, button:focus { outline: 2px solid var(--accent-2); outline-offset: 2px }
img { max-width:100%; height:auto; }

.container { width:min(1320px, 92vw); margin-inline:auto }
.section { padding: clamp(32px, 6vw, 96px) 0 }

/* Headings */
h1{ font-weight:800; font-size: clamp(40px, 7vw, 72px); line-height:1.05; letter-spacing:-0.015em }
h2{ font-weight:600; font-family: Manrope, Inter, system-ui, sans-serif; font-size:clamp(28px,5vw,48px); line-height:1.2 }
h3{ font-family:"Permanent Marker", system-ui, sans-serif; font-size:clamp(22px,3.5vw,32px); line-height:1.2 }

/* Cards & Surfaces */
.card { background: var(--surface); border:1px solid var(--muted); border-radius: var(--radius); box-shadow: var(--shadow) }
.card.pad { padding: 24px }

/* Buttons */
.btn {
  display:inline-flex; align-items:center; gap:.6rem;
  padding:.8rem 1.1rem; border-radius: 999px;
  color:#000; background: var(--accent-1); font-weight:700;
}
.btn.secondary { background: var(--accent-2) }
.btn.ghost { background: transparent; border:1px solid var(--muted); color: var(--text) }

/* Skip Link */
.skip-link {
  position:absolute; left:-9999px; top:auto; width:1px; height:1px; overflow:hidden;
}
.skip-link:focus {
  position:fixed; left:12px; top:12px; width:auto; height:auto;
  padding:.6rem 1rem; background:#000; color:#fff; z-index:9999; border-radius:8px;
}

/* Visually Hidden (for aria-describedby etc.) */
.visually-hidden { 
  position:absolute!important; height:1px; width:1px; overflow:hidden; clip: rect(1px, 1px, 1px, 1px);
  white-space:nowrap; border:0; padding:0; margin:-1px;
}
```

Also ship a base `src/index.html` that includes `lang`, `<meta>` tags, and a **Skip to content** link.

---

## 2) Accessibility Rules (WCAG 2.1 AA+)
- **Icon-only links MUST have aria-label.** Example:  
  `<a href="mailto:design@q10ux.com" aria-label="Email Quent (opens mail app)">…</a>`
- **Keyboard-first:** Every interactive element reachable via `Tab`; visible focus states.
- **Headings:** One `<h1>` per page. Descend semantically (`h2` → `h3`).
- **Media:** Provide `alt` text for non-decorative images. Use `<figure><figcaption>` for case study visuals with context.
- **Motion:** Reduce motion if `prefers-reduced-motion` is set; avoid parallax that impairs readability.
- **Color:** Never rely on color to convey state; include text/shape.
- **Forms:** Associate `<label>` with inputs. Provide error messages and aria-live for validation.

---

## 3) SEO/Metadata
- `<title>` ≤ 60 chars; `<meta name="description" content="150–160 chars">`
- Canonical URL on all pages.
- **OpenGraph/Twitter** tags per page with real content (no lorem).  
- Structured data (JSON-LD) for **Person/CreativeWork** on case studies (author = Quent / Q10 UX Design).

---

## 4) Performance
- Use modern formats: **AVIF/WEBP** for images with PNG fallbacks if transparency is needed.
- Lazy load non-critical images (`loading="lazy"`).
- Preload critical fonts and use `font-display: swap`.
- Purge unused CSS. Bundle & minify JS; avoid large dependencies where possible.
- Avoid layout shift: specify `width`/`height` or aspect-ratio.

---

## 5) Information Architecture
**Site sections:**
- Home (hero, value prop, featured case studies)
- Case Studies (grid, filters, tags)
- Case Study Detail (problem → process → outcomes → artifacts → credits)
- About (bio, philosophy, tools)
- Contact (direct email, socials with aria-labels)

**Case Study Skeleton:**
1. **Hero** (title, role, timeframe, tools)  
2. **Problem** (context, constraints)  
3. **Approach** (methods, artifacts)  
4. **Outcomes** (metrics, impact)  
5. **Gallery** (flows, boards, video/lightbox)  
6. **Downloads** (PDF/ZIP), Credits & NDA note

---

## 6) Code Standards
- Semantic HTML5 only. No Mobirise fragments/branding/classes.
- Componentize shared pieces (`/partials/header.html`, `/partials/footer.html`, `/partials/social.html`).
- Add `aria-label` to **all** icon-only links (phone, email, resume).  
- Class naming: utility-first + component BEM-like (`.cs-card`, `.cs-gallery`, `.u-mt-24`).
- JS: ES modules; no global leaks; use `data-` attributes for hooks.

---

## 7) Build & Local Dev
- Directory layout (MAMP-ready, no DB):
```
/src
  /assets/{img,video,fonts}
  /partials/{header.html,footer.html,nav.html,social.html}
  /styles/q10ux.css
  /scripts/{app.js, gallery.js}
  index.html
  case-studies/{slug}/index.html
```
- Use `live-server` or `vite` for hot reload. Ship npm scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"
  }
}
```

---

## 8) Cursor Usage — Golden Prompts
**Global System Prompt (place in Cursor when editing):**
> You are a senior front-end engineer. Enforce Q10UX Playbook rules: high contrast dark theme, Inter/Manrope/Permanent Marker typography, aria-labels on icon-only links, semantic HTML5, WCAG 2.1 AA, no Mobirise classes or branding, SEO/OG tags, performance optimizations. Never use lorem ipsum; if content is missing, synthesize professional copy relevant to Q10UX’s portfolio.

**Task Prompt Examples:**
- “Refactor `case-studies/t-mobile/index.html` to match the Case Study Skeleton and add OG tags; ensure all icons have aria-labels; import `styles/q10ux.css`.”
- “Create `/partials/header.html` + `/partials/footer.html`; wire them into all pages; add skip-link and visible focus states.”
- “Write JSON-LD schema for a case study.”

---

## 9) QA Checklists
**A11y Quick Pass:**
- [ ] Tab order sane; focus visible  
- [ ] All icons have aria-label  
- [ ] Headings descend semantically  
- [ ] Alt text present and meaningful  
- [ ] Contrast meets AA  

**SEO Quick Pass:**
- [ ] Unique title/meta on each page  
- [ ] Canonical + OG/Twitter tags  
- [ ] JSON-LD where relevant  

**Perf Quick Pass:**
- [ ] Images optimized & lazy  
- [ ] Fonts preloaded + swap  
- [ ] Minified CSS/JS; no unused CSS bloats

---

## 10) Credits
- Typography: Inter, Manrope, Permanent Marker  
- Author Credit: **Quent (Q10 UX Design)**  
- License: Internal, non-commercial reuse allowed within Q10UX portfolio
