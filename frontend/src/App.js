import React, { useState, useEffect } from 'react';
import './App.css';
import Filters from './components/Filters';
import DataTable from './components/DataTable';
import ExportButtons from './components/ExportButtons';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [bdoOptions, setBdoOptions] = useState([]);
  const [bdoTeamOptions, setBdoTeamOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [jumpToPageInput, setJumpToPageInput] = useState('');
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    clientName: '',
    source: 'MANILA',
    active: '1',
    bdo: '',
    bdoTeam: '',
    selectedProductLines: [],
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc',
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductLineFilter, setSelectedProductLineFilter] = useState(null);

  const THIRD_BOX_DEFINITIONS = {
    'PVD SALT': [
      { label: 'PVD SALT ONLY', products: ['PVD SALT'] },
      { label: 'PVD SALT ONLY + RICE ONLY', products: ['PVD SALT', 'RICE'] },
      { label: 'PVD SALT ONLY + CONDENSE ONLY', products: ['PVD SALT', 'CONDENSE'] },
      { label: 'PVD SALT ONLY + INDUSTRIAL SALT ONLY', products: ['PVD SALT', 'INDUSTRIAL SALT'] },
      { label: 'PVD SALT ONLY + RICE ONLY + CONDENSE ONLY', products: ['PVD SALT', 'RICE', 'CONDENSE'] },
      { label: 'PVD SALT ONLY + RICE ONLY + INDUSTRIAL SALT ONLY', products: ['PVD SALT', 'RICE', 'INDUSTRIAL SALT'] },
      { label: 'PVD SALT ONLY + CONDENSE ONLY + INDUSTRIAL SALT ONLY', products: ['PVD SALT', 'CONDENSE', 'INDUSTRIAL SALT'] },
      { label: 'PVD SALT ONLY + RICE ONLY + CONDENSE ONLY + INDUSTRIAL SALT ONLY', products: ['PVD SALT', 'RICE', 'CONDENSE', 'INDUSTRIAL SALT'] },
    ],
    'INDUSTRIAL SALT': [
      { label: 'INDUSTRIAL SALT ONLY', products: ['INDUSTRIAL SALT'] },
      { label: 'INDUSTRIAL SALT ONLY + RICE ONLY', products: ['INDUSTRIAL SALT', 'RICE'] },
      { label: 'INDUSTRIAL SALT ONLY + CONDENSE ONLY', products: ['INDUSTRIAL SALT', 'CONDENSE'] },
      { label: 'INDUSTRIAL SALT ONLY + PVD SALT ONLY', products: ['INDUSTRIAL SALT', 'PVD SALT'] },
      { label: 'INDUSTRIAL SALT ONLY + RICE ONLY + CONDENSE ONLY', products: ['INDUSTRIAL SALT', 'RICE', 'CONDENSE'] },
      { label: 'INDUSTRIAL SALT ONLY + RICE ONLY + PVD SALT ONLY', products: ['INDUSTRIAL SALT', 'RICE', 'PVD SALT'] },
      { label: 'INDUSTRIAL SALT ONLY + CONDENSE ONLY + PVD SALT ONLY', products: ['INDUSTRIAL SALT', 'CONDENSE', 'PVD SALT'] },
      { label: 'INDUSTRIAL SALT ONLY + RICE ONLY + CONDENSE ONLY + PVD SALT ONLY', products: ['INDUSTRIAL SALT', 'RICE', 'CONDENSE', 'PVD SALT'] },
    ],
    'RICE': [
      { label: 'RICE ONLY', products: ['RICE'] },
      { label: 'RICE ONLY + PVD SALT ONLY', products: ['RICE', 'PVD SALT'] },
      { label: 'RICE ONLY + CONDENSE ONLY', products: ['RICE', 'CONDENSE'] },
      { label: 'RICE ONLY + INDUSTRIAL SALT ONLY', products: ['RICE', 'INDUSTRIAL SALT'] },
      { label: 'RICE ONLY + PVD SALT ONLY + CONDENSE ONLY', products: ['RICE', 'PVD SALT', 'CONDENSE'] },
      { label: 'RICE ONLY + PVD SALT ONLY + INDUSTRIAL SALT ONLY', products: ['RICE', 'PVD SALT', 'INDUSTRIAL SALT'] },
      { label: 'RICE ONLY + CONDENSE ONLY + INDUSTRIAL SALT ONLY', products: ['RICE', 'CONDENSE', 'INDUSTRIAL SALT'] },
      { label: 'RICE ONLY + PVD SALT ONLY + CONDENSE ONLY + INDUSTRIAL SALT ONLY', products: ['RICE', 'PVD SALT', 'CONDENSE', 'INDUSTRIAL SALT'] },
    ],
    'CONDENSE': [
      { label: 'CONDENSE ONLY', products: ['CONDENSE'] },
      { label: 'CONDENSE ONLY + PVD SALT ONLY', products: ['CONDENSE', 'PVD SALT'] },
      { label: 'CONDENSE ONLY + RICE ONLY', products: ['CONDENSE', 'RICE'] },
      { label: 'CONDENSE ONLY + INDUSTRIAL SALT ONLY', products: ['CONDENSE', 'INDUSTRIAL SALT'] },
      { label: 'CONDENSE ONLY + PVD SALT ONLY + RICE ONLY', products: ['CONDENSE', 'PVD SALT', 'RICE'] },
      { label: 'CONDENSE ONLY + PVD SALT ONLY + INDUSTRIAL SALT ONLY', products: ['CONDENSE', 'PVD SALT', 'INDUSTRIAL SALT'] },
      { label: 'CONDENSE ONLY + RICE ONLY + INDUSTRIAL SALT ONLY', products: ['CONDENSE', 'RICE', 'INDUSTRIAL SALT'] },
      { label: 'CONDENSE ONLY + PVD SALT ONLY + RICE ONLY + INDUSTRIAL SALT ONLY', products: ['CONDENSE', 'PVD SALT', 'RICE', 'INDUSTRIAL SALT'] },
    ],
  };

  const CATEGORY_LABELS = {
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

  useEffect(() => {
    fetchData();
    fetchProductCounts();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      applyFilters(data, filters, selectedCategory, selectedProductLineFilter);
    }
  }, [sortConfig, selectedCategory, filters, selectedProductLineFilter]);

  useEffect(() => {
    if (filteredData.length > 0) {
      const startIdx = currentPage * pageSize;
      const paged = filteredData.slice(startIdx, startIdx + pageSize);
      setPaginatedData(paged);
    }
  }, [currentPage, pageSize, filteredData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch data');
      const jsonData = await response.json();
      setData(jsonData);
      setPagination({
        totalRecords: jsonData.length,
        totalPages: Math.ceil(jsonData.length / pageSize),
        pageSize
      });
      applyFilters(jsonData, filters, null, null);
      extractFilterOptions(jsonData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductCounts = async () => {
    try {
      const response = await fetch('/api/product-counts');
      if (!response.ok) throw new Error('Failed to fetch product counts');
      const jsonData = await response.json();
      const counts = {};
      jsonData.forEach(row => {
        counts[row.PRODUCT_LINE] = row.client_count;
      });
      setProductCounts(counts);
    } catch (err) {
      console.error('Error fetching product counts:', err);
    }
  };

  const extractFilterOptions = (dataToProcess) => {
    const bdoSet = new Set();
    const bdoTeamSet = new Set();

    console.log('Extracting filter options from', dataToProcess.length, 'rows');
    console.log('First row sample:', dataToProcess[0]);

    dataToProcess.forEach(row => {
      if (row.BDO) bdoSet.add(row.BDO);
      if (row['BDO TEAM']) bdoTeamSet.add(row['BDO TEAM']);
    });

    console.log('BDO options found:', Array.from(bdoSet));
    console.log('BDO TEAM options found:', Array.from(bdoTeamSet));

    setBdoOptions(Array.from(bdoSet).sort());
    setBdoTeamOptions(Array.from(bdoTeamSet).sort());
  };

  const handleFilterChange = (newFilters) => {
    setCurrentPage(0);
    setSelectedCategory(null);
    applyFilters(data, newFilters, null, selectedProductLineFilter);
    setFilters(newFilters);
  };

  const handleCategoryClick = (categoryKey) => {
    setCurrentPage(0);
    setSelectedCategory(categoryKey);
    applyFilters(data, filters, categoryKey, selectedProductLineFilter);
  };

  const applyFilters = (dataToFilter, filtersToApply, categoryToFilter, productLineFilter) => {
    let result = dataToFilter;

    if (productLineFilter) {
      const clientProducts = new Map();
      result.forEach(row => {
        const key = `${row.CLIENT_NAME}|${row.SOURCE}`;
        if (!clientProducts.has(key)) {
          clientProducts.set(key, new Set());
        }
        clientProducts.get(key).add(row.PRODUCT_LINE);
      });

      const validClients = new Set();
      clientProducts.forEach((products, clientKey) => {
        if (products.has(productLineFilter)) {
          validClients.add(clientKey);
        }
      });

      console.log('AFTER PRODUCTLINE FILTER:', {
        productLineFilter,
        clientProductsMapSize: clientProducts.size,
        validClientsCount: validClients.size,
        rowsBeforeFilter: result.length,
      });

      result = result.filter(row => {
        const key = `${row.CLIENT_NAME}|${row.SOURCE}`;
        return validClients.has(key);
      });

      console.log('ROWS AFTER PRODUCTLINE FILTER:', result.length);
    }

    if (filtersToApply.clientName) {
      result = result.filter(row =>
        row.CLIENT_NAME?.toLowerCase().includes(filtersToApply.clientName.toLowerCase())
      );
    }

    if (filtersToApply.source) {
      result = result.filter(row => row.SOURCE === filtersToApply.source);
    }

    if (filtersToApply.active !== '') {
      const isActive = filtersToApply.active === '1';
      result = result.filter(row => {
        const rowIsActive = row.ACTIVE === 'Y' || row.ACTIVE === true || row.ACTIVE === 1;
        return isActive ? rowIsActive : !rowIsActive;
      });
    }

    if (filtersToApply.bdo) {
      result = result.filter(row => row.BDO === filtersToApply.bdo);
    }

    if (filtersToApply.bdoTeam) {
      result = result.filter(row => row['BDO TEAM'] === filtersToApply.bdoTeam);
    }

    if (filtersToApply.selectedProductLines && filtersToApply.selectedProductLines.length > 0) {
      const requiredProducts = new Set(filtersToApply.selectedProductLines);

      const clientProducts = new Map();
      result.forEach(row => {
        const key = `${row.CLIENT_NAME}|${row.SOURCE}`;
        if (!clientProducts.has(key)) {
          clientProducts.set(key, new Set());
        }
        clientProducts.get(key).add(row.PRODUCT_LINE);
      });

      const validClients = new Set();
      clientProducts.forEach((products, clientKey) => {
        if (products.size === requiredProducts.size &&
            Array.from(requiredProducts).every(p => products.has(p))) {
          validClients.add(clientKey);
        }
      });

      result = result.filter(row => {
        const key = `${row.CLIENT_NAME}|${row.SOURCE}`;
        return validClients.has(key);
      });
    }

    if (categoryToFilter) {
      const clientProducts = new Map();
      result.forEach(row => {
        const key = `${row.CLIENT_NAME}|${row.SOURCE}`;
        if (!clientProducts.has(key)) {
          clientProducts.set(key, new Set());
        }
        clientProducts.get(key).add(row.PRODUCT_LINE);
      });

      const validClients = new Set();
      clientProducts.forEach((products, clientKey) => {
        const productArray = Array.from(products).sort();
        const productKey = productArray.join('|');
        if (productKey === categoryToFilter) {
          validClients.add(clientKey);
        }
      });

      result = result.filter(row => {
        const key = `${row.CLIENT_NAME}|${row.SOURCE}`;
        return validClients.has(key);
      });
    }

    setPagination(prev => ({
      ...prev,
      totalRecords: result.length,
      totalPages: Math.ceil(result.length / pageSize)
    }));

    applySorting(result);
  };

  const deduplicateClients = (dataToProcess) => {
    const clientMap = new Map();

    dataToProcess.forEach(row => {
      const key = `${row.CLIENT_NAME}|${row.SOURCE}`;
      if (!clientMap.has(key)) {
        clientMap.set(key, {
          CLIENT_NAME: row.CLIENT_NAME,
          SOURCE: row.SOURCE,
          ACTIVE: row.ACTIVE,
          products: new Set()
        });
      }
      clientMap.get(key).products.add(row.PRODUCT_LINE);
    });

    return Array.from(clientMap.values()).map(item => ({
      CLIENT_NAME: item.CLIENT_NAME,
      SOURCE: item.SOURCE,
      ACTIVE: item.ACTIVE,
      productLines: Array.from(item.products)
    }));
  };

  const getClientProfiles = (dataToProcess) => {
    const clientMap = new Map();

    dataToProcess.forEach(row => {
      const key = `${row.CLIENT_NAME}|${row.SOURCE}`;
      if (!clientMap.has(key)) {
        clientMap.set(key, {
          CLIENT_NAME: row.CLIENT_NAME,
          SOURCE: row.SOURCE,
          ACTIVE: row.ACTIVE,
          products: new Set()
        });
      }
      clientMap.get(key).products.add(row.PRODUCT_LINE);
    });

    return clientMap;
  };

  const getProductLineCounts = (dataToProcess, filtersToApply) => {
    let result = dataToProcess;

    if (filtersToApply.clientName) {
      result = result.filter(row =>
        row.CLIENT_NAME?.toLowerCase().includes(filtersToApply.clientName.toLowerCase())
      );
    }

    if (filtersToApply.source) {
      result = result.filter(row => row.SOURCE === filtersToApply.source);
    }

    if (filtersToApply.active !== '') {
      const isActive = filtersToApply.active === '1';
      result = result.filter(row => {
        const rowIsActive = row.ACTIVE === 'Y' || row.ACTIVE === true || row.ACTIVE === 1;
        return isActive ? rowIsActive : !rowIsActive;
      });
    }

    if (filtersToApply.bdo) {
      result = result.filter(row => row.BDO === filtersToApply.bdo);
    }

    if (filtersToApply.bdoTeam) {
      result = result.filter(row => row['BDO TEAM'] === filtersToApply.bdoTeam);
    }

    const clientProfiles = getClientProfiles(result);
    const counts = {
      'PVD SALT': new Set(),
      'INDUSTRIAL SALT': new Set(),
      'RICE': new Set(),
      'CONDENSE': new Set(),
    };

    clientProfiles.forEach((profile, clientKey) => {
      profile.products.forEach(product => {
        if (counts[product]) {
          counts[product].add(clientKey);
        }
      });
    });

    return counts;
  };

  const applySorting = (dataToSort) => {
    let deduped = deduplicateClients(dataToSort);

    console.log('APPLYSORT DEBUG:', {
      inputRowCount: dataToSort.length,
      dedupedClientCount: deduped.length,
      selectedProductLineFilter,
      filters,
    });

    let sorted = deduped;
    if (sortConfig.key) {
      sorted = [...deduped].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    setFilteredData(sorted);

    const startIdx = currentPage * pageSize;
    const paged = sorted.slice(startIdx, startIdx + pageSize);
    setPaginatedData(paged);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
    setPagination(prev => ({
      ...prev,
      totalPages: Math.ceil(prev.totalRecords / newPageSize),
      pageSize: newPageSize
    }));
  };

  const handleJumpToPage = () => {
    const pageNum = parseInt(jumpToPageInput) - 1;
    const totalPages = pagination.totalPages || Math.ceil(filteredData.length / pageSize) || 1;
    if (pageNum >= 0 && pageNum < totalPages) {
      setCurrentPage(pageNum);
      setJumpToPageInput('');
    } else {
      alert(`Please enter a page number between 1 and ${totalPages}`);
    }
  };

  if (loading) return <div className="app"><p className="loading">Loading data...</p></div>;
  if (error) return <div className="app"><p className="error">Error: {error}</p></div>;

  return (
    <div className="app">
      <header className="app-header">
        <h1>CLIENT LIST PER PRODUCT LINE</h1>
        <p>Interactive sales data from Manila & Province</p>
      </header>

      <div className="container">
        <div className="product-line-overview">
          {(() => {
            const productLineCounts = getProductLineCounts(data, filters);

            console.log('MOTHER BOX DEBUG:', {
              pvdSaltCount: productLineCounts['PVD SALT'].size,
              industrialSaltCount: productLineCounts['INDUSTRIAL SALT'].size,
              riceCount: productLineCounts['RICE'].size,
              condenseCount: productLineCounts['CONDENSE'].size,
            });

            return (
              <div className="product-line-container">
                <div
                  className={`product-line-box ${selectedProductLineFilter === 'PVD SALT' ? 'selected' : ''}`}
                  onClick={() => {
                    const newFilter = selectedProductLineFilter === 'PVD SALT' ? null : 'PVD SALT';
                    setSelectedProductLineFilter(newFilter);
                    setSelectedCategory(null);
                    setCurrentPage(0);
                    if (newFilter) {
                      applyFilters(data, filters, null, newFilter);
                    } else {
                      applyFilters(data, filters, null, null);
                    }
                  }}
                >
                  <h3>PVD SALT CLIENTS</h3>
                  <p className="product-line-count">{productLineCounts['PVD SALT'].size}</p>
                </div>
                <div
                  className={`product-line-box ${selectedProductLineFilter === 'INDUSTRIAL SALT' ? 'selected' : ''}`}
                  onClick={() => {
                    const newFilter = selectedProductLineFilter === 'INDUSTRIAL SALT' ? null : 'INDUSTRIAL SALT';
                    setSelectedProductLineFilter(newFilter);
                    setSelectedCategory(null);
                    setCurrentPage(0);
                    if (newFilter) {
                      applyFilters(data, filters, null, newFilter);
                    } else {
                      applyFilters(data, filters, null, null);
                    }
                  }}
                >
                  <h3>INDUSTRIAL SALT CLIENTS</h3>
                  <p className="product-line-count">{productLineCounts['INDUSTRIAL SALT'].size}</p>
                </div>
                <div
                  className={`product-line-box ${selectedProductLineFilter === 'RICE' ? 'selected' : ''}`}
                  onClick={() => {
                    const newFilter = selectedProductLineFilter === 'RICE' ? null : 'RICE';
                    setSelectedProductLineFilter(newFilter);
                    setSelectedCategory(null);
                    setCurrentPage(0);
                    if (newFilter) {
                      applyFilters(data, filters, null, newFilter);
                    } else {
                      applyFilters(data, filters, null, null);
                    }
                  }}
                >
                  <h3>RICE CLIENTS</h3>
                  <p className="product-line-count">{productLineCounts['RICE'].size}</p>
                </div>
                <div
                  className={`product-line-box ${selectedProductLineFilter === 'CONDENSE' ? 'selected' : ''}`}
                  onClick={() => {
                    const newFilter = selectedProductLineFilter === 'CONDENSE' ? null : 'CONDENSE';
                    setSelectedProductLineFilter(newFilter);
                    setSelectedCategory(null);
                    setCurrentPage(0);
                    if (newFilter) {
                      applyFilters(data, filters, null, newFilter);
                    } else {
                      applyFilters(data, filters, null, null);
                    }
                  }}
                >
                  <h3>CONDENSE CLIENTS</h3>
                  <p className="product-line-count">{productLineCounts['CONDENSE'].size}</p>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="only-summary-section">
          {(() => {
            let result = data;

            if (filters.clientName) {
              result = result.filter(row =>
                row.CLIENT_NAME?.toLowerCase().includes(filters.clientName.toLowerCase())
              );
            }

            if (filters.source) {
              result = result.filter(row => row.SOURCE === filters.source);
            }

            if (filters.active !== '') {
              const isActive = filters.active === '1';
              result = result.filter(row => {
                const rowIsActive = row.ACTIVE === 'Y' || row.ACTIVE === true || row.ACTIVE === 1;
                return isActive ? rowIsActive : !rowIsActive;
              });
            }

            if (filters.bdo) {
              result = result.filter(row => row.BDO === filters.bdo);
            }

            if (filters.bdoTeam) {
              result = result.filter(row => row['BDO TEAM'] === filters.bdoTeam);
            }

            const clientProfiles = getClientProfiles(result);
            const onlyCounts = {
              'PVD SALT': 0,
              'INDUSTRIAL SALT': 0,
              'RICE': 0,
              'CONDENSE': 0,
            };

            clientProfiles.forEach(profile => {
              const products = Array.from(profile.products).sort();
              if (products.length === 1) {
                onlyCounts[products[0]]++;
              }
            });

            return (
              <div className="only-cards-container">
                <div className="only-card">
                  <h3>PVD SALT ONLY</h3>
                  <p className="only-count">{onlyCounts['PVD SALT']}</p>
                </div>
                <div className="only-card">
                  <h3>INDUSTRIAL SALT ONLY</h3>
                  <p className="only-count">{onlyCounts['INDUSTRIAL SALT']}</p>
                </div>
                <div className="only-card">
                  <h3>RICE ONLY</h3>
                  <p className="only-count">{onlyCounts['RICE']}</p>
                </div>
                <div className="only-card">
                  <h3>CONDENSE ONLY</h3>
                  <p className="only-count">{onlyCounts['CONDENSE']}</p>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="summary-section">
          <h2 className="summary-section-title">
            {selectedProductLineFilter ? `${selectedProductLineFilter} — Cumulative Combinations` : 'Cumulative Combinations (Select a mother card above)'}
          </h2>
          {selectedProductLineFilter && (() => {
              let result = data;

              if (filters.clientName) {
                result = result.filter(row =>
                  row.CLIENT_NAME?.toLowerCase().includes(filters.clientName.toLowerCase())
                );
              }

              if (filters.source) {
                result = result.filter(row => row.SOURCE === filters.source);
              }

              if (filters.active !== '') {
                const isActive = filters.active === '1';
                result = result.filter(row => {
                  const rowIsActive = row.ACTIVE === 'Y' || row.ACTIVE === true || row.ACTIVE === 1;
                  return isActive ? rowIsActive : !rowIsActive;
                });
              }

              if (filters.bdo) {
                result = result.filter(row => row.BDO === filters.bdo);
              }

              if (filters.bdoTeam) {
                result = result.filter(row => row['BDO TEAM'] === filters.bdoTeam);
              }

              const clientProfiles = getClientProfiles(result);
              const categories = {
                'PVD SALT': 0,
                'INDUSTRIAL SALT': 0,
                'RICE': 0,
                'CONDENSE': 0,
                'INDUSTRIAL SALT|PVD SALT': 0,
                'PVD SALT|RICE': 0,
                'CONDENSE|PVD SALT': 0,
                'INDUSTRIAL SALT|RICE': 0,
                'CONDENSE|INDUSTRIAL SALT': 0,
                'CONDENSE|RICE': 0,
                'INDUSTRIAL SALT|PVD SALT|RICE': 0,
                'CONDENSE|INDUSTRIAL SALT|PVD SALT': 0,
                'CONDENSE|PVD SALT|RICE': 0,
                'CONDENSE|INDUSTRIAL SALT|RICE': 0,
                'CONDENSE|INDUSTRIAL SALT|PVD SALT|RICE': 0
              };

              clientProfiles.forEach(profile => {
                const products = Array.from(profile.products).sort();
                const key = products.join('|');
                if (categories.hasOwnProperty(key)) {
                  categories[key]++;
                }
              });

              return (
                <div className="summary-cards-container">
                  {THIRD_BOX_DEFINITIONS[selectedProductLineFilter].map((item, idx) => {
                    const cumulativeCount = item.products.reduce((sum, product) => {
                      return sum + (categories[product] || 0);
                    }, 0);
                    const cardKey = `summary-box-${selectedProductLineFilter}-${idx}`;
                    return (
                      <div
                        key={cardKey}
                        className={`summary-card`}
                      >
                        <h3>{item.label}</h3>
                        <p className="summary-value">{cumulativeCount}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          {!selectedProductLineFilter && (
            <div className="summary-cards-container">
              <div className="summary-card" style={{ opacity: 0.5, cursor: 'default' }}>
                <h3>Select a mother card above to see cumulative combinations</h3>
              </div>
            </div>
          )}
        </div>

        <div className="third-box-section">
          <h2 className="third-box-title">All Exact Combinations</h2>
          {(() => {
            let result = data;

            if (filters.clientName) {
              result = result.filter(row =>
                row.CLIENT_NAME?.toLowerCase().includes(filters.clientName.toLowerCase())
              );
            }

            if (filters.source) {
              result = result.filter(row => row.SOURCE === filters.source);
            }

            if (filters.active !== '') {
              const isActive = filters.active === '1';
              result = result.filter(row => {
                const rowIsActive = row.ACTIVE === 'Y' || row.ACTIVE === true || row.ACTIVE === 1;
                return isActive ? rowIsActive : !rowIsActive;
              });
            }

            if (filters.bdo) {
              result = result.filter(row => row.BDO === filters.bdo);
            }

            if (filters.bdoTeam) {
              result = result.filter(row => row['BDO TEAM'] === filters.bdoTeam);
            }

            const clientProfiles = getClientProfiles(result);
            const categories = {
              'PVD SALT': 0,
              'INDUSTRIAL SALT': 0,
              'RICE': 0,
              'CONDENSE': 0,
              'INDUSTRIAL SALT|PVD SALT': 0,
              'PVD SALT|RICE': 0,
              'CONDENSE|PVD SALT': 0,
              'INDUSTRIAL SALT|RICE': 0,
              'CONDENSE|INDUSTRIAL SALT': 0,
              'CONDENSE|RICE': 0,
              'INDUSTRIAL SALT|PVD SALT|RICE': 0,
              'CONDENSE|INDUSTRIAL SALT|PVD SALT': 0,
              'CONDENSE|PVD SALT|RICE': 0,
              'CONDENSE|INDUSTRIAL SALT|RICE': 0,
              'CONDENSE|INDUSTRIAL SALT|PVD SALT|RICE': 0
            };

            clientProfiles.forEach(profile => {
              const products = Array.from(profile.products).sort();
              const key = products.join('|');
              if (categories.hasOwnProperty(key)) {
                categories[key]++;
              }
            });

            const shouldShowCategory = (categoryKey) => {
              if (!selectedProductLineFilter) return true;
              return categoryKey.includes(selectedProductLineFilter);
            };

            return (
              <div className="third-box-container">
                {shouldShowCategory('PVD SALT') && (
                  <div className={`third-box-card ${selectedCategory === 'PVD SALT' ? 'selected' : ''}`} onClick={() => handleCategoryClick('PVD SALT')}>
                    <h3><span className={`product-name ${selectedProductLineFilter === 'PVD SALT' ? 'highlighted' : ''}`}>PVD</span> SALT ONLY</h3>
                    <p className="third-box-count">{categories['PVD SALT']}</p>
                  </div>
                )}
                {shouldShowCategory('INDUSTRIAL SALT') && (
                  <div className={`third-box-card ${selectedCategory === 'INDUSTRIAL SALT' ? 'selected' : ''}`} onClick={() => handleCategoryClick('INDUSTRIAL SALT')}>
                    <h3><span className={`product-name ${selectedProductLineFilter === 'INDUSTRIAL SALT' ? 'highlighted' : ''}`}>INDUSTRIAL</span> SALT ONLY</h3>
                    <p className="third-box-count">{categories['INDUSTRIAL SALT']}</p>
                  </div>
                )}
                {shouldShowCategory('RICE') && (
                  <div className={`third-box-card ${selectedCategory === 'RICE' ? 'selected' : ''}`} onClick={() => handleCategoryClick('RICE')}>
                    <h3><span className={`product-name ${selectedProductLineFilter === 'RICE' ? 'highlighted' : ''}`}>RICE</span> ONLY</h3>
                    <p className="third-box-count">{categories['RICE']}</p>
                  </div>
                )}
                {shouldShowCategory('CONDENSE') && (
                  <div className={`third-box-card ${selectedCategory === 'CONDENSE' ? 'selected' : ''}`} onClick={() => handleCategoryClick('CONDENSE')}>
                    <h3><span className={`product-name ${selectedProductLineFilter === 'CONDENSE' ? 'highlighted' : ''}`}>CONDENSE</span> ONLY</h3>
                    <p className="third-box-count">{categories['CONDENSE']}</p>
                  </div>
                )}
                {shouldShowCategory('INDUSTRIAL SALT|PVD SALT') && (
                  <div className={`third-box-card ${selectedCategory === 'INDUSTRIAL SALT|PVD SALT' ? 'selected' : ''}`} onClick={() => handleCategoryClick('INDUSTRIAL SALT|PVD SALT')}>
                    <h3><span className={`product-name ${selectedProductLineFilter === 'PVD SALT' ? 'highlighted' : ''}`}>PVD</span> SALT AND <span className={`product-name ${selectedProductLineFilter === 'INDUSTRIAL SALT' ? 'highlighted' : ''}`}>INDUSTRIAL</span> SALT ONLY</h3>
                    <p className="third-box-count">{categories['INDUSTRIAL SALT|PVD SALT']}</p>
                  </div>
                )}
                {shouldShowCategory('PVD SALT|RICE') && (
                  <div className={`third-box-card ${selectedCategory === 'PVD SALT|RICE' ? 'selected' : ''}`} onClick={() => handleCategoryClick('PVD SALT|RICE')}>
                    <h3><span className={`product-name ${selectedProductLineFilter === 'PVD SALT' ? 'highlighted' : ''}`}>PVD</span> SALT AND <span className={`product-name ${selectedProductLineFilter === 'RICE' ? 'highlighted' : ''}`}>RICE</span> ONLY</h3>
                    <p className="third-box-count">{categories['PVD SALT|RICE']}</p>
                  </div>
                )}
                {shouldShowCategory('CONDENSE|PVD SALT') && (
                  <div className={`third-box-card ${selectedCategory === 'CONDENSE|PVD SALT' ? 'selected' : ''}`} onClick={() => handleCategoryClick('CONDENSE|PVD SALT')}>
                    <h3><span className={`product-name ${selectedProductLineFilter === 'PVD SALT' ? 'highlighted' : ''}`}>PVD</span> SALT AND <span className={`product-name ${selectedProductLineFilter === 'CONDENSE' ? 'highlighted' : ''}`}>CONDENSE</span> ONLY</h3>
                    <p className="third-box-count">{categories['CONDENSE|PVD SALT']}</p>
                  </div>
                )}
                {shouldShowCategory('INDUSTRIAL SALT|RICE') && (
                  <div className={`third-box-card ${selectedCategory === 'INDUSTRIAL SALT|RICE' ? 'selected' : ''}`} onClick={() => handleCategoryClick('INDUSTRIAL SALT|RICE')}>
                    <h3><span className={`product-name ${selectedProductLineFilter === 'INDUSTRIAL SALT' ? 'highlighted' : ''}`}>INDUSTRIAL</span> SALT AND <span className={`product-name ${selectedProductLineFilter === 'RICE' ? 'highlighted' : ''}`}>RICE</span> ONLY</h3>
                    <p className="third-box-count">{categories['INDUSTRIAL SALT|RICE']}</p>
                  </div>
                )}
                {shouldShowCategory('CONDENSE|INDUSTRIAL SALT') && (
                  <div className={`third-box-card ${selectedCategory === 'CONDENSE|INDUSTRIAL SALT' ? 'selected' : ''}`} onClick={() => handleCategoryClick('CONDENSE|INDUSTRIAL SALT')}>
                    <h3><span className={`product-name ${selectedProductLineFilter === 'INDUSTRIAL SALT' ? 'highlighted' : ''}`}>INDUSTRIAL</span> SALT AND <span className={`product-name ${selectedProductLineFilter === 'CONDENSE' ? 'highlighted' : ''}`}>CONDENSE</span> ONLY</h3>
                    <p className="third-box-count">{categories['CONDENSE|INDUSTRIAL SALT']}</p>
                  </div>
                )}
                {shouldShowCategory('CONDENSE|RICE') && (
                  <div className={`third-box-card ${selectedCategory === 'CONDENSE|RICE' ? 'selected' : ''}`} onClick={() => handleCategoryClick('CONDENSE|RICE')}>
                    <h3><span className={`product-name ${selectedProductLineFilter === 'RICE' ? 'highlighted' : ''}`}>RICE</span> AND <span className={`product-name ${selectedProductLineFilter === 'CONDENSE' ? 'highlighted' : ''}`}>CONDENSE</span> ONLY</h3>
                    <p className="third-box-count">{categories['CONDENSE|RICE']}</p>
                  </div>
                )}
                {shouldShowCategory('INDUSTRIAL SALT|PVD SALT|RICE') && (
                  <div className={`third-box-card ${selectedCategory === 'INDUSTRIAL SALT|PVD SALT|RICE' ? 'selected' : ''}`} onClick={() => handleCategoryClick('INDUSTRIAL SALT|PVD SALT|RICE')}>
                    <h3><span className={`product-name ${selectedProductLineFilter === 'PVD SALT' ? 'highlighted' : ''}`}>PVD</span> SALT AND <span className={`product-name ${selectedProductLineFilter === 'INDUSTRIAL SALT' ? 'highlighted' : ''}`}>INDUSTRIAL</span> SALT AND <span className={`product-name ${selectedProductLineFilter === 'RICE' ? 'highlighted' : ''}`}>RICE</span> ONLY</h3>
                    <p className="third-box-count">{categories['INDUSTRIAL SALT|PVD SALT|RICE']}</p>
                  </div>
                )}
                {shouldShowCategory('CONDENSE|INDUSTRIAL SALT|PVD SALT') && (
                  <div className={`third-box-card ${selectedCategory === 'CONDENSE|INDUSTRIAL SALT|PVD SALT' ? 'selected' : ''}`} onClick={() => handleCategoryClick('CONDENSE|INDUSTRIAL SALT|PVD SALT')}>
                    <h3><span className={`product-name ${selectedProductLineFilter === 'PVD SALT' ? 'highlighted' : ''}`}>PVD</span> SALT AND <span className={`product-name ${selectedProductLineFilter === 'INDUSTRIAL SALT' ? 'highlighted' : ''}`}>INDUSTRIAL</span> SALT AND <span className={`product-name ${selectedProductLineFilter === 'CONDENSE' ? 'highlighted' : ''}`}>CONDENSE</span> ONLY</h3>
                    <p className="third-box-count">{categories['CONDENSE|INDUSTRIAL SALT|PVD SALT']}</p>
                  </div>
                )}
                {shouldShowCategory('CONDENSE|PVD SALT|RICE') && (
                  <div className={`third-box-card ${selectedCategory === 'CONDENSE|PVD SALT|RICE' ? 'selected' : ''}`} onClick={() => handleCategoryClick('CONDENSE|PVD SALT|RICE')}>
                    <h3><span className={`product-name ${selectedProductLineFilter === 'PVD SALT' ? 'highlighted' : ''}`}>PVD</span> SALT AND <span className={`product-name ${selectedProductLineFilter === 'RICE' ? 'highlighted' : ''}`}>RICE</span> AND <span className={`product-name ${selectedProductLineFilter === 'CONDENSE' ? 'highlighted' : ''}`}>CONDENSE</span> ONLY</h3>
                    <p className="third-box-count">{categories['CONDENSE|PVD SALT|RICE']}</p>
                  </div>
                )}
                {shouldShowCategory('CONDENSE|INDUSTRIAL SALT|RICE') && (
                  <div className={`third-box-card ${selectedCategory === 'CONDENSE|INDUSTRIAL SALT|RICE' ? 'selected' : ''}`} onClick={() => handleCategoryClick('CONDENSE|INDUSTRIAL SALT|RICE')}>
                    <h3><span className={`product-name ${selectedProductLineFilter === 'INDUSTRIAL SALT' ? 'highlighted' : ''}`}>INDUSTRIAL</span> SALT AND <span className={`product-name ${selectedProductLineFilter === 'RICE' ? 'highlighted' : ''}`}>RICE</span> AND <span className={`product-name ${selectedProductLineFilter === 'CONDENSE' ? 'highlighted' : ''}`}>CONDENSE</span> ONLY</h3>
                    <p className="third-box-count">{categories['CONDENSE|INDUSTRIAL SALT|RICE']}</p>
                  </div>
                )}
                {shouldShowCategory('CONDENSE|INDUSTRIAL SALT|PVD SALT|RICE') && (
                  <div className={`third-box-card ${selectedCategory === 'CONDENSE|INDUSTRIAL SALT|PVD SALT|RICE' ? 'selected' : ''}`} onClick={() => handleCategoryClick('CONDENSE|INDUSTRIAL SALT|PVD SALT|RICE')}>
                    <h3><span className={`product-name ${selectedProductLineFilter === 'PVD SALT' ? 'highlighted' : ''}`}>PVD</span> SALT AND <span className={`product-name ${selectedProductLineFilter === 'INDUSTRIAL SALT' ? 'highlighted' : ''}`}>INDUSTRIAL</span> SALT AND <span className={`product-name ${selectedProductLineFilter === 'RICE' ? 'highlighted' : ''}`}>RICE</span> AND <span className={`product-name ${selectedProductLineFilter === 'CONDENSE' ? 'highlighted' : ''}`}>CONDENSE</span> ONLY</h3>
                    <p className="third-box-count">{categories['CONDENSE|INDUSTRIAL SALT|PVD SALT|RICE']}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        <div className="controls-section">
          <Filters filters={filters} onFilterChange={handleFilterChange} data={data} bdoOptions={bdoOptions} bdoTeamOptions={bdoTeamOptions} />
          <ExportButtons data={filteredData} filters={filters} currentPage={currentPage} pageSize={pageSize} selectedCategory={selectedCategory} selectedProductLineFilter={selectedProductLineFilter} />
        </div>

        <DataTable data={paginatedData} onSort={handleSort} sortConfig={sortConfig} filters={filters} currentPage={currentPage} pageSize={pageSize} />

        <div className="pagination-section">
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="pagination-btn"
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {currentPage + 1} of {pagination.totalPages || 1}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= ((pagination.totalPages || 1) - 1)}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>

          <div className="pagination-settings">
            <div className="page-size-control">
              <label>Records per page:</label>
              <select value={pageSize} onChange={(e) => handlePageSizeChange(parseInt(e.target.value))} className="page-size-select">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={1000}>1000</option>
              </select>
            </div>

            <div className="jump-to-page-control">
              <label>Jump to page:</label>
              <input
                type="number"
                min="1"
                max={pagination.totalPages || 1}
                value={jumpToPageInput}
                onChange={(e) => setJumpToPageInput(e.target.value)}
                placeholder="Page #"
                className="jump-to-page-input"
              />
              <button onClick={handleJumpToPage} className="jump-btn">
                Go
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
