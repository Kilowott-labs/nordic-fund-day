# Block: Header Navigation
**Block name:** `agent-theme/header-nav`
**Version:** 1.0.0
**Generated:** 2026-04-11

## Purpose
Fixed top navigation bar with logo, desktop navigation links, CTA button, and mobile hamburger menu with smooth slide transition. Supports smooth scroll to anchor sections. Background transitions from transparent to dark on scroll.

## Attributes

| Attribute | Type | Default | What it controls |
|---|---|---|---|
| logo | string | "" | Logo image URL |
| logoId | number | 0 | WordPress media ID |
| logoAlt | string | "Nordic Fund Day" | Logo alt text / fallback text |
| navLinks | array | [3 links] | Navigation links: `{id, label, url}` |
| ctaLabel | string | "REQUEST ACCESS" | CTA button label |
| ctaUrl | string | "#" | CTA button URL |

## Theme Tokens Used

| Token slug | CSS variable | Where used |
|---|---|---|
| lime | --wp--preset--color--lime | Link hover color, CTA hover bg |

## Files

| File | Purpose |
|---|---|
| block.json | Attribute schema, `multiple: false` support |
| edit.js | Editor with logo MediaUpload, nav link management, CTA controls |
| save.js | Frontend nav with data- attributes for view.js |
| view.js | Mobile toggle, smooth scroll, nav scroll background |
| style.scss | Mobile menu max-height transition, scrolled state |
| index.js | Block registration |
| block-spec.md | This documentation file |

## Frontend Behaviour (view.js)
- **Mobile toggle:** Click hamburger → slide menu open with animated icon swap (hamburger ↔ X)
- **Smooth scroll:** Anchor links (`#section-id`) scroll smoothly with -90px offset for nav height. Uses Lenis if available, falls back to native `scrollTo`.
- **Nav background:** Transparent at top, transitions to `rgba(0,0,0,0.85)` with backdrop blur after 50px scroll. CSS class `scrolled` toggled via JS.
- **Auto-close:** Mobile menu closes when an anchor link is clicked.

## Known Constraints
- `multiple: false` — only one instance allowed per page
- In editor, nav is shown with relative position (not fixed) to avoid editor UI conflicts
- Lenis integration is optional — view.js checks `window.lenis` and falls back gracefully
- Logo falls back to text (`logoAlt`) when no image is uploaded

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-04-11 | Initial block generated |
