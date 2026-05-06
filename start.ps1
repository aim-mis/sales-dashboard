# Sales Dashboard Quick Start Script

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Sales Dashboard - Quick Start" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Node.js found: $(node --version)" -ForegroundColor Green
Write-Host "✓ npm found: $(npm --version)" -ForegroundColor Green
Write-Host ""

# Check backend .env file
if (-not (Test-Path "backend\.env")) {
    Write-Host "WARNING: backend\.env file not found" -ForegroundColor Yellow
    Write-Host "Creating .env from template..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✓ Created backend\.env - Please verify your database credentials!" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan

# Start backend in a new window
$backendProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd backend; npm install; npm start" -PassThru

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting Frontend Development Server..." -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan

# Start frontend in a new window
$frontendProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd frontend; npm install; npm start" -PassThru

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Dashboard is starting!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "The frontend will open in your browser when ready." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers." -ForegroundColor Yellow
Write-Host ""

# Wait for both processes
$backendProcess.WaitForExit()
$frontendProcess.WaitForExit()
