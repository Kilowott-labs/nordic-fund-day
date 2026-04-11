# Block: Pitch Showcase
**Block name:** `agent-theme/pitch-showcase`
**Version:** 1.0.0
**Generated:** 2026-04-11

## Purpose
Full-bleed background image section showing the tailored stage program. Contains subtitle, large heading, date info, a frosted-glass description card with CTA, and a horizontal row of 5 sector cards with SVG icons, titles, and descriptions.

## Attributes

| Attribute | Type | Default | What it controls |
|---|---|---|---|
| backgroundImage | string | "" | Full-bleed background image URL |
| backgroundImageId | number | 0 | WordPress media ID |
| subtitle | string | "✦ Tailored Stage Program" | Mono label |
| heading | string | "Pitches, Context &<br>Direction for Nordic Deals" | Main heading |
| dateInfo | string | "May 5, 16:00 at Fiskepiren, Stavanger" | Date/location line |
| descriptionText | string | "12 carefully selected..." | Frosted card body text |
| ctaLabel | string | "REQUEST YOUR SPOT" | CTA button label |
| ctaUrl | string | "#" | CTA button URL |
| ctaOpenInNewTab | boolean | false | Open in new tab |
| sectors | array | [5 sectors] | Sector cards: `{id, title, description, iconSvg}` |

### Sector SVG icons
Icons are stored as raw SVG markup strings using `currentColor` for stroke/fill. This allows the lime color to be applied via the parent's text color class.

## Theme Tokens Used

| Token slug | CSS variable | Where used |
|---|---|---|
| lime | --wp--preset--color--lime | Sector card icons, titles, hover state |
| dark-card | --wp--preset--color--dark-card | Sector card backgrounds |
| grey-muted | --wp--preset--color--grey-muted | Sector card descriptions |

## Files

| File | Purpose |
|---|---|
| block.json | Attribute schema with sectors array containing SVG markup |
| edit.js | Editor with MediaUpload, RichText, sector card management |
| save.js | Frontend HTML with gradient overlays, frosted card, sector row |
| index.js | Block registration |
| block-spec.md | This documentation file |

## Known Constraints
- Sector icons use `dangerouslySetInnerHTML` for SVG rendering — SVG must be sanitized input
- Gradient overlays use inline styles (rgba values cannot be Tailwind tokens)
- Description card has `outline: 1px solid #bfbfbf` as inline style
- Background aspect ratio maintains 1920/1200 on desktop via `lg:aspect-[1920/1200]`

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-04-11 | Initial block generated |
