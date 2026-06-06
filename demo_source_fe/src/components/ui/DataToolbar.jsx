import React, { useState } from 'react';

/**
 * DataToolbar Component
 * @param {string} searchPlaceholder - Placeholder for search input
 * @param {Function} onSearch - Function to handle search submit
 * @param {Array} selectedIds - Array of selected row IDs
 * @param {Array} bulkActions - Array of bulk action definitions: { label, onClick, variant }
 * @param {React.ReactNode} customFilters - Custom filter components to render
 */
const DataToolbar = ({
  searchPlaceholder = 'Tìm kiếm...',
  onSearch,
  selectedIds = [],
  bulkActions = [],
  customFilters = null,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
      {/* Left side: Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
        {onSearch && (
          <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full min-w-[200px] pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        )}
        
        {customFilters && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {customFilters}
          </div>
        )}
      </div>

      {/* Right side: Bulk Actions */}
      <div className="flex items-center gap-2">
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-md border border-blue-100">
            <span className="text-sm text-blue-700 font-medium">
              Đã chọn {selectedIds.length}
            </span>
            <div className="h-4 w-px bg-blue-200 mx-1"></div>
            {bulkActions.map((action, index) => (
              <button
                key={index}
                onClick={() => action.onClick(selectedIds)}
                className={`text-sm px-3 py-1 rounded-md transition-opacity ${
                  action.variant === 'danger'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataToolbar;
