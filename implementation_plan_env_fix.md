# Implementation Plan - Fix .env Formatting

The `.env` file currently has the `PORT` and `MONGODB_URI` variables concatenated, which causes a "MongoParseError: Invalid scheme" and a broken server start.

## Proposed Changes

### [Component: Configuration]

#### [MODIFY] [.env](file:///c:/Users/santr/Documents/Movie%20Platform/server/.env)
- Correctly separate `PORT` and `MONGODB_URI` into distinct lines.
- Ensure `PORT=5000` and `MONGODB_URI` contains the full connection string starting with `mongodb://`.

## Verification Plan

### Manual Verification
1. Run `npm run dev` in the `server` directory.
2. Verify the output:
    - `🎬 Movie Platform API running on http://localhost:5000` (instead of the concatenated string).
    - `✅ MongoDB connected successfully to Cloud Atlas` (or at least a clear network/auth error if the URI itself is problematic, but the *scheme* error should be gone).
