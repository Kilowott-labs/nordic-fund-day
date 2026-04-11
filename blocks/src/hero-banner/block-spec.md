# Block: Hero Banner
**Block name:** `agent-theme/hero-banner`
**Version:** 1.0.0
**Generated:** 2026-04-11

## Purpose
Full-screen hero section for the Nordic Fund Day landing page. Features a parallax background image, multi-line event title with glow effect, date badge, dual CTA buttons (primary lime + ghost glass), a spacer, partner logo row, frosted-glass description card with two buttons, and a stats row with large numbers.

## Attributes

| Attribute | Type | Default | What it controls |
|---|---|---|---|
| backgroundImage | string | "" | Parallax background image URL |
| backgroundImageId | number | 0 | WordPress media ID |
| dateBadge | string | "May 5–6, 2026" | Date badge text in frosted pill |
| titleLines | array | [3 lines] | Hero title lines: `{id, text}` |
| primaryCta | object | `{label, sublabel, url}` | Green CTA card (Investors) |
| secondaryCta | object | `{label, sublabel, url}` | Ghost CTA card (Exclusive) |
| partnerLogos | array | [5 logos] | Partner logos: `{id, url, imageId, alt}` |
| cardText | string | "The must-attend event..." | Frosted card description |
| cardButton1 | object | `{label, url}` | Card black button (Investor Programme) |
| cardButton2 | object | `{label, url}` | Card white button (Become a Partner) |
| stats | array | [3 stats] | Stats: `{id, value, label}` |

## Theme Tokens Used

| Token slug | CSS variable | Where used |
|---|---|---|
| lime | --wp--preset--color--lime | Primary CTA bg, secondary CTA hover, card button hover |
| dark-olive | --wp--preset--color--dark-olive | CTA text color on lime bg |

## Files

| File | Purpose |
|---|---|
| block.json | Complex attribute schema with nested objects/arrays |
| edit.js | Editor with MediaUpload for bg + logos, TextControl for titles/CTAs/stats |
| save.js | Frontend HTML with data- attributes for GSAP animation hooks |
| style.scss | Text-shadow glow effects, parallax will-change |
| index.js | Block registration |
| block-spec.md | This documentation file |

## GSAP Animation Hooks (data- attributes)
The save.js outputs these data attributes for external GSAP scripts:
- `data-hero-banner` — block root
- `data-hero-badge` — date badge (fade in)
- `data-hero-title` — each title line (staggered reveal)
- `data-hero-cta` — CTA buttons (slide up)
- `data-hero-bottom` — bottom section (fade in)

## Known Constraints
- Background image uses `loading="eager"` (above the fold, no lazy)
- Parallax effect requires external GSAP ScrollTrigger setup (not in view.js)
- Title lines are stored as array — changing line count requires editing block.json defaults
- Partner logos require individual MediaUpload per logo (5 slots)
- The `min-[1600px]:` breakpoint classes handle the original Figma padding for large screens

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-04-11 | Initial block generated |
