# Implementation Plan - TMDB 401 Fix & Fallback

The server is receiving 401 Unauthorized errors from TMDB. This plan aims to handle these errors gracefully by falling back to mock data and providing clearer feedback.

## User Review Required

> [!IMPORTANT]
> The current TMDB credentials (API Key/Token) in the `.env` file are being rejected by TMDB with a 401 error. You may need to generate a new API key/token from your TMDB account settings.

## Proposed Changes

### [Component: Server API]

#### [MODIFY] [tmdb.js](file:///c:/Users/santr/Documents/Movie%20Platform/server/routes/tmdb.js)
- Update `handleError` to include `err.response?.status === 401` in the fallback condition. This ensures that even if credentials are broken, the app remains functional with mock data during development.
- Add a specific log warning when a 401 occurs, advising the user to check their credentials.

## Verification Plan

### Automated Tests
- Run a node script to hit a TMDB route and verify it returns mock data with a 401-specific message in the logs.
```bash
node -e "const axios = require('axios'); axios.get('http://localhost:5000/api/tmdb/trending').then(r => console.log('Status:', r.status, 'Offline/Fallback:', !!r.data._offline))"
```

### Manual Verification
- Observe the server logs after the change. It should show: `⚠️ Auth Error (401): Falling back to MOCK DATA [trending]. Please check your TMDB_API_KEY / TMDB_API_READ_ACCESS_TOKEN.`
