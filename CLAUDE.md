# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static multi-page website for **Blissful Living Solutions LLC**, a non-medical home care agency based in Lemont, IL. Deployed via GitHub Pages at `www.blissfullivingsolutions.com` using a Bun + Vite build system with GitHub Actions.

## Development Commands

```bash
bun run dev      # Start local dev server with HMR (localhost:5173)
bun run build    # Production build → dist/
bun run preview  # Preview the production build locally
```

There is no linting or test runner configured — do not attempt `bun run lint` or `bun run test`.

## Build System

**Bun + Vite 5** — `vite.config.js` sets `base: '/'` and defines two HTML entry points (`index.html` and `privacy-policy.html`) via `rollupOptions.input`. All pages must be registered here for Vite to bundle them.

GitHub Actions (`.github/workflows/deploy.yml`) handles CI/CD:
- Trigger: push to `main` or manual dispatch
- Build flow: checkout → configure Pages → setup Bun → `bun install` → `bun run build` → verify `dist/` → upload Pages artifact → deploy to GitHub Pages
- Uses `actions/checkout@v5`, `actions/configure-pages@v5`, `oven-sh/setup-bun@v2`, `actions/upload-pages-artifact@v4`, `actions/deploy-pages@v4`

**⚠️ One-time manual step**: GitHub repo Settings → Pages → Source must be set to **"GitHub Actions"** (not "Deploy from a branch") for the workflow to succeed.

## Environment Variables

`VITE_GA_MEASUREMENT_ID` is the only env var. Copy `.env.example` to `.env` and fill in the GA4 Measurement ID. Vite bakes it into the bundle at build time — it is **not** a runtime variable.

- In JS modules: `import.meta.env.VITE_GA_MEASUREMENT_ID`
- In HTML files: `%VITE_GA_MEASUREMENT_ID%` (Vite replaces this in the `<script src>` tag)
- In GitHub Actions: stored as a repository secret and passed via `env:` on the build step

If the variable is absent, all analytics and the cookie banner are silently disabled — safe to deploy without it.

## Project Structure

```
/
├── index.html             # Main single-page entry (Vite reads this)
├── privacy-policy.html    # Second Vite entry point — imports src/main.js for CSS
├── vite.config.js
├── package.json
├── .env.example           # Copy to .env; only VITE_GA_MEASUREMENT_ID needed
├── public/                # Copied verbatim to dist/ — do NOT put src assets here
│   ├── CNAME              # Custom domain — critical, must stay here
│   ├── favicon.ico
│   └── img/
├── src/
│   ├── main.js            # JS entry; imports CSS and initialises all features
│   ├── analytics.js       # GA4 module — loads only after consent
│   ├── consent-banner.js  # Cookie banner UI and localStorage persistence
│   └── styles/
│       ├── main.css       # Imports only (no styles here)
│       ├── base.css       # CSS custom properties (tokens), reset, typography
│       ├── layout.css     # Header, footer, nav, grids, containers
│       ├── components.css # Buttons, cards, forms, accordion, pathway/estimator/checklist
│       ├── sections.css   # Section-specific styles (hero, services, quality, etc.)
│       └── consent.css    # Cookie banner styles (z-index 150)
└── .claude/rules/
    ├── brand.md           # Full brand identity guide — read before any design work
    └── analytics.md       # GA4 consent mode architecture — read before touching analytics
```

## Architecture

All content is in `index.html` as a single scrollable page with anchor-linked sections: `#home`, `#why-us`, `#services`, `#who-we-help`, `#quality`, `#service-area`, `#how-it-works`, `#features`, `#resources`, `#careers`, `#contact`.

**`src/main.js`** — `init*` functions called on `DOMContentLoaded`: `initMobileNav` (full-screen overlay, body scroll lock, Escape key), `initScrollHeader` (`.scrolled` class at 60px), `initSmoothScroll` (header-offset anchor scroll), `initActiveNav` (IntersectionObserver, rootMargin `-15% 0px -75% 0px`), `initScrollReveal` (`.reveal` / `.reveal-stagger` → `.revealed`), `initPathwayExplorer` (tab switcher), `initCostEstimator` (`HOURLY_RATE = 32`, updates `--range-pct` CSS var via `slider.style.setProperty`), `initAccordion` (uses `aria-expanded` + `.active` class on content), `initContactForm` (redirects to `mailto:` URI via `window.location.href` — no backend), `initConsentBanner` (shows cookie banner on first visit; auto-loads GA if previously accepted), `initCookiePrefsButtons` (wires `[data-cookie-prefs]` elements to reopen the banner).

**Analytics** (Advanced Consent Mode) — see `.claude/rules/analytics.md` for full detail. The static gtag.js `<script>` block lives at the top of `<head>` in both HTML files so GA's validator can detect it. `analytics_storage` is denied by default; `src/analytics.js:initGA()` upgrades consent and activates event tracking only after the user accepts.

**Image layout patterns** (in `sections.css`):
- `.hero-layout` — 2-col grid on ≥900px (text | photo); image hidden on mobile
- `.section-photo` — full-width banner photo with `object-fit: cover`; used in Who We Help
- `.careers-layout` — 2-col grid on ≥768px (photo | card); stacks on mobile

**CSS design conventions:**
- Icons use `--color-primary-light` background / `--color-primary` stroke — never `--color-accent`. Amber (`--color-accent`) is reserved for secondary CTA buttons (`btn-accent`) and footer headings only.
- Accordion open/close is animated via `max-height: 0 → 1000px` + `padding-bottom` transition (not `display: none/block`, which cannot be transitioned).
- Scroll reveal: `.reveal` for single elements, `.reveal-stagger` for grids — JS adds `.revealed` class via IntersectionObserver at 8% threshold; CSS handles the staggered delays.

**Adding a new page** — register it in `vite.config.js` `rollupOptions.input`, add the gtag consent block to its `<head>` (copy from `index.html`), and import `src/main.js` so it gets the bundled CSS and consent banner wiring.

**`public/CNAME`** — Must contain `www.blissfullivingsolutions.com`. If this file disappears from `dist/`, the custom domain breaks on the next deploy.

## Brand

See `.claude/rules/brand.md` for the full brand identity. Key tokens:
- Primary: `#2D6A6A` (Deep Slate Teal)
- Accent: `#D4923A` (Warm Amber)
- Background: `#FAF7F0` (Warm Ivory)
- All defined as CSS custom properties in `src/styles/base.css`

## Deployment Notes / Troubleshooting

- GitHub Pages must remain configured as **Settings → Pages → Source → GitHub Actions**
- `public/CNAME` must remain present so the custom domain persists after deploys
- `VITE_GA_MEASUREMENT_ID` must be set as a GitHub Actions secret or GA will be silently disabled in production
- The production build must output a valid `dist/index.html`
- If Pages deploy fails with a misleading `404`, verify the workflow still includes:
  - `actions/configure-pages`
  - `actions/upload-pages-artifact`
  - `actions/deploy-pages`
  - top-level permissions for `contents: read`, `pages: write`, and `id-token: write`

## Pending Items (commented out in code)

Several blocks are commented out awaiting the IDPH license **number** (approval received, number in mail):
- Phone number in hero, contact section, footer, and schema.org structured data
- Physical street address (city/ZIP shown only)
- IDPH license number in quality section and footer
- Meta description update from "licensing pending" to "licensed"
- Trust signal update in hero

When license number arrives: search for `<!-- ` comments containing `tel:`, `License No.`, and the street address placeholder.
