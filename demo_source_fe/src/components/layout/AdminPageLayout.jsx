import React from 'react';
import AdminLayout from '../AdminLayout';

/**
 * AdminPageLayout Component
 * @param {string} title - Page title
 * @param {React.ReactNode} headerActions - Actions to display in the header (e.g., Create button)
 * @param {React.ReactNode} children - Page content (Toolbar, Table, Pagination)
 */
const AdminPageLayout = ({ title, headerActions, children }) => {
  return (
    <AdminLayout title={title}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          {children}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPageLayout;
