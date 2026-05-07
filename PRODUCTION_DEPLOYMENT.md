# Production Deployment Guide

## Production Server Details
- **Location**: `c:\users\sales-dashboard`
- **Backend Port**: 5070
- **Frontend Port**: 5071

## Deployment Steps

### 1. Backend Setup on Production Server

#### Navigate to project
```powershell
cd c:\users\sales-dashboard\backend
```

#### Create `.env` file
```
DB_SERVER=192.168.1.15
DB_USER=sa
DB_PASSWORD=p@ssw0rd
PORT=5070
```

#### Install dependencies
```powershell
npm install
```

#### Start backend service
```powershell
npm start
```

**Backend will run on**: `http://localhost:5070`

---

### 2. Frontend Setup on Production Server

#### Navigate to project
```powershell
cd c:\users\sales-dashboard\frontend
```

#### Install dependencies
```powershell
npm install
```

#### Build for production
```powershell
npm run build
```

This creates a `build/` folder with static files ready for production.

#### Serve frontend (Option 1 - Using Node.js)
Install global HTTP server:
```powershell
npm install -g http-server
cd c:\users\sales-dashboard\frontend\build
http-server -p 5071
```

**Frontend will run on**: `http://localhost:5071`

#### Serve frontend (Option 2 - Using IIS)
1. Copy `c:\users\sales-dashboard\frontend\build` contents to IIS wwwroot
2. Create IIS site pointing to port 5071
3. Restart IIS

---

### 3. Verify Both Services are Running

#### Backend Health Check
```
curl http://localhost:5070/api/data
```
Should return JSON data

#### Frontend Check
```
Open browser: http://localhost:5071
```
Should display the Sales Dashboard

---

### 4. Firewall Configuration (if needed)

Allow ports 5070 and 5071:
```powershell
netsh advfirewall firewall add rule name="Sales Dashboard Backend" dir=in action=allow protocol=tcp localport=5070
netsh advfirewall firewall add rule name="Sales Dashboard Frontend" dir=in action=allow protocol=tcp localport=5071
```

---

## Automated Startup Scripts

### Create Backend Auto-Start Batch File
**File**: `c:\users\sales-dashboard\start-backend.bat`
```batch
@echo off
cd C:\users\sales-dashboard\backend
npm start
pause
```

### Create Frontend Auto-Start Batch File
**File**: `c:\users\sales-dashboard\start-frontend.bat`
```batch
@echo off
cd C:\users\sales-dashboard\frontend\build
http-server -p 5071
pause
```

### Create Windows Task Scheduler Jobs
Run these as administrator:
```powershell
# Backend task
$trigger = New-ScheduledTaskTrigger -AtStartup
$action = New-ScheduledTaskAction -Execute "C:\users\sales-dashboard\start-backend.bat"
Register-ScheduledTask -TaskName "Sales Dashboard Backend" -Trigger $trigger -Action $action -RunLevel Highest

# Frontend task
$trigger = New-ScheduledTaskTrigger -AtStartup
$action = New-ScheduledTaskAction -Execute "C:\users\sales-dashboard\start-frontend.bat"
Register-ScheduledTask -TaskName "Sales Dashboard Frontend" -Trigger $trigger -Action $action -RunLevel Highest
```

---

## Troubleshooting

### Port Already in Use
```powershell
# Find process using port 5070
netstat -ano | findstr :5070

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Database Connection Failed
- Verify DB_SERVER in `.env` is correct
- Check SQL Server credentials
- Ensure SQL Server is running
- Verify firewall allows SQL Server port (1433)

### Frontend Not Loading Data
- Verify backend is running on port 5070
- Check browser console for errors (F12)
- Verify API endpoint in frontend (`/api/data`)
- Check network requests in DevTools

---

## Version Control

Always commit and push changes to GitHub:
```powershell
cd c:\users\sales-dashboard
git add .
git commit -m "Deploy: Update production configuration"
git push origin main
```

The auto-commit script (`auto-commit.ps1`) will handle this automatically every 5 minutes.
