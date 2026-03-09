# Implementation Plan - Deploy Backend to Render

This plan outlines the steps to deploy the Node.js backend to Render. Since the project uses a monorepo structure, specific configuration is needed on Render to point to the `server` directory.

## Proposed Changes

### [Component: Server Configuration]

#### [No Changes Required]
- The `server/index.js` already uses `process.env.PORT` and handles `CORS` via `process.env.CLIENT_URL`.
- The `server/package.json` already has a `start` script.

## Deployment Steps (Manual for User)

To deploy your backend, follow these steps on [Render.com](https://render.com):

1. **Create a New Web Service**: Select "Web Service" and connect your GitHub repository `Movie_Universe_Recomendation`.
2. **General Settings**:
   - **Name**: `movie-universe-api` (or your choice)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. **Environment Variables**: Add the following keys under the "Environment" tab:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random string for tokens.
   - `TMDB_API_KEY`: Your TMDB API Key.
   - `TMDB_API_READ_ACCESS_TOKEN`: Your TMDB Bearer Token.
   - `PORT`: `5000` (Optional, Render assigns one automatically if not set).
   - `CLIENT_URL`: `https://movie-universe-recomendation-client.onrender.com`

## Verification Plan

### Manual Verification
1. **Health Check**:
   - Once deployed, visit `https://your-api-url.onrender.com/api/health`.
   - It should return `{"status":"ok", "message":"Movie Platform API running"}`.
2. **Log Check**:
   - Monitor the Render logs to ensure "MongoDB connected successfully" is displayed.
