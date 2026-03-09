# Implementation Plan - Restore Horizontal Scroll & Debug Signup

The "Spotlight" and "Trending" sections on the home page have lost their horizontal scrolling capability because of conflicting CSS rules that hide the scrollbar. Also, registration is reportedly failing for the user despite API tests passing.

## Proposed Changes

### [Component: Client Styles]

#### [MODIFY] [home.scss](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/styles/home.scss)
- Remove the `scrollbar-width: none` and `display: none` for `::-webkit-scrollbar` in the `.horizontal-scroll` class.
- Add visible scrollbar styling to match the cinematic theme.

#### [MODIFY] [components.scss](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/styles/components.scss)
- Ensure `.horizontal-scroll` has a consistent, visible scrollbar style.

### [Component: Client Logic]

#### [MODIFY] [SignupPage.jsx](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/pages/SignupPage.jsx)
- Enhance error logging in `handleSubmit` to provide more context on registration failures (e.g., logging full error response).

## Verification Plan

### Manual Verification
1. **Scroll Check**:
    - Open the Home Page on a desktop browser.
    - Verify that a styled scrollbar is visible under the movie rows.
    - Verify that the row scrolls horizontally using the mouse/trackpad.
2. **Signup Check**:
    - Attempt to register a new user.
    - If it fails, check the browser console for detailed error logs to diagnose the issue.
