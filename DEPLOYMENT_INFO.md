# Sales Dashboard - Official Deployment Info

## Project Details

**Project Name:** CLIENT LIST PER PRODUCT LINE  
**Created:** May 2026  
**Database:** 192.168.1.15

## Official Ports (Fixed)

| Component | Port | URL |
|-----------|------|-----|
| Backend API | **5070** | `http://localhost:5070` |
| Frontend Web | **5071** | `http://localhost:5071` |
| Database | 1433 | `192.168.1.15:1433` |

## Database Credentials

```
Server: 192.168.1.15
User: sa
Password: p@ssw0rd
```

⚠️ **Note:** Database is READ-ONLY. No INSERT, UPDATE, DELETE operations.

## Local Development

```powershell
# Terminal 1 - Backend
cd C:\Users\NVG\sales-dashboard\backend
npm start
# Output: Dashboard backend running on http://localhost:5070

# Terminal 2 - Frontend
cd C:\Users\NVG\sales-dashboard\frontend
npm start
# Accessible at: http://localhost:5071
```

## Production Server Deployment

**Production Server IP:** 192.168.1.124

### Quick Start
```powershell
# On production server (192.168.1.124)
cd C:\sales-dashboard\backend
npm start

cd C:\sales-dashboard\frontend
npm start
```

### Access from Network
```
http://192.168.1.124:5071
```

## Configuration Files

### Backend `.env`
```
DB_SERVER=192.168.1.15
DB_USER=sa
DB_PASSWORD=p@ssw0rd
PORT=5070
```

### Frontend `.env`
```
PORT=5071
BROWSER=none
```

### Frontend `package.json` proxy
```json
"proxy": "http://localhost:5070"
```

## Key Features

✅ Interactive client list per product line  
✅ Filtering by Source (Manila/Province), Active status, Client name  
✅ Product line checkbox selection (AND logic)  
✅ Dynamic counts per product line  
✅ Pagination with customizable page size (5, 10, 20, 30, 50, 100, 1000)  
✅ Jump to specific page  
✅ Sorting by any column  
✅ Export to Excel and PDF  
✅ Responsive design (mobile & desktop)  

## Troubleshooting

**Port already in use:**
```powershell
# Check what's using the port
netstat -ano | findstr :5070

# Kill the process
taskkill /PID [PID] /F
```

**Cannot connect to database:**
- Verify SQL Server is running at 192.168.1.15
- Check network connectivity: `ping 192.168.1.15`
- Verify credentials in `.env`

**Frontend not connecting to backend:**
- Verify backend is running on port 5070
- Check `proxy` in frontend `package.json`
- Check browser console for CORS errors

## Support

For issues or questions, refer to README.md in the project root.
