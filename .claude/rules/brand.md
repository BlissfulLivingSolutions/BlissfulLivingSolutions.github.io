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
| `--color-primary-light` | `#E8F4F4` | Teal-tinted badge/section backgrounds |
| `--color-secondary` | `#FAF7F0` | Warm Ivory — page background |
| `--color-accent` | `#D4923A` | Warm Amber — secondary CTAs, footer headings, highlights |
| `--color-accent-dark` | `#B87730` | Amber hover |
| `--color-accent-light` | `#FDF3E3` | Amber-tinted light sections |
| `--color-dark` | `#1E2B3A` | Near-black — primary body text, footer bg |
| `--color-mid` | `#6B7E8F` | Slate gray — secondary text, captions, trust bar |
| `--color-green` | `#7DB87D` | Soft Green — checkmarks, trust icons, positive signals |
| `--color-card-bg` | `#F0EDE6` | Card/item backgrounds |
| `--color-white` | `#FFFFFF` | Pure white — header bg, card bg on dark sections |
| `--color-border` | `#E2DDD5` | Borders, dividers |
| `--color-error` | `#C0392B` | Form validation errors |
| `--color-success` | `#27AE60` | Form success, positive feedback |

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
| `--color-accent-light` | `#3A2D1B` | Amber-tinted fill — dark inversion |
| `--color-green` | `#9BD09B` | Checkmarks, trust signals |
| `--color-error` | `#E8624E` | Form validation |
| `--color-success` | `#4FD187` | Success feedback |

**Footer exception**: `--color-dark` is repurposed as body text in dark mode, so the footer hard-codes `background-color: #0D1517` (near-black teal-charcoal) rather than using the token. Do not change this to a token reference.

## Typography
- **Display font**: `Fraunces` (Google Fonts, variable — `opsz` 9–144, weight 400–700). Used for **h1/h2 and pull-quotes only** (`--font-display`), weight ~540, letter-spacing -0.015em. Its soft terminals carry "compassionate warmth"; never use it for UI controls or small text.
- **Heading/UI sans**: `Inter` (`--font-heading`) — h3/h4, buttons, labels, numbers.
- **Body font**: `Inter` (Google Fonts, weight 400/500/600)
- H1: `clamp(2.125rem, 5.5vw, 3.5rem)`, Fraunces 540
- H2: `clamp(1.625rem, 4vw, 2.375rem)`, Fraunces 540
- H3: `1.5rem`, Inter 600
- Body: `1.0625rem` (17px), line-height 1.7
- Small/caption: `0.875rem`
- Eyebrows/section labels: `0.8125rem` Inter 600, letter-spacing 0.08em, teal

## Visual Style
- **Corners**: sm=6px, md=12px, lg=20px, xl=32px, full=9999px
- **Shadows**: Soft, `rgba(30,43,58,...)` based — never harsh drop shadows
- **Icons**: Inline SVG only (Heroicons stroke style, 1.5–2px stroke-width) — no emoji in UI elements
- **Backgrounds**: Subtle radial gradients on hero; alternating `--color-white` / `--color-secondary` sections
- **Spacing**: Generous — sections breathe; 80–96px vertical padding on desktop
- **Hero layout**: Left-aligned text on desktop (F-pattern reading), centered on mobile

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
