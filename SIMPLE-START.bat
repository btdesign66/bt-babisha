@echo off
echo.
echo ============================================
echo   BABISHA - Starting Backend Server
echo ============================================
echo.
echo Checking dependencies...
call npm list express >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    call npm install
    echo.
)

echo.
echo Starting server...
echo.
echo IMPORTANT: Keep this window open!
echo The server must stay running for the try-on feature to work.
echo.
echo ============================================
echo.

node server.js

if errorlevel 1 (
    echo.
    echo ERROR: Server failed to start!
    echo.
    echo Try running: npm install
    echo.
    pause
)

