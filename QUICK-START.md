# Quick Start Guide - Virtual Try-On

## The Problem
If you see "Failed to fetch" error, it means the backend server is not running.

## Solution - Start the Backend Server

### Option 1: Using Batch File (Easiest)
Double-click `start-server.bat` in Windows Explorer

### Option 2: Using PowerShell
```powershell
.\start-server.ps1
```

### Option 3: Using Command Line
```bash
npm start
```
or
```bash
node server.js
```

## Verify Server is Running

You should see:
```
🚀 BABISHA Virtual Try-On API running on http://localhost:3000
📁 Upload directory: ...
📁 Results directory: ...
⏰ Image retention: 24 hours
```

## Then Test the Feature

1. Open `http://localhost:8000/virtual-tryon.html` in your browser
2. Select a product
3. Upload your photo
4. Click "Generate Try-On"

## Troubleshooting

### Port 3000 Already in Use
Change the port in `server.js` or set environment variable:
```bash
$env:PORT=3001
node server.js
```

Then update `tryon-script.js`:
```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

### Server Won't Start
1. Make sure Node.js is installed: `node --version`
2. Install dependencies: `npm install`
3. Check for error messages in the terminal

### Still Getting "Failed to fetch"
1. Make sure server is running on port 3000
2. Check browser console for detailed errors
3. Verify CORS is enabled in server.js (it should be)

## Note About AI Processing

The current implementation uses a **demo mode** that copies your photo as a placeholder. 

For **real AI try-on**, you need to:
1. Get API key from Replicate or Stability AI
2. Add to `.env` file:
   ```
   REPLICATE_API_TOKEN=your_token_here
   ```
3. Uncomment the Replicate code in `server.js` (line 218)

