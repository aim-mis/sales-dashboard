import React from 'react';

function Filters({ filters, onFilterChange, bdoOptions = [], bdoTeamOptions = [] }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <input
          type="text"
          name="clientName"
          placeholder="Search Client Name..."
          value={filters.clientName}
          onChange={handleChange}
          className="filter-input"
        />

        <select
          name="source"
          value={filters.source}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">All Sources</option>
          <option value="MANILA">MANILA</option>
          <option value="PROVINCE">PROVINCE</option>
        </select>

        <select
          name="active"
          value={filters.active}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>

        <select
          name="bdo"
          value={filters.bdo || ''}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">All BDO</option>
          {bdoOptions.map((bdo) => (
            <option key={bdo} value={bdo}>
              {bdo}
            </option>
          ))}
        </select>

        <select
          name="bdoTeam"
          value={filters.bdoTeam || ''}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">All BDO TEAM</option>
          {bdoTeamOptions.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Filters;
