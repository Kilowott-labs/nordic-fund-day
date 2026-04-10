# Design QA - Automated Testing Guide

## Overview

Automated design-to-code verification system that compares your implementation against Figma designs using AI-powered analysis.

**Figma is queried once** during the design-to-code phase and the result is cached locally. QA reads from `figma-cache/blocks/` every time — no repeated MCP calls, no rate limits.

**What it checks:**
- ✅ Design accuracy (dimensions, typography, colors, spacing)
- ✅ Accessibility (semantic HTML, ARIA, color contrast, keyboard navigation)
- ✅ SEO (heading structure, semantic elements, link quality)
- ✅ Console errors (JavaScript errors specific to your block) — Chrome DevTools MCP
- ✅ Network errors (missing images, failed requests) — Chrome DevTools MCP

---

## How the Cache Works

```
Design-to-code phase (once per page):
  Figma MCP → figma-cache/[page]-full.json
                └── extracted to figma-cache/blocks/[block].json (one per block)

QA phase (every test run):
  figma-cache/blocks/[block].json → compare vs DOM
  Chrome DevTools MCP             → navigate, measure, console, network
```

The `figma-cache/` directory should be committed to Git so teammates share the same cached data without making additional Figma MCP calls.

---

## Quick Start

### 1. Ensure Figma Cache Exists

Before running any QA, the cache must be populated. If `figma-cache/blocks/[your-section].json` does not exist, run the Figma Cache Step from `design-to-code.md` (Step 0). This is a one-time setup per page.

### 2. Add Your Section to Config

Edit `tests/visual-regression/design-qa-config.json`:

```json
{
  "sections": {
    "your-section-name": {
      "figmaCacheFile": "figma-cache/blocks/your-section-name.json",
      "url": "/",
      "rootSelector": ".wp-block-avaro-your-section",
      "viewports": ["desktop", "tablet", "mobile"]
    }
  }
}
```

**Required fields:**
- `figmaCacheFile`: Path to the local block JSON in `figma-cache/blocks/`
- `url`: Page URL (relative like `/` or `/about`, or full URL)
- `rootSelector`: CSS selector for your section container (helps AI find elements)
- `viewports`: Which screen sizes to test

### 3. Run Test in Chat

In Kiro chat, type:

```
Test your-section-name
```

That's it. The AI will:
1. Read design specs from `figma-cache/blocks/your-section-name.json` (no Figma MCP call)
2. Navigate to your page via Chrome DevTools MCP
3. Find and measure all elements
4. Compare against local Figma JSON
5. Check accessibility and SEO
6. Generate detailed report

### 4. Review Report

Report location: `tests/visual-regression/reports/your-section-name.md`

The report shows:
- Design mismatches with exact CSS fixes
- Accessibility issues with solutions
- SEO problems with recommendations
- Console/network errors
- Only failures (passed items are not listed)

### 5. Fix Issues

Apply the CSS fixes from the report, then re-run:

```
Test your-section-name
```

The report updates automatically:
- New issues are added
- Fixed issues move to "Recently Resolved"
- Persistent issues show how long they've existed

---

## Configuration Details

### Section Properties

```json
{
  "your-section": {
    "figmaCacheFile": "figma-cache/blocks/your-section.json", // Required: local block JSON path
    "url": "/about",                                           // Required: page URL
    "rootSelector": ".section",                                // Recommended: container selector
    "viewports": ["desktop"]                                   // Required: viewports to test
  }
}
```

### Getting the figmaCacheFile path

The block JSON files are auto-extracted from the full page cache during the design-to-code Figma Cache Step. After running it, list `figma-cache/blocks/` to see available files and use the matching path in `figmaCacheFile`.

### Root Selector

The `rootSelector` helps AI find elements faster and more accurately.

**Good examples:**
- `.wp-block-avaro-hero` (block class)
- `#hero-section` (unique ID)
- `[data-block="hero"]` (data attribute)

**Why it helps:**
- Narrows search scope (faster)
- Reduces ambiguity (more accurate)
- Prevents matching wrong elements on the page

### Multiple Pages

Test sections on different pages:

```json
{
  "sections": {
    "home-hero": {
      "figmaCacheFile": "figma-cache/blocks/home-hero.json",
      "url": "/"
    },
    "about-hero": {
      "figmaCacheFile": "figma-cache/blocks/about-hero.json",
      "url": "/about"
    },
    "contact-form": {
      "figmaCacheFile": "figma-cache/blocks/contact-form.json",
      "url": "https://staging.example.com/contact"
    }
  }
}
```

### Viewport Presets

```json
{
  "viewportPresets": {
    "desktop": { "width": 1920, "height": 1080 },
    "tablet": { "width": 768, "height": 1024 },
    "mobile": { "width": 375, "height": 667 }
  }
}
```

Add custom viewports:

```json
{
  "viewportPresets": {
    "desktop": { "width": 1920, "height": 1080 },
    "laptop": { "width": 1440, "height": 900 },
    "tablet": { "width": 768, "height": 1024 },
    "mobile": { "width": 375, "height": 667 },
    "mobile-landscape": { "width": 667, "height": 375 }
  }
}
```

### Tolerance Settings

```json
{
  "tolerance": {
    "dimensions": 2,    // ±2px for width/height
    "spacing": 2,       // ±2px for padding/margin
    "typography": 1,    // ±1px for font sizes
    "colors": 5         // ±5 RGB value difference
  }
}
```

---

## Chat Commands

### Test Single Section

```
Test hero-section
```

### Test Specific Viewport

```
Test hero-section on mobile
```

### Test All Sections

```
Test all sections
```

### Re-test After Fixes

```
Test hero-section
```

---

## Understanding Reports

### Report Structure

```markdown
# Design QA Report: hero-section
**Last Updated:** 2024-03-01 14:30:00
**Status:** ❌ 3 issues found

## 📊 Summary
- Design Issues: 2
- Accessibility Issues: 1
- SEO Issues: 0

## 🔴 Design Issues
[Only failures listed here]

## ♿ Accessibility Issues
[Only failures listed here]

## 🔍 SEO Issues
[Only failures listed here]

## ✅ Recently Resolved
[Fixed issues from last 7 days]
```

### Design Issues

Each issue shows:
- Element and selector
- Property that doesn't match
- Expected vs actual values
- Exact CSS fix
- When first detected / last checked

### Accessibility Issues

Common issues caught:
- Missing alt text on images
- Poor color contrast
- Non-semantic HTML (divs instead of header/nav/etc)
- Missing ARIA labels
- Broken keyboard navigation
- Improper heading hierarchy

### SEO Issues

Common issues caught:
- Multiple or missing h1 tags
- Improper heading order
- Non-descriptive link text ("click here")
- Missing semantic structure
- Images without descriptive alt text

### Console Errors

JavaScript errors that occur in your block:
- Error message + source file and line number
- Severity and impact description

### Network Errors

Failed resource requests:
- Missing images (404)
- Failed API calls
- Blocked or slow resources

---

## Best Practices

### 1. Keep `figma-cache/` in Git

Commit the cache directory so the whole team shares it. Nobody hits rate limits, nobody runs duplicate MCP calls.

### 2. Test Early and Often

```
Implement component → Test → Fix → Test → Commit
```

### 3. Use Semantic HTML

The AI looks for semantic elements first:
- `<header>` not `<div class="header">`
- `<nav>` not `<div class="nav">`
- `<button>` not `<div class="button">`

### 4. Provide Root Selector

Always include `rootSelector` in config. Dramatically improves speed and accuracy.

### 5. Name Figma Layers Clearly

Good: `Hero / Main Heading`, `Navigation / Logo`, `CTA Button`
Avoid: `Rectangle 123`, `Group 45`, `Layer 1`

### 6. Test All Viewports

```json
{ "viewports": ["desktop", "tablet", "mobile"] }
```

### 7. Fix Accessibility First

Accessibility issues often reveal design problems:
- Missing alt text → image not properly implemented
- Poor contrast → wrong colors used
- Non-semantic HTML → structure needs refactoring

### 8. Refresh Cache When Design Changes

```
1. Delete figma-cache/[page-name]-full.json
2. Re-run Figma Cache Step (design-to-code Step 0)
3. Block JSONs regenerate automatically
4. Element mapping cache auto-invalidates on next test run
```

---

## Troubleshooting

### "Figma cache not found"

**Cause:** `figma-cache/blocks/[section-name].json` does not exist

**Solution:**
1. Run the Figma Cache Step from `.kiro/steering/design-to-code.md` (Step 0)
2. Confirm `figma-cache/blocks/` was populated after running
3. Update `figmaCacheFile` in config if block name differs from expected

### "Element not found"

**Cause:** AI couldn't match Figma element to DOM

**Solutions:**
1. Add/verify `rootSelector` in config
2. Check if element exists on page
3. Verify Figma layer is visible (check block JSON — look for `visible: false`)
4. Check if element is in correct viewport
5. Use more semantic HTML

### "Low confidence match"

**Cause:** AI found element but isn't certain it's correct

**Solutions:**
1. Provide more specific `rootSelector`
2. Use semantic HTML elements
3. Add descriptive text content
4. Check if multiple similar elements exist on page

### "Measurements don't match"

**Cause:** Values differ — may be genuine issue or environment difference

**Solutions:**
1. Check if fonts are loaded (wait a moment, re-test)
2. Verify viewport size is correct
3. Check if Figma cache is stale (design changed after last cache refresh)
4. Adjust tolerance if differences are acceptable

### "Console errors not detected"

**Cause:** Errors may not be block-specific

**Solutions:**
1. Check browser console via Chrome DevTools MCP manually
2. Verify error occurs during page load
3. Check if error source contains block name
4. Error may be from a different block

---

## Token Usage & Cost

### First QA Run (No Element Cache)
- Read local block JSON: ~500 tokens (no Figma MCP call)
- Element discovery: ~8,000 tokens
- Measure & compare: ~5,000 tokens
- Generate report: ~4,500 tokens
- **Total: ~18,000 tokens**

### Cached QA Runs (Element Cache Exists)
- Read local block JSON: ~500 tokens
- Skip element discovery: 0 tokens
- Measure & compare: ~5,000 tokens
- Generate report: ~4,500 tokens
- **Total: ~10,000 tokens (44% savings)**

Figma MCP calls at QA time: **zero**.

---

## Sharing with Team

### What to Share

1. **Steering files:**
   - `.kiro/steering/design-to-code.md`
   - `.kiro/steering/design-qa-workflow.md`

2. **Config file:**
   - `tests/visual-regression/design-qa-config.json`

3. **Figma cache (important):**
   - `figma-cache/` — commit to Git so teammates don't re-fetch

4. **This guide:**
   - `tests/visual-regression/DESIGN-QA-GUIDE.md`

### Setup for New Team Member

1. Pull repo (gets `figma-cache/` automatically)
2. Update `design-qa-config.json` if needed (sections, URLs)
3. Start testing immediately:
   ```
   Test hero-section
   ```

No additional setup, no API keys to configure, no CLI tools needed.

---

## FAQ

**Q: Do I need to add data-testid attributes?**
A: No — the AI discovers elements automatically using semantic HTML, text content, and position.

**Q: What if my HTML structure changes?**
A: The AI re-discovers elements automatically. Element mapping cache auto-invalidates on hash mismatch.

**Q: Can I test components not in Figma?**
A: You need a local block JSON for design comparison. Accessibility and console/network error checks still work without Figma data.

**Q: Does this work with Tailwind CSS?**
A: Yes — the AI measures computed styles, not class names. Works with any CSS approach.

**Q: What if the Figma design changes?**
A: Delete `figma-cache/[page-name]-full.json` and re-run the Figma Cache Step. Block JSONs and element mappings update automatically.

**Q: Why not just call Figma MCP each time?**
A: Figma MCP has rate limits that cause failures when tests run frequently. Caching locally eliminates this entirely and makes QA runs faster and free of external dependencies.

---

**Version:** 2.0
**Last Updated:** 2025-03-16
