# Block: Investor Brunch
**Block name:** `agent-theme/investor-brunch`
**Version:** 1.0.0
**Generated:** 2026-04-11

## Purpose
Event showcase section for the Investor Brunch. Mirrored layout from Treasure Mixer — content on left, offset image on right with lime accent rectangle behind. Feature badges with SVG icons on black background, CTA button.

## Attributes

| Attribute | Type | Default | What it controls |
|---|---|---|---|
| subtitle | string | "✦ TOP OF THE CITY – INVESTORS ONLY" | Mono label |
| heading | string | "Investor<br>Brunch" | Main heading |
| dateInfo | string | "May 6, 10:00 at Fiskepiren, Stavanger" | Date line |
| description | string | HTML paragraphs | Multi-paragraph body text |
| image | string | "" | Event image URL |
| imageId | number | 0 | WordPress media ID |
| imageAlt | string | "Investor Brunch at Seid" | Image alt text |
| labelLine1 | string | "INVITE ONLY" | Top label on lime accent |
| labelLine2 | string | "LIMITED SEATS" | Bottom label on lime accent |
| badges | array | [3 badges] | Feature badges: `{id, text, iconSvg}` |
| ctaLabel | string | "REQUEST YOUR SPOT" | CTA button label |
| ctaUrl | string | "#" | CTA URL |
| ctaOpenInNewTab | boolean | false | Open in new tab |

## Layout
- **Desktop:** Content left (634px max), image right (52%)
- **Mobile:** Image stacks above content (`flex-col-reverse`)
- **Image offset:** Lime rectangle behind image, offset top-right. Image offset bottom-left.
- **Labels:** Right-aligned, black text on lime accent

## Key Differences from Treasure Mixer
- Flex direction: `flex-col-reverse lg:flex-row` (vs `flex-col lg:flex-row`)
- Accent color: Lime `#D4FF49` (vs Black)
- Label text color: Black (vs White)
- Badge background: `bg-black` (vs `bg-[#212121]`)
- Label alignment: Right-aligned `items-end pr-8` (vs Left-aligned `pl-8`)

## Theme Tokens Used

| Token slug | CSS variable | Where used |
|---|---|---|
| lime | --wp--preset--color--lime | Accent rectangle, badge icon color |
| lime-cta | --wp--preset--color--lime-cta | CTA button background |

## Files

| File | Purpose |
|---|---|
| block.json | Attribute schema |
| edit.js | Editor with MediaUpload, RichText, badge management |
| save.js | Frontend HTML — mirrored layout from treasure-mixer |
| index.js | Block registration |
| block-spec.md | This documentation file |

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-04-11 | Initial block generated |
