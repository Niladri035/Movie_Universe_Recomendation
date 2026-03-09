# Walkthrough: Content Diversification

I have resolved the issue where the Hero section and the "Trending Now" row showed identical movies. The Home page now offers a more varied and engaging discovery experience.

## Changes Made

### 🚀 Distinct Hero Content
- **New Category**: The `Hero3D` section now pulls from the **Upcoming** movie category. This gives the landing experience a "Featured/Spotlight" feel.
- **Data Isolation**: By separating the Hero data from the Trending data, users now see 25+ unique movies immediately upon scroll, rather than seeing the same 5 movies twice.

### 🛠️ Technical Implementation
- **Redux Update**: Added `upcoming` state and `setUpcoming` action to `moviesSlice.js` to manage the new data stream.
- **Smart Loading**: Updated the `HomePage.jsx` fetch sequence to include the `getUpcoming` API call in a parallel `Promise.all` block for maximum efficiency.
- **Fallback Logic**: Implemented a fallback in the Hero section to show `trending` movies only if the `upcoming` list is unavailable, ensuring the UI never looks empty.

### ✨ Transition Refinement
- Verified that the `-15vh` content overlap maintains a high-end parallax effect while scrolling from the 3D space into the movie rows.

## Verification
- Checked that Hero posters differ from Trending row posters.
- Verified Redux state population for the new `upcoming` field.
- Confirmed smooth scroll behavior from the "Explore" button.
