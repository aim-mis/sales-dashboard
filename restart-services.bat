@echo off
REM Sales Dashboard - Restart All Services
REM Run as Administrator

echo.
echo ========================================
echo Sales Dashboard - Service Restart
echo ========================================
echo.

REM Kill existing processes
echo Stopping existing services...
taskkill /F /IM node.exe /T 2>/dev/null
taskkill /F /IM http-server.exe /T 2>/dev/null

timeout /t 2

REM Start backend
echo.
echo Starting Backend Service (Port 5070)...
start "Sales Dashboard Backend" cmd /k "cd /d C:\users\sales-dashboard\backend && npm start"

timeout /t 3

REM Start frontend
echo Starting Frontend Service (Port 5071)...
start "Sales Dashboard Frontend" cmd /k "cd /d C:\users\sales-dashboard\frontend\build && (npm list -g http-server >/dev/null 2>&1 || npm install -g http-server) && http-server -p 5071"

timeout /t 2

echo.
echo ========================================
echo Services Started Successfully!
echo.
echo Backend:  http://localhost:5070
echo Frontend: http://localhost:5071
echo ========================================
echo.

pause
