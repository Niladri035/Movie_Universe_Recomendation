# Diversifying Home Content

To provide a more engaging experience, we will ensure the Hero section features "Upcoming" content, while the scrollable rows focus on real-time "Trending" and "Popular" data. This avoids the redundancy of seeing the same movies in both sections.

## Proposed Changes

### [moviesSlice.js](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/store/slices/moviesSlice.js)
- Add `upcoming: []` to the initial state.
- Add `setUpcoming` reducer to update the state.
- Export `setUpcoming` action.

### [HomePage.jsx](file:///c:/Users/santr/Documents/Movie%20Platform/client/src/pages/HomePage.jsx)
- Update the `useEffect` to fetch `upcoming` movies.
- Pass `upcoming` movies to the `Hero3D` component.
- Label the section appropriately if needed, and ensure `Trending Now` row remains with `trending` data.

## Verification Plan

### Automated Tests
- Check if `Hero3D` renders movies from the `upcoming` array.
- Verify `Trending Now` row displays `trending` movies.

### Manual Verification
- Confirm that the Hero posters are different from the first row of movies.
- Check the visual flow between the "Explore" button and the content section.
