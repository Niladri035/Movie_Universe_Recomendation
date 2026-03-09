# Debugging Persistent 500 Error

The platform is experiencing a 500 error when the frontend attempts to fetch data from the backend via Vite's `/api` proxy.

## Proposed Changes

### 1. Request Logging (Done)
- Added middleware to `server/index.js` to log incoming requests with time stamps.
- This will confirm whether requests are actually reaching the backend or if Vite is failing the proxy.

### 2. Resilient Environment Variables
- Updated `client/.env` carefully with UTF-8 encoding to ensure `VITE_API_URL` and `VITE_TMDB_IMAGE_BASE` aren't read as `undefined`.

### 3. Three.js Modernization
- Switched from `THREE.Clock` to `THREE.Timer` in `Hero3D.jsx`.
- This silences the deprecation warning for Three.js r169+ and ensures modern performance timing.

### 4. Connection Diagnostics
- Standardized networking on `127.0.0.1` to bypass Windows IPv6 resolution issues.
- Established UTF-8 encoding for all `.env` files to prevent `undefined` environmental variables.

## Verification
- Refresh `http://localhost:5173`.
- ✅ Backend Logs: Confirmed `200 OK` for `/api/tmdb/trending`.
- ✅ Browser Console: Verified no `Clock` deprecation warnings.
- ✅ WebGL: Confirmed movie posters are rendering with correct CORS headers.
