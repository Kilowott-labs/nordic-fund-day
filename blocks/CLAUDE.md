# Block Developer + QA Context — blocks/

This file is loaded automatically when Claude Code works in the `blocks/` directory.
It defines two roles: Block Developer (Phase 2) and QA Reviewer (Phase 3).

---

## Phase 2 — Block Developer Role

### Input / Output

- **Input:** `designs/clean/[block-name].html` + Phase 1 style.scss assessment
- **Output:** `blocks/src/[block-name]/` with all required files

### Step 1 — Read Before Writing

1. Read `designs/clean/[block-name].html` in full
2. Read one existing similar block from `blocks/src/` as structural reference
3. Note whether Phase 1 flagged `style.scss` as needed

### Step 2 — Identify Editable Content

Map every editable element to a block attribute type:

| Content type | Attribute type | Component |
|---|---|---|
| Plain text | `string` | `RichText` or `TextControl` |
| Rich text (bold, italic, links) | `string` | `RichText` |
| Image | `string` (url) + `number` (id) | `MediaUpload` |
| Repeating items | `array` of objects | Inspector panel with add/remove |
| On/off setting | `boolean` | `ToggleControl` |
| URL / link | `string` | `TextControl` or `URLInput` |

### Step 3 — Generate Block Files

#### `block.json`

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "agent-theme/[block-name]",
  "version": "1.0.0",
  "title": "[Block Title]",
  "category": "theme",
  "icon": "[dashicon]",
  "description": "[One line]",
  "textdomain": "agent-theme",
  "attributes": {
    // Define all editable content with sensible defaults
    // Defaults must match the content in designs/clean/[block-name].html
  },
  "supports": {
    "html": false,
    "align": ["wide", "full"],
    "spacing": { "padding": true, "margin": true }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "viewScript": "file:./view.js"
}
```

#### `edit.js`

Critical rules:
- `useBlockProps()` on root element — always, no exceptions
- Pass the **same Tailwind classes** from `designs/clean/[block-name].html` into
  `useBlockProps({ className: '...' })` so the editor preview matches the frontend
- `InspectorControls` in sidebar for: images, URLs, toggles, array item management
- `RichText` for all editable text — headings, paragraphs, button labels
- `MediaUpload` + `MediaUploadCheck` for all images
- Helper functions for array attributes: `updateItem`, `addItem`, `removeItem`
- No SCSS imports — styling is Tailwind + optional `style.scss`

```javascript
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps({
        className: 'relative w-full ...' // same classes as save.js
    });

    const updateItem = (index, field, value) => {
        const updated = [...attributes.items];
        updated[index] = { ...updated[index], [field]: value };
        setAttributes({ items: updated });
    };

    return (
        <>
            <InspectorControls>
                {/* sidebar controls */}
            </InspectorControls>
            <div {...blockProps}>
                {/* editor preview — same structure as save.js */}
            </div>
        </>
    );
}
```

#### `save.js`

Critical rules:
- `useBlockProps.save()` on root element — always
- HTML structure must match `designs/clean/[block-name].html` exactly
- All Tailwind classes from cleaned HTML applied to matching elements
- `RichText.Content` for all rich text attributes
- `data-[block-name]-block` on interactive root for `view.js` hooks
- `loading="lazy"` on all images
- ARIA attributes on all interactive elements

#### `style.scss` — Only If Phase 1 Flagged It

If Phase 1 said YES, create `style.scss` with these strict rules:

```scss
/**
 * style.scss — [block-name]
 * Only CSS that Tailwind cannot express. All colors via theme.json tokens.
 */

.wp-block-agent-theme-[block-name] {

    // @keyframes — Tailwind cannot define keyframe sequences
    @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    // ::after pseudo-element — Tailwind cannot generate content
    .item__underline::after {
        content: '';
        display: block;
        height: 1px;
        background: var(--wp--preset--color--primary); // never hex
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    // :nth-child stagger — Tailwind cannot vary delays per child
    .item:nth-child(1) { animation-delay: 0ms; }
    .item:nth-child(2) { animation-delay: 80ms; }
    .item:nth-child(3) { animation-delay: 160ms; }

    // clip-path — too complex for Tailwind arbitrary value
    .shape { clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%); }
}
```

Rules for `style.scss`:
- Always scoped to `.wp-block-agent-theme-[block-name]`
- All colors: `var(--wp--preset--color--[slug])` — zero hardcoded hex
- No responsive media queries — responsive goes in Tailwind prefixes in JSX
- No layout rules that Tailwind already handles in JSX
- Every rule must have a comment explaining why Tailwind cannot handle it

If Phase 1 said NO — do not create `style.scss`.

#### `view.js` — Only If Block Has Frontend Interactions

```javascript
function init[BlockName]() {
    // Always use data- attributes as selectors — never Tailwind class names
    const blocks = document.querySelectorAll('[data-[block-name]-block]');

    blocks.forEach(block => {
        const items = block.querySelectorAll('[data-item]');
        const image = block.querySelector('[data-main-image]');

        items.forEach(item => {
            item.addEventListener('click', () => handleClick(item, items, image));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick(item, items, image);
                }
            });
        });
    });
}

function handleClick(active, all, image) {
    all.forEach(i => {
        i.classList.remove('opacity-100');
        i.classList.add('opacity-40');
        i.setAttribute('aria-pressed', 'false');
    });
    active.classList.remove('opacity-40');
    active.classList.add('opacity-100');
    active.setAttribute('aria-pressed', 'true');

    if (image && active.dataset.image) {
        image.style.opacity = '0';
        setTimeout(() => { image.src = active.dataset.image; image.style.opacity = '1'; }, 300);
    }
}

document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init[BlockName])
    : init[BlockName]();
```

### Step 4 — Register and Build

Add to `blocks/blocks.php`:
```php
register_block_type( __DIR__ . '/src/[block-name]' );
```

Run: `npm run build`

### Step 5 — Write block-spec.md

After a successful build, generate `blocks/src/[block-name]/block-spec.md`.
This is developer documentation only — for any developer picking up this block.
Read `block.json`, `edit.js`, `save.js`, and `style.scss` (if exists) before writing.
Everything must be derived from actual generated code — not guessed.

Write the file using this structure:

---
# Block: [Block Title]
**Block name:** `agent-theme/[block-name]`
**Version:** 1.0.0
**Generated:** [date]
**Figma source:** [file URL and node ID if known, otherwise omit line]

## Purpose
[One specific paragraph. Not "displays content" but e.g. "Displays 3-6 USP items
with icon, number and description in a horizontal row, collapsing to vertical on mobile."]

## Attributes
Derived from block.json exactly — no additions or omissions.

| Attribute | Type | Default | What it controls |
|---|---|---|---|
| heading | string | "[value]" | [what it controls] |
| items | array | [n items] | [object shape: {id, title, ...}] |

## Theme Tokens Used
Every var(--wp--preset--) referenced in save.js and style.scss.

| Token slug | CSS variable | Where used in block |
|---|---|---|
| primary | --wp--preset--color--primary | [e.g. heading color] |
| background-warm | --wp--preset--color--background-warm | [e.g. section bg] |

## Files

| File | Purpose |
|---|---|
| block.json | Attribute schema, metadata, supports |
| edit.js | Gutenberg editor component, InspectorControls |
| save.js | Frontend HTML output |
| view.js | Frontend JS interactions (only if present) |
| style.scss | CSS Tailwind cannot express (only if present) |
| block-spec.md | This file |

## Frontend Behaviour
[Only write this section if view.js exists. Plain English description of what
the JS does. e.g. "Clicking a collection item fades the main image and marks
the item active. Enter and Space trigger the same action."]

## Known Constraints
[Real gotchas only — omit this section entirely if none exist.
e.g. "Adding a new field to items requires updating block.json, edit.js,
and save.js simultaneously."]

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | [date] | Initial block generated |
---

Rules for writing block-spec.md:
- Attribute table must match block.json exactly — no missing or invented rows
- Token table must list every var(--wp--preset--) actually found in the code
- Frontend Behaviour section only written if view.js exists
- Known Constraints section omitted entirely if no real constraints exist
- Write as if handing to a developer who has never seen this block before

### Phase 2 Output Summary Format

```
✅ Phase 2 complete — blocks/src/[block-name]/

Files created:
  - block.json
  - edit.js
  - save.js
  - view.js (reason: [why interactive JS was needed]) OR not created
  - style.scss (reason: [specific CSS that needed it]) OR not created
  - block-spec.md ← developer documentation for this block

Attributes defined:
  - heading: string
  - items: array [{id, title, image, imageId, alt}]
  - [etc]

Tokens mapped in spec: X (list slugs)
Build: ✅ success / ❌ errors:
[paste any build errors]

Ready for Phase 3 QA? (y to continue)
```

Wait for approval before proceeding to Phase 3.

---

## Phase 3 — QA Reviewer Role

### Input / Output

- **Input:** `blocks/src/[block-name]/` + `figma-cache/blocks/[block-name].json`
- **Output:** `tests/visual-regression/reports/[block-name].md`

### Part A — Code Review (Always Runs)

Report format: `[CRITICAL / WARNING / SUGGESTION] — File:line — Issue — Fix`

**Security:**
- [ ] All user-facing strings through `esc_html()`, `esc_attr()`, or `esc_url()`
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] URL attributes through `esc_url()`

**WordPress:**
- [ ] `useBlockProps()` on root in `edit.js`
- [ ] `useBlockProps.save()` on root in `save.js`
- [ ] Block name is `agent-theme/[block-name]` in `block.json`
- [ ] Registered in `blocks/blocks.php`
- [ ] `textdomain` is `agent-theme` in all `__()`  calls

**Tailwind:**
- [ ] Zero `text-[#hex]`, `bg-[#hex]` or other hardcoded hex arbitrary values
- [ ] No inline `style=""` for colors or fonts
- [ ] Responsive prefixes present at `md:` and `lg:` breakpoints where needed
- [ ] Transition classes on interactive elements (`transition-all duration-300`)

**style.scss (if exists):**
- [ ] Scoped to `.wp-block-agent-theme-[block-name]`
- [ ] Zero hardcoded hex — all `var(--wp--preset--color--[slug])`
- [ ] No layout or spacing rules duplicating Tailwind JSX
- [ ] No media queries — responsive in Tailwind prefixes
- [ ] Every declaration has a comment explaining why Tailwind cannot handle it
- [ ] Flag if style.scss exists but Tailwind could have covered everything

**Accessibility:**
- [ ] All `<img>` have `alt` attribute and `loading="lazy"`
- [ ] All interactive non-`<button>` elements have `role` and `tabindex`
- [ ] `aria-label` on icon-only buttons
- [ ] Heading hierarchy is logical — no skipped levels

**view.js (if exists):**
- [ ] Uses `data-` attributes as all selectors — no Tailwind class selectors
- [ ] `aria-pressed` / `aria-expanded` updated on state change
- [ ] `Enter` and `Space` keyboard support on interactive elements
- [ ] `DOMContentLoaded` guard present

**block-spec.md:**
- [ ] Exists at `blocks/src/[block-name]/block-spec.md`
- [ ] Token table lists every `var(--wp--preset--color--)` actually used in the block
- [ ] Attribute table matches `block.json` exactly — no missing or invented attributes
- [ ] Known Constraints section is accurate — omitted if none exist

### Part B — Visual Regression (Chrome DevTools MCP + Local Figma Cache)

**Do not call Figma MCP.** All design data comes from `figma-cache/blocks/[block-name].json`.

If `figma-cache/blocks/[block-name].json` does not exist — stop and tell the user to run the Figma Cache Step from `designs/CLAUDE.md` (Step 0) first.

1. Add entry to `tests/visual-regression/design-qa-config.json`:
```json
{
  "[block-name]": {
    "figmaCacheFile": "figma-cache/blocks/[block-name].json",
    "url": "/page-with-block",
    "rootSelector": ".wp-block-agent-theme-[block-name]",
    "viewports": ["desktop", "tablet", "mobile"]
  }
}
```

2. Read design specs from `figma-cache/blocks/[block-name].json`

3. Use Chrome DevTools MCP to navigate to the page and measure at:
   - Desktop: 1440px
   - Tablet: 768px
   - Mobile: 375px

4. Compare DOM measurements against local Figma block JSON

5. For every mismatch — output the corrected Tailwind class or SCSS rule

### Report Format

Write to `tests/visual-regression/reports/[block-name].md`:

```markdown
# QA Report: [block-name]
**Date:** [date]
**Status:** ✅ Pass / ❌ X issues

## Critical Issues
[CRITICAL] — save.js:24 — Missing esc_url() on button href — Fix: wrap with esc_url()

## Warnings
[WARNING] — style.scss:12 — gap: 24px could be var(--wp--preset--spacing--40) — Fix: use token

## Visual Mismatches
Desktop 1440px:
- .wp-block-agent-theme-[block-name] h2: font-size 38px, expected 40px
  Fix: className="text-[40px]" (currently text-[38px])

## ✅ All Checks Passed
[List if clean]
```

### Phase 3 Output Summary

```
✅ Phase 3 complete

Code review: X critical, X warnings, X suggestions
Visual regression: X mismatches at desktop, X at tablet, X at mobile

Report: tests/visual-regression/reports/[block-name].md

Next action: [fix X critical issues] OR [block is ready to use ✅]
```
