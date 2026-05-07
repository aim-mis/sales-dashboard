@echo off
REM Sales Dashboard Frontend Startup Script
REM Runs on port 5071

title Sales Dashboard Frontend - Port 5071

echo.
echo ========================================
echo Sales Dashboard Frontend
echo Port: 5071
echo Database Backend: http://localhost:5070
echo ========================================
echo.

cd /d C:\users\sales-dashboard\frontend\build

echo Checking if http-server is installed...
npm list -g http-server > /dev/null 2>&1
if errorlevel 1 (
    echo Installing http-server...
    npm install -g http-server
)

echo Starting frontend server...
http-server -p 5071

pause
