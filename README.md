# Sales Dashboard

A modern, interactive web-based dashboard for sales data from Manila and Province databases.

## Official Ports
- **Backend API:** Port **5070**
- **Frontend:** Port **5071**

## Features

✅ **Interactive Data Filtering** - Filter by client name, product line, and date range  
✅ **Smart Sorting** - Click column headers to sort ascending/descending  
✅ **Product Line Checkmarks** - Visual checkmarks for PVD SALT, INDUSTRIAL SALT, RICE, CONDENSE  
✅ **Export Functionality** - Export to Excel (.xlsx) and PDF (.pdf)  
✅ **Live Aggregations** - Real-time summary statistics (total records, unique clients, product count)  
✅ **Responsive Design** - Works on desktop and mobile devices  
✅ **Secure Connection** - Database credentials stored in environment variables, never exposed  

## Architecture

```
sales-dashboard/
├── backend/           # Node.js/Express API server
│   ├── server.js      # Express server with database connection
│   ├── package.json   # Backend dependencies
│   └── .env.example   # Environment variable template
└── frontend/          # React web application
    ├── src/
    │   ├── App.js     # Main React component
    │   ├── App.css    # Global styles
    │   ├── index.js   # React entry point
    │   └── components/
    │       ├── Filters.jsx       # Filter controls
    │       ├── DataTable.jsx     # Data table with sorting
    │       └── ExportButtons.jsx # Excel/PDF export
    ├── public/
    │   └── index.html # HTML entry point
    └── package.json   # Frontend dependencies
```

## Setup Instructions

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- Access to SQL Server at `192.168.1.15`

### Step 1: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd sales-dashboard\backend
   ```

2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` and verify your database credentials:
   ```
   DB_SERVER=192.168.1.15
   DB_USER=sa
   DB_PASSWORD=p@ssw0rd
   PORT=5070
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

   You should see: `Dashboard backend running on http://localhost:5070`

### Step 2: Frontend Setup (New Terminal)

1. Navigate to the frontend directory:
   ```bash
   cd sales-dashboard\frontend
   ```

2. Verify `.env` file has:
   ```
   PORT=5071
   BROWSER=none
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the React development server:
   ```bash
   npm start
   ```

   The dashboard will open in your browser at `http://localhost:5071`

## Usage

### Filtering Data

- **Client Name**: Type to search for specific clients (partial match)
- **Product Line**: Select from PVD SALT, INDUSTRIAL SALT, RICE, or CONDENSE
- **Date Range**: Select start and end dates
- **Reset Filters**: Click to clear all filters

### Sorting

Click on any column header to sort:
- First click: Ascending (↑)
- Second click: Descending (↓)
- Third click: No sort (⇅)

### Exporting Data

- **Export to Excel**: Downloads filtered data as `.xlsx` file with formatted columns
- **Export to PDF**: Downloads filtered data as professional PDF report

### Dashboard Summary

At the top of the table, you'll see real-time aggregations:
- **Total Records**: Count of all filtered rows
- **Unique Clients**: Number of distinct clients
- **Product Lines**: Count of different product categories in filtered data

## Data Structure

The dashboard displays the following columns:

| Column | Description |
|--------|-------------|
| Client Name | Customer/organization name |
| Source | Data source (MANILA or PROVINCE) |
| PVD SALT | ✓ if client has PVD SALT orders |
| INDUSTRIAL SALT | ✓ if client has INDUSTRIAL SALT orders |
| RICE | ✓ if client has RICE orders |
| CONDENSE | ✓ if client has CONDENSE orders |
| Active | Yes/No status |
| Date Encoded | Order creation date |

## Database Query

The dashboard uses a UNION query that combines data from:
- **Manila Database** (`arvinaim`): ORDR, RDR1, OCRD, OITM tables
- **Province Database** (`PROVINCE`): Same table structure

The query filters for product categories:
- PVD SALT
- INDUSTRIAL SALT
- RICE
- CONDENSE (CONDENSADA in Province DB)

## Security Notes

⚠️ **Important**

- Database credentials are stored in `.env` file (NOT in code)
- The `.env` file is listed in `.gitignore` (never commit credentials)
- The application is read-only (no INSERT, UPDATE, DELETE operations)
- All data requests go through the backend API
- Only authorized users should access this dashboard

## Troubleshooting

### "Cannot connect to database"
- Verify SQL Server is running at `192.168.1.15`
- Check credentials in `.env` file
- Ensure network connectivity to the server

### "Port 5000 already in use"
- Change `PORT` in `.env` to an available port (e.g., 5001)
- Or kill the process using port 5000

### "React app won't start"
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again
- Clear browser cache (Ctrl+Shift+Del)

### "Data not displaying"
- Open browser developer tools (F12)
- Check Network tab for failed requests
- Check Console for error messages

## Production Deployment

For production use on your network:

### Official Ports (Fixed)
- **Backend:** 5070
- **Frontend:** 5071

### Deployment Steps

1. **Copy to Production Server (e.g., 192.168.1.124):**
   ```bash
   Copy entire sales-dashboard folder to production server
   ```

2. **Install Node.js on Production Server:**
   - Download from https://nodejs.org/ (LTS version)

3. **Build the React frontend:**
   ```bash
   cd C:\sales-dashboard\frontend
   npm install
   npm run build
   ```

4. **Configure Backend (.env):**
   ```
   DB_SERVER=192.168.1.15
   DB_USER=sa
   DB_PASSWORD=p@ssw0rd
   PORT=5070
   ```

5. **Start Services:**
   - **Backend:** `cd C:\sales-dashboard\backend && npm install && npm start`
   - **Frontend:** `cd C:\sales-dashboard\frontend && npm start`

6. **Access from Network:**
   ```
   http://[SERVER_IP]:5071
   ```

7. **Production Monitoring (Optional):**
   ```bash
   npm install -g pm2
   pm2 start npm --name "dashboard-backend" -- start
   pm2 startup
   pm2 save
   ```

8. **Use HTTPS** for production (generate SSL certificates)

9. **Database connection pooling** should be configured for multiple concurrent users

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Check backend server logs for database issues
4. Verify network connectivity and credentials
