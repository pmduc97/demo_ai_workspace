import React from 'react';

/**
 * DataTable Component
 * @param {Array} columns - Array of column definitions: { key, label, sortable, render }
 * @param {Array} data - Array of data objects
 * @param {boolean} loading - Loading state
 * @param {Array} selectedIds - Array of selected row IDs
 * @param {Function} onSelectRow - Function to handle single row selection
 * @param {Function} onSelectAll - Function to handle select all
 * @param {Object} sort - Current sort state { field, order }
 * @param {Function} onSort - Function to handle sorting
 * @param {string} emptyMessage - Message to display when data is empty
 */
const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  sort = {},
  onSort,
  emptyMessage = 'Không có dữ liệu',
}) => {
  const allIds = data.map((item) => item.id);
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < data.length;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {onSelectAll && (
              <th scope="col" className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = isIndeterminate;
                    }
                  }}
                  onChange={() => onSelectAll(allIds)}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{col.label}</span>
                  {col.sortable && sort.field === col.key && (
                    <span>{sort.order === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            // Skeleton Loading
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={`skeleton-${index}`}>
                {onSelectAll && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                )}
                {columns.map((col) => (
                  <td key={`skeleton-${col.key}-${index}`} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            // Empty State
            <tr>
              <td
                colSpan={columns.length + (onSelectAll ? 1 : 0)}
                className="px-6 py-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            // Data Rows
            data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {onSelectRow && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => onSelectRow(row.id)}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={`${row.id}-${col.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
