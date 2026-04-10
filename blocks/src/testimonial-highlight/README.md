# Testimonial Highlight Block

A testimonial section featuring a heading, CTA button, and achievement cards with fade-in animations.

## Features

- Editable subtitle with decorative circle indicator
- Rich text heading
- Customizable CTA button with hover animation
- 4 achievement cards with white icons
- Fade-in animations with staggered delays
- Card hover effects (lift and border highlight)
- Decorative box element (desktop only)
- Fully responsive layout

## Block Attributes

### Content
- `subtitle` (string): Subtitle text with circle indicator
- `heading` (string): Main heading text
- `buttonText` (string): CTA button label
- `buttonUrl` (string): CTA button URL
- `cards` (array): Achievement cards with text content

### Card Structure
Each card contains:
- `id` (number): Unique identifier
- `text` (string): Card text (supports \n for line breaks)

## Theme.json Tokens Used

### Colors
- `--wp--preset--color--testimonial-bg`: Section background (#1a1b1e)
- `--wp--preset--color--card-bg`: Card background (#0e0f11)
- `--wp--preset--color--cta-button`: Button background (#d0ff71)
- `--wp--preset--color--cta-text`: Button text color (#141414)
