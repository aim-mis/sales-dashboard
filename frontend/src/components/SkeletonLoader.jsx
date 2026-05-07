import React from 'react';
import '../SkeletonLoader.css';

function SkeletonLoader() {
  return (
    <div className="container">
      {/* Header Skeleton */}
      <div className="skeleton-header">
        <div className="skeleton-shimmer skeleton-header-title"></div>
        <div className="skeleton-shimmer skeleton-header-subtitle"></div>
      </div>

      {/* Product Line Overview Skeleton (4 mother boxes - purple gradient) */}
      <div className="skeleton-product-line-overview">
        <div className="skeleton-product-line-container">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-product-line-box">
              <div className="skeleton-shimmer skeleton-mother-title"></div>
              <div className="skeleton-shimmer skeleton-mother-count"></div>
            </div>
          ))}
        </div>
      </div>

      {/* ONLY Summary Section Skeleton (4 cards - orange gradient) */}
      <div className="skeleton-only-summary">
        <div className="skeleton-only-cards-container">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-only-card">
              <div className="skeleton-shimmer skeleton-only-title"></div>
              <div className="skeleton-shimmer skeleton-only-count"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section Skeleton (Cumulative Combinations - 8 cards) */}
      <div className="skeleton-summary-section">
        <div className="skeleton-shimmer skeleton-section-heading"></div>
        <div className="skeleton-summary-cards-container">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="skeleton-summary-card">
              <div className="skeleton-shimmer skeleton-card-title"></div>
              <div className="skeleton-shimmer skeleton-card-count"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Third Box Section Skeleton (All Exact Combinations - 15 cards) */}
      <div className="skeleton-third-box-section">
        <div className="skeleton-shimmer skeleton-section-heading"></div>
        <div className="skeleton-third-box-container">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
            <div key={i} className="skeleton-third-box-card">
              <div className="skeleton-shimmer skeleton-card-title"></div>
              <div className="skeleton-shimmer skeleton-card-count-small"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls Section Skeleton (Filters + Export) */}
      <div className="skeleton-controls-section">
        <div className="skeleton-filters">
          <div className="skeleton-shimmer skeleton-filter-input"></div>
          <div className="skeleton-shimmer skeleton-filter-input"></div>
          <div className="skeleton-shimmer skeleton-filter-input"></div>
          <div className="skeleton-shimmer skeleton-filter-input"></div>
          <div className="skeleton-shimmer skeleton-filter-input"></div>
          <div className="skeleton-shimmer skeleton-reset-btn"></div>
        </div>
        <div className="skeleton-export-buttons">
          <div className="skeleton-shimmer skeleton-export-btn"></div>
          <div className="skeleton-shimmer skeleton-export-btn"></div>
        </div>
      </div>

      {/* Data Table Skeleton */}
      <div className="skeleton-data-table">
        <div className="skeleton-table-header">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="skeleton-shimmer skeleton-th"></div>
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="skeleton-table-row">
            {[1, 2, 3, 4, 5, 6, 7].map((col) => (
              <div key={col} className="skeleton-shimmer skeleton-td"></div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="skeleton-pagination-section">
        <div className="skeleton-shimmer skeleton-pagination-btn"></div>
        <div className="skeleton-shimmer skeleton-pagination-info"></div>
        <div className="skeleton-shimmer skeleton-pagination-btn"></div>
      </div>
    </div>
  );
}

export default SkeletonLoader;
