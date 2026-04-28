@echo off
title BlockVote Launcher
echo ==========================================
echo Starting BlockVote Application...
echo ==========================================
echo.

echo [1/3] Checking and Installing Backend Dependencies...
cd backend
call npm install
cd ..

echo.
echo [2/3] Checking and Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo.
echo [3/3] Launching Servers...
start "BlockVote Backend" cmd /k "cd backend && npm run dev"
start "BlockVote Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo Initialization Complete! Both servers are booting up.
echo.
echo Backend API will be available at: http://localhost:5000
echo Frontend UI will be available at: http://localhost:5173
echo ==========================================
echo.
echo You can close this window now. The servers will run in the background windows.
pause
