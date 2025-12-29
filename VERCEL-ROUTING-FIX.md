# Vercel API Routing Fix

## Problem
The API routes were not working on Vercel because:
1. Vercel requires specific file patterns for serverless functions
2. The `api/index.js` pattern doesn't work well with catch-all routes
3. Express app needs proper export for Vercel's serverless environment

## Solution

### Changed File Structure
- **Before**: `api/index.js` (doesn't work well with Vercel routing)
- **After**: `api/[...].js` (Vercel catch-all pattern for all `/api/*` routes)

### Updated `vercel.json`
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/[...].js"
    }
  ]
}
```

### How It Works
1. All requests to `/api/*` are routed to `api/[...].js`
2. The catch-all file exports the Express app
3. Express handles all routing internally
4. Vercel treats it as a single serverless function

## Testing

After deployment, test these endpoints:

1. **Health Check:**
   ```
   GET https://your-app.vercel.app/api/health
   ```
   Expected: `{"status":"ok","timestamp":"...","environment":"vercel"}`

2. **Image Generation:**
   ```
   POST https://your-app.vercel.app/api/generate-image
   Body: {"prompt": "test", "aspectRatio": "1:1"}
   ```

3. **Virtual Try-On:**
   ```
   POST https://your-app.vercel.app/api/try-on
   Body: FormData with files
   ```

## If Still Not Working

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Check for errors in `api/[...].js`

2. **Verify Environment Variables:**
   - All required env vars are set
   - No typos in variable names

3. **Test Locally First:**
   ```bash
   npm start
   # Test: http://localhost:3000/api/health
   ```

4. **Check Route Matching:**
   - Vercel routes are case-sensitive
   - Ensure `/api/` prefix matches exactly

## Next Steps

1. Redeploy on Vercel (should auto-deploy from GitHub)
2. Test the health endpoint first
3. Then test other endpoints
4. Check function logs for any errors

