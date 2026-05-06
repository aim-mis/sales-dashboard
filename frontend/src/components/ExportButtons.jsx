import React from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function ExportButtons({ data, filters, currentPage = 0, pageSize = 5, selectedCategory = null, selectedProductLineFilter = null }) {
  const hasProduct = (row, productLine) => {
    return row.productLines && row.productLines.includes(productLine) ? '✓' : '';
  };

  const getCategoryLabel = () => {
    // If product line filter is selected, use that label
    if (selectedProductLineFilter) {
      const productLineMap = {
        'PVD SALT': 'PVD SALT CLIENTS',
        'INDUSTRIAL SALT': 'INDUSTRIAL SALT CLIENTS',
        'RICE': 'RICE CLIENTS',
        'CONDENSE': 'CONDENSE CLIENTS',
      };
      return productLineMap[selectedProductLineFilter] || 'Sales Data';
    }

    // Otherwise use category label
    if (!selectedCategory) return 'Sales Data';

    const categoryMap = {
      'PVD SALT': 'PVD SALT ONLY',
      'INDUSTRIAL SALT': 'INDUSTRIAL SALT ONLY',
      'RICE': 'RICE ONLY',
      'CONDENSE': 'CONDENSE ONLY',
      'INDUSTRIAL SALT|PVD SALT': 'PVD SALT AND INDUSTRIAL SALT ONLY',
      'PVD SALT|RICE': 'PVD SALT AND RICE ONLY',
      'CONDENSE|PVD SALT': 'PVD SALT AND CONDENSE ONLY',
      'INDUSTRIAL SALT|RICE': 'INDUSTRIAL SALT AND RICE ONLY',
      'CONDENSE|INDUSTRIAL SALT': 'INDUSTRIAL SALT AND CONDENSE ONLY',
      'CONDENSE|RICE': 'RICE AND CONDENSE ONLY',
      'INDUSTRIAL SALT|PVD SALT|RICE': 'PVD SALT AND INDUSTRIAL SALT AND RICE ONLY',
      'CONDENSE|INDUSTRIAL SALT|PVD SALT': 'PVD SALT AND INDUSTRIAL SALT AND CONDENSE ONLY',
      'CONDENSE|PVD SALT|RICE': 'PVD SALT AND RICE AND CONDENSE ONLY',
      'CONDENSE|INDUSTRIAL SALT|RICE': 'INDUSTRIAL SALT AND RICE AND CONDENSE ONLY',
      'CONDENSE|INDUSTRIAL SALT|PVD SALT|RICE': 'PVD SALT AND INDUSTRIAL SALT AND RICE AND CONDENSE ONLY',
    };

    return categoryMap[selectedCategory] || 'Sales Data';
  };

  const showSourceColumn = !filters.source;
  const showActiveColumn = !filters.active || filters.active === '';

  const exportToExcel = () => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const exportData = data.map((row, idx) => {
      const lineNum = currentPage * pageSize + idx + 1;
      const obj = {
        'Line No.': lineNum,
        'Client Name': row.CLIENT_NAME,
      };

      if (showSourceColumn) {
        obj['Source'] = row.SOURCE;
      }

      if (showActiveColumn) {
        obj['Status'] = row.ACTIVE === 'Y' || row.ACTIVE === true || row.ACTIVE === 1 ? 'Active' : 'Inactive';
      }

      obj['PVD SALT'] = hasProduct(row, 'PVD SALT');
      obj['INDUSTRIAL SALT'] = hasProduct(row, 'INDUSTRIAL SALT');
      obj['RICE'] = hasProduct(row, 'RICE');
      obj['CONDENSE'] = hasProduct(row, 'CONDENSE');

      return obj;
    });

    // Add total row
    exportData.push({
      'Line No.': '',
      'Client Name': `TOTAL CLIENTS: ${data.length}`,
      ...(showSourceColumn && { 'Source': '' }),
      ...(showActiveColumn && { 'Status': '' }),
      'PVD SALT': '',
      'INDUSTRIAL SALT': '',
      'RICE': '',
      'CONDENSE': '',
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Data');

    ws['!cols'] = [
      { wch: 10 },
      { wch: 25 },
      { wch: 12 },
      { wch: 12 },
      { wch: 16 },
      { wch: 8 },
      { wch: 10 },
    ];

    const filename = `${getCategoryLabel()}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const exportToPDF = () => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.text('Sales Dashboard Report', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);
    doc.text(`Total Clients: ${data.length}`, 14, 30);

    const headers = ['Line No.', 'Client Name'];
    if (showSourceColumn) headers.push('Source');
    if (showActiveColumn) headers.push('Status');
    headers.push('PVD SALT', 'INDUSTRIAL SALT', 'RICE', 'CONDENSE');

    const tableData = data.map((row, idx) => {
      const lineNum = currentPage * pageSize + idx + 1;
      const rowData = [lineNum, row.CLIENT_NAME];
      if (showSourceColumn) rowData.push(row.SOURCE);
      if (showActiveColumn) rowData.push(row.ACTIVE === 'Y' || row.ACTIVE === true || row.ACTIVE === 1 ? 'Active' : 'Inactive');
      rowData.push(
        hasProduct(row, 'PVD SALT'),
        hasProduct(row, 'INDUSTRIAL SALT'),
        hasProduct(row, 'RICE'),
        hasProduct(row, 'CONDENSE')
      );
      return rowData;
    });

    const columnStyles = {};
    const productCols = headers.length - 4;
    for (let i = 0; i < 4; i++) {
      columnStyles[productCols + i] = { halign: 'center' };
    }

    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: columnStyles,
    });

    const filename = `${getCategoryLabel()}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="export-buttons">
      <button onClick={exportToExcel} className="export-btn excel-btn">
        📊 Export to Excel
      </button>
      <button onClick={exportToPDF} className="export-btn pdf-btn">
        📄 Export to PDF
      </button>
    </div>
  );
}

export default ExportButtons;
