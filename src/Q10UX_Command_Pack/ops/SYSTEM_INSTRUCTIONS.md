
# SYSTEM_INSTRUCTIONS.md — Q10UX Canonical Rules (Pin in Cursor)

**CANONICAL SOURCE:** `/Users/quentstyle/Pictures/_0_Q10UXPortfolioStaging/New stage/chatgpt/src`
**REFERENCE ONLY:** `/Applications/MAMP/htdocs/Q10UXPortfolio` (Mobirise). Copy *content* only; never re-import markup/CSS/JS.

Non‑negotiables:
- Preserve shared components: Header, Footer, Nav, Breadcrumbs, SocialIcons. Edit single source only.
- Capsule CTAs are rigid; variants change tokens only.
- Colors come from `styleguide/tokens.css` (derived from Q10 card). No new colors.
- A11y: WCAG 2.2 AA, skip‑link, focus-visible, alt text, proper heading order.
- Perf: lazy images, decoding=async, preload hero fonts, preconnect font hosts.
- SEO: title/description per page, OG/Twitter, canonical, sitemap/robots.
- Mobirise guard: Reject diffs that add Mobirise classes/assets.
- After each change: print “✅ Done / ⏭ Next” + list of files touched.
