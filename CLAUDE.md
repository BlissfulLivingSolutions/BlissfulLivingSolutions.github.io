# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static single-page website for **Blissful Living Solutions LLC**, a non-medical home care agency based in Lemont, IL. Deployed via GitHub Pages at `www.blissfullivingsolutions.com` using a Bun + Vite build system with GitHub Actions.

## Development Commands

```bash
bun run dev      # Start local dev server with HMR (localhost:5173)
bun run build    # Production build → dist/
bun run preview  # Preview the production build locally
```

## Build System

**Bun + Vite 5** — `package.json` defines the scripts; `vite.config.js` sets `base: '/'`, which is correct for this site because it is served from the domain root (custom domain on the GitHub Pages site), not from a repository subpath.

GitHub Actions (`.github/workflows/deploy.yml`) handles CI/CD:
- Trigger: push to `main` or manual dispatch
- Build flow: checkout → configure Pages → setup Bun → `bun install` → `bun run build` → verify `dist/` → upload Pages artifact → deploy to GitHub Pages
- Uses `actions/checkout@v5`, `actions/configure-pages@v5`, `oven-sh/setup-bun@v2`, `actions/upload-pages-artifact@v4`, `actions/deploy-pages@v4`

**⚠️ One-time manual step**: GitHub repo Settings → Pages → Source must be set to **"GitHub Actions"** (not "Deploy from a branch") for the workflow to succeed.

## Project Structure

```
/
├── index.html             # Single-page entry point (Vite reads this)
├── vite.config.js
├── package.json
├── public/                # Copied verbatim to dist/ — do NOT put src assets here
│   ├── CNAME              # Custom domain — critical, must stay here
│   ├── favicon.ico
│   └── img/
│       ├── logo.png
│       ├── hero_image.png           # Hero section right-column photo
│       ├── enjoying_the_park_image.png  # Who We Help banner photo
│       └── work_for_us_image.png    # Careers section photo
├── src/
│   ├── main.js            # JS entry; imports CSS and initialises all features
│   └── styles/
│       ├── main.css       # Imports only (no styles here)
│       ├── base.css       # CSS custom properties (tokens), reset, typography
│       ├── layout.css     # Header, footer, nav, grids, containers
│       ├── components.css # Buttons, cards, forms, accordion, pathway/estimator/checklist
│       └── sections.css   # Section-specific styles (hero, services, quality, etc.)
└── .claude/rules/
    └── brand.md           # Full brand identity guide — read before any design work
```

## Architecture

All content is in `index.html` as a single scrollable page with anchor-linked sections: `#home`, `#why-us`, `#services`, `#who-we-help`, `#quality`, `#service-area`, `#how-it-works`, `#features`, `#resources`, `#careers`, `#contact`.

**`src/main.js`** — Ten `init*` functions called on `DOMContentLoaded`: `initBanner` (licensing notice dismiss), `initMobileNav` (full-screen overlay, body scroll lock, Escape key), `initScrollHeader` (`.scrolled` class at 60px), `initSmoothScroll` (header-offset anchor scroll), `initActiveNav` (IntersectionObserver, rootMargin `-15% 0px -75% 0px`), `initScrollReveal` (`.reveal` / `.reveal-stagger` → `.revealed`), `initPathwayExplorer` (tab switcher), `initCostEstimator` (`HOURLY_RATE = 32`, updates `--range-pct` CSS var), `initAccordion`, `initContactForm` (`mailto:` — no backend).

**Image layout patterns** (in `sections.css`):
- `.hero-layout` — 2-col grid on ≥900px (text | photo); image hidden on mobile
- `.section-photo` — full-width banner photo with `object-fit: cover`; used in Who We Help
- `.careers-layout` — 2-col grid on ≥768px (photo | card); stacks on mobile

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
