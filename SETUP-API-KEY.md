# Setting Up Google API Key for Image Generation

## Quick Setup Guide

### Step 1: Create `.env` File

Create a file named `.env` in your project root with:

```env
GOOGLE_GENERATIVE_AI_API_KEY=AlzaSyCyGjOs5ce1pPjs4an_epUC6G49h0rPcDM
GOOGLE_CLOUD_PROJECT_ID=980552783774
GOOGLE_CLOUD_LOCATION=us-central1
PORT=3000
NODE_ENV=development
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Install Google Auth Library (for Vertex AI)

For Vertex AI Imagen to work, you need OAuth authentication:

```bash
npm install google-auth-library
```

### Step 4: Enable Vertex AI API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `980552783774`
3. Go to **APIs & Services** > **Library**
4. Search for "Vertex AI API"
5. Click **Enable**

### Step 5: Set Up Authentication

#### Option A: Using Service Account (Recommended for Production)

1. Go to **IAM & Admin** > **Service Accounts**
2. Create a new service account
3. Grant **Vertex AI User** role
4. Create and download JSON key
5. Set environment variable:

```env
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
```

#### Option B: Using API Key (Simpler, but may have limitations)

The API key you have may work for some endpoints, but Vertex AI typically requires OAuth.

### Step 6: Start Server

```bash
npm start
```

### Step 7: Test

1. Open: `http://localhost:8000/image-generator.html`
2. Enter a prompt
3. Click "Generate Image"

## Troubleshooting

### "Image generation requires Vertex AI setup"

- Make sure `GOOGLE_CLOUD_PROJECT_ID` is set
- Enable Vertex AI API in Google Cloud Console
- Install `google-auth-library`: `npm install google-auth-library`

### "Authentication failed"

- For Vertex AI, use Service Account credentials
- Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable
- Or ensure API key has proper permissions

### Alternative: Use Different Service

If Vertex AI setup is complex, you can modify the code to use:
- **Stability AI** (easier setup)
- **Replicate** (supports Imagen models)
- **OpenAI DALL-E**

## Security Note

⚠️ **Never commit `.env` file to Git!**

The `.env` file is already in `.gitignore` for security.

## For Vercel Deployment

Add these environment variables in Vercel Dashboard:
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `GOOGLE_CLOUD_PROJECT_ID`
- `GOOGLE_CLOUD_LOCATION`
- `GOOGLE_APPLICATION_CREDENTIALS` (if using service account)

