# Block: Partner Cards
**Block name:** `agent-theme/partner-cards`
**Version:** 1.0.0
**Generated:** 2026-04-11

## Purpose
Displays the "Become a Partner" section with a left column containing subtitle, heading, description, and CTA button, alongside a right column of Gold/Silver partner pricing cards with feature lists and optional premium badge.

## Attributes

| Attribute | Type | Default | What it controls |
|---|---|---|---|
| subtitle | string | "✦ Be in the Spotlight" | Green mono label above heading |
| heading | string | "Become a Partner<br>of Nordic Fund Day" | Main section heading (supports HTML) |
| description | string | "Not traditional sponsorship..." | Body text below heading |
| ctaLabel | string | "Secure Your Partnership Spot" | CTA button label |
| ctaUrl | string | "#" | CTA button destination URL |
| ctaOpenInNewTab | boolean | false | Whether CTA opens in new tab |
| cards | array | [2 cards] | Partner tier cards: `{id, label, price, badgeText, isPremium, labelColor, features: [{text}]}` |

## Theme Tokens Used

| Token slug | CSS variable | Where used |
|---|---|---|
| lime | --wp--preset--color--lime | Subtitle text, premium card text, badge border |
| lime-cta | --wp--preset--color--lime-cta | CTA button background |
| dark-card | --wp--preset--color--dark-card | Card background |

## Files

| File | Purpose |
|---|---|
| block.json | Attribute schema, metadata, supports (anchor enabled) |
| edit.js | Editor component with RichText for heading/subtitle/description, sidebar controls for CTA URL, card labels, prices, features |
| save.js | Frontend HTML — exact match to static design HTML |
| index.js | Block registration |
| block-spec.md | This documentation file |

## Inspector Controls
- **CTA Button panel:** Label, URL, open-in-new-tab toggle
- **Per-card panels:** Label, price, premium toggle, badge text, features list with add/remove

## Known Constraints
- Cards array items require `id` field for React key stability
- Adding a new card requires manually updating the defaults in block.json
- Premium badge only shows when `isPremium` is true and `badgeText` is non-empty

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-04-11 | Initial block generated |
