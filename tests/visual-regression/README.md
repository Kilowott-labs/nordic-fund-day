# Design QA - Automated Testing

Automated design-to-code verification using local Figma cache + Chrome DevTools MCP.

## What This Does

Tests your implementation against Figma designs and checks:
- ✅ Design accuracy (dimensions, typography, colors, spacing)
- ✅ Accessibility (semantic HTML, ARIA, color contrast)
- ✅ SEO (heading structure, semantic elements)
- ✅ Console errors (JavaScript errors)
- ✅ Network errors (404s, failed requests)

## How It Works

Figma is queried **once** during the design-to-code phase and the full page JSON is saved locally under `figma-cache/`. All QA runs read from these local files — no repeated Figma MCP calls, no rate limit issues. Browser testing uses Chrome DevTools MCP.

## Quick Start

### 1. Setup (One-Time per Page)

The Figma cache must be populated before QA can run. This is done as part of the design-to-code flow:

```
# In Kiro chat — run the Figma Cache Step from design-to-code.md
Use the Figma MCP to fetch the full node JSON for this page:
Figma URL: [your figma file url]
Page Node ID: [your page node id]

Save the complete response as-is to figma-cache/[page-name]-full.json.
Do not summarise, trim or interpret the JSON — save the raw output exactly as returned.
Create the figma-cache/ directory if it doesn't exist.
Confirm how many API calls were made once done.
```

This is a **one-time step per page**. After that, all QA runs use the local cache.

### 2. Add Your Section to Config

Edit `tests/visual-regression/design-qa-config.json`:

```json
{
  "sections": {
    "your-section": {
      "figmaCacheFile": "figma-cache/blocks/your-section.json",
      "url": "/",
      "rootSelector": ".your-section-class",
      "viewports": ["desktop", "tablet", "mobile"]
    }
  }
}
```

**Get Figma node ID:**
1. Select frame in Figma
2. Right-click → "Copy link to selection"
3. URL: `...?node-id=3-3390`
4. Use: `3-3390`

### 3. Test in Chat

In Kiro chat, activate the steering file and test:

```
#design-qa-workflow

Test your-section
```

### 4. Review Report

Report location: `reports/your-section.md`

Shows:
- Design mismatches with CSS fixes
- Accessibility issues with solutions
- SEO problems with recommendations
- Console/network errors

### 5. Fix and Re-test

Apply fixes from report, then:

```
Test your-section
```

Report updates automatically.

## Chat Commands

```bash
# Test single section
Test hero-section

# Test specific viewport
Test hero-section on mobile

# Test all sections
Test all sections
```

## Files in This Directory

```
tests/visual-regression/
├── design-qa-config.json          # Your sections config
├── reports/                       # Generated test reports
│   └── [section-name].md
├── .cache/                        # Auto-generated element mapping cache (gitignored)
│   └── element-mappings.json
├── README.md                      # This file
├── DESIGN-QA-GUIDE.md            # Detailed usage guide
├── SETUP.md                       # Setup for new projects
└── QUICK-REFERENCE.md            # Quick command reference
```

And at the project root:

```
figma-cache/
├── [page-name]-full.json          # Raw full page JSON (one Figma MCP call)
└── blocks/
    └── [block-name].json          # Per-block JSON used by QA
```

## Documentation

- **Quick Start:** This file (README.md)
- **Detailed Guide:** [DESIGN-QA-GUIDE.md](./DESIGN-QA-GUIDE.md)
- **Setup for New Projects:** [SETUP.md](./SETUP.md)
- **Quick Reference:** [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)

## Configuration

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

### Multi-Viewport

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

### Different Page

```json
{
  "about-hero": {
    "figmaCacheFile": "figma-cache/blocks/about-hero.json",
    "url": "/about",
    "rootSelector": ".about-hero",
    "viewports": ["desktop"]
  }
}
```

## Best Practices

1. **Run the Figma Cache Step first** — QA cannot proceed without it
2. **Use semantic HTML** — `<header>`, `<nav>`, `<button>` (not divs)
3. **Provide rootSelector** — helps AI find elements accurately
4. **Name Figma layers clearly** — "Hero / Main Heading" (not "Rectangle 123")
5. **Test early and often** — Implement → Test → Fix → Test
6. **Test all viewports** — catch responsive issues early
7. **Refresh cache when design changes** — delete `figma-cache/[page]-full.json` and re-run the Figma Cache Step

## Token Usage

- First run: ~18,000 tokens (element discovery + caching)
- Cached runs: ~10,000 tokens (skip discovery)
- Figma MCP: 0 calls at QA time (reads local JSON)
- Monthly: very affordable — most cost is first-run element discovery, cached after that

## Troubleshooting

**Figma cache not found:**
- Run the design-to-code Figma Cache Step first
- Check that `figma-cache/blocks/[section-name].json` exists
- Do not try to call Figma MCP manually during QA

**Element not found:**
- Add/verify `rootSelector` in config
- Check element exists on page
- Use semantic HTML

**Low confidence match:**
- Provide more specific `rootSelector`
- Use semantic elements
- Check for duplicate elements

**Measurements don't match:**
- Wait for fonts to load, re-test
- Verify viewport size
- Check if Figma cache is stale (design changed since last cache)

## Sharing with Team

Share these files:
1. `.kiro/steering/design-qa-workflow.md`
2. `.kiro/steering/design-to-code.md`
3. `tests/visual-regression/` (this entire directory)
4. `figma-cache/` (so teammates don't need to re-fetch Figma)

Team members:
1. Copy files to their project
2. Update `design-qa-config.json` with their sections
3. If `figma-cache/` is not shared, run the Figma Cache Step once
4. Start testing in chat

---

**Version:** 2.0
**Status:** ✅ Ready to Use
