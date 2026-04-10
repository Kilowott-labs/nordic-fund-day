# agent-theme — Claude Code Context

## Stack

| Layer | Detail |
|---|---|
| Platform | WordPress 6.x FSE / Gutenberg |
| Theme | `agent-theme` at `wp-content/themes/agent-theme/` |
| PHP | 8.4 — XAMPP: `C:\fixed-xampp\htdocs\wordpress` |
| Block namespace | `agent-theme` |
| Primary styling | **Tailwind CSS** — 1:1 Figma Make fidelity |
| SCSS escape hatch | `style.scss` — only for CSS Tailwind cannot express |
| JS | Vanilla ES6+ — no jQuery |
| Build | `@wordpress/scripts` → `npm run build` / `npm run start` |
| Local URL | `http://localhost/wordpress` |
| MCP | Figma MCP (Framelink, one call per page → cached locally) + Chrome DevTools MCP |

## Project Structure

```
wp-content/themes/agent-theme/
├── figma-cache/                 # Figma design data — fetched once, reused always
│   ├── [page-name]-full.json   # Raw full page JSON (single Figma MCP call)
│   └── blocks/
│       └── [block-name].json   # Per-block JSON extracted from full — used by QA
├── blocks/src/[block-name]/     # Gutenberg block source
│   ├── block.json
│   ├── edit.js
│   ├── save.js
│   ├── view.js                  # only if interactive
│   └── style.scss               # only if Tailwind cannot express it
├── designs/                     # Raw Figma Make HTML exports
│   └── clean/                   # Cleaned output ready for block conversion
├── tests/visual-regression/
│   ├── design-qa-config.json
│   ├── reports/
│   └── .cache/
├── functions.php
└── theme.json                   # Source of truth for all design tokens
```

## Figma Cache — One Call, Always Reuse

Before any design or QA work, check `figma-cache/blocks/[block-name].json` exists.

**If missing — run the cache step once:**
```
Use the Figma MCP to fetch the full node JSON for this page:
Figma URL: [url]
Page Node ID: [node-id]
Save to figma-cache/[page-name]-full.json — raw, no trimming, no summarising.
Then extract each top-level child node into figma-cache/blocks/[block-name].json.
```

**All QA runs read from `figma-cache/blocks/` — never call Figma MCP during QA.**

Commit `figma-cache/` to Git so the whole team shares it.

## Pipeline — Run With /build-block

```
/build-block [block-name]
```

Three sequential phases, each pausing for your approval:
1. **UI Developer** — Figma Cache Step → clean `designs/[name].html` → `designs/clean/[name].html`
2. **Block Developer** — convert clean HTML → `blocks/src/[name]/`
3. **QA Reviewer** — code review + visual regression (Chrome DevTools MCP + local Figma cache)

## Styling Rules

### Tailwind First — SCSS Only as Escape Hatch

| Use Tailwind ✅ | Use style.scss only ☐ |
|---|---|
| Colors, spacing, typography | `@keyframes` animations |
| Layout — flex, grid, positioning | `::before` / `::after` pseudo-elements |
| Responsive — `md:` `lg:` prefixes | `:nth-child()` stagger selectors |
| Hover, focus, active states | Complex `clip-path` shapes |
| Opacity, transitions, transforms | Scroll-driven animations |
| Shadows, borders, border-radius | `mask` / `mask-image` complex values |

### Color Tokens — Non-Negotiable

Never hardcode hex anywhere — Tailwind or SCSS.

```jsx
// ❌ Never
className="text-[#604683] bg-[#ead8d6]"

// ✅ Always
className="text-[var(--wp--preset--color--primary)] bg-[var(--wp--preset--color--background-warm)]"
```

```scss
// ❌ Never
color: #604683;

// ✅ Always
color: var(--wp--preset--color--primary);
```

SVG fills: use `fill="currentColor"` + set color via Tailwind on parent element.

### Responsive — Tailwind Prefixes Only

Never convert Tailwind responsive classes to SCSS media queries.
Keep all: `sm:` `md:` `lg:` `xl:` `2xl:`

## Naming

- Block namespace: `agent-theme`
- Block name format: `agent-theme/block-name` (kebab-case)
- Registration: `blocks/blocks.php` via `register_block_type()`
- PHP functions: `agent_theme_function_name()`
- PHP classes: `Agent_Theme_Class_Name`
- JS selectors: `data-` attributes only — never couple JS to Tailwind class names

## Security — Non-Negotiable

```php
esc_html( $text )           // plain text output
esc_attr( $attribute )      // HTML attribute values
esc_url( $url )             // href and src values
wp_kses_post( $html )       // rich HTML content
sanitize_text_field()       // user text input
absint()                    // numeric input
```

## theme.json Token Reference

```jsx
// In JSX / Tailwind
className="text-[var(--wp--preset--color--primary)]"
className="bg-[var(--wp--preset--color--secondary)]"
className="text-[length:var(--wp--preset--font-size--large)]"
className="p-[var(--wp--preset--spacing--50)]"
className="font-[family-name:var(--wp--preset--font-family--primary)]"
```

```scss
// In style.scss
color: var(--wp--preset--color--primary);
font-size: var(--wp--preset--font-size--large);
padding: var(--wp--preset--spacing--50);
```

## Hard Rules — Never Do These

- Hardcode any hex color in Tailwind arbitrary values or SCSS
- Create `style.scss` without first confirming Tailwind cannot handle it
- Write SCSS media queries for responsive — use Tailwind prefixes in JSX
- Select by Tailwind class name in `view.js` — use `data-` attributes
- Modify WordPress core, plugin, or WooCommerce files directly
- Run `git push`, `git commit`, or `git add` without explicit developer approval
- Build blocks from scratch — always read an existing block first as reference
- Feed raw Figma Make HTML to the block developer without running cleanup first
- Call Figma MCP during QA — always read from `figma-cache/blocks/`
- Commit `.claude/mcp.json` — it contains the Figma API key
- Commit `figma-cache/` to a public repository — it contains proprietary design data

## Session Start

1. Check `PROJECT-STATUS.md` for current state and blockers
2. Check `figma-cache/blocks/` — if the block you need is missing, run the Figma Cache Step first
3. Check `designs/` for any new Figma Make exports waiting to be processed
4. Run `/build-block [name]` to start the pipeline
