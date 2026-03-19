# Vercel Deployment Fix

## Changes Made

### 1. Updated `vercel.json`
- Removed deprecated `builds` configuration
- Using modern Vercel routing
- Added function configuration with 60s timeout

### 2. Fixed `api/index.js`
- Properly sets Vercel environment variables
- Exports Express app correctly for serverless

### 3. Updated `package.json`
- Added build script for Vercel

## What Was Fixed

1. **Removed `builds` warning** - Using modern Vercel configuration
2. **Proper serverless function export** - Express app now works correctly
3. **Environment detection** - Server knows it's running on Vercel

## Testing After Deployment

1. **Health Check:**
   ```
   https://your-app.vercel.app/api/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Image Generation:**
   ```
   POST https://your-app.vercel.app/api/generate-image
   ```

3. **Virtual Try-On:**
   ```
   POST https://your-app.vercel.app/api/try-on
   ```

## Environment Variables Needed in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

- `GOOGLE_GENERATIVE_AI_API_KEY` (for image generation)
- `GOOGLE_CLOUD_PROJECT_ID` (for Vertex AI)
- `GOOGLE_CLOUD_LOCATION` (optional, default: us-central1)
- `REPLICATE_API_TOKEN` (optional, for try-on)
- `STABILITY_API_KEY` (optional, for try-on)

## Next Deployment

The next deployment should:
- ✅ Build without warnings
- ✅ Properly route API requests
- ✅ Work with serverless functions

## If Still Having Issues

1. Check Vercel function logs in dashboard
2. Verify environment variables are set
3. Test API endpoints individually
4. Check that `api/index.js` is being used

