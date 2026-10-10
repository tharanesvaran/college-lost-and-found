@echo off
title Push College Lost & Found to GitHub
color 0A
echo ========================================================
echo   Pushing College Lost & Found System to GitHub...
echo ========================================================
echo.
set "PATH=C:\Users\user\.local\bin\git\cmd;%PATH%"
cd /d "C:\Users\user\.gemini\antigravity\scratch\college-lost-found"

echo Current Git Remote:
git remote -v
echo.
echo Pushing to GitHub (origin main)...
echo Note: If Git Credential Manager prompts you, please click Sign in with Browser.
echo.
git push origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! Code pushed cleanly to GitHub!
    echo ========================================================
    echo.
    echo GitHub Repository:
    echo https://github.com/tharanesvaran/college-lost-and-found
    echo.
    echo Live GitHub Pages URL:
    echo https://tharanesvaran.github.io/college-lost-and-found/
    echo.
    echo Reminder to enable GitHub Pages if not yet active:
    echo 1. Open: https://github.com/tharanesvaran/college-lost-and-found/settings/pages
    echo 2. Set 'Build and deployment' Source to 'GitHub Actions' OR 'Deploy from a branch' (main / root)
    echo 3. Click Save!
    echo.
) else (
    echo.
    echo ========================================================
    echo   [NOTICE] Authentication may be needed.
    echo ========================================================
    echo Please make sure you are signed in to GitHub, then run this again.
    echo.
)
pause
