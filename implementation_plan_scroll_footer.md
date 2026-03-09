# Scroll Restoration & Footer Redesign Plan

The objective is to fix the non-functional scrolling across all pages and elevate the footer design to match the cinematic aesthetic of the rest of the application.

## Proposed Changes

### [Component] Global Styles
#### [MODIFY] [globals.scss](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/styles/globals.scss)
- Remove `overscroll-behavior: none` to restore default browser scrolling, especially on Windows.
- Ensure `html, body` allow for natural vertical overflow.

### [Component] Footer Styling
#### [NEW] [footer.scss](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/styles/footer.scss)
- Implement a premium glassmorphism design with HSL tailored colors.
- Add subtle hover animations to social icons and links.
- Use smooth gradients and improved spacing.

#### [MODIFY] [main.jsx](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/main.jsx)
- Import the new `footer.scss`.

## Verification Plan

### Automated Tests
- None, visual and interaction-based verification.

### Manual Verification
- Verify scrolling works on Home, Search, and Detail pages.
- Visually inspect the footer for premium aesthetics and responsiveness.
- Test social icon hover effects.
