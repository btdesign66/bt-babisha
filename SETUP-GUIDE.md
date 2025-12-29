# Virtual Try-On Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
REPLICATE_API_TOKEN=your_replicate_api_token
# OR
STABILITY_API_KEY=your_stability_api_key
```

### 3. Create Directories
```bash
mkdir uploads
mkdir public
mkdir public/results
```

### 4. Start Backend Server
```bash
npm start
```

The API will run on `http://localhost:3000`

### 5. Start Frontend Server
```bash
# In a separate terminal
python -m http.server 8000
```

The website will be available at `http://localhost:8000`

## Getting API Keys

### Replicate API (Recommended)
1. Visit https://replicate.com
2. Sign up for an account
3. Go to Account Settings > API Tokens
4. Create a new token
5. Copy and paste into `.env` file

### Stability AI (Alternative)
1. Visit https://platform.stability.ai
2. Sign up for an account
3. Go to API Keys section
4. Create a new API key
5. Copy and paste into `.env` file

## Testing

1. Open `http://localhost:8000/virtual-tryon.html`
2. Select a product type
3. Upload a clear front-facing photo
4. Click "Generate Try-On"
5. Wait for processing (30-60 seconds)
6. View and download result

## Troubleshooting

- **Port already in use**: Change PORT in `.env`
- **API errors**: Verify API keys are correct
- **File upload fails**: Check file size (max 10MB) and format (JPG/PNG/WebP)
- **Images not displaying**: Check directory permissions

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2
3. Set up HTTPS
4. Configure proper CORS settings
5. Use cloud storage for images (AWS S3, etc.)

