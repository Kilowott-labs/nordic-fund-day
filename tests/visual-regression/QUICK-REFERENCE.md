# Design QA - Quick Reference

## Before You Can Test

The Figma cache must exist. Run this once per page (design-to-code flow):

```
Use the Figma MCP to fetch the full node JSON for this page:
Figma URL: [url]   Page Node ID: [node-id]
Save to figma-cache/[page-name]-full.json — raw, no trimming.
```

Block JSONs are auto-extracted to `figma-cache/blocks/` from the full page JSON.

---

## Chat Commands

```
Test hero-section              # Test single section
Test hero-section on mobile    # Test specific viewport
Test all sections              # Test all configured sections
```

---

## Config Structure

```json
{
  "figmaCachePath": "figma-cache/blocks",
  "baseUrl": "https://your-site.com",
  "sections": {
    "section-name": {
      "figmaCacheFile": "figma-cache/blocks/section-name.json",
      "url": "/",
      "rootSelector": ".section-class",
      "viewports": ["desktop", "tablet", "mobile"]
    }
  }
}
```

---

## Getting Figma Info

**File Key:**
- URL: `https://www.figma.com/design/ABC123/...`
- Use: `ABC123`

**Node ID:**
- Select frame → Right-click → "Copy link to selection"
- URL: `...?node-id=3-3390`
- Use: `3-3390`

---

## What Gets Tested

- ✅ Design (dimensions, typography, colors, spacing) — vs local block JSON
- ✅ Accessibility (semantic HTML, alt text, contrast, ARIA)
- ✅ SEO (headings, structure, links)
- ✅ Console errors (JavaScript errors) — via Chrome DevTools MCP
- ✅ Network errors (404s, failed requests) — via Chrome DevTools MCP

---

## Figma Cache Structure

```
figma-cache/
├── [page-name]-full.json       ← one MCP call, saved raw
└── blocks/
    └── [block-name].json       ← per-block, extracted from full
```

QA reads from `figma-cache/blocks/` — never calls Figma MCP.

---

## Report Location

```
tests/visual-regression/reports/[section-name].md
```

---

## When to Refresh Cache

Refresh when the Figma design changes:
1. Delete `figma-cache/[page-name]-full.json`
2. Re-run the Figma Cache Step in design-to-code
3. Block JSONs regenerate automatically
4. Element mapping cache in `.cache/` will auto-invalidate on next test run

---

## Best Practices

1. **Run Figma Cache Step first** (one-time per page)
2. **Use semantic HTML** (`<header>`, `<nav>`, `<button>`)
3. **Provide rootSelector** (`.wp-block-avaro-hero`)
4. **Name Figma layers clearly** ("Hero / Main Heading")
5. **Test early and often** (Implement → Test → Fix → Test)
6. **Test all viewports** (`["desktop", "tablet", "mobile"]`)
7. **Share `figma-cache/`** with teammates to avoid repeat MCP calls

---

## Troubleshooting

**Figma cache not found:**
- Run design-to-code Figma Cache Step
- Check `figma-cache/blocks/[section-name].json` exists

**Element not found:**
- Add/verify `rootSelector`
- Check element exists on page
- Use semantic HTML

**Low confidence match:**
- Provide more specific `rootSelector`
- Use semantic elements
- Check for duplicate elements

**Measurements don't match:**
- Wait for fonts to load, re-test
- Verify viewport size
- Check if Figma cache is stale

---

## Files

- **Config:** `tests/visual-regression/design-qa-config.json`
- **Reports:** `tests/visual-regression/reports/`
- **Element cache:** `tests/visual-regression/.cache/element-mappings.json`
- **Figma cache:** `figma-cache/blocks/`
- **Guide:** `tests/visual-regression/DESIGN-QA-GUIDE.md`
- **Setup:** `tests/visual-regression/SETUP.md`
