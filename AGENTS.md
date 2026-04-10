# Gutenberg Block Development Playbook

## Purpose
Complete workflow for building pixel-perfect, accessible Gutenberg blocks from Figma designs using our established patterns and automated QA process.

---

## Complete Block Development Workflow

### Phase 1: Design Analysis & Planning

#### Step 1: Analyze Figma Design
1. Get Figma file key and node ID from user
2. Use `mcp_Framelink_Figma_MCP_get_figma_data` to fetch design data
3. Extract key information:
   - **Layout structure**: Sections, containers, grid/flex patterns
   - **Content elements**: Headings, text, images, buttons, icons
   - **Typography**: Font families, sizes, weights, line heights, letter spacing
   - **Colors**: Background colors, text colors, border colors
   - **Spacing**: Padding, margins, gaps between elements
   - **Effects**: Border radius, shadows, opacity, gradients
   - **Responsive behavior**: How design adapts at different viewports
   - **Interactive elements**: Hover states, animations, transitions

#### Step 2: Identify Block Type & Complexity
Determine block category:
- **Simple content block**: Text, images, basic layout (e.g., hero, CTA banner)
- **Interactive block**: User interactions, state management (e.g., accordion, tabs, cards-fade)
- **Data-driven block**: Dynamic content, loops (e.g., testimonials slider, process steps)
- **Form block**: User input, validation (e.g., contact form)

#### Step 3: Plan Block Structure
Define:
- **Block name**: `namespace/block-name` (e.g., `coretrek/cards-fade`)
- **Attributes**: All editable content and settings
- **Components**: Reusable UI elements
- **Interactivity**: Frontend JavaScript requirements
- **Responsive strategy**: Mobile-first breakpoints

---

### Phase 2: Block Scaffolding

#### Step 4: Create Block Directory Structure
```
blocks/src/[block-name]/
├── block.json          # Block metadata and configuration
├── edit.js            # Editor component
├── save.js            # Frontend markup
├── style.scss         # Frontend + editor styles
├── editor.scss        # Editor-only styles
├── view.js            # Frontend JavaScript (if needed)
└── index.js           # Auto-generated entry point
```

#### Step 5: Configure block.json
**Template:**
```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "namespace/block-name",
  "version": "1.0.0",
  "title": "Block Display Name",
  "category": "ytf",
  "icon": "icon-name",
  "description": "Brief description of block functionality",
  "textdomain": "ytf",
  "attributes": {
    // Define all editable content here
  },
  "supports": {
    "html": false,
    "align": ["full", "wide"],
    "spacing": {
      "padding": true,
      "margin": true
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "viewScript": "file:./view.js"
}
```

**Attribute Types:**
- `string`: Text content, URLs, class names
- `number`: Numeric values, IDs
- `boolean`: Toggle settings
- `array`: Lists of items (cards, slides, steps)
- `object`: Complex nested data

**Example Attributes:**
```json
"attributes": {
  "heading": {
    "type": "string",
    "default": "Default Heading"
  },
  "items": {
    "type": "array",
    "default": [
      {
        "id": 1,
        "title": "Item 1",
        "description": "Description",
        "image": "",
        "imageId": 0
      }
    ]
  },
  "backgroundColor": {
    "type": "string",
    "default": "#ffffff"
  },
  "showCTA": {
    "type": "boolean",
    "default": true
  }
}
```

---

### Phase 3: Editor Component (edit.js)

#### Step 6: Build Editor Component
**Structure:**
```javascript
import { __ } from '@wordpress/i18n';
import { 
    useBlockProps, 
    InspectorControls, 
    MediaUpload, 
    MediaUploadCheck,
    RichText,
    ColorPalette
} from '@wordpress/block-editor';
import { 
    PanelBody, 
    TextControl, 
    ToggleControl,
    Button,
    RangeControl 
} from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    // Destructure attributes
    const { heading, items, backgroundColor } = attributes;
    
    // Local state for editor interactions
    const [activeItem, setActiveItem] = useState(0);
    
    // Block props
    const blockProps = useBlockProps({
        className: 'block-name-editor'
    });
    
    // Helper functions
    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setAttributes({ items: newItems });
    };
    
    const addItem = () => {
        const newItems = [...items];
        const newId = Math.max(...items.map(i => i.id), 0) + 1;
        newItems.push({
            id: newId,
            title: `Item ${newId}`,
            description: '',
            image: '',
            imageId: 0
        });
        setAttributes({ items: newItems });
    };
    
    const removeItem = (index) => {
        if (items.length <= 1) return;
        const newItems = items.filter((_, i) => i !== index);
        setAttributes({ items: newItems });
    };
    
    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Block Settings', 'ytf')} initialOpen={true}>
                    <TextControl
                        label={__('Heading', 'ytf')}
                        value={heading}
                        onChange={(value) => setAttributes({ heading: value })}
                    />
                    {/* Add more controls */}
                </PanelBody>
                
                <PanelBody title={__('Items', 'ytf')} initialOpen={true}>
                    {items.map((item, index) => (
                        <PanelBody
                            key={item.id}
                            title={item.title}
                            initialOpen={false}
                        >
                            <TextControl
                                label={__('Title', 'ytf')}
                                value={item.title}
                                onChange={(value) => updateItem(index, 'title', value)}
                            />
                            
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={(media) => {
                                        const newItems = [...items];
                                        newItems[index] = {
                                            ...newItems[index],
                                            image: media.url,
                                            imageId: media.id
                                        };
                                        setAttributes({ items: newItems });
                                    }}
                                    allowedTypes={['image']}
                                    value={item.imageId}
                                    render={({ open }) => (
                                        <div className="components-base-control">
                                            <label className="components-base-control__label">
                                                {__('Image', 'ytf')}
                                            </label>
                                            {item.image && (
                                                <img 
                                                    src={item.image} 
                                                    alt={item.title}
                                                    style={{ 
                                                        width: '100%', 
                                                        height: 'auto', 
                                                        marginBottom: '10px',
                                                        maxHeight: '200px',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            )}
                                            <Button onClick={open} variant="secondary">
                                                {item.image ? __('Change Image', 'ytf') : __('Select Image', 'ytf')}
                                            </Button>
                                            {item.image && (
                                                <Button
                                                    onClick={() => updateItem(index, 'image', '')}
                                                    variant="link"
                                                    isDestructive
                                                    style={{ marginLeft: '10px' }}
                                                >
                                                    {__('Remove', 'ytf')}
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                />
                            </MediaUploadCheck>
                            
                            {items.length > 1 && (
                                <Button
                                    onClick={() => removeItem(index)}
                                    variant="secondary"
                                    isDestructive
                                    style={{ marginTop: '10px' }}
                                >
                                    {__('Remove Item', 'ytf')}
                                </Button>
                            )}
                        </PanelBody>
                    ))}
                    
                    <Button onClick={addItem} variant="primary" style={{ marginTop: '10px' }}>
                        {__('Add Item', 'ytf')}
                    </Button>
                </PanelBody>
            </InspectorControls>
            
            <div {...blockProps}>
                {/* Editor preview markup */}
                <section className="block-preview">
                    <h2>{heading}</h2>
                    {/* Render items preview */}
                </section>
            </div>
        </>
    );
}
```

**Key Patterns:**
- Use `InspectorControls` for sidebar settings
- Use `BlockControls` for toolbar controls
- Destructure attributes at top
- Create helper functions for array manipulation
- Provide visual preview in editor
- Use WordPress components for consistency

---

### Phase 4: Frontend Markup (save.js)

#### Step 7: Build Save Component
**Structure:**
```javascript
import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { heading, items, backgroundColor } = attributes;
    
    const blockProps = useBlockProps.save({
        className: 'block-name'
    });
    
    return (
        <div {...blockProps}>
            <section 
                className="block-section"
                style={{ backgroundColor }}
                data-block-name
                data-animate-on-scroll="fade-up"
                aria-label="Section description"
            >
                <div className="container">
                    <h2>{heading}</h2>
                    
                    <div className="items-grid">
                        {items.map((item, index) => (
                            <div key={item.id} className="item">
                                {item.image && (
                                    <img 
                                        src={item.image} 
                                        alt={item.title}
                                        loading="lazy"
                                    />
                                )}
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
```

**Key Patterns:**
- Use semantic HTML (section, article, header, footer, nav)
- Add data attributes for JavaScript hooks
- Include ARIA labels for accessibility
- Use loading="lazy" for images
- Keep markup clean and minimal
- Match Figma structure exactly

---

### Phase 5: Styling (style.scss & editor.scss)

#### Step 8: Write Frontend Styles (style.scss)
**Structure:**
```scss
/**
 * Frontend styles for Block Name
 * Mobile-first approach
 */

.block-name {
    // Base styles (mobile: 320px+)
    .block-section {
        position: relative;
        padding: 2rem 1rem;
    }
    
    .container {
        max-width: 1400px;
        margin: 0 auto;
    }
    
    .items-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .item {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        
        img {
            width: 100%;
            height: auto;
            object-fit: cover;
            border-radius: 8px;
        }
        
        h3 {
            font-size: 1.25rem;
            font-weight: 700;
            line-height: 1.4;
            color: var(--wp--preset--color--heading);
        }
        
        p {
            font-size: 1rem;
            line-height: 1.6;
            color: var(--wp--preset--color--text);
        }
    }
    
    // Tablet: 768px+
    @media (min-width: 768px) {
        .block-section {
            padding: 3rem 2rem;
        }
        
        .items-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
        }
    }
    
    // Desktop: 1024px+
    @media (min-width: 1024px) {
        .block-section {
            padding: 4rem 2rem;
        }
        
        .items-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2.5rem;
        }
    }
    
    // Large desktop: 1440px+
    @media (min-width: 1440px) {
        .block-section {
            padding: 5rem 2rem;
        }
    }
}
```

**Styling Rules:**
1. **Mobile-first**: Base styles for 320px, then min-width media queries
2. **Use theme tokens**: `var(--wp--preset--color--primary)` instead of hex colors
3. **Responsive breakpoints**: 768px (tablet), 1024px (desktop), 1440px (large)
4. **BEM-like naming**: `.block-name__element--modifier`
5. **Flexbox/Grid**: Modern layout techniques
6. **Transitions**: Smooth interactions (0.3s ease)

#### Step 9: Write Editor Styles (editor.scss)
```scss
/**
 * Editor-only styles for Block Name
 */

.block-name-editor {
    // Match frontend styles but add editor-specific adjustments
    .block-section {
        min-height: 200px;
        border: 1px dashed #ddd;
    }
    
    .item {
        cursor: pointer;
        
        &:hover {
            opacity: 0.9;
        }
    }
}

// Inspector controls styling
.components-panel__body {
    .components-base-control {
        margin-bottom: 16px;
        
        img {
            border-radius: 4px;
            border: 1px solid #ddd;
        }
    }
}
```

---

### Phase 6: Frontend JavaScript (view.js)

#### Step 10: Add Interactivity (if needed)
**Structure:**
```javascript
/**
 * Frontend JavaScript for Block Name
 */

function initBlockName() {
    const blocks = document.querySelectorAll('[data-block-name]');
    
    blocks.forEach(block => {
        // Get elements
        const items = block.querySelectorAll('.item');
        const fader = block.querySelector('.fader');
        
        // Add event listeners
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                handleItemClick(item, index, items, fader);
            });
            
            // Keyboard accessibility
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemClick(item, index, items, fader);
                }
            });
        });
    });
}

function handleItemClick(item, index, items, fader) {
    // Remove active class from all items
    items.forEach(i => {
        i.classList.remove('active');
        i.setAttribute('aria-pressed', 'false');
    });
    
    // Add active class to clicked item
    item.classList.add('active');
    item.setAttribute('aria-pressed', 'true');
    
    // Update fader background
    const imageUrl = item.dataset.image;
    if (imageUrl && fader) {
        fader.style.backgroundImage = `url(${imageUrl})`;
        fader.style.opacity = '1';
        
        setTimeout(() => {
            fader.style.opacity = '0';
        }, 700);
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlockName);
} else {
    initBlockName();
}
```

**JavaScript Rules:**
1. **Vanilla JS**: No jQuery unless required by WordPress core
2. **Event delegation**: Efficient event handling
3. **Keyboard accessibility**: Support Enter and Space keys
4. **ARIA attributes**: Update aria-pressed, aria-expanded, etc.
5. **Performance**: Use requestAnimationFrame for animations
6. **Cleanup**: Remove event listeners when needed

---

### Phase 7: Block Registration

#### Step 11: Register Block in blocks.php
Add to `blocks/blocks.php`:
```php
// Register Block Name
register_block_type( __DIR__ . '/src/block-name' );
```

#### Step 12: Build Block
Run build command:
```bash
npm run build
```

Or for development with watch mode:
```bash
npm run start
```

---

### Phase 8: Design QA & Testing

#### Step 13: Add to Design QA Config
Add section to `tests/visual-regression/design-qa-config.json`:
```json
{
  "sections": {
    "block-name": {
      "nodeId": "FIGMA-NODE-ID",
      "url": "/page-url",
      "rootSelector": ".block-name",
      "viewports": ["desktop", "tablet", "mobile"]
    }
  }
}
```

#### Step 14: Run Design QA
Test block against Figma design:
```
Test block-name
```

This will:
1. Fetch Figma design data
2. Navigate to page with block
3. Match Figma elements to DOM elements
4. Measure all properties (typography, colors, spacing, etc.)
5. Compare with tolerances
6. Check accessibility (semantic HTML, alt text, ARIA, contrast)
7. Check SEO (heading hierarchy, link text)
8. Detect console/network errors
9. Generate detailed report with CSS fixes

#### Step 15: Fix Issues
Apply CSS fixes from report:
```css
/* From report: tests/visual-regression/reports/block-name.md */
.block-name h2 {
  font-size: 48px; /* was 42px */
  line-height: 1.2; /* was 1.4 */
  color: #1B3C39; /* was #1E293B */
}
```

#### Step 16: Re-test
Run design QA again to verify fixes:
```
Test block-name
```

Repeat until all issues resolved.

---

### Phase 9: Accessibility Validation

#### Step 17: Manual Accessibility Checks
1. **Keyboard navigation**: Tab through all interactive elements
2. **Screen reader**: Test with NVDA/JAWS (Windows) or VoiceOver (Mac)
3. **Focus states**: Verify visible focus indicators
4. **Color contrast**: Check text/background contrast ratios
5. **Semantic HTML**: Verify proper heading hierarchy
6. **ARIA attributes**: Check aria-label, aria-pressed, aria-expanded
7. **Images**: Verify alt text (descriptive or empty for decorative)
8. **Forms**: Check label associations and error messages

---

### Phase 10: Performance Optimization

#### Step 18: Optimize Assets
1. **Images**: Use WebP format, lazy loading, responsive images
2. **CSS**: Remove unused styles, minimize specificity
3. **JavaScript**: Code split, defer non-critical scripts
4. **Fonts**: Preload critical fonts, use font-display: swap

#### Step 19: Test Performance
1. **Lighthouse**: Run audit in Chrome DevTools
2. **WebPageTest**: Test on real devices
3. **Core Web Vitals**: Check LCP, FID, CLS scores

---

## Block Development Checklist

### Planning Phase
- [ ] Analyze Figma design (layout, typography, colors, spacing)
- [ ] Identify block type and complexity
- [ ] Plan attributes and interactivity
- [ ] Define responsive strategy

### Development Phase
- [ ] Create block directory structure
- [ ] Configure block.json with all attributes
- [ ] Build edit.js with InspectorControls
- [ ] Build save.js with semantic HTML
- [ ] Write style.scss (mobile-first, theme tokens)
- [ ] Write editor.scss
- [ ] Add view.js for interactivity (if needed)
- [ ] Register block in blocks.php
- [ ] Build block (npm run build)

### Testing Phase
- [ ] Add to design-qa-config.json
- [ ] Run design QA test
- [ ] Fix all design issues
- [ ] Re-test until all pass
- [ ] Manual accessibility testing
- [ ] Keyboard navigation testing
- [ ] Screen reader testing
- [ ] Performance testing (Lighthouse)

### Quality Assurance
- [ ] All output escaped (esc_html, esc_attr, esc_url)
- [ ] No hardcoded colors (use theme tokens)
- [ ] Responsive at all breakpoints (320px, 768px, 1024px, 1440px)
- [ ] Images have alt attributes
- [ ] Interactive elements keyboard accessible
- [ ] Proper heading hierarchy
- [ ] No console errors
- [ ] No network errors
- [ ] Passes WCAG AA contrast requirements

---

## Common Block Patterns

### Pattern 1: Simple Content Block
**Use for**: Hero sections, CTA banners, text blocks

**Attributes**: Heading, description, button text/URL, image

**No view.js needed** - Static content only

### Pattern 2: Interactive Cards
**Use for**: Service cards, feature lists, team members

**Attributes**: Array of card objects (title, description, image)

**view.js**: Handle card interactions, hover effects, click events

### Pattern 3: Slider/Carousel
**Use for**: Testimonials, image galleries, product showcases

**Attributes**: Array of slide objects, autoplay settings

**view.js**: Slider logic, navigation, autoplay, touch gestures

### Pattern 4: Accordion/Tabs
**Use for**: FAQs, content organization, multi-step forms

**Attributes**: Array of panel objects (title, content)

**view.js**: Toggle panels, keyboard navigation, ARIA states

### Pattern 5: Form Block
**Use for**: Contact forms, newsletter signup, search

**Attributes**: Form fields, validation rules, submit URL

**view.js**: Form validation, AJAX submission, error handling

---

## Design Token Usage

### Colors
```scss
// ❌ Don't hardcode
color: #1B3C39;
background-color: #35746E;

// ✅ Use theme tokens
color: var(--wp--preset--color--heading);
background-color: var(--wp--preset--color--primary);
```

### Spacing
```scss
// ❌ Don't hardcode
padding: 32px;
margin-bottom: 24px;

// ✅ Use theme tokens
padding: var(--wp--preset--spacing--50);
margin-bottom: var(--wp--preset--spacing--40);
```

### Typography
```scss
// ❌ Don't hardcode
font-size: 48px;
font-family: 'Inter', sans-serif;

// ✅ Use theme tokens
font-size: var(--wp--preset--font-size--x-large);
font-family: var(--wp--preset--font-family--primary);
```

---

## Troubleshooting

### Block Not Appearing in Editor
1. Check block.json syntax (valid JSON)
2. Verify block is registered in blocks.php
3. Run `npm run build`
4. Clear browser cache
5. Check console for errors

### Styles Not Applying
1. Verify style.scss is imported
2. Check CSS specificity
3. Inspect element in DevTools
4. Clear WordPress cache
5. Rebuild block (npm run build)

### JavaScript Not Working
1. Check view.js syntax errors
2. Verify data attributes in save.js
3. Check browser console for errors
4. Test in incognito mode (no extensions)
5. Verify script is enqueued

### Design QA Failing
1. Check Figma node ID is correct
2. Verify rootSelector matches block class
3. Check if fonts are loaded
4. Disable animations during testing
5. Verify page is fully loaded

---

## Best Practices Summary

### Code Quality
- Escape all output (esc_html, esc_attr, esc_url)
- Sanitize all input (sanitize_text_field, wp_kses)
- Use WordPress coding standards
- Add JSDoc comments for complex functions
- Keep functions small and focused

### Performance
- Lazy load images
- Minimize CSS/JS bundle size
- Use CSS Grid/Flexbox (not floats)
- Avoid expensive JavaScript operations
- Cache expensive queries

### Accessibility
- Use semantic HTML elements
- Add ARIA attributes where needed
- Ensure keyboard navigation works
- Provide descriptive alt text
- Meet WCAG AA contrast requirements
- Test with screen readers

### Maintainability
- Use consistent naming conventions
- Document complex logic
- Keep components reusable
- Follow established patterns
- Use theme tokens (no hardcoded values)

---

## Example: Complete Block Development

### User Request
"Create a cards-fade block from Figma design"

### AI Response Flow

1. **Analyze Design**
   - Fetch Figma data
   - Identify: 3 service cards, background image fade effect, CTA section
   - Extract: Typography, colors, spacing, layout

2. **Create Structure**
   - Generate block.json with cards array attribute
   - Define card object: id, number, title, image, imageId

3. **Build Editor**
   - InspectorControls for card management
   - Add/remove card functionality
   - MediaUpload for images
   - Live preview with active state

4. **Build Frontend**
   - Semantic HTML with data attributes
   - ARIA labels for accessibility
   - Keyboard navigation support

5. **Style Block**
   - Mobile-first responsive styles
   - Use theme tokens for colors
   - Smooth transitions for interactions

6. **Add Interactivity**
   - Click/keyboard handlers for cards
   - Background image fade effect
   - Update ARIA states

7. **Test & Fix**
   - Add to design-qa-config.json
   - Run design QA test
   - Apply CSS fixes from report
   - Re-test until all pass

8. **Validate**
   - Manual accessibility testing
   - Keyboard navigation
   - Screen reader testing
   - Performance audit

---

## Token Optimization

### Use Cached Element Mappings
After first design QA test, element mappings are cached:
- **First test**: ~21,000 tokens (full discovery)
- **Subsequent tests**: ~7,000 tokens (use cache)
- **Savings**: 66% per test

Cache location: `tests/visual-regression/.cache/element-mappings.json`

Cache is automatically:
- Created after first successful test
- Reused if Figma design unchanged
- Invalidated if design changes
- Updated with new mappings

---

## Quick Reference

### Essential WordPress Imports
```javascript
// Block editor
import { useBlockProps, InspectorControls, MediaUpload, RichText } from '@wordpress/block-editor';

// Components
import { PanelBody, TextControl, ToggleControl, Button } from '@wordpress/components';

// React hooks
import { useState, useEffect, useRef } from '@wordpress/element';

// Internationalization
import { __ } from '@wordpress/i18n';
```

### Essential PHP Functions
```php
// Escaping
esc_html( $text );
esc_attr( $attribute );
esc_url( $url );
wp_kses_post( $html );

// Sanitizing
sanitize_text_field( $input );
sanitize_email( $email );
absint( $number );

// Block registration
register_block_type( __DIR__ . '/src/block-name' );
```

### Build Commands
```bash
# Development (watch mode)
npm run start

# Production build
npm run build

# Lint JavaScript
npm run lint:js

# Lint CSS
npm run lint:css
```

---

## Conclusion

This playbook provides a complete, repeatable workflow for building pixel-perfect Gutenberg blocks from Figma designs. Follow each phase systematically, use the automated design QA process, and apply the established patterns for consistent, high-quality results.

**Key Success Factors:**
1. Thorough design analysis before coding
2. Use existing blocks as templates
3. Follow WordPress coding standards
4. Implement accessibility from the start
5. Use automated design QA for validation
6. Test on real devices and browsers
7. Optimize for performance

**Remember**: The goal is not just to build blocks, but to build blocks that are:
- Pixel-perfect to design
- Fully accessible
- Performant
- Maintainable
- Reusable
