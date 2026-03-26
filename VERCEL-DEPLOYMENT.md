# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **For production:**
   ```bash
   vercel --prod
   ```

### Option 2: Using GitHub Integration

1. **Push your code to GitHub** (already done)

2. **Go to Vercel Dashboard:**
   - Visit https://vercel.com
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository: `btdesign66/bt-babisha`

3. **Configure Project:**
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: Leave empty or `npm install`
   - Output Directory: Leave empty
   - Install Command: `npm install`

4. **Environment Variables (Optional):**
   - `REPLICATE_API_TOKEN` - If using Replicate AI
   - `STABILITY_API_KEY` - If using Stability AI
   - `NODE_ENV` = `production`

5. **Deploy!**

## Important Notes for Vercel

### File Storage
- Vercel uses a **read-only filesystem** except for `/tmp`
- Uploaded files are stored in `/tmp` (temporary)
- Files in `/tmp` are **automatically deleted** after function execution
- For production, consider using:
  - **AWS S3** for file storage
  - **Cloudinary** for image processing
  - **Vercel Blob Storage** (new)

### API Routes
- All API routes are automatically available at `/api/*`
- The frontend is configured to use `/api` in production
- No need to specify port or domain

### Limitations
- Function execution time: 10 seconds (Hobby), 60 seconds (Pro)
- File size limit: 4.5MB request body
- Memory: 1024MB (Hobby), 3008MB (Pro)

## Troubleshooting

### 404 Errors
1. Check `vercel.json` configuration
2. Ensure routes are correct
3. Check Vercel function logs

### File Upload Issues
- Vercel has a 4.5MB limit for request body
- Consider using direct upload to S3/Cloudinary
- Or use Vercel Blob Storage

### Environment Variables
- Set in Vercel Dashboard → Project → Settings → Environment Variables
- Redeploy after adding variables

## Recommended: Use Cloud Storage

For production, update `server.js` to use cloud storage:

```javascript
// Example: AWS S3
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// Upload to S3 instead of local filesystem
```

Or use **Vercel Blob Storage**:
```javascript
import { put, list } from '@vercel/blob';
```

## Current Configuration

✅ `vercel.json` - Vercel configuration
✅ `api/index.js` - Serverless function entry point
✅ Updated `server.js` - Vercel-compatible
✅ Updated `tryon-script.js` - Auto-detects environment
✅ `.vercelignore` - Excludes unnecessary files

## Next Steps

1. Deploy to Vercel using one of the methods above
2. Test the API: `https://your-project.vercel.app/api/health`
3. Update your frontend domain if needed
4. Consider adding cloud storage for file persistence


