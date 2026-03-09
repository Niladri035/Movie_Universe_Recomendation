# Fix MongoDB Connection Timeout

We will ensure the server only starts handling requests once the database connection is fully established. We will also add a check to the authentication routes to return a clear error if the database is unavailable.

## User Actions Required

> [!IMPORTANT]
> **Check MongoDB Atlas IP Whitelist**: The `buffering timed out` error is most commonly caused by your current IP address not being whitelisted in the MongoDB Atlas dashboard. Please ensure "Allow access from anywhere" (0.0.0.0/0) is enabled for testing, or add your current IP.

## Proposed Changes

### [server/index.js](file:///c:/Users/santr/Documents/Movie%20Platform/server/index.js)
- Refactor the startup logic to call `app.listen()` inside the `mongoose.connect().then()` block.
- This prevents the server from and dangling in a "half-started" state.

### [routes/auth.js](file:///c:/Users/santr/Documents/Movie%20Platform/server/routes/auth.js) (and other routes)
- Add a middleware or a simple check at the start of routes to verify `mongoose.connection.readyState`.
- If the connection is not `1` (connected), return a `503 Service Unavailable` with a descriptive message.

## Verification Plan

### Automated Tests
- Restart the server and monitor the console for "✅ MongoDB connected successfully".
- Attempt a signup immediately after restart; it should now either wait until the server is up (if starting) or fail with a clear 503 if the DB is unreachable.

### Manual Verification
- Verify the API health endpoint returns "ok" only after DB connection.
