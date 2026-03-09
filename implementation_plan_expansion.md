# Galaxy Expansion: New Navigation Sections

The objective is to enrich the platform by adding dedicated sections for Movies, TV Shows, and a Premium Pricing page, making the "Universe" feel more complete and professional.

## 🚀 New Destinations

### [Component] Movies & TV Pages
- **MoviesPage.jsx**: Specialized view for browsing films with trending and top-rated categories.
- **TVShowsPage.jsx**: Dedicated space for series discovery.
- Both will utilize existing `MovieCard` components for a consistent UI.

### [Component] Pricing Page
- **PricingPage.jsx**: A premium-grade glassmorphism page showcasing available service tiers (Free, Pro, Cinephile).
- Adds more "commercial" depth to the platform.

### [Component] Navigation Update
- **Navbar.jsx**: Reorganized to fit the new links without looking cluttered.

## Proposed Changes

### [Component] Local API
#### [MODIFY] [tmdb.js](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/api/tmdb.js)
- Add specific methods for fetching Movies and TV shows by category if missing.

### [Component] Pages
#### [NEW] [MoviesPage.jsx](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/pages/MoviesPage.jsx)
#### [NEW] [TVShowsPage.jsx](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/pages/TVShowsPage.jsx)
#### [NEW] [PricingPage.jsx](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/pages/PricingPage.jsx)

### [Component] Layout
#### [MODIFY] [Navbar.jsx](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/components/layout/Navbar.jsx)
- Add "Movies", "TV Shows", and "Premium" links.
#### [MODIFY] [App.jsx](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/App.jsx)
- Register the new routes.

## Verification Plan
1. Check each new page for data loading and responsive UI.
2. Verify Navbar links correctly navigate and show active state.
3. Test interaction on the pricing cards.
