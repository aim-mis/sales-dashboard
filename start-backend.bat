@echo off
REM Sales Dashboard Backend Startup Script
REM Runs on port 5070

title Sales Dashboard Backend - Port 5070

cd /d C:\users\sales-dashboard\backend

echo.
echo ========================================
echo Sales Dashboard Backend
echo Port: 5070
echo ========================================
echo.

npm start

pause
