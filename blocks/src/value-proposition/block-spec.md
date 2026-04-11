# Block: Value Proposition
**Block name:** `agent-theme/value-proposition`
**Version:** 1.0.0
**Generated:** 2026-04-11

## Purpose
Split-layout section with a dark background. Left column contains subtitle, large heading (with highlighted "This is it." in lime), body text, and red cross (✗) pain-point cards. Right column displays two side-by-side images with gradient overlays, diagonal lime accent slashes, and a quote overlay.

## Attributes

| Attribute | Type | Default | What it controls |
|---|---|---|---|
| subtitle | string | "✦ A New Format for Real Connections" | Mono label above heading |
| heading | string | "If there is one event..." | Main heading with inline HTML for lime highlight |
| bodyText | string | "Not because it's bigger..." | Description paragraph |
| painPoints | array | [2 items] | Red cross cards: `{id, text}` |
| imageLeft | string | "" | Left image URL (speaker/presenter) |
| imageLeftId | number | 0 | WordPress media ID |
| imageRight | string | "" | Right image URL (audience) |
| imageRightId | number | 0 | WordPress media ID |
| quoteText | string | "A carefully curated program..." | Quote overlay on right image |

## Theme Tokens Used

| Token slug | CSS variable | Where used |
|---|---|---|
| near-black | --wp--preset--color--near-black | Section background (#010101) |
| lime | --wp--preset--color--lime | Heading highlight, diagonal slashes, quote icon |
| red-cross | --wp--preset--color--red-cross | Pain point cross icon |

## Files

| File | Purpose |
|---|---|
| block.json | Attribute schema with dual image support |
| edit.js | Editor with RichText, MediaUpload for both images, pain point management |
| save.js | Frontend HTML with gradient overlays, diagonal lime accents, quote overlay |
| index.js | Block registration |
| block-spec.md | This documentation file |

## Known Constraints
- Heading attribute contains inline HTML (`<span>` with lime color class) — editing preserves this via RichText
- Diagonal lime slashes use CSS transforms (inline style) — cannot be expressed in Tailwind
- Gradient overlays use inline styles for rgba values
- Image placeholders show in editor when no image is selected

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-04-11 | Initial block generated |
