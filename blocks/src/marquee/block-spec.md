# Block: Marquee
**Block name:** `agent-theme/marquee`
**Version:** 1.0.0
**Generated:** 2026-03-09
**Source designs:** `designs/marquee-rotate.html` + `designs/marquee-simple.html`

## Purpose
Animated scrolling marquee supporting one or two strips. When layout is "double" and tilt is enabled, the two strips overlap at opposing angles (one tilted −N°, one +N°) inside a fixed-height section — matching the marquee-rotate design. When layout is "single" and tilt is off, a flat single-strip marquee is produced — matching the marquee-simple design. All visual properties (colors, speed, angle, font size, separator dots) are configurable per-strip from the editor sidebar.

## Attributes

| Attribute | Type | Default | What it controls |
|---|---|---|---|
| layout | string | "double" | "single" or "double" — number of visible strips |
| tilt | boolean | true | Whether strips are rotated and absolutely positioned for overlap |
| tiltAngle | number | 5 | Rotation in degrees applied to each strip (strip 1 negative, strip 2 positive) |
| sectionHeight | number | 600 | Section height in px — only relevant when tilt is true |
| sectionBg | string | "" | Section background color (empty = transparent) |
| speed | number | 20 | CSS animation duration in seconds — lower = faster |
| pauseOnHover | boolean | false | Pauses animation when cursor is over the block |
| strips | array | 2 strips | Array of strip objects (see strip shape below) |

**Strip object shape:**

| Field | Type | Default strip 1 | Default strip 2 |
|---|---|---|---|
| id | number | 1 | 2 |
| bgColor | string | #C1ED00 | #141414 |
| textColor | string | #141414 | #C1ED00 |
| direction | string | "ltr" | "rtl" |
| showSeparator | boolean | true | true |
| separatorColor | string | #141414 | #C1ED00 |
| fontSize | number | 30 | 30 |
| gap | number | 30 | 30 |
| items | array | 6 items | 6 items |

**Item object shape:** `{ id: number, text: string }`

## Theme Tokens Used

| Token slug | CSS variable | Where used in block |
|---|---|---|
| dm-sans | --wp--preset--font-family--dm-sans | Marquee item font-family (inline style) |

Note: Strip and section colors are stored as hex in attributes and applied via inline styles (set by the color pickers). The two defaults (#C1ED00 lime and #141414 near-black) correspond to theme tokens but are stored as hex because `PanelColorSettings`/`ColorPicker` works in hex.

## CSS Custom Properties

Set inline on the block root (`<section>`):

| Property | Set from | Used in style.scss |
|---|---|---|
| --marquee-speed | `speed` attribute | `.marquee-track--ltr`, `.marquee-track--rtl` animation-duration |
| --tilt-angle | `tiltAngle` attribute | Set as reference; tilt transforms use JS-calculated values |

Set inline on each strip wrapper:

| Property | Set from | Used in style.scss |
|---|---|---|
| --marquee-separator-color | `strip.separatorColor` | `.marquee-item--dot::after` background-color |

## Files

| File | Purpose |
|---|---|
| block.json | Attribute schema, metadata, supports |
| index.js | Block registration entry point |
| edit.js | Editor component — canvas preview + full InspectorControls |
| save.js | Frontend HTML output |
| style.scss | @keyframes, .marquee-item--dot::after, .marquee-strip positioning, pause-on-hover |
| block-spec.md | This file |

## Frontend Behaviour
The marquee animation runs via CSS only — no view.js. The `--marquee-speed` CSS custom property controls duration. Pause on hover is handled via `&[data-pause-on-hover='true']:hover .marquee-track { animation-play-state: paused }` in style.scss — no JavaScript required.

Each strip's item list is duplicated once in the HTML output. The LTR animation moves the track from `0` to `-50%`, and the RTL animation from `-50%` to `0` — both loop seamlessly regardless of item count.

## Known Constraints
- `layout: "single"` only renders `strips[0]`. Settings in the Strip 2 panel are preserved but inactive until layout switches back to "double".
- `tilt: true` + `layout: "single"` will rotate the single strip but the absolute positioning and height-based overlap only look correct with two strips.
- The separator dot `margin-left` is hardcoded to `30px` in style.scss. If `gap` is set very small (< 30), the dot will visually overlap the next item's text — set `gap ≥ 46` when using separators for clean spacing.
- Adding a third strip requires both adding a new object to the `strips` default array in block.json and adding a third case to the tilt positioning logic in edit.js and save.js.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-03-09 | Initial block — combines marquee-rotate and marquee-simple designs |
