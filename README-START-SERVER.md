# 🚀 How to Start the Server (EASY WAY)

## Quick Start - 3 Steps

### Step 1: Double-Click This File
👉 **START-SERVER-NOW.bat**

A black terminal window will open.

### Step 2: Look for This Message
You should see:
```
🚀 BABISHA Virtual Try-On API running on http://localhost:3000
```

### Step 3: Keep That Window Open!
**IMPORTANT:** Don't close the terminal window. The server must stay running.

### Step 4: Refresh Your Browser
Go back to your browser and refresh the Virtual Try-On page.

---

## ✅ Verify It's Working

Open this URL in your browser:
```
http://localhost:3000/api/health
```

You should see:
```json
{"status":"ok","timestamp":"2024-..."}
```

---

## ❌ Still Not Working?

### Check the Server Window
Look for error messages in the black terminal window.

### Common Errors:

1. **"Port 3000 already in use"**
   - Another program is using port 3000
   - Close that program or change the port

2. **"Cannot find module"**
   - Run: `npm install`
   - Then try again

3. **"EADDRINUSE"**
   - Port is busy
   - Restart your computer or change port

---

## 🔄 Alternative: Manual Start

Open PowerShell or Command Prompt:
```bash
cd C:\Users\nitin\Desktop\BABISHA
node server.js
```

---

## 📞 Need Help?

Check `HOW-TO-FIX.md` for detailed troubleshooting.

