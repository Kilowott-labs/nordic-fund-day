# /build-block

Runs the full 3-phase block pipeline for a single block.
Figma is called once per page and cached locally — never called again after that.

## Usage

```
/build-block [block-name]
Figma file URL: [url]        ← only needed if page has never been cached
Page node ID: [page-node-id] ← the PAGE-level node, not the block node
```

**First time (page never cached):**
```
/build-block testimonial-simple
Figma file URL: https://www.figma.com/design/HiKh4iSnO9uA8cXuMhTjl6/blocks
Page node ID: 0-1
```

**Any time after (page already cached):**
```
/build-block testimonial-simple
```

The page node ID is the top-level page in Figma — not the individual block node.
Click the page name in Figma's left panel → copy link → use that node ID.
One fetch caches every block on that page automatically.

---

## Pre-Flight Checks

Before starting any phase:

1. Read `theme.json` — extract all color slugs + hex values into a mapping table
2. Check `blocks/src/$ARGUMENTS/` — if it already exists, ask before overwriting
3. Skim `PROJECT-STATUS.md` for any relevant blockers
4. **Figma cache check — this is the entry point for all design data:**
   - Check if `figma-cache/blocks/$ARGUMENTS.json` exists
   - **If it exists** → cache ready, proceed to Phase 1
   - **If missing AND** Figma file URL + page node ID were provided in the prompt:
     → Run the Cache Step below immediately
     → Proceed to Phase 1 once complete
   - **If missing AND** no URL/node provided:
     → Stop and ask: "No Figma cache found for `$ARGUMENTS`. Please provide:
        - Figma file URL
        - Page node ID (the top-level page node — not the individual block node)"
     → Do not proceed until cache exists

### Cache Step (runs automatically when cache is missing)

```
1. Call Figma MCP with the provided file URL and page node ID
2. Save the complete raw response to figma-cache/[page-name]-full.json
   — do not summarise, trim or interpret — save exactly as returned
3. For each top-level child node in the full JSON:
   - Kebab-case the node name → use as filename
   - Save full subtree to figma-cache/blocks/[block-name].json
4. Confirm API calls made: must be 1
```

Output before proceeding to Phase 1:
```
✅ Figma cache complete
   Saved: figma-cache/[page-name]-full.json
   Blocks extracted to figma-cache/blocks/:
     - testimonial-simple.json ✅
     - hero.json
     - footer.json
     - ... (every block on the page)
   API calls made: 1
```

---

## Phase 1 — UI Developer

**Source of truth:** `figma-cache/blocks/$ARGUMENTS.json`
**Output:** `designs/clean/$ARGUMENTS.html`
**Context:** `designs/CLAUDE.md` rules apply

Tasks:
1. Read `figma-cache/blocks/$ARGUMENTS.json` in full — this is the design source
2. Read `theme.json` color mapping (already built in pre-flight)
3. Generate semantic, accessible, token-mapped HTML from the Figma block JSON:
   - All colors as Tailwind arbitrary values using theme.json CSS custom properties
   - Standard Tailwind utility classes for layout, spacing, typography
   - Responsive using Tailwind prefixes: `sm:` `md:` `lg:` `xl:`
   - Semantic HTML5 elements throughout (`<section>`, `<nav>`, `<header>`, etc.)
   - All images: descriptive `alt` text + `loading="lazy"`
   - All interactive elements keyboard accessible
   - No hardcoded hex anywhere — all via `var(--wp--preset--color--[slug])`
   - No `<script src="cdn.tailwindcss.com">` or Google Font tags
4. Save raw generated HTML to `designs/$ARGUMENTS.html`
5. Save cleaned token-mapped version to `designs/clean/$ARGUMENTS.html`
6. Assess whether `style.scss` will be needed (see `designs/CLAUDE.md` — style.scss Assessment)
7. Output Phase 1 summary in the exact format specified in `designs/CLAUDE.md`

**PAUSE after Phase 1 summary. Wait for explicit user approval (y) before continuing.**

---

## Phase 2 — Block Developer

**Working directory:** `blocks/src/`
**Context:** `blocks/CLAUDE.md` Block Developer rules apply

Tasks:
1. Read `designs/clean/$ARGUMENTS.html` in full
2. Read one similar existing block from `blocks/src/` as structural reference
3. Identify all editable content and map to attribute types
4. Generate all required files inside `blocks/src/$ARGUMENTS/`:
   - `block.json` — always
   - `edit.js` — always
   - `save.js` — always
   - `view.js` — only if block has frontend JS interactions
   - `style.scss` — only if Phase 1 flagged it as needed
   - `block-spec.md` — always (developer documentation)
5. Add `register_block_type( __DIR__ . '/src/$ARGUMENTS' );` to `blocks/blocks.php`
6. Run `npm run build`
7. Output Phase 2 summary in the exact format specified in `blocks/CLAUDE.md`

**PAUSE after Phase 2 summary. Wait for explicit user approval (y) before continuing.**

---

## Phase 3 — QA Reviewer

**Working directory:** `blocks/src/$ARGUMENTS/` + `tests/visual-regression/`
**Context:** `blocks/CLAUDE.md` QA Reviewer rules apply

Tasks:
1. Run the full code review checklist from `blocks/CLAUDE.md` — Part A
2. Read design data from `figma-cache/blocks/$ARGUMENTS.json` — do NOT call Figma MCP
3. Add entry to `tests/visual-regression/design-qa-config.json`:
   ```json
   {
     "$ARGUMENTS": {
       "figmaCacheFile": "figma-cache/blocks/$ARGUMENTS.json",
       "url": "/page-containing-block",
       "rootSelector": ".wp-block-agent-theme-$ARGUMENTS",
       "viewports": ["desktop", "tablet", "mobile"]
     }
   }
   ```
4. Use Chrome DevTools MCP to navigate to the page and measure at:
   - Desktop: 1440px
   - Tablet: 768px
   - Mobile: 375px
5. Compare DOM measurements against local Figma block JSON — Part B
6. Write report to `tests/visual-regression/reports/$ARGUMENTS.md`
7. Output Phase 3 summary in the exact format specified in `blocks/CLAUDE.md`

---

## Pipeline Complete

```
✅ /build-block $ARGUMENTS complete

Figma cache: ✅ figma-cache/blocks/$ARGUMENTS.json
Phase 1 — UI Developer: X colors mapped, style.scss: [needed/not needed]
Phase 2 — Block Developer: [list files created], build: [success/errors]
Phase 3 — QA Reviewer: X critical, X warnings, X visual mismatches

Report: tests/visual-regression/reports/$ARGUMENTS.md

Next action: [fix X critical issues] OR [block is ready ✅]
```
