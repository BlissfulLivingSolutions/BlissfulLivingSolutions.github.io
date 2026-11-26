---
description: Google Analytics 4 implementation — advanced consent mode, event tracking, env var setup, and rules for what must never be sent to GA
---

# Google Analytics 4 — Implementation Guide

## Overview

GA4 is implemented using **Advanced Consent Mode** (direct gtag.js, no GTM). The script is always present in the HTML so GA can detect the tag, but `analytics_storage` is denied by default — no cookies or tracking data are sent until the visitor explicitly accepts via the cookie banner.

## Key Files

| File | Role |
|---|---|
| `src/layouts/BaseLayout.astro` | Consent-default `<script is:inline>` + the gtag.js tag (rendered only when the ID is set) at the top of every page's `<head>` |
| `src/scripts/analytics.js` | Core GA4 module: consent update, config, and all event tracking |
| `src/scripts/consent-banner.js` | Cookie banner UI, localStorage persistence, wires Accept/Decline to `initGA()` |
| `src/styles/consent.css` | Banner styles (z-index 150, above sticky header at 100) |
| `astro.config.mjs` | `env.schema` declares `PUBLIC_GA_MEASUREMENT_ID` (optional, client, public) |
| `.env` / `.env.example` | `PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` — baked in at build time |

## Consent Flow

1. **Every page load** — `is:inline` `<script>` in `<head>` (BaseLayout) calls `gtag('consent', 'default', {...all denied})` before the gtag.js script loads. This is required by Google; it must appear before the `<script async src="gtag/js?id=...">` tag.

2. **`initConsentBanner()`** (called from `main.js` on `DOMContentLoaded`):
   - `consent === 'granted'` → calls `initGA()` immediately (returning visitor who accepted)
   - `consent === 'denied'` → does nothing (returning visitor who declined)
   - `consent === null` → shows the banner (first-time visitor)

3. **Accept** → `setConsent('granted')` in localStorage + `initGA()`
   - `initGA()` calls `gtag('consent', 'update', {analytics_storage: 'granted'})`, then fires `trackPageView()` and starts five internal listeners: `initScrollDepth`, `initSectionReach`, `initLinkTracking`, `initCtaTracking`.

4. **Decline** → `setConsent('denied')` in localStorage. If GA was previously granted in this session, also calls `gtag('consent', 'update', {analytics_storage: 'denied'})` to revoke mid-session.

## Environment Variable

`PUBLIC_GA_MEASUREMENT_ID` is injected at **build time** (not runtime) through Astro's typed env (`astro:env`). Astro only exposes `PUBLIC_`-prefixed variables to the browser. Everywhere — `.astro` frontmatter and client scripts — it is read the same way:

```js
import { PUBLIC_GA_MEASUREMENT_ID } from 'astro:env/client'
```

`BaseLayout.astro` uses it to render the `<script async src="https://www.googletagmanager.com/gtag/js?id=…">` tag (omitted entirely when unset); `analytics.js` and `consent-banner.js` use it to configure GA and decide whether to show the banner.

**GitHub Actions**: the repository secret is still named `VITE_GA_MEASUREMENT_ID`; `.github/workflows/deploy.yml` passes it to the build step as `PUBLIC_GA_MEASUREMENT_ID`. **Cloudflare Workers Builds**: set `PUBLIC_GA_MEASUREMENT_ID` as a *build* variable on the Worker (Settings → Build → Variables and secrets). On either host, without it all analytics and the banner are silently disabled.

## Events Tracked

| Event | Trigger | Notes |
|---|---|---|
| `page_view` | On `initGA()` | Sends `page_location` (sanitized) and `page_title` |
| `scroll_depth` | 50% and 90% scroll milestones | Fires once per milestone per session; listener self-removes after both fire |
| `section_reach` | 25% of a key section enters viewport | Sections: `services`, `contact`, `how-it-works`, `careers`, `why-us`; fires once per section per session |
| `cta_click` | Click on any `[data-cta-label]` element | Sends `cta_label` and `page_section`; see CTA Tracking Pattern below |
| `pathway_select` | Care pathway tab clicked | Sends `pathway_name` (safety, loneliness, burnout, hospice) |
| `estimator_interaction` | Cost slider settles after 1.5s debounce | Sends `hours_per_week` and `estimated_weekly_cost` |
| `faq_open` | Accordion item expanded (not on collapse) | Sends `question` text (truncated to 100 chars) |
| `email_click` | Any `mailto:` link clicked | Sends `link_text`; covers footer email and careers apply button |
| `phone_click` | Any `tel:` link clicked | Ready for when phone number goes live; mark as conversion at that point |
| `outbound_click` | Click on any off-domain `http` link | Sends `link_url`, `link_domain`, `link_text` |
| `lead_form_submit` | Contact form submission | Fired before `window.location.href` mailto redirect; **marked as conversion in GA4** |

## CTA Tracking Pattern

CTA clicks are tracked via a delegated listener (`initCtaTracking` in `analytics.js`) that watches for clicks on any element with `data-cta-label`. Add two attributes to any button or link you want tracked:

```html
<a href="#contact" class="btn btn-primary"
   data-cta-label="hero_consultation"
   data-cta-section="hero">Request a Free Care Consultation</a>
```

Currently labeled CTAs: `hero_consultation`, `who_we_help_contact`, `how_it_works_consultation` (note: this one sits in `#quality` — the label is kept for GA history continuity), `service_area_check`, `estimator_contact`, `careers_apply`, `mobile_sticky_consultation` (phone-only sticky bar, section `sticky-bar`, added Nov 2026).

## GA4 Property Setup Status

| Task | Status |
|---|---|
| Tag detected (advanced consent mode) | ✅ Done |
| Data retention set to 14 months | ✅ Done |
| `lead_form_submit` marked as conversion | ⏳ Waiting for event to appear (~24–48h of live traffic) |
| `phone_click` marked as conversion | ⏳ Do when phone number goes live |
| Google Search Console linked | 🔜 Pending |

Custom events appear automatically in Admin → Events once real traffic fires them — no manual pre-creation needed. Only the "Mark as conversion" toggle requires a manual step after events appear.

## URL Sanitization

All events that include a URL use `sanitizeUrl()` from `analytics.js`, which returns `window.location.origin + window.location.pathname` — stripping query strings and hash fragments to avoid accidental PII leakage.

## Ad-Related Consent

`ad_storage`, `ad_user_data`, and `ad_personalization` are always `'denied'` and are never updated. Do not change this — this site does not run ads and should never send ad-signal data to Google.

## What Never Gets Sent to GA

- Form field values (name, email, phone, message)
- Query string parameters or URL hash fragments
- Any data that could identify an individual visitor
- IP addresses (GA4 auto-anonymizes)

## Cookie Preferences Reopener

Any element with `data-cookie-prefs` attribute in the DOM will reopen the banner when clicked. Currently wired in the shared footer (`SiteFooter.astro`), so it is on every page. `initCookiePrefsButtons()` in `src/scripts/main.js` handles this via a delegated querySelectorAll at `DOMContentLoaded`.

## Adding a New Page

Build the page on `BaseLayout.astro` (`src/pages/<name>.astro`). The layout already provides the consent-default block, the gtag tag, `main.js` (banner + cookie-prefs wiring) and the footer's `data-cookie-prefs` button — nothing to copy. If a page ever needs its own `<head>`, the consent-default block must still come before the gtag tag.
