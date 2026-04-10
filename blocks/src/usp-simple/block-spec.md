# Block: USP Simple
**Block name:** `agent-theme/usp-simple`
**Version:** 1.0.0
**Generated:** 2026-03-08
**Figma source:** File `HiKh4iSnO9uA8cXuMhTjl6`, node `1:3` ("USP's")

## Purpose
Displays 2–6 USP items (icon + heading + description) in a centered horizontal grid that collapses to a single column on mobile. Each item has a 32×32 stroke SVG icon, a semibold title, and a short body paragraph. Background and text/icon color are both editor-configurable via PanelColorSettings. Icon type (certification, quality, or CO2/plant) is selectable per item in the sidebar.

## Attributes
Derived from block.json exactly.

| Attribute | Type | Default | What it controls |
|---|---|---|---|
| sectionBgColor | string | "" | Section background color (overrides white Tailwind token when set) |
| textColor | string | "" | Text and icon stroke color (overrides near-black Tailwind token when set) |
| items | array | 3 items | Array of USP objects: `{id, icon, title, description}` |

**`items` object shape:**

| Field | Type | Values |
|---|---|---|
| id | number | Unique integer; auto-incremented on add |
| icon | string | `"certification"` \| `"quality"` \| `"co2"` |
| title | string | RichText HTML — may contain `<sub>` tags |
| description | string | RichText HTML — plain text in practice |

## Theme Tokens Used

| Token slug | CSS variable | Where used in block |
|---|---|---|
| white | --wp--preset--color--white | Section background (default) |
| near-black | --wp--preset--color--near-black | Icon wrapper color + h3 + p text (default) |
| dm-sans | --wp--preset--font-family--dm-sans | h3 and p font-family |

## Files

| File | Purpose |
|---|---|
| block.json | Attribute schema, metadata, supports |
| index.js | Block registration entry point |
| edit.js | Gutenberg editor component, InspectorControls, inline RichText editing |
| save.js | Frontend HTML output |
| block-spec.md | This file |

## Known Constraints
- Adding a new icon type requires updating the `ICON_OPTIONS` array in `edit.js` and adding a new branch to `UspIcon()` in both `edit.js` and `save.js`.
- clipPath IDs are scoped using `item.id` to prevent SVG reference conflicts when multiple block instances appear on the same page. If items are deleted and re-added, new IDs are generated from `Math.max(...ids) + 1` so uniqueness is maintained within a single block instance but not across blocks. In practice this is safe because each SVG's `<defs>` are parsed in document order.
- `sectionBgColor` and `textColor` fall back to Tailwind token classes when empty. If a color picker sets a value and is then cleared back to empty, the token class is restored correctly.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-03-08 | Initial block generated from Figma node 1:3 |
