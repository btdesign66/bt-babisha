# How to Fix "Failed to fetch" Error

## Problem
The frontend cannot connect to the backend API server.

## Solution

### Step 1: Open a Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `cmd` or `powershell`
- Press Enter

### Step 2: Navigate to Project Folder
```bash
cd C:\Users\nitin\Desktop\BABISHA
```

### Step 3: Start the Backend Server
```bash
node server.js
```

You should see:
```
🚀 BABISHA Virtual Try-On API running on http://localhost:3000
📁 Upload directory: C:\Users\nitin\Desktop\BABISHA\uploads
📁 Results directory: C:\Users\nitin\Desktop\BABISHA\public\results
⏰ Image retention: 24 hours
```

### Step 4: Keep the Terminal Open
**Important:** Keep this terminal window open while using the try-on feature.

### Step 5: Test the Feature
1. Open your browser
2. Go to `http://localhost:8000/virtual-tryon.html`
3. Try the feature again

## Alternative: Use the Batch File

1. Double-click `start-server.bat` in Windows Explorer
2. A terminal window will open with the server running
3. Keep that window open

## Verify Server is Running

Open a new browser tab and go to:
```
http://localhost:3000/api/health
```

You should see:
```json
{"status":"ok","timestamp":"2024-..."}
```

## Common Issues

### "Port 3000 already in use"
Another program is using port 3000. Either:
1. Close that program, OR
2. Change the port in `server.js` (line 15):
   ```javascript
   const PORT = process.env.PORT || 3001;
   ```
   Then update `tryon-script.js` (line 4):
   ```javascript
   const API_BASE_URL = 'http://localhost:3001/api';
   ```

### "Cannot find module"
Run:
```bash
npm install
```

### Server starts but still getting errors
1. Check the terminal for error messages
2. Make sure both frontend (port 8000) and backend (port 3000) are running
3. Check browser console (F12) for detailed errors

## Need Help?

Check `QUICK-START.md` for more details.

