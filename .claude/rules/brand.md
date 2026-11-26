---
description: Brand identity, color palette, typography, and tone of voice for Blissful Living Solutions LLC
---

# Blissful Living Solutions — Brand Identity

## Business
- **Name**: Blissful Living Solutions LLC
- **Type**: Non-medical home service agency
- **Location**: Lemont, IL 60439
- **Service area**: Cook, Will, Kane, Lake, and DuPage counties
- **Email**: contact@blissfullivingsolutions.com
- **IDPH status**: License approved.

## Primary Audiences
1. **Adult children (40–65)** — anxious, time-pressed, researching care for an aging parent; often on mobile; guilt-prone; need reassurance and professionalism
2. **Seniors (65+)** — value dignity, independence, and familiarity; may be researching for themselves or with family

## Brand Positioning
"Compassionate Warmth + Professional Authority"
- Warm like family; rigorous like a healthcare professional
- Local and personal — not a national franchise
- Transparent about scope: non-medical only, always refers out for skilled care

## Tone of Voice
- Warm, reassuring — never clinical or corporate
- Plain language — no jargon
- Acknowledge the anxiety: "We know this is hard"
- Refer to care recipients as "your loved one," "mom," "dad," or "your parent" — never "the elderly" or "patients"
- Use "seniors" or "older adults" — never "elderly"

## Color Palette

### Light Theme (default)
| CSS Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#2D6A6A` | Deep Slate Teal — primary brand, CTAs, nav active |
| `--color-primary-dark` | `#1F4D4D` | Hover states on primary |
| `--color-primary-light` | `#E6F0EE` | Teal-tinted icon tiles, answer blocks (warmed slightly in Nov 2026 to sit better on ivory) |
| `--color-secondary` | `#FAF7F0` | Warm Ivory — page background |
| `--color-accent` | `#D4923A` | Warm Amber — secondary CTAs, footer headings, highlights |
| `--color-accent-dark` | `#B87730` | Amber hover |
| `--color-accent-light` | `#FBF1E1` | Amber-tinted panels (hospice, careers) |
| `--color-dark` | `#1E2B3A` | Near-black — primary body text, footer bg |
| `--color-mid` | `#6B7E8F` | Slate gray — secondary text, captions, trust bar |
| `--color-green` | `#7DB87D` | Soft Green — checkmarks, trust icons, positive signals |
| `--color-card-bg` | `#F0EDE6` | Card/item backgrounds |
| `--color-white` | `#FFFFFF` | Pure white — header bg, card bg on dark sections |
| `--color-border` | `#E4DED3` | Borders, dividers |
| `--color-error` | `#B73A2A` | Form validation errors (darkened for AA on white) |
| `--color-success` | `#23824F` | Form success (darkened — `#27AE60` was ~2.9:1 on white) |

#### Supporting tones (added Nov 2026)
| CSS Token | Light Hex | Dark Hex | Role |
|---|---|---|---|
| `--color-body` | `#3A4756` | `#D3CBBD` | Paragraph text (~8:1 on ivory). Use `--color-dark` for headings |
| `--color-muted` | `#5A6B7B` | `#A5B1BC` | Secondary text — AA on ivory/white. Prefer over `--color-mid` (`#6B7E8F` is ~4:1, below AA for body copy) |
| `--color-linen` | `#F3EEE4` | `#182226` | Inset panels (pathway explorer, worksheet callout) |
| `--color-line` | `#DCD4C6` | `#33413F` | Hairlines that structure lists |
| `--color-deep` | `#1B4444` | `#0F2627` | Evergreen band (Quality section) |
| `--color-on-deep` / `-muted` | `#F4EFE6` / `#B9CBC8` | `#ECE4D4` / `#A9BDBA` | Text on evergreen |
| `--color-accent-on-deep` | `#E8B36E` | `#E8B36E` | Amber that passes AA on evergreen (footer headings) |
| `--color-on-primary` | `#FFFFFF` | `#0F1B1C` | Text on teal buttons |
| `--color-footer` | `#173A3A` | `#0D1517` (hard-coded override) | Footer background |

### Dark / Night Theme (`data-theme="dark"` on `<html>`)
Warm charcoal base with a faint teal undertone — preserves "compassionate warmth + professional authority" on dark backgrounds. Teal and amber are brightened for WCAG AA contrast. Text uses warm off-white (not pure white) to stay brand-warm.

| CSS Token | Dark Hex | Role |
|---|---|---|
| `--color-secondary` | `#141C1F` | Page background — deep warm charcoal |
| `--color-white` | `#1E2A2D` | Elevated surface (header, cards) |
| `--color-card-bg` | `#22302F` | Secondary card surface |
| `--color-dark` | `#ECE4D4` | Primary text — warm ivory-white |
| `--color-mid` | `#9BAAB8` | Secondary text, captions |
| `--color-border` | `#2F3B3D` | Dividers, input borders |
| `--color-primary` | `#5FB3B3` | Brand teal — brightened for AA contrast (~7.4:1) |
| `--color-primary-dark` | `#7FC9C9` | Hover — inverts lighter on dark |
| `--color-primary-light` | `#1A3A3A` | Teal-tinted fill — dark inversion |
| `--color-accent` | `#E5A659` | Warm amber — softened (~8.9:1) |
| `--color-accent-dark` | `#F0BB78` | Amber hover — inverts lighter |
| `--color-accent-light` | `#33291B` | Amber-tinted fill — dark inversion |
| `--color-green` | `#9BD09B` | Checkmarks, trust signals |
| `--color-error` | `#E8624E` | Form validation |
| `--color-success` | `#4FD187` | Success feedback |

**Footer exception**: `--color-dark` is repurposed as body text in dark mode, so the footer hard-codes `background-color: #0D1517` (near-black teal-charcoal) rather than using the token. Do not change this to a token reference.

## Typography (Nov 2026)
- **Display font**: `Fraunces` (Google Fonts, variable — `opsz` 9–144, `wght` 350–500, `SOFT` 0–100). `--font-display`, always with `font-variation-settings: var(--soft)` (`"SOFT" 70` — rounded, warm terminals). Light weights at large sizes read as elegant: h1 380, h2 400, logo 500. Used for **display sizes only (≥ 24px)**: h1/h2, service names, the pathway title, step numerals, prices and hours in the estimator, the menu-sheet links, and the logo name. Never for UI controls or small text.
- **Everything else**: `Atkinson Hyperlegible Next` (Google Fonts, `wght` 400–700; `--font-body` = `--font-heading`). Drawn by the Braille Institute for low-vision readers — a deliberate choice for an audience that includes seniors. It replaced Inter.
- H1: `clamp(2.5rem, 1.55rem + 3.9vw, 4.75rem)`, Fraunces 380, letter-spacing -0.028em, line-height 1.02
- H2: `clamp(2rem, 1.45rem + 2.3vw, 3.25rem)`, Fraunces 400
- H3: `1.375rem`, Atkinson 700
- Body: `1.125rem` (18px), line-height 1.65; lede paragraphs up to `1.3125rem`
- Small/caption: `0.9375rem`; never below `0.8125rem`
- **No all-caps eyebrows** above headings, and no single words picked out in a different color/italic inside a headline. Headings are sentence case.

## Visual Style
- **Signature motif — the arch**: a doorway shape (`--arch: 999px 999px 20px 20px`; `--arch-soft` has 160px shoulders) symbolizing the threshold of home. Used on the hero photo (with a second outline arch behind it), photo frames and banners, the map, icon tiles, vetting marks, step numerals, the sample-week day tiles, and county markers. It is the one memorable element; everything around it stays quiet — hairline-ruled lists rather than card grids.
- **Corners**: sm=6px, md=12px, lg=20px, xl=32px, full=9999px
- **Shadows**: Soft, `rgba(30,43,58,...)` based — never harsh drop shadows
- **Icons**: Inline SVG only (Heroicons stroke style, 1.5–2px stroke-width) — no emoji in UI elements
- **Backgrounds**: a low, warm radial "window light" on the hero; ivory page with white `.section--surface` sections and one evergreen `.section--deep` band (Quality)
- **Spacing**: Generous — sections breathe; 80–96px vertical padding on desktop
- **Hero layout**: Left-aligned text at every width (F-pattern reading); arched photo beside it on desktop, below it on phones/tablets

## DO NOT
- Use garish gradients or bright/clashing colors
- Use clinical or hospital imagery
- Use the word "elderly"
- Represent or imply medical services
- Add phone number to live site until IDPH license NUMBER is received (approval is done; number pending)
- Use emoji as UI/design elements (only in prose if absolutely needed)
- Use the old color palette (navy #1A3A5A, gold #E6B800, sky #87CEEB)
- Use pure black (`#000000`) or pure white (`#FFFFFF`) as dark-mode backgrounds or text — the palette uses warm near-blacks and warm off-whites to stay on-brand
- Introduce new hard-coded hex/rgba values in screen CSS without adding a matching `:root[data-theme="dark"]` override
