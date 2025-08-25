# 2025-08-24 Phase Notes (feat/astro-mvp)

## Current Status
- ✅ Repo initialized on branch `feat/astro-mvp`
- ✅ Command Pack hoisted to root (`scripts/`, `ops/`, `docs/`, `styleguide/`)
- ✅ `git-phase.sh` checkpoints working
- ✅ Mobirise guard + image optimize/remap scripts working
- ✅ Symlink loop removed from `public/mamp-images`
- ✅ A11y sanity script added (ignores tuned later)
- ✅ Astro build **successful** with routes:
  - `/`
  - `/about/`
  - `/contact/`
  - `/case-studies/`
  - `/case-studies/atmosfx-ecommerce/`

## Known Adjustments
- MDX quirks → `atmosfx-ecommerce` case study switched to `.md` (safe)
- Mobirise guard ignores `archive/` + old T-Mobile case study
- A11y check is noisy (node_modules, archive) → added ignore patterns

## Outstanding Vulnerabilities
- `npm audit` shows **7 moderate/low**, requires upgrading Astro/vite/esbuild.
- **Decision:** ignore for MVP, patch in a future branch.

## Next MVP Moves
1. **Add 2 more case studies**  
   - Copy `templates/case-study.mdx` → `microsoft-liveworkspace.md`, `tmobile-how-to-switch.md`  
   - Fill `title`, `slug`, `summary`, drop 1–2 images under `/public/assets/case-studies/<slug>/`
2. **Ensure tokens are global**  
   - In `src/layouts/BaseLayout.astro` →  
     ```html
     <link rel="stylesheet" href="/styleguide/tokens.css">
     ```
3. **Basic SEO meta**  
   - Add `<title>` + `<meta name="description">` in `index.astro` (and optionally each page)

## Commit Rhythm
- After each chunk:
  ```bash
  npm run phase "content: +2 case studies"
  npm run build
  npm run phase "build: mvp content update"
  ```

## Stop Conditions (when Cursor must ask user)
- Deleting/moving large dirs without backup
- Introducing new frameworks/deps
- A11y/Lighthouse dropping below targets
- Any attempt to reintroduce Mobirise markup
