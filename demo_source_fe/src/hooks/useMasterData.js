import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook to manage state for master data pages (list pages).
 * @param {Function} fetchFn - The API function to fetch data. Should return a Promise resolving to { data, total, page, limit } or similar.
 * @param {Object} initialFilters - Initial filter values.
 * @param {Object} initialSort - Initial sort values { field, order }.
 * @param {number} initialLimit - Initial items per page.
 */
export const useMasterData = (fetchFn, initialFilters = {}, initialSort = { field: 'createdAt', order: 'desc' }, initialLimit = 10) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState(initialSort);
  
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFn({ page, limit, ...filters, sortField: sort.field, sortOrder: sort.order });
      // Assuming response structure is { data: [...], total: number } or similar
      // Adjust based on actual API response structure
      setData(response.data || response.items || []);
      setTotal(response.total || response.totalItems || 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, limit, filters, sort]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (field) => {
    setSort((prev) => {
      if (prev.field === field) {
        return { field, order: prev.order === 'asc' ? 'desc' : 'asc' };
      }
      return { field, order: 'asc' };
    });
    setPage(1);
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleSelectAll = (ids) => {
    if (selectedIds.length === ids.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(ids);
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  return {
    data,
    total,
    loading,
    error,
    page,
    limit,
    filters,
    sort,
    selectedIds,
    fetchData,
    handlePageChange,
    handleLimitChange,
    handleFilterChange,
    handleSortChange,
    handleSelectRow,
    handleSelectAll,
    clearSelection,
  };
};
