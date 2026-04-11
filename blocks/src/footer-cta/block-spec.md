# Block: Footer CTA
**Block name:** `agent-theme/footer-cta`
**Version:** 1.0.0
**Generated:** 2026-04-11

## Purpose
Full-width footer CTA section with a background image (landscape), gradient overlay, date badge, large heading, mono description, three CTA buttons (primary + ghost variants), stats row, and copyright bar. Designed as the final call-to-action before the page ends.

## Attributes

| Attribute | Type | Default | What it controls |
|---|---|---|---|
| backgroundImage | string | "" | Background image URL |
| backgroundImageId | number | 0 | WordPress media library ID |
| dateBadge | string | "May 5–6, 2026 · Stavanger, Norway" | White pill badge text |
| heading | string | "Be Where<br>Deals Happen" | Large hero-style heading |
| description | string | "Nordic Fund Day — where capital meets..." | Mono body text |
| buttons | array | [3 buttons] | CTA buttons: `{id, label, url, style}` |
| stats | array | [3 stats] | Stats row: `{id, text}` |
| copyrightLeft | string | "© 2026 Nordic Funday..." | Left copyright text |
| copyrightRight | string | "Powered by Kilowott" | Right copyright text |

### Button styles
- `"primary"` — Lime green background, black text
- `"ghost"` — Transparent with white border + backdrop blur

## Theme Tokens Used

| Token slug | CSS variable | Where used |
|---|---|---|
| lime | --wp--preset--color--lime | Primary button background, ghost button hover |

## Files

| File | Purpose |
|---|---|
| block.json | Attribute schema with buttons/stats arrays |
| edit.js | Editor with MediaUpload for background, RichText for heading/description, sidebar for buttons/stats/copyright |
| save.js | Frontend HTML with gradient overlay, responsive button layout |
| index.js | Block registration |
| block-spec.md | This documentation file |

## Inspector Controls
- **Background Image panel:** MediaUpload with preview, remove button
- **Content panel:** Date badge text
- **CTA Buttons panel:** Per-button label, URL, style selector
- **Stats panel:** Per-stat text fields
- **Copyright panel:** Left/right text fields

## Known Constraints
- Background image is applied via inline style (required for dynamic URLs)
- Footer description uses inline `color: #373737` (grey-body token) as Tailwind arbitrary value can't reference the token for inline styles
- Buttons on mobile stack to full-width via `flex-col` → `sm:flex-row`

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-04-11 | Initial block generated |
