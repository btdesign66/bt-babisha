@echo off
title BABISHA Virtual Try-On Server
color 0A
echo ========================================
echo   BABISHA Virtual Try-On Backend Server
echo ========================================
echo.
echo Starting server on http://localhost:3000
echo.
echo IMPORTANT: Keep this window open!
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
node server.js

pause


