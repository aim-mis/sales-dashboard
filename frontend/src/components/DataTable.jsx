import React from 'react';

function DataTable({ data, onSort, sortConfig, filters, currentPage = 0, pageSize = 5 }) {
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <span className="sort-icon">⇅</span>;
    return <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  const hasProduct = (row, productLine) => {
    return row.productLines && row.productLines.includes(productLine) ? '✓' : '';
  };

  const showSourceColumn = !filters.source;
  const showActiveColumn = !filters.active || filters.active === '';
  const showPvdSalt = !filters.productLine || filters.productLine === 'PVD SALT';
  const showIndustrialSalt = !filters.productLine || filters.productLine === 'INDUSTRIAL SALT';
  const showRice = !filters.productLine || filters.productLine === 'RICE';
  const showCondense = !filters.productLine || filters.productLine === 'CONDENSE';

  const visibleColumns = [
    showSourceColumn,
    showActiveColumn,
    showPvdSalt,
    showIndustrialSalt,
    showRice,
    showCondense
  ].filter(Boolean).length;

  const colSpan = 2 + visibleColumns;

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th className="line-number-header">Line No.</th>
            <th onClick={() => onSort('CLIENT_NAME')}>
              Client Name <SortIcon columnKey="CLIENT_NAME" />
            </th>
            {showSourceColumn && (
              <th onClick={() => onSort('SOURCE')}>
                Source <SortIcon columnKey="SOURCE" />
              </th>
            )}
            {showActiveColumn && (
              <th onClick={() => onSort('ACTIVE')}>
                Status <SortIcon columnKey="ACTIVE" />
              </th>
            )}
            {showPvdSalt && <th>PVD SALT</th>}
            {showIndustrialSalt && <th>INDUSTRIAL SALT</th>}
            {showRice && <th>RICE</th>}
            {showCondense && <th>CONDENSE</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => {
              const lineNumber = currentPage * pageSize + idx + 1;
              return (
                <tr key={idx}>
                  <td className="line-number-cell">{lineNumber}</td>
                  <td>{row.CLIENT_NAME}</td>
                  {showSourceColumn && <td>{row.SOURCE}</td>}
                  {showActiveColumn && <td>{row.ACTIVE === 'Y' || row.ACTIVE === true || row.ACTIVE === 1 ? 'Active' : 'Inactive'}</td>}
                  {showPvdSalt && <td className="checkmark-cell">{hasProduct(row, 'PVD SALT')}</td>}
                  {showIndustrialSalt && <td className="checkmark-cell">{hasProduct(row, 'INDUSTRIAL SALT')}</td>}
                  {showRice && <td className="checkmark-cell">{hasProduct(row, 'RICE')}</td>}
                  {showCondense && <td className="checkmark-cell">{hasProduct(row, 'CONDENSE')}</td>}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={colSpan} className="no-data">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
