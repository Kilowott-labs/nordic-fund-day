# Block: Treasure Island Mixer
**Block name:** `agent-theme/treasure-mixer`
**Version:** 1.0.0
**Generated:** 2026-04-11

## Purpose
Event showcase section for the Treasure Island Mixer. Features an offset image layout (image on left with black accent rectangle behind), heading, date info, multi-paragraph description, feature badges with SVG icons, and CTA button. White background section.

## Attributes

| Attribute | Type | Default | What it controls |
|---|---|---|---|
| subtitle | string | "✦ NETWORKING COCKTAIL & FINGERFOOD AT" | Mono label above heading |
| heading | string | "The Treasure<br>Island Mixer" | Main heading |
| dateInfo | string | "May 5, 18:30 at Fiskepiren, Stavanger" | Date/location line |
| description | string | HTML paragraphs | Multi-paragraph body text |
| image | string | "" | Main event image URL |
| imageId | number | 0 | WordPress media ID |
| imageAlt | string | "Treasure Island Mixer" | Image alt text |
| labelLine1 | string | "INVITE ONLY" | Top label on black accent area |
| labelLine2 | string | "LIMITED SEATS" | Bottom label on black accent area |
| badges | array | [4 badges] | Feature badges: `{id, text, iconSvg}` |
| ctaLabel | string | "REQUEST YOUR SPOT" | CTA button label |
| ctaUrl | string | "#" | CTA button URL |
| ctaOpenInNewTab | boolean | false | Open in new tab |

## Layout
- **Desktop:** Image left (52%), content right (634px max)
- **Mobile:** Image stacks above content
- **Image offset:** Black rectangle behind image, offset top-left. Image offset bottom-right by 30-75px (responsive).

## Theme Tokens Used

| Token slug | CSS variable | Where used |
|---|---|---|
| lime | --wp--preset--color--lime | Badge icon color |
| lime-cta | --wp--preset--color--lime-cta | CTA button background |
| dark-card | --wp--preset--color--dark-card | Badge background |

## Files

| File | Purpose |
|---|---|
| block.json | Attribute schema with badges array |
| edit.js | Editor with MediaUpload, RichText multiline, badge management |
| save.js | Frontend HTML matching static design exactly |
| index.js | Block registration |
| block-spec.md | This documentation file |

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-04-11 | Initial block generated |
