# Implementation Plan: Offline TMDB Mock Fallback

The server is currently returning 500 errors when offline because it cannot reach TMDB. This plan adds a mock data fallback to ensure the frontend can still display movies for development purposes.

## Proposed Changes

### [NEW] `server/mocks/tmdbMocks.js`
Create a centralized mock data file containing sample responses for:
- Trending (all/week)
- Popular movies
- Top rated movies
- Popular TV shows
- Upcoming movies

### [MODIFY] `server/routes/tmdb.js`
- Import the mock data.
- Update the `handleError` or the individual routes to check for network-related errors (`ENOTFOUND`, `ETIMEDOUT`, `ECONNREFUSED`).
- If a network error occurs, return the corresponding mock data with a 200 status and a custom header/log indicating "Offline Mock Mode".

## Verification Plan

### Automated Verification
- I will create a script `server/tests/test_offline.js` that simulates a network failure (e.g., by pointing to an invalid base URL) and verifies that the TMDB routes return the mock data instead of 500 errors.

### Manual Verification
1. Disconnect internet (already done by the looks of it).
2. Start the server: `npm run dev` in `server/`.
3. Hit `http://localhost:5000/api/tmdb/trending` and verify it returns a valid JSON list of movies.
4. Check the server console for "⚠️ Falling back to MOCK DATA due to network error".
