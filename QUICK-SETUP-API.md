# Quick Setup - Use Your Google API Key

## Your API Details
- **API Key**: `AlzaSyCyGjOs5ce1pPjs4an_epUC6G49h0rPcDM`
- **Project Number**: `980552783774`
- **Project Name**: `babisha`

## Step 1: Create `.env` File

Create a file named `.env` in the project root (`C:\Users\nitin\Desktop\BABISHA\.env`):

```env
GOOGLE_GENERATIVE_AI_API_KEY=AlzaSyCyGjOs5ce1pPjs4an_epUC6G49h0rPcDM
GOOGLE_CLOUD_PROJECT_ID=980552783774
GOOGLE_CLOUD_LOCATION=us-central1
PORT=3000
NODE_ENV=development
```

## Step 2: Install Google Auth Library

```bash
npm install google-auth-library
```

## Step 3: Enable Vertex AI API

1. Go to: https://console.cloud.google.com/apis/library
2. Select project: `980552783774`
3. Search for "Vertex AI API"
4. Click **Enable**

## Step 4: Start Server

```bash
npm start
```

## Step 5: Test

1. Open: `http://localhost:8000/image-generator.html`
2. Enter a prompt like: "A beautiful lehenga with gold embroidery"
3. Click "Generate Image"

## Important Notes

⚠️ **The API key you have is for Google Generative AI (Gemini), which is primarily for text generation.**

For **image generation with Imagen**, you need:
- Vertex AI API enabled
- OAuth authentication (Service Account)

### Alternative: Use Stability AI (Easier)

If Vertex AI setup is complex, I can update the code to use Stability AI instead, which is simpler to set up.

Would you like me to:
1. Help set up Vertex AI properly, OR
2. Switch to Stability AI (easier setup)?

## Security

✅ Your `.env` file is already in `.gitignore` - it won't be committed to GitHub.

