# Block: Schedule Grid
**Block name:** `agent-theme/schedule-grid`
**Version:** 1.0.0
**Generated:** 2026-04-11

## Purpose
Displays a 3-column day schedule grid showing events across multiple days. Each day card contains a date label, title, horizontal divider, and a list of timed events with optional access badges (e.g., "Expo Ticket Required", "Open to All", "By Invitations Only").

## Attributes

| Attribute | Type | Default | What it controls |
|---|---|---|---|
| subtitle | string | "✦ Full Schedule" | Mono label above heading |
| heading | string | "What's on in<br>Stavanger May 4–6" | Main section heading |
| ctaLabel | string | "Full Programme" | Green CTA button label |
| ctaUrl | string | "#" | CTA button URL |
| ctaOpenInNewTab | boolean | false | Whether CTA opens in new tab |
| days | array | [3 days] | Day cards: `{id, dateLabel, title, events: [{time, title, description, badge, badgeType}]}` |

### Event object shape
```json
{
  "time": "09:00",
  "title": "Event Name",
  "description": "Optional description text",
  "badge": "Open to All",
  "badgeType": "white"
}
```

### Badge types
- `"white"` — White border + white text (for open/free events)
- `"lime"` — Lime border + lime text (for restricted/ticketed events)
- `""` (empty) — No badge shown

## Theme Tokens Used

| Token slug | CSS variable | Where used |
|---|---|---|
| lime | --wp--preset--color--lime | Date labels, lime badges |
| lime-cta | --wp--preset--color--lime-cta | CTA button background |
| dark-pill | --wp--preset--color--dark-pill | Day card background |

## Files

| File | Purpose |
|---|---|
| block.json | Attribute schema with nested days/events arrays |
| edit.js | Editor with RichText heading, nested sidebar panels for days > events |
| save.js | Frontend HTML with Badge component for access indicators |
| index.js | Block registration |
| block-spec.md | This documentation file |

## Inspector Controls
- **CTA Button panel:** Label, URL, open-in-new-tab
- **Per-day panels:** Date label, day title
  - **Per-event sub-panels:** Time, title, description, badge text, badge style selector
  - Add/remove event buttons per day

## Known Constraints
- Days are stored as a flat array — reordering requires manual attribute editing
- Each event's badge visibility is controlled by non-empty `badge` text
- `badgeType` selector only appears when badge text is non-empty

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-04-11 | Initial block generated |
