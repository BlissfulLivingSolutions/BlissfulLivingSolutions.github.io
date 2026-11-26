# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static website for **Blissful Living Solutions LLC**, a non-medical home care agency based in Lemont, IL, at `www.blissfullivingsolutions.com`. Built with **Astro 7** (static output, Bun as package manager). Every push to `main` deploys to **both** GitHub Pages (GitHub Actions) and Cloudflare Workers static assets (Workers Builds) while the domain moves to Cloudflare.

## Development Commands

```bash
bun run dev      # Astro dev server with HMR (localhost:4321)
bun run build    # Production build → dist/
bun run preview  # Preview the production build locally
```

Requires **Node ≥ 22.23.4** (Astro's CLI runs on Node even under `bun run`); `.node-version` pins 24 for both CI hosts. There is no linting or test runner configured — do not attempt `bun run lint` or `bun run test`.

## Build System

**Astro 7** — `astro.config.mjs` holds the whole config. Key choices (don't change without checking output):
- `build.format: 'file'` + `trailingSlash: 'never'` — pages build to `dist/<name>.html` and are linked as `/privacy-policy` (no `.html`, no trailing slash). Canonical URLs, the sitemap and in-page links all use that form.
- `compressHTML: false` — Astro 7's default (`'jsx'`) strips whitespace between inline elements, which changes rendering. Keep it off.
- `vite.build.target` / `cssTarget` pinned to Safari/iOS 14, Chrome 87, Firefox 78 (the pre-Astro defaults). Vite 8 otherwise targets Safari/iOS 16.4+, and its CSS minifier then rewrites media queries to range syntax (`width>=1024px`) and drops `-webkit-` prefixes — older iPhones/iPads would lose the entire responsive layout. Don't raise these without checking the audience's devices.
- `env.schema` — `PUBLIC_GA_MEASUREMENT_ID` via `astro:env` (see below).
- `@astrojs/sitemap` — writes `sitemap-index.xml` + `sitemap-0.xml`; `<lastmod>` comes from the `LASTMOD` map at the top of the config. 404 is filtered out.
- Every file in `src/pages/` becomes a page automatically — there is no entry-point list to register.

**Deploys** (both run on push to `main`):
- **GitHub Pages** — `.github/workflows/deploy.yml`: checkout → configure Pages → setup Node (`.node-version`) → setup Bun → `bun install --frozen-lockfile` → `bun run build` → verify `dist/` → upload artifact → deploy. **⚠️ One-time manual step**: repo Settings → Pages → Source must be **"GitHub Actions"**.
- **Cloudflare Workers Builds** — Worker `blissful-living-solutions`; build `bun run build`, deploy `npx wrangler deploy` (reads `wrangler.jsonc`: serves `dist/` as static assets, `auto-trailing-slash`, `404-page`). Redirects for Cloudflare live in `public/_redirects` (GitHub Pages ignores that file). Preview: `blissful-living-solutions.frosty-limit-ab7d.workers.dev`.

## Environment Variables

`PUBLIC_GA_MEASUREMENT_ID` is the only env var (Astro only exposes `PUBLIC_`-prefixed vars to the browser). Declared in `astro.config.mjs` `env.schema` as an optional client/public string. Copy `.env.example` to `.env` for local builds. It is baked in at build time — **not** a runtime variable.

- In `.astro` files and client scripts: `import { PUBLIC_GA_MEASUREMENT_ID } from 'astro:env/client'`
- GitHub Actions: the repository secret is still named `VITE_GA_MEASUREMENT_ID`; the workflow maps it to `PUBLIC_GA_MEASUREMENT_ID` on the build step
- Cloudflare: a **build** variable (Worker → Settings → Build → Variables and secrets), not a runtime variable

If the variable is absent, the gtag tag is not rendered and all analytics and the cookie banner are silently disabled — safe to deploy without it.

## Project Structure

```
/
├── astro.config.mjs       # Astro config: site URL, file-format pages, env schema, sitemap + LASTMOD map
├── wrangler.jsonc         # Cloudflare Workers static-assets config (dist/)
├── .node-version          # Node major for GitHub Actions + Cloudflare builds
├── .env.example           # Copy to .env; only PUBLIC_GA_MEASUREMENT_ID needed
├── public/                # Copied verbatim to dist/ — do NOT put source images here
│   ├── CNAME              # Custom domain for GitHub Pages — critical, must stay here
│   ├── _redirects         # Cloudflare redirects (/sitemap.xml → /sitemap-index.xml)
│   ├── robots.txt         # Allows all crawlers; references sitemap-index.xml
│   └── img/               # logo.png (OG/schema), logo-96.png (header/footer)
├── src/
│   ├── pages/
│   │   ├── index.astro          # Home page: composes the sections; OG/Twitter/Geo meta; LocalBusiness + FAQPage JSON-LD
│   │   ├── privacy-policy.astro # Privacy policy (simple header)
│   │   └── 404.astro            # Not-found page (noindex; used by both hosts)
│   ├── layouts/
│   │   └── BaseLayout.astro     # <head> (GA consent, pre-paint theme, SEO, fonts), header, <main>, footer; imports main.css + main.js
│   ├── components/
│   │   ├── SiteHeader.astro     # variant 'full' (home: nav, toggle, Contact us, Menu pill) | 'simple' (logo, toggle, Back to home)
│   │   ├── MenuSheet.astro      # Full-screen menu sheet (<1180px)
│   │   ├── SiteFooter.astro     # Four-column footer + legal row; `home` prop switches #links ↔ /#links
│   │   ├── MobileCtaBar.astro   # Phone-only sticky consultation bar
│   │   ├── Logo.astro, ThemeIcons.astro, Icon.astro
│   │   ├── PathwayExplorer.astro, CostEstimator.astro
│   │   ├── CarePlanningWorksheet.astro  # Printable worksheet — see below; edit surgically
│   │   └── sections/            # One component per home-page section (Hero, WhyUs, Services, WhoWeHelp, Quality, ServiceArea, HowItWorks, Features, Faq, Careers, Contact)
│   ├── data/
│   │   ├── site.ts              # Business facts, nav links, social links, pending license items
│   │   ├── faq.ts               # FAQ items — feeds the accordion AND the FAQPage JSON-LD
│   │   └── icons.ts             # Outline icon paths for <Icon name="…" />
│   ├── assets/images/           # Source photos, optimized at build time by <Picture>
│   ├── scripts/
│   │   ├── main.js              # Client entry; initialises all features
│   │   ├── theme.js             # Dark/night mode — detection, persistence, toggle wiring
│   │   ├── analytics.js         # GA4 module — loads only after consent
│   │   └── consent-banner.js    # Cookie banner UI and localStorage persistence
│   └── styles/
│       ├── main.css       # Imports only (no styles here)
│       ├── base.css       # Design tokens, reset, typography, motion, print styles
│       ├── layout.css     # Container, section rhythm, split layout, header, menu sheet, sticky phone CTA, footer
│       ├── components.css # Buttons, text links, arch icon tiles, check lists, forms, accordion, pathway tabs, cost estimator
│       ├── sections.css   # Section-specific styles (hero, trust strip, services index, vetting band, worksheet, careers, contact, privacy prose)
│       └── consent.css    # Cookie banner styles (z-index 150)
└── .claude/rules/
    ├── brand.md           # Full brand identity guide — read before any design work
    └── analytics.md       # GA4 consent mode architecture — read before touching analytics
```

## Architecture

The home page (`src/pages/index.astro`) is a single scrollable page with anchor-linked sections, one component each in `src/components/sections/`: `#home`, `#why-us`, `#services`, `#who-we-help`, `#quality`, `#service-area`, `#how-it-works`, `#features`, `#resources`, `#careers`, `#contact`.

**Astro conventions in this repo:**
- Repeated items (reasons, services, personas, pathways, vetting steps, steps, trust facts) are arrays in the component's frontmatter, rendered with `.map()`. Facts used in more than one place live in `src/data/`.
- **CSS is global**, imported once in `BaseLayout.astro` (`import '../styles/main.css'`). Do **not** add scoped `<style>` blocks to components — Astro's scoping attributes raise specificity and break the cascade the stylesheets rely on.
- Client JS is one processed `<script>` in `BaseLayout.astro` that imports `src/scripts/main.js` (bundled, `type="module"`). Every `init*` runs once on `DOMContentLoaded` and null-checks its elements, so the same bundle serves every page. Don't add `<ClientRouter />` (view transitions) without reworking that — swapped pages would never re-initialise.
- Head scripts that must run before paint or before gtag.js — the consent-default block, the gtag tag, the pre-paint theme script — and the footer's `document.write` year are `is:inline`. Never let Astro process them.
- Photos use `<Picture>` from `astro:assets` with `formats={['avif', 'webp']}`, `fallbackFormat="jpg"`, real pixel `widths` and the original `sizes`. Hero is `loading="eager" fetchpriority="high"`.
- JSON-LD is built from data in `index.astro` frontmatter and emitted with `set:html={JSON.stringify(…)}`.

**`src/scripts/main.js`** — `init*` functions called on `DOMContentLoaded` (in order): `initThemeToggle` (wires all `[data-theme-toggle]` elements via `querySelectorAll` — header button on desktop ≥1180px, `.mobile-theme-btn` in the menu sheet below that; see Dark Mode below), `initMobileNav` (full-screen menu sheet, body scroll lock, Escape key, focus moves to Close on open / back to the Menu button on close, Tab is trapped inside the sheet), `initScrollHeader` (`.scrolled` class at 60px), `initSmoothScroll` (header-offset anchor scroll), `initActiveNav` (IntersectionObserver, rootMargin `-15% 0px -75% 0px`), `initScrollReveal` (`.reveal` / `.reveal-stagger` → `.revealed`), `initPathwayExplorer` (WAI-ARIA tabs — `aria-selected`, roving `tabindex`, arrow/Home/End keys; calls `trackPathwaySelect` on select), `initCostEstimator` (`HOURLY_RATE = 32`, slider min 4 = the 4-hour visit minimum, updates `--range-pct` CSS var and a spoken `aria-valuetext`; calls `trackEstimatorInteraction` via 1.5s debounce), `initAccordion` (uses `aria-expanded` + `.active` class; calls `trackAccordionOpen` on expand), `initContactForm` (redirects to `mailto:` URI via `window.location.href` — no backend; calls `trackLeadFormSubmit` before redirect), `initMobileCtaBar` (phone-only sticky "Request a free consultation" bar — `.visible` once the hero has scrolled away, hidden from `#contact` onward), `initConsentBanner` (shows cookie banner on first visit; auto-loads GA if previously accepted), `initCookiePrefsButtons` (wires `[data-cookie-prefs]` elements to reopen the banner).

**Analytics** (Advanced Consent Mode) — see `.claude/rules/analytics.md` for full detail. The static gtag.js `<script>` block lives at the top of `<head>` in `BaseLayout.astro` (so every page has it and GA's validator can detect it). `analytics_storage` is denied by default; `src/scripts/analytics.js:initGA()` upgrades consent and activates event tracking only after the user accepts.

**Layout patterns** (Nov 2026 redesign — "A home, kept."):
- Headings are **left-aligned and editorial** — no centered section headers, no all-caps eyebrows. `.split` (layout.css) is the 5/7 two-column pattern (heading column | content column) used by Why Us, Services and FAQ; `.split--sticky` pins the heading column on ≥1024px.
- `.hero-grid` — 2-col on ≥1024px (copy | `.hero-arch` tall arched photo with a second outline arch drawn behind via `.hero-media::before`); stacks on smaller screens. `.trust-strip` below it lists four plain facts (only facts stated elsewhere on the page — never "licensed", ratings, or counts).
- Background rhythm: ivory page → `.section--surface` (white) → one `.section--deep` evergreen band (`#quality`). Footer uses `--color-footer`.
- `.photo-banner` — full-width arched banner (Who We Help); `.arch-frame` — tall arched photo (How It Works); `.area-map` — the OpenStreetMap embed in a soft arch, bbox covers all five counties.
- The pathway explorer lives inside `#who-we-help`; each panel shows a sample plan with a `.week` strip (seven small arches, `.on` / `.maybe`). `#features` holds the cost estimator and the Care Planning Worksheet.

**Image pipeline** — source photos live in `src/assets/images/` (full-size PNG) and are optimized at build time by `<Picture>`: AVIF + WebP sources at the listed `widths`, JPEG fallback, hashed filenames under `/_astro/`. To swap a photo, replace the file (or import a new one) — no manual `cwebp` step. Use real pixel widths in `widths` (e.g. `1184`, not a rounded number). The logo is **not** optimized: headers use `/img/logo-96.png` and OG/schema use the absolute `/img/logo.png` URL, both in `public/img/`.

**CSS design conventions:**
- Breakpoints (min-width): 480 / 640 / 768 / 1024 / **1180** (full desktop nav + header theme toggle). Below 1180 the header shows a labelled **Menu** pill (clearer for older visitors than a bare hamburger); "Contact us" shows in the header from 768.
- **Specificity gotcha**: `components.css` loads after `layout.css`, so `.btn { display: inline-flex }` beats a same-specificity `display: none` in layout.css. Scope such rules (e.g. `.header-actions .header-cta`).
- Icons sit in `.icon-arch` tiles (`--color-primary-light` background / `--color-primary` stroke) — never `--color-accent`. `.icon-arch--accent` is reserved for hospice. Amber (`--color-accent`) is otherwise reserved for `btn-accent` (Careers) and footer headings (`--color-accent-on-deep`). Aim for at most one amber element per viewport. **`btn-accent` uses dark ink text in both themes** — white on amber fails contrast.
- **Arch motif** (the site signature — a doorway/threshold): tokens `--arch` (`999px 999px 20px 20px`) and `--arch-soft` (160px shoulders). Used on the hero photo, `.arch-frame`, `.photo-banner`, `.area-map`, `.icon-arch`, `.vetting-mark`, `.step-num`, the `.week` day tiles, and county list markers. Use it consistently; everything around it stays quiet.
- **Motion tokens** (base.css): `--ease-out: cubic-bezier(0.22,1,0.36,1)`, `--ease-in-out`, and duration tokens `--dur-fast/base/slow/reveal` (140/220/450/700ms). `--transition`/`--transition-slow` are shorthand aliases built on them. Animate transform/opacity only (the hero door reveal's one-time `clip-path` is the single exception). Buttons have a `:active { scale(0.97) }` press state. The hero has a one-time entrance — copy rises in and the arched photo opens upward like a door (`hero-door` keyframes) — gated by `prefers-reduced-motion: no-preference`.
- Accordion open/close is animated via `grid-template-rows: 0fr → 1fr` on `.accordion-content` with an `.accordion-content-inner` wrapper (`overflow: hidden; min-height: 0`) — smooth at any content height. The FAQ question text must remain a bare text node inside `.accordion-header` (analytics extracts direct text nodes). JS still writes `+`/`−` into `.accordion-icon`; CSS hides that glyph (`font-size: 0`) and draws the plus/minus with pseudo-elements.
- Scroll reveal is used **sparingly** (photos only): `.reveal` for single elements, `.reveal-stagger` for grids — JS adds `.revealed` via IntersectionObserver at 8% threshold. `initScrollReveal` reveals everything immediately under `prefers-reduced-motion`.
- **Never style bare `input`, `h2`, or `strong` globally** — the printed worksheet uses `h2.spt-section-title`, raw checkboxes and `<strong>` that must keep their hard-coded print colors. Form styles are scoped to `.form-group`.

**Adding a new page** — create `src/pages/<name>.astro` and wrap the content in `<BaseLayout title="…" description="…">`. The layout supplies everything every page needs (GA consent block + gtag, theme-color pair, pre-paint theme script, canonical URL, fonts, CSS, `main.js`, header, footer). It defaults to the simple header (`.theme-toggle--always` + "Back to home"); pass `header="full"` only for the one-page home layout. Page-specific `<head>` tags go in `<Fragment slot="head">`, JSON-LD in `slot="schema"`. The sitemap picks the page up automatically — add its path to the `LASTMOD` map in `astro.config.mjs` with today's date. Link to it as `/<name>` (no `.html`).

**Updating page content** — whenever substantive content changes are made to any existing page, update that page's date in the `LASTMOD` map in `astro.config.mjs` to today's date (ISO 8601: `YYYY-MM-DD`). This keeps Google's crawl scheduling accurate.

**`public/CNAME`** — Must contain `www.blissfullivingsolutions.com` while GitHub Pages serves the site. If this file disappears from `dist/`, the custom domain breaks on the next GitHub deploy. (Remove it, and the GitHub workflow, only after the domain is attached to the Cloudflare Worker and GitHub Pages is turned off.)

**Footer** — `SiteFooter.astro`: four columns in `.footer-top` (`.footer-brand`, `.footer-nav` "Explore", `.footer-contact` "Get in touch", `.footer-social` "Follow along") and a `.footer-bottom` legal row (copyright, Privacy policy, `[data-cookie-prefs]` button). Column headings are small `h2`s styled in layout.css. Links come from `navLinks` / `socialLinks` in `src/data/site.ts` (Facebook, Instagram, X, LinkedIn — inline SVG, `target="_blank" rel="noopener noreferrer"`, `aria-label`). The same component renders on every page; `home` switches `#section` ↔ `/#section`.

## Care Planning Worksheet (Print Feature)

The `#features` section (`#service-plan-section` feature-block, `src/components/CarePlanningWorksheet.astro`) contains a printable Care Planning Worksheet triggered by `onclick="window.print()"`. On screen it is introduced by the `.worksheet.screen-only` callout (a CSS-drawn paper illustration + print button). The worksheet markup itself (`.print-only` header, `.spt-body`, footer) was deliberately left untouched in the Nov 2026 redesign and moved into the component byte-for-byte in the Astro migration — edit it surgically, never by retyping. It must contain no `{`/`}` characters (Astro would treat them as expressions).

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

Theme is applied via `data-theme="light|dark"` on `<html>`. A synchronous `is:inline` `<script>` in `BaseLayout.astro`'s `<head>` sets this attribute before paint (no FOUC). Resolution order: `localStorage.bls_theme` (`'light'`|`'dark'`) → OS `prefers-color-scheme: dark` → local clock (night = hour ≥ 19 or < 7).

**`src/scripts/theme.js`** — exports `initThemeToggle()`. Uses `querySelectorAll('[data-theme-toggle]')` to wire **all** toggle buttons — the `.theme-toggle` in the header (visible at ≥1180px; `.theme-toggle--always` on secondary pages shows at every width) and the `.mobile-theme-btn` inside `.mobile-nav-footer` at the bottom of the menu sheet. All of them render the same `ThemeIcons.astro` pair. Both call `applyTheme()`, which updates `data-theme` on `<html>` and syncs the `aria-label` on every `[data-theme-toggle]` element. Also listens to `matchMedia('(prefers-color-scheme: dark)')` change events to repaint when the user has no stored preference.

**CSS token overrides** live in `src/styles/base.css` under `:root[data-theme="dark"]`. All `--color-*` and `--shadow-*` tokens are redefined there, including the Nov 2026 supporting tones (`--color-body`, `--color-muted`, `--color-linen`, `--color-line`, `--color-deep`, `--color-on-deep*`, `--color-accent-on-deep`, `--color-on-primary`, `--color-footer`). Hard-coded `rgba(...)`/hex values in other CSS files get a companion `:root[data-theme="dark"]` override next to the rule.

**Critical caveat — footer background**: the footer uses `--color-footer` (evergreen `#173A3A`) in light mode. `--color-dark` must never be used as a background — it becomes warm off-white body text in dark mode. The footer keeps its explicit hard-coded dark override in `src/styles/layout.css`:
```css
:root[data-theme="dark"] .site-footer { background-color: #0D1517; }
```
Do not convert this to a token — it would create the same inversion problem.

**Print styles are immune**: `@media print` in `base.css` hard-codes hex values and is unaffected by `data-theme`. A separate small print block forces `color-scheme: light` and a white `html` background — without it, printing while the site is in night mode painted the page margins near-black. The sticky phone CTA and cookie banner both carry their own `@media print { display: none }`.

**Toggle icon convention**: sun icon = shown in dark mode (click → go light); moon icon = shown in light mode (click → go dark). CSS controls visibility via `:root[data-theme="dark"] .theme-toggle-sun { display: block }` etc. in `src/styles/layout.css`. The `.mobile-theme-btn` reuses these same icon classes, and adds `.mobile-theme-label-light` / `.mobile-theme-label-dark` text labels that flip with the same `data-theme` selectors. The header toggle shows at ≥1180px; below that the toggle lives in the menu sheet.

## Brand

See `.claude/rules/brand.md` for the full brand identity. Key tokens:
- Primary: `#2D6A6A` (Deep Slate Teal)
- Accent: `#D4923A` (Warm Amber)
- Background: `#FAF7F0` (Warm Ivory)
- Evergreen: `#1B4444` (`--color-deep`, the Quality band) / footer `#173A3A`
- Type: **Fraunces** (display, SOFT axis 70) + **Atkinson Hyperlegible Next** (everything else, 18px body)
- All defined as CSS custom properties in `src/styles/base.css`

## Deployment Notes / Troubleshooting

- GitHub Pages must remain configured as **Settings → Pages → Source → GitHub Actions** (until the Cloudflare cutover)
- `public/CNAME` must remain present so the custom domain persists after GitHub deploys
- The `VITE_GA_MEASUREMENT_ID` GitHub secret (mapped to `PUBLIC_GA_MEASUREMENT_ID` in the workflow) and the `PUBLIC_GA_MEASUREMENT_ID` Cloudflare build variable must both be set, or GA is silently disabled on that host
- A build that fails on "Node.js vXX is not supported by Astro" means a host ignored `.node-version` — set `NODE_VERSION=24` (Cloudflare) or check the `actions/setup-node` step (GitHub)
- If Pages deploy fails with a misleading `404`, verify the workflow still includes `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`, and top-level permissions for `contents: read`, `pages: write`, and `id-token: write`
- Search Console: the sitemap is `https://www.blissfullivingsolutions.com/sitemap-index.xml` (the old `/sitemap.xml` 301s there on Cloudflare only)

## Pending Items (waiting on the IDPH license number)

Approval is received; the license **number** is pending. Everything that depends on it is driven by three `null` fields in `src/data/site.ts` — nothing renders while they are null:
- `phone` → contact-details list (with phone icon) and schema.org `telephone`
- `streetAddress` → contact "Office" line and schema.org `streetAddress`
- `licenseNumber` → footer "Get in touch" column

When the number arrives, fill those in (formats are in the comment above them). Then consider: adding the phone to the menu sheet and the trust strip, marking `phone_click` as a conversion in GA4, and updating the `LASTMOD` date for `/`.
