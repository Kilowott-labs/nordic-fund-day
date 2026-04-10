# Design QA Setup Guide

## For New Projects / Teams

This guide helps you set up automated design QA testing in your project.

## What You Get

- ✅ Automated design-to-code verification (no repeated Figma MCP calls)
- ✅ Accessibility checking
- ✅ SEO validation
- ✅ Console/network error detection via Chrome DevTools MCP
- ✅ Chat-based workflow (no CLI needed)
- ✅ Detailed reports with CSS fixes

## Prerequisites

- Kiro IDE with MCP support
- Figma MCP connected (needed once for cache population, not for QA)
- Chrome DevTools MCP connected (used for all browser testing)
- Figma design file
- Live website to test

---

## Installation (10 Minutes)

### Step 1: Copy Files

Copy these files to your project:

```bash
# Steering files
mkdir -p .kiro/steering
cp design-to-code.md .kiro/steering/
cp design-qa-workflow.md .kiro/steering/

# Test directory structure
mkdir -p tests/visual-regression/reports
mkdir -p tests/visual-regression/.cache
mkdir -p figma-cache/blocks

# Config file
cp design-qa-config.json tests/visual-regression/

# Documentation
cp DESIGN-QA-GUIDE.md tests/visual-regression/
cp QUICK-REFERENCE.md tests/visual-regression/
cp SETUP.md tests/visual-regression/
```

### Step 2: Populate the Figma Cache (One-Time per Page)

This is the **only** time Figma MCP is called. In Kiro chat:

```
Use the Figma MCP to fetch the full node JSON for this page:
Figma URL: [your figma file url]
Page Node ID: [your page node id]

Save the complete response as-is to figma-cache/[page-name]-full.json.
Do not summarise, trim or interpret the JSON — save the raw output exactly as returned.
Create the figma-cache/ directory if it doesn't exist.
Confirm how many API calls were made once done.
```

Then extract block JSONs from the full page cache:

```
For each top-level child node in figma-cache/[page-name]-full.json:
- Use the node's name (kebab-cased) as the filename
- Save to figma-cache/blocks/[block-name].json
- Include the full subtree for that node
```

After this, `figma-cache/blocks/` will contain one JSON file per block/section. These are the files QA reads from.

### Step 3: Update Config

Edit `tests/visual-regression/design-qa-config.json`:

```json
{
  "version": "2.0",
  "figmaCachePath": "figma-cache/blocks",
  "baseUrl": "https://your-site.com",
  "sections": {
    "your-first-section": {
      "figmaCacheFile": "figma-cache/blocks/your-first-section.json",
      "url": "/",
      "rootSelector": ".your-section-class",
      "viewports": ["desktop"]
    }
  }
}
```

**How to get the block JSON filename:**
The block JSON files are auto-extracted from the full page cache during the design-to-code Figma Cache Step. Check `figma-cache/blocks/` for the available filenames and use the matching one in `figmaCacheFile`.

### Step 4: Test It

In Kiro chat, type:

```
Test your-first-section
```

You should see:
```
✅ Design QA completed for your-first-section

Results:
- Design Issues: X
- Accessibility Issues: X
...

Report: tests/visual-regression/reports/your-first-section.md
```

### Step 5: Add More Sections

Add more sections to config as you build. The block JSONs are already extracted from the full page cache — just point each section to its file:

```json
{
  "sections": {
    "hero": {
      "figmaCacheFile": "figma-cache/blocks/hero.json",
      "url": "/",
      "rootSelector": ".hero",
      "viewports": ["desktop", "tablet", "mobile"]
    },
    "footer": {
      "figmaCacheFile": "figma-cache/blocks/footer.json",
      "url": "/",
      "rootSelector": ".footer",
      "viewports": ["desktop"]
    },
    "about-hero": {
      "figmaCacheFile": "figma-cache/blocks/about-hero.json",
      "url": "/about",
      "rootSelector": ".about-hero",
      "viewports": ["desktop"]
    }
  }
}
```

---

## File Structure After Setup

```
your-project/
├── .kiro/
│   └── steering/
│       ├── design-to-code.md          # Figma cache step + cleanup instructions
│       └── design-qa-workflow.md      # QA instructions (auto-loaded)
├── figma-cache/
│   ├── [page-name]-full.json          # Raw full page JSON (one-time MCP call)
│   └── blocks/
│       ├── hero.json                  # Per-block JSON for QA
│       ├── footer.json
│       └── ...
└── tests/
    └── visual-regression/
        ├── design-qa-config.json      # Your sections config
        ├── DESIGN-QA-GUIDE.md
        ├── QUICK-REFERENCE.md
        ├── SETUP.md                   # This file
        ├── reports/                   # Generated reports
        │   ├── hero.md
        │   └── footer.md
        └── .cache/                    # Auto-generated element cache
            └── element-mappings.json
```

---

## Usage

### Test a Section

```
Test hero
```

### Test All Sections

```
Test all sections
```

### Test Specific Viewport

```
Test hero on mobile
```

### After Fixing Issues

```
Test hero
```

Report updates automatically showing what's fixed.

---

## Refreshing the Figma Cache

When the Figma design changes:

1. Delete the full page cache file:
   ```
   figma-cache/[page-name]-full.json
   ```
2. Re-run the Figma Cache Step (Step 2 above)
3. Block JSONs regenerate automatically
4. The element mapping cache in `tests/visual-regression/.cache/` will auto-invalidate on the next test run (hash mismatch)

---

## Configuration Options

### Basic Section

```json
{
  "section-name": {
    "figmaCacheFile": "figma-cache/blocks/section-name.json",
    "url": "/",
    "rootSelector": ".section-class",
    "viewports": ["desktop"]
  }
}
```

### Multi-Viewport Section

```json
{
  "section-name": {
    "figmaCacheFile": "figma-cache/blocks/section-name.json",
    "url": "/",
    "rootSelector": ".section-class",
    "viewports": ["desktop", "tablet", "mobile"]
  }
}
```

### Tolerance Settings

```json
{
  "tolerance": {
    "dimensions": 2,
    "spacing": 2,
    "typography": 1,
    "colors": 5
  }
}
```

### Custom Viewports

```json
{
  "viewportPresets": {
    "desktop": { "width": 1920, "height": 1080 },
    "laptop": { "width": 1440, "height": 900 },
    "tablet": { "width": 768, "height": 1024 },
    "mobile": { "width": 375, "height": 667 }
  }
}
```

---

## Team Workflow

### Developer Workflow

1. **Ensure Figma cache exists** for the page (`figma-cache/blocks/` has the right JSON)
2. **Implement component** from Figma
3. **Add to config** with `figmaCacheFile` pointing to existing block JSON
4. **Test in chat:** `Test my-component`
5. **Review report:** `tests/visual-regression/reports/my-component.md`
6. **Fix issues** based on report
7. **Re-test:** `Test my-component`
8. **Commit** when all tests pass

### Designer Workflow

1. **Update Figma** design
2. **Notify team** to refresh the Figma cache
3. **Provide page node ID** so dev can re-run the cache step
4. **Dev refreshes cache** — all QA runs immediately reflect the new design

### QA Workflow

1. **Run all tests:** `Test all sections`
2. **Review reports** in `tests/visual-regression/reports/`
3. **Create tickets** for failures with exact CSS fixes from reports
4. **Verify fixes** by re-running tests

---

## Best Practices

### 1. Commit `figma-cache/` to Git

Share the cache across the team so nobody hits Figma MCP rate limits:

```gitignore
# .gitignore — do NOT ignore figma-cache
# figma-cache/    ← remove this line if it exists
```

### 2. Use Semantic HTML

```html
<!-- ✅ Good -->
<header>
  <nav>
    <h1>Title</h1>
  </nav>
</header>

<!-- ❌ Avoid -->
<div class="header">
  <div class="nav">
    <div class="title">Title</div>
  </div>
</div>
```

### 3. Always Provide rootSelector

```json
{
  "hero": {
    "rootSelector": ".wp-block-avaro-hero"
  }
}
```

### 4. Name Figma Layers Clearly

Good: `Hero / Main Heading`, `Navigation / Logo`, `CTA Button`
Avoid: `Rectangle 123`, `Group 45`, `Layer 1`

### 5. Test Early and Often

```
Implement → Test → Fix → Test → Commit
```

---

## Troubleshooting

### "Figma cache not found"
- Run the Figma Cache Step from `design-to-code.md` (Step 0)
- Check `figma-cache/blocks/[section-name].json` exists
- Make sure the block name in config matches the extracted file name

### "Element not found"
- Verify `rootSelector` is correct
- Check if element exists on page
- Verify Figma layer is visible (not hidden in block JSON)
- Check correct viewport

### "Low confidence match"
- Add/improve `rootSelector`
- Use semantic HTML
- Check for duplicate elements

### "Measurements don't match"
- Wait for fonts to load, re-test
- Verify viewport size
- Check if Figma cache is stale (design changed since last cache refresh)

---

## Support

### Documentation

- **Team Guide:** `DESIGN-QA-GUIDE.md`
- **This File:** `SETUP.md`
- **Steering Files:** `.kiro/steering/design-qa-workflow.md` and `design-to-code.md`

### Getting Help

Ask in Kiro chat:
```
How do I test my footer?
Why can't the test find my header?
My Figma cache is missing — what do I do?
```

---

**Version:** 2.0
**Last Updated:** 2025-03-16
