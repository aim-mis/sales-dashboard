# Sales Dashboard - Claude Code Configuration

## Project Overview
Interactive sales data dashboard for analyzing client data across product lines (PVD SALT, INDUSTRIAL SALT, RICE, CONDENSE).

## Technology Stack
- **Backend**: Node.js 14+, Express.js, SQL Server
- **Frontend**: React 18+, XLSX, jsPDF
- **Dev Tools**: npm, git

## Key Features
1. **Multi-level Filtering**: Client name, source, status, BDO, BDO Team
2. **Product Line Analysis**: Mother boxes, cumulative combinations, exact combinations, ONLY summaries
3. **Data Export**: Excel (XLSX) and PDF formats
4. **Responsive UI**: Grid-based layouts, mobile-friendly
5. **Pagination**: Configurable page sizes

## Important Files
- `backend/server.js` - SQL queries and API endpoints
- `frontend/src/App.js` - Main React component with all filtering logic
- `frontend/src/App.css` - Styling for all dashboard sections
- `frontend/src/components/` - Reusable components

## Development Workflow

### Code Changes
Every code change should include:
1. Clear commit message (see format below)
2. Single responsibility per commit
3. Test in local environment before pushing

### Commit Message Format
```
[Type]: Brief description

Detailed explanation of changes (optional)
```

**Types:**
- **Feature**: New functionality
- **Fix**: Bug fixes
- **Update**: Enhancement to existing feature
- **Refactor**: Code improvements without changing behavior
- **Docs**: Documentation updates
- **Style**: CSS/UI updates
- **Deploy**: Deployment configuration

**Examples:**
```
Feature: Add BDO filter dropdown to filter controls

Implement BDO and BDO TEAM filter fields aligned with SOURCE and STATUS filters. Extract filter options from API response and populate dropdowns dynamically.

Fix: Correct cumulative count calculation in 3rd box

Ensure cumulative cards sum only the relevant "ONLY" categories instead of exact combination counts.

Update: Improve ONLY summary card styling

Add orange/amber color scheme and responsive grid layout for better visual distinction.
```

## Git Configuration
- **Remote**: origin (GitHub)
- **Main Branch**: main
- **Commit Template**: See format above
- **Auto-push**: Configure in your shell environment if desired

## Database Connection
Configure backend `.env` file:
```
DB_SERVER=<your_sql_server>
DB_USER=<your_username>
DB_PASSWORD=<your_password>
PORT=5070
```

## Environment Variables
- **Frontend Port**: 5071
- **Backend Port**: 5070
- **Database Server**: SQL Server instance
- **Production Server**: 192.168.1.124:5071

## Key Code Patterns

### State Management (App.js)
- `selectedProductLineFilter`: Currently selected mother product
- `selectedCategory`: Exact combination filter
- `filters`: Multi-field filter state
- `categories`: Combination counts (pipe-separated keys)

### Filter Pipeline Order
1. Product line filter (if selectedProductLineFilter)
2. Standard filters (clientName, source, active, bdo, bdoTeam)
3. Exact category match (if selectedCategory)

### Components
- **Filters.jsx**: Input controls for filtering
- **DataTable.jsx**: Paginated results display
- **ExportButtons.jsx**: Excel/PDF export functionality

## Testing
- Test all three boxes on first load
- Verify filter interactions
- Check export file names and totals
- Test pagination across all filter combinations
- Verify responsive layout on mobile

## Deployment
Frontend build is served from production server at `\\192.168.1.124\c$\Users\sales-dashboard\`

**Restart Services Script**: `restart-services.bat` on production server

## Common Tasks

### Add a New Filter
1. Add field to `filters` state in App.js
2. Add filter logic in `applyFilters` function
3. Add input control in Filters.jsx
4. Update filter display in data table

### Modify SQL Query
1. Edit query in `backend/server.js`
2. Test query in SQL Server Management Studio
3. Restart backend server
4. Verify data appears correctly in frontend

### Update Styling
1. Modify `frontend/src/App.css`
2. Test responsive layout at different screen sizes
3. Check contrast for accessibility

## Notes
- All product combinations use sorted pipe-separated keys (e.g., "CONDENSE|INDUSTRIAL SALT|PVD SALT|RICE")
- ONLY cards show counts of clients with exactly one product line
- Cumulative cards sum the relevant "ONLY" category counts
- Mother boxes show all clients who have that product (inclusive)
