# Refining Hero-to-Content Transition

The current `-15vh` margin on the main content wrapper is causing the "Trending Now" header to push too far into the Hero 3D space, creating a visual clash. We will give the 3D scene more breathing room.

## Proposed Changes

### [HomePage.jsx](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/pages/HomePage.jsx)
- Adjust the `marginTop` of `.main-content-wrapper` from `-15vh` to a more subtle `-5vh` or `0`.
- Ensure the `z-index` and `position` allow for a clean transition.

### [home.scss](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/styles/home.scss)
- Increase the bottom padding or margin of the Hero section if necessary.
- Refine the `.section-header` typography and spacing to feel more "grounded" below the 3D space.

## Verification Plan

### Manual Verification
- Scroll from the Hero section to the Trending row and ensure the header doesn't overlap with the central Hero text or posters.
- Check visual balance on mobile viewports.
