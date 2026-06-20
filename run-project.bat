@echo off
title Placement Prep Tracker Launcher
echo ===================================================
echo   Starting Placement Prep Tracker & AI Coach...
echo   Please keep this window open while using the app.
echo ===================================================
echo.

:: Navigate to the project folder
cd /d "c:\Users\pc\.gemini\antigravity\scratch\my2nd project"

:: Automatically launch the default web browser to the localhost page
echo Opening browser to http://localhost:5180...
start http://localhost:5180

:: Start both backend and frontend servers
npm start

pause
