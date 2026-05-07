import React from 'react';
import '../SkeletonLoader.css';

function SkeletonLoader() {
  return (
    <div className="skeleton-container">
      {/* Product Line Overview Skeleton */}
      <div className="skeleton-section">
        <div className="skeleton-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-text skeleton-title"></div>
              <div className="skeleton-number"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Only Summary Skeleton */}
      <div className="skeleton-section">
        <div className="skeleton-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-text skeleton-title"></div>
              <div className="skeleton-number"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section Skeleton */}
      <div className="skeleton-section">
        <div className="skeleton-text skeleton-heading"></div>
        <div className="skeleton-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-text skeleton-small"></div>
              <div className="skeleton-number"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="skeleton-section">
        <div className="skeleton-table">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton-row">
              <div className="skeleton-text skeleton-cell"></div>
              <div className="skeleton-text skeleton-cell"></div>
              <div className="skeleton-text skeleton-cell"></div>
              <div className="skeleton-text skeleton-cell"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkeletonLoader;
