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
├── .env.example           # Copy to .env; only VITE_GA_MEASUREMENT_ID needed
├── public/                # Copied verbatim to dist/ — do NOT put src assets here
│   ├── CNAME              # Custom domain — critical, must stay here
│   ├── robots.txt         # Allows all crawlers; references sitemap URL
│   ├── sitemap.xml        # All indexable pages; update <lastmod> on content changes
│   └── img/
├── src/
│   ├── main.js            # JS entry; imports CSS and initialises all features
│   ├── theme.js           # Dark/night mode — detection, persistence, toggle wiring
│   ├── analytics.js       # GA4 module — loads only after consent
│   ├── consent-banner.js  # Cookie banner UI and localStorage persistence
│   └── styles/
│       ├── main.css       # Imports only (no styles here)
│       ├── base.css       # Design tokens, reset, typography, print styles
│       ├── layout.css     # Header, footer, nav, grids, containers
│       ├── components.css # Buttons, cards, forms, accordion, pathway explorer, cost estimator
│       ├── sections.css   # Section-specific styles (hero, services, quality, etc.)
│       └── consent.css    # Cookie banner styles (z-index 150)
└── .claude/rules/
    ├── brand.md           # Full brand identity guide — read before any design work
    └── analytics.md       # GA4 consent mode architecture — read before touching analytics
```

## Architecture

All content is in `index.html` as a single scrollable page with anchor-linked sections: `#home`, `#why-us`, `#services`, `#who-we-help`, `#quality`, `#service-area`, `#how-it-works`, `#features`, `#resources`, `#careers`, `#contact`.

**`src/main.js`** — `init*` functions called on `DOMContentLoaded` (in order): `initThemeToggle` (wires the `[data-theme-toggle]` header button; see Dark Mode below), `initBanner` (dismisses the `#licensing-banner` top-of-page notice via a close button), `initMobileNav` (full-screen overlay, body scroll lock, Escape key), `initScrollHeader` (`.scrolled` class at 60px), `initSmoothScroll` (header-offset anchor scroll), `initActiveNav` (IntersectionObserver, rootMargin `-15% 0px -75% 0px`), `initScrollReveal` (`.reveal` / `.reveal-stagger` → `.revealed`), `initPathwayExplorer` (tab switcher — calls `trackPathwaySelect` on click), `initCostEstimator` (`HOURLY_RATE = 32`, updates `--range-pct` CSS var; calls `trackEstimatorInteraction` via 1.5s debounce), `initAccordion` (uses `aria-expanded` + `.active` class; calls `trackAccordionOpen` on expand), `initContactForm` (redirects to `mailto:` URI via `window.location.href` — no backend; calls `trackLeadFormSubmit` before redirect), `initConsentBanner` (shows cookie banner on first visit; auto-loads GA if previously accepted), `initCookiePrefsButtons` (wires `[data-cookie-prefs]` elements to reopen the banner).

**Analytics** (Advanced Consent Mode) — see `.claude/rules/analytics.md` for full detail. The static gtag.js `<script>` block lives at the top of `<head>` in both HTML files so GA's validator can detect it. `analytics_storage` is denied by default; `src/analytics.js:initGA()` upgrades consent and activates event tracking only after the user accepts.

**Image layout patterns** (in `sections.css`):
- `.hero-layout` — 2-col grid on ≥900px (text | photo); image hidden on mobile
- `.section-photo` — full-width banner photo with `object-fit: cover`; used in Who We Help
- `.careers-layout` — 2-col grid on ≥768px (photo | card); stacks on mobile

**CSS design conventions:**
- Icons use `--color-primary-light` background / `--color-primary` stroke — never `--color-accent`. Amber (`--color-accent`) is reserved for secondary CTA buttons (`btn-accent`) and footer headings only.
- Accordion open/close is animated via `max-height: 0 → 1000px` + `padding-bottom` transition (not `display: none/block`, which cannot be transitioned).
- Scroll reveal: `.reveal` for single elements, `.reveal-stagger` for grids — JS adds `.revealed` class via IntersectionObserver at 8% threshold; CSS handles the staggered delays.

**Adding a new page** — register it in `vite.config.js` `rollupOptions.input`, then copy the following blocks from `index.html` into the new page's `<head>` (order matters):
1. The GA consent `<script>` block (must precede the async gtag.js tag)
2. The `theme-color` meta pair
3. The pre-paint theme detection `<script>` (synchronous; prevents flash of wrong theme)

Import `src/main.js` so it gets the bundled CSS, theme toggle, and consent banner wiring. Add a `[data-theme-toggle]` button to the page's header (copy from `index.html`). Then add a `<url>` entry to `public/sitemap.xml` with the canonical production URL and today's date as `<lastmod>`.

**Updating page content** — whenever substantive content changes are made to any existing page, update the corresponding `<lastmod>` date in `public/sitemap.xml` to today's date (ISO 8601 format: `YYYY-MM-DD`). This keeps Google's crawl scheduling accurate.

**`public/CNAME`** — Must contain `www.blissfullivingsolutions.com`. If this file disappears from `dist/`, the custom domain breaks on the next deploy.

**Footer social links** — Facebook, Instagram, and X icons live in `.footer-social` inside `.footer-inner`. Each is a `.social-link` anchor (inline SVG, `target="_blank" rel="noopener noreferrer"`, `aria-label`). Styles are in `src/styles/layout.css` under `.footer-social` / `.social-links` / `.social-link`.

## Care Planning Worksheet (Print Feature)

The `#features` section (`#service-plan-section` feature-block) contains a printable Care Planning Worksheet triggered by `onclick="window.print()"`.

**Screen/print separation pattern:**
- `.screen-only` — visible on screen, hidden in print (`display: none !important` in `@media print`)
- `.print-only` — the entire worksheet body. **Not** `display: none` on screen; instead rendered off-screen via `@media screen { position: fixed; left: -9999px; visibility: hidden; width: 816px; }`. This keeps the element in the browser's layout tree at all times so the first print never has a missing-last-page bug from a cold layout pass.
- In `@media print`, `.print-only` is reset to `position: static; visibility: visible`.

**Print CSS lives in `src/styles/base.css`** inside `@media print`. All print-specific classes use the `.spt-` namespace (service plan template):
- `.spt-section` — bordered card with teal header; `page-break-inside: avoid`
- `.spt-section-title` — uses negative margin bleed (`margin: -10pt -12pt 8pt`) to span full card width with teal background
- `.spt-grid-2` — 2-column field grid
- `.spt-line` / `.spt-line-2` / `.spt-line-tall` — write-in lines (use explicit `#ffffff` not `transparent` in gradients — mobile browsers render `transparent` as black when printing)
- `.spt-task-grid` — 2-column task list with checkbox + frequency rows
- `.spt-check-row` — flex row for `<input type="checkbox">` + label text
- `.spt-sig-row` — signature grid (1fr + 80pt date column)
- `.spt-table` — plan review log table

The worksheet has 12 sections (A–L): Client Information, Emergency Contacts, Authorized Representative, Care Needs & Goals, Services Requested, Specific Caregiver Tasks, Preferred Schedule, Special Instructions & Precautions, Home Environment & Safety, Visit Documentation, Plan Review Log, Signatures.

## Dark / Night Mode

Theme is applied via `data-theme="light|dark"` on `<html>`. A synchronous inline `<script>` in `<head>` sets this attribute before paint (no FOUC). Resolution order: `localStorage.bls_theme` (`'light'`|`'dark'`) → OS `prefers-color-scheme: dark` → local clock (night = hour ≥ 19 or < 7).

**`src/theme.js`** — exports `initThemeToggle()`. Wires the `[data-theme-toggle]` header button (click toggles opposite of current resolved theme, saves to `localStorage.bls_theme`). Also listens to `matchMedia('(prefers-color-scheme: dark)')` change events to repaint when the user has no stored preference.

**CSS token overrides** live in `src/styles/base.css` under `:root[data-theme="dark"]`. All `--color-*` and `--shadow-*` tokens are redefined there. Hard-coded `rgba(...)` values in other CSS files get companion overrides at the bottom of their respective files under the same selector.

**Critical caveat — footer background**: `--color-dark` (the footer's `background-color` in light mode) is repurposed as warm off-white body text in dark mode. The footer therefore has an explicit hard-coded override in `src/styles/layout.css`:
```css
:root[data-theme="dark"] .site-footer { background-color: #0D1517; }
```
Do not convert this to a token — it would create the same inversion problem.

**Print styles are immune**: `@media print` in `base.css` hard-codes hex values and is unaffected by `data-theme`, so the Care Planning Worksheet always prints on white paper regardless of screen theme.

**Toggle icon convention**: sun icon = shown in dark mode (click → go light); moon icon = shown in light mode (click → go dark). CSS controls visibility via `:root[data-theme="dark"] .theme-toggle-sun { display: block }` etc. in `src/styles/layout.css`.

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
- If Pages deploy fails with a misleading `404`, verify the workflow still includes `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`, and top-level permissions for `contents: read`, `pages: write`, and `id-token: write`

## Pending Items (commented out in code)

Several blocks are commented out awaiting the IDPH license **number** (approval received, number pending):
- Phone number in hero, contact section, footer, and schema.org structured data
- Physical street address (city/ZIP shown only)
- IDPH license number in quality section and footer
- Meta description update from "licensing pending" to "licensed"
- Trust signal update in hero

When license number arrives: search for `<!-- ` comments containing `tel:`, `License No.`, and the street address placeholder.
