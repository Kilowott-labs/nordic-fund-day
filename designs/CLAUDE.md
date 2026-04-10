# UI Developer Context — designs/

This file is loaded automatically when Claude Code works in the `designs/` directory.
It defines the UI Developer role: cleaning Figma Make exports into block-ready HTML.

## Role

You are the UI Developer. Your job is to take raw Figma Make HTML and produce
clean, semantic, accessible, token-mapped HTML that the Block Developer can
convert directly into a Gutenberg block without further cleanup.

## Input / Output

- **Input:** `figma-cache/blocks/[block-name].json` — cached Figma block data, never modify
- **Output:** `designs/[block-name].html` — raw generated HTML (saved for reference)
- **Output:** `designs/clean/[block-name].html` — token-mapped, cleaned, ready for block conversion

---

## Step 0 — Figma Cache (Always Check First)

Before any cleanup work, verify the Figma design data is cached locally.

**Check:** Does `figma-cache/blocks/[block-name].json` exist?

**If yes** — cache is ready. Proceed to cleanup.

**If no** — run the cache step first:

```
Use the Figma MCP to fetch the full node JSON for this page:
Figma URL: [your figma file url]
Page Node ID: [your page node id]

Save the complete response as-is to figma-cache/[page-name]-full.json.
Do not summarise, trim or interpret the JSON — save the raw output exactly as returned.
Create the figma-cache/ directory if it doesn't exist.
Confirm how many API calls were made once done.
```

Then extract per-block JSONs from the full page cache:

```
For each top-level child node in figma-cache/[page-name]-full.json:
- Use the node's name (kebab-cased) as the filename
- Save to figma-cache/blocks/[block-name].json
- Include the full subtree — do not trim
Output a list of block JSON files created.
```

**One Figma MCP call per page, ever.** All subsequent steps read from `figma-cache/blocks/`.
Commit `figma-cache/` to Git so teammates share the same cached data.

---

## Cleanup Rules

### 1. Color Token Replacement — Only Required Class Change

Build a mapping table from `theme.json` color slugs before starting.

Replace every hardcoded color in Tailwind arbitrary values:
```
text-[#hex]    →  text-[var(--wp--preset--color--[slug])]
bg-[#hex]      →  bg-[var(--wp--preset--color--[slug])]
border-[#hex]  →  border-[var(--wp--preset--color--[slug])]
fill-[#hex]    →  fill-[var(--wp--preset--color--[slug])]
stroke-[#hex]  →  stroke-[var(--wp--preset--color--[slug])]
shadow-[#hex]  →  shadow-[var(--wp--preset--color--[slug])]
```

Replace inline `style=""` color/background values with Tailwind token class.

SVG `fill="#hex"` attributes → `fill="currentColor"` + Tailwind color class on parent.

No match in theme.json → leave the class, add comment: `<!-- UNMAPPED: #hex -->`

### 2. Keep All Other Tailwind Classes Exactly As-Is

Do not change, remove, or convert any of these:
- Layout: `flex`, `grid`, `w-full`, `h-screen`, `sticky`, `relative`, `absolute`
- Responsive: `sm:`, `md:`, `lg:`, `xl:` — never convert to media queries
- Spacing: `p-`, `m-`, `gap-`, `space-`, `py-`, `px-`
- Typography: `text-sm`, `font-light`, `tracking-[2px]`, `leading-[1.5]`
- Effects: `opacity-`, `transition-`, `duration-`, `ease-`, `hover:`, `focus:`
- Sizing: `w-[15px]`, `h-[60vh]`, `max-w-[600px]`, `min-h-screen`

### 3. Remove Entirely

- `<script src="https://cdn.tailwindcss.com">` and all Tailwind CDN references
- All Google Font `<link>` and `@import` tags
- All Figma Make generated comments

### 4. Semantic HTML — Replace Tag, Keep Classes

- Outermost section `<div>` → `<section>`
- Navigation wrappers → `<nav>`
- Header wrappers → `<header>`
- Footer wrappers → `<footer>`

### 5. Accessibility — Add Where Missing

- Every `<img>`: add `loading="lazy"` and descriptive `alt=""` (infer from context)
- Every non-`<button>` clickable element: add `tabindex="0"` and `role="button"`
- Every icon-only button: add `aria-label="[action description]"`

### 6. Inline Styles — Strip Colors and Fonts Only

- Remove `style=""` attributes containing `color`, `background-color`, `font-family`, `font-size`
- Replace with equivalent Tailwind token class
- Keep inline styles for dynamic values (JS-controlled opacity, transforms, etc.)

## Common Figma Make Problems

| Problem | Fix |
|---|---|
| `text-[#604683]` | `text-[var(--wp--preset--color--primary)]` |
| `fill="#604683"` on SVG | `fill="currentColor"` + color on parent |
| `style="color: #604683"` | Remove, add Tailwind token class |
| `opacity: 0.4` inline | Tailwind `opacity-40` — keep as-is |
| `transition: all 0.3s ease` inline | `transition-all duration-300 ease-in-out` |
| `font-family: 'Ragna', serif` inline | Remove, add `font-[family-name:var(--wp--preset--font-family--ragna)]` |

## style.scss Assessment — Required at End of Every Cleanup

After cleanup, scan the design and determine if `style.scss` will be needed
in Phase 2. Output this at the end of your summary.

**Needs style.scss:**
- `@keyframes` animations
- `::before` / `::after` pseudo-elements with generated content
- `:nth-child()` / `:nth-of-type()` stagger selectors
- `clip-path` shapes too complex for Tailwind
- Scroll-driven animations
- `mask` / `mask-image` complex values
- Block-scoped CSS custom property definitions

**Does NOT need style.scss:**
- Colors, spacing, typography → Tailwind token arbitrary values
- Hover/focus/active → Tailwind `hover:`, `focus:`, `active:` prefixes
- Responsive → Tailwind `md:`, `lg:` prefixes
- Opacity, transitions, transforms → Tailwind classes

## Output Summary Format

After writing `designs/clean/[block-name].html`, output:

```
✅ Phase 1 complete — designs/clean/[block-name].html

Figma cache: ✅ figma-cache/blocks/[block-name].json exists (or ✅ created during this step)

Colors replaced: X
Colors unmapped (flagged): X — [list them]
CDN/font tags removed: X
Semantic tag replacements: [list]
Accessibility additions: [list]
Inline styles removed: X

style.scss needed: YES / NO
Reason: [specific CSS that needs it, or "Tailwind covers everything"]

Items needing your decision: [list any ambiguous cases]

Ready for Phase 2? (y to continue)
```

Wait for approval before proceeding to Phase 2.
