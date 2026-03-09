# Fix Authentication Issues

The goal is to make the authentication system robust by verifying sessions on startup and handling expired tokens gracefully.

## Proposed Changes

### [authSlice.js](file:///c:/Users/santr\Documents\Movie Platform\client\src\store\slices\authSlice.js)
- Add a `setUser` action to update the user object independently.
- Improve `initialState` to handle potential JSON parsing errors.

### [App.jsx](file:///c:/Users/santr\Documents\Movie Platform\client\src\App.jsx)
- Add `useEffect` to call `/api/auth/me` on application mount if a token exists.
- This ensures the Redux state is hydrated with the latest user data from the server.

### [axios.js](file:///c:/Users/santr\Documents\Movie Platform\client\src\api\axios.js)
- Add a response interceptor to detect `401 Unauthorized` errors.
- If a 401 is received (except on the login route), automatically clear local storage and reset the auth state in Redux.

## Verification Plan

### Automated Tests
- Refresh the page with a valid token: should stay logged in.
- Manually corrupt the token in `localStorage` and refresh: should be redirected to login.
- Perform a restricted action (e.g., add to favorites) after token expires: should trigger auto-logout.

### Manual Verification
- Log in, refresh the page, and verify the user profile still appears in the Navbar.
- Log out and verify all protected routes redirect to `/login`.
