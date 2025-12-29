# Google Imagen Image Generator - Setup Guide

## Overview

This feature uses Google's Imagen model for AI-powered image generation. The implementation provides a production-ready solution with proper error handling and security.

## Prerequisites

1. **Google Cloud Account** with Vertex AI API enabled
2. **API Key** or **Service Account** credentials
3. **Node.js** 16+ installed

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install `@google/generative-ai` package.

### 2. Set Up Google Cloud (Vertex AI)

#### Option A: Using API Key (Simpler)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Vertex AI API**
4. Go to **APIs & Services** > **Credentials**
5. Create **API Key**
6. Add to environment variables:

```bash
# .env file
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_LOCATION=us-central1
```

#### Option B: Using Service Account (Recommended for Production)

1. Create a **Service Account** in Google Cloud Console
2. Grant **Vertex AI User** role
3. Download JSON key file
4. Set environment variable:

```bash
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_LOCATION=us-central1
```

### 3. Install Additional Package (for Service Account)

If using service account authentication:

```bash
npm install google-auth-library
```

## Configuration

### Environment Variables

Create a `.env` file:

```env
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
# OR
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json

# Required for Vertex AI
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_LOCATION=us-central1

# Optional
NODE_ENV=production
PORT=3000
```

### For Vercel Deployment

Add these in Vercel Dashboard → Project Settings → Environment Variables:

- `GOOGLE_GENERATIVE_AI_API_KEY`
- `GOOGLE_CLOUD_PROJECT_ID`
- `GOOGLE_CLOUD_LOCATION`

## API Endpoint

### POST `/api/generate-image`

**Request Body:**
```json
{
  "prompt": "A beautiful sunset over mountains",
  "aspectRatio": "1:1"
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "data:image/png;base64,...",
  "imageBase64": "...",
  "message": "Image generated successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Usage

### Frontend

1. Open `image-generator.html` in your browser
2. Enter a prompt describing the image you want
3. Select aspect ratio
4. Click "Generate Image"
5. Wait 30-60 seconds for generation
6. Download or share the result

### API Usage

```javascript
const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        prompt: 'A beautiful landscape',
        aspectRatio: '16:9'
    })
});

const result = await response.json();
console.log(result.imageUrl);
```

## Security Best Practices

1. **Never expose API keys** in frontend code
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** in production
4. **Validate and sanitize** user inputs
5. **Use HTTPS** in production
6. **Monitor API usage** and costs

## Troubleshooting

### "API key not found"
- Check environment variables are set correctly
- Restart server after adding environment variables
- Verify `.env` file is in project root

### "Image generation failed"
- Verify Vertex AI API is enabled in Google Cloud
- Check API key has proper permissions
- Ensure project ID is correct
- Check Google Cloud billing is enabled

### "Cannot connect to server"
- Make sure backend server is running
- Check port 3000 is not blocked
- Verify CORS is configured correctly

## Cost Considerations

- Google Imagen pricing: Check [Google Cloud Pricing](https://cloud.google.com/vertex-ai/pricing)
- Implement rate limiting to control costs
- Monitor usage in Google Cloud Console
- Set up billing alerts

## Production Deployment

### Vercel

1. Add environment variables in Vercel dashboard
2. Deploy as usual
3. API routes will be available at `/api/generate-image`

### Other Platforms

1. Set environment variables
2. Ensure Node.js 16+ is available
3. Install dependencies: `npm install`
4. Start server: `npm start`

## Alternative: Using Different Image Generation API

If Google Imagen is not available, you can modify `generateImageWithImagen()` function to use:

- **OpenAI DALL-E**
- **Stability AI**
- **Midjourney API**
- **Replicate** (with Imagen model)

## Support

For issues:
- Check Google Cloud Console for API errors
- Review server logs
- Verify API quotas and limits
- Contact: btdesigners555@gmail.com

