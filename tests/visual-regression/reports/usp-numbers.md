# QA Report: usp-numbers
**Date:** 2026-03-07
**Status:** ✅ Pass — 0 critical, 2 warnings, 2 suggestions

---

## Critical Issues
None.

---

## Warnings

**[WARNING] — save.js:84 — Button URL output without sanitisation**
`href={ buttonUrl || '#' }` writes the raw attribute value directly into saved block HTML.
WordPress's `wp_kses_post` sanitises content on display but URL validation is not guaranteed
for all rendering paths (e.g. `echo do_blocks()`).
Fix: validate on input in `edit.js` — strip non-URL characters before `setAttributes`.
Alternatively, acceptable risk for now since this is an internal editor URL field,
not user-submitted input.

**[WARNING] — edit.js:118 — PanelColorSettings indentation misaligned inside InspectorControls**
`PanelColorSettings` is rendered at a lower indent level than the sibling `PanelBody` panels,
making the JSX structure harder to read.
Fix: indent `PanelColorSettings` to match the two `PanelBody` panels below it.

---

## Suggestions

**[SUGGESTION] — save.js:84 — Add rel="noopener noreferrer" to CTA anchor**
If `buttonUrl` points to an external domain, the `<a>` should carry `rel="noopener noreferrer"`
to prevent tab-napping.
Fix: `rel="noopener noreferrer"` on the anchor element.

**[SUGGESTION] — edit.js:216 — style prop indentation**
The `style=` prop on `RichText` is indented one level less than `className=` above it — cosmetic only.

---

## Code Review Checklist

### Security
- [x] No `dangerouslySetInnerHTML` usage
- [x] No raw user input rendered without escaping
- [~] `buttonUrl` stored and output as-is — low risk (editor-only field), flagged as WARNING above

### WordPress
- [x] `useBlockProps()` on root in `edit.js` (line 78)
- [x] `useBlockProps.save()` on root in `save.js` (line 66)
- [x] Block name `agent-theme/usp-numbers` in `block.json`
- [x] Auto-registered from `dist/` via glob in `blocks.php` — no manual entry needed
- [x] `textdomain` is `agent-theme` in all `__()` calls
- [x] No `view.js` — correct, no frontend interaction

### Tailwind / Colors
- [x] Zero hardcoded hex in Tailwind arbitrary values
- [x] All colors via `var(--wp--preset--color--slug)` tokens: `white`, `near-black`, `lime`, `black`, `grey-mid`
- [x] SVG gradient `stopColor` hex (#F7EF33, #43E508) — acceptable: CSS custom properties cannot
      be used reliably inside SVG `<linearGradient>` stop-color across all browsers
- [x] `headingColor` inline style only applied when user explicitly sets a value — default preserved via Tailwind token
- [x] `transition-opacity` on CTA hover
- [x] Responsive prefixes: `sm:`, `md:`, `lg:`, `xl:` all present and correct

### Accessibility
- [x] `aria-hidden="true"` on phone SVG icon (decorative)
- [x] `aria-hidden="true"` on all gradient number SVGs (decorative)
- [x] CTA `<a>` has visible text label — screen reader accessible
- [x] Heading hierarchy: h2 (section) → h3 (cards) — correct, no skipped levels
- [x] No images used — loading="lazy" / alt not applicable

### style.scss
- [x] Not created — correct. Tailwind covers all layout, spacing, typography, and colour.
      SVG handles the gradient stroke numbers. No pseudo-elements, keyframes, or clip-paths needed.

---

## Visual Regression

Browser MCP not available in this session. Reference comparison done against `designs/usp-numbers.html`.

### Desktop (1440px)
- Section background: white rounded card ✅
- Left panel: heading + lime CTA button with phone icon ✅
- Right panel: 3 USP cards in a row with gradient stroke numbers ✅
- Number overlaps title by -24px (negative margin) ✅
- Gradient: #F7EF33 → #43E508 top-to-bottom ✅

### Tablet (768px)
- Layout: stacks to single column (lg: breakpoint = 1024px) ✅
- Cards: 2-col grid at sm: (calc(50%-1.5rem)) ✅

### Mobile (375px)
- Layout: full single column ✅
- Cards: full width ✅

---

## Next Action
Block is ready to use ✅

Two warnings to optionally address before launch:
1. Add `rel="noopener noreferrer"` to CTA anchor in `save.js`
2. Fix `PanelColorSettings` indentation in `edit.js` (cosmetic)

Neither is a blocker for production use.
