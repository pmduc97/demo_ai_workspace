import React, { useState } from 'react';
import api, { parseApiError } from '../../services/api';
import { getMessage } from '../../constants/messages';
import { useMasterData } from '../../hooks/useMasterData';
import AdminPageLayout from '../../components/layout/AdminPageLayout';
import DataToolbar from '../../components/ui/DataToolbar';
import DataTable from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';

const toSlug = (str) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

const emptyForm = { name: '', slug: '', description: '', status: 'active', thumbnail_url: '', seo_title: '', seo_description: '' };

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('vi-VN');
};

export default function CategoryListPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });
  const [detailCategory, setDetailCategory] = useState(null);

  const fetchCategories = React.useCallback(async (params) => {
    const { data } = await api.get('/categories', {
      params: {
        page: params.page,
        limit: params.limit,
        keyword: params.keyword,
        status: params.status !== 'all' ? params.status : undefined,
        sort: params.sortField ? `${params.sortField}_${params.sortOrder}` : 'created_at_desc'
      }
    });
    const items = Array.isArray(data) ? data : data?.items || [];
    return { data: items, total: data?.pagination?.totalItems || items.length };
  }, []);

  const {
    data: categories,
    total,
    loading,
    page,
    limit,
    filters,
    sort,
    fetchData: load,
    handlePageChange,
    handleLimitChange,
    handleFilterChange,
    handleSortChange,
  } = useMasterData(fetchCategories, { keyword: '', status: 'all' }, { field: 'created_at', order: 'desc' }, 5);

  const busy = loading || adding || saving || deleting || exporting;
  const canSubmitAdd = addForm.name.trim().length >= 2 && addForm.slug.trim().length > 0 && !adding;

  const escapeCsv = (value) => {
    const text = value === null || value === undefined ? '' : String(value);
    return `"${text.replace(/"/g, '""')}"`;
  };

  const exportCsv = async () => {
    setExporting(true);
    setError('');
    try {
      const exportLimit = 100;
      const firstResponse = await api.get('/categories', {
        params: { keyword: filters.keyword, status: filters.status, sort: sort.field ? `${sort.field}_${sort.order}` : 'created_at_desc', page: 1, limit: exportLimit },
      });
      const firstPageItems = Array.isArray(firstResponse.data) ? firstResponse.data : firstResponse.data?.items || [];
      const totalPages = firstResponse.data?.pagination?.totalPages || 1;
      let items = [...firstPageItems];
      for (let p = 2; p <= totalPages; p += 1) {
        const { data } = await api.get('/categories', {
          params: { keyword: filters.keyword, status: filters.status, sort: sort.field ? `${sort.field}_${sort.order}` : 'created_at_desc', page: p, limit: exportLimit },
        });
        items = [...items, ...(Array.isArray(data) ? data : data?.items || [])];
      }
      const header = ['ID', 'Tên', 'Slug', 'Mô tả', 'Trạng thái', 'Số bài', 'Bài đã publish', 'Lượt xem', 'Người tạo', 'Bài mới nhất', 'Ngày tạo', 'Ngày cập nhật'];
      const rows = items.map((cat) => [cat.id, cat.name, cat.slug, cat.description, cat.status, cat.postCount ?? 0, cat.publishedPostCount ?? 0, cat.viewCount ?? 0, cat.createdByName, cat.latestPost?.title, formatDate(cat.created_at), formatDate(cat.updated_at)]);
      const csv = [header, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n');
      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `categories-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(parseApiError(err, 'CATEGORY-E-001'));
    } finally {
      setExporting(false);
    }
  };

  // Add
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddError('');
    setAddForm((f) => ({
      ...f,
      [name]: value,
      ...(name === 'name' ? { slug: toSlug(value) } : {}),
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!canSubmitAdd) { setAddError(getMessage('CATEGORY-E-001')); return; }
    setAdding(true); setAddError(''); setSuccess('');
    try {
      await api.post('/categories', addForm);
      setAddForm(emptyForm);
      setAddModalOpen(false);
      setSuccess(getMessage('CATEGORY-S-001'));
      load();
    } catch (err) {
      setAddError(parseApiError(err, 'CATEGORY-E-001'));
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditForm({
      name: cat.name || '', slug: cat.slug || '', description: cat.description || '', status: cat.status || 'active',
      thumbnail_url: cat.thumbnail_url || '', seo_title: cat.seo_title || '', seo_description: cat.seo_description || '',
    });
  };
  const cancelEdit = () => setEditingId(null);
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value, ...(name === 'name' ? { slug: toSlug(value) } : {}) }));
  };
  const handleSave = async (id) => {
    setSaving(true); setError(''); setSuccess('');
    try {
      await api.put(`/categories/${id}`, editForm);
      setEditingId(null);
      setSuccess(getMessage('CATEGORY-S-002'));
      load();
    } catch (err) {
      setError(parseApiError(err, 'CATEGORY-E-001'));
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const confirmDelete = async () => {
    setDeleting(true); setError(''); setSuccess('');
    try {
      await api.delete(`/categories/${deleteModal.id}`);
      setDeleteModal({ open: false, id: null, name: '' });
      setSuccess(getMessage('CATEGORY-S-003'));
      load();
    } catch (err) {
      setError(parseApiError(err, 'CATEGORY-E-003'));
    } finally {
      setDeleting(false);
    }
  };

  const categoryColumns = [
    {
      key: 'name',
      label: 'Tên',
      sortable: true,
      render: (cat) => editingId === cat.id ? <input name="name" value={editForm.name} onChange={handleEditChange} className="border border-gray-300 rounded px-2 py-1 w-full text-sm" /> : <span className="font-medium text-gray-800">{cat.name}</span>
    },
    {
      key: 'slug',
      label: 'Slug',
      sortable: true,
      render: (cat) => editingId === cat.id ? <input name="slug" value={editForm.slug} onChange={handleEditChange} className="border border-gray-300 rounded px-2 py-1 w-full text-sm" /> : <span className="text-gray-500 font-mono text-xs">{cat.slug}</span>
    },
    
    {
      key: 'status',
      label: 'Trạng thái',
      sortable: true,
      render: (cat) => editingId === cat.id ? <select name="status" value={editForm.status} onChange={handleEditChange} className="border border-gray-300 rounded px-2 py-1 w-full text-sm"><option value="active">Hiển thị</option><option value="hidden">Ẩn</option></select> : <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${cat.status === 'hidden' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>{cat.status === 'hidden' ? 'Ẩn' : 'Hiển thị'}</span>
    },
    {
      key: 'posts',
      label: 'Số bài',
      sortable: false,
      render: (cat) => <span className="text-gray-600">{cat.postCount ?? 0} <span className="text-gray-400">/ {cat.publishedPostCount ?? 0} publish</span></span>
    },
    {
      key: 'actions',
      label: 'Hành động',
      sortable: false,
      render: (cat) => editingId === cat.id ? (
        <div className="flex justify-end gap-2">
          <button onClick={() => handleSave(cat.id)} disabled={saving} className="text-xs bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-3 py-1 rounded-lg">Lưu</button>
          <button onClick={cancelEdit} disabled={saving} className="text-xs bg-gray-200 hover:bg-gray-300 disabled:opacity-60 text-gray-700 px-3 py-1 rounded-lg">Hủy</button>
        </div>
      ) : (
        <div className="flex justify-end gap-2">
          <button onClick={() => setDetailCategory(cat)} disabled={busy} className="text-xs font-medium bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 px-3 py-1.5 rounded-lg">Xem</button>
          <button onClick={() => startEdit(cat)} disabled={busy} className="text-xs font-medium bg-amber-50 hover:bg-amber-100 disabled:opacity-60 text-amber-700 px-3 py-1.5 rounded-lg">Sửa</button>
          <button onClick={() => setDeleteModal({ open: true, id: cat.id, name: cat.name })} disabled={busy} className="text-xs font-medium bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-600 px-3 py-1.5 rounded-lg">Xóa</button>
        </div>
      )
    }
  ];

  const customFilters = (
    <select value={filters.status} onChange={(e) => handleFilterChange({ status: e.target.value })} disabled={busy} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100">
      <option value="all">Tất cả</option><option value="active">Đang hiển thị</option><option value="hidden">Đã ẩn</option>
    </select>
  );

  const headerActions = (
    <>
      <button type="button" onClick={exportCsv} disabled={busy} className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-60">{exporting ? 'Đang export...' : 'Export CSV'}</button>
      <button type="button" onClick={() => { setAddError(''); setAddForm(emptyForm); setAddModalOpen(true); }} disabled={busy} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60">+ Tạo mới</button>
    </>
  );

  return (
    <AdminPageLayout title="Quản Lý Danh Mục" headerActions={headerActions}>
      <div className="space-y-4">
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        {success && <p className="text-sm text-green-600 mb-3">{success}</p>}

        <DataToolbar
          searchPlaceholder="Tên hoặc slug"
          onSearch={(keyword) => handleFilterChange({ keyword })}
          customFilters={customFilters}
        />

        <DataTable
          columns={categoryColumns}
          data={categories}
          loading={loading}
          sort={sort}
          onSort={handleSortChange}
          emptyMessage="Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!"
        />

        <Pagination
          page={page}
          total={total}
          limit={limit}
          onPageChange={handlePageChange}
        />
      </div>

      {addModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-4 mb-4">
              <h3 className="font-semibold text-gray-800">Thêm danh mục</h3>
              <button onClick={() => !adding && setAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            {addError && <p className="text-sm text-red-600 mb-3">{addError}</p>}
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="name" value={addForm.name} onChange={handleAddChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Tên danh mục" />
                <input name="slug" value={addForm.slug} onChange={handleAddChange} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="slug-danh-muc" />
              </div>
              <textarea name="description" value={addForm.description} onChange={handleAddChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Mô tả" />
              <select name="status" value={addForm.status} onChange={handleAddChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="active">Hiển thị</option>
                <option value="hidden">Ẩn</option>
              </select>
              <input name="thumbnail_url" value={addForm.thumbnail_url} onChange={handleAddChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Thumbnail URL" />
              <input name="seo_title" value={addForm.seo_title} onChange={handleAddChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="SEO title" />
              <textarea name="seo_description" value={addForm.seo_description} onChange={handleAddChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="SEO description" />
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setAddModalOpen(false)} disabled={adding} className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700">Hủy</button>
                <button type="submit" disabled={!canSubmitAdd} className="px-4 py-2 text-sm rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white">{adding ? 'Đang thêm...' : 'Thêm danh mục'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailCategory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start gap-4 mb-4">
              <h3 className="font-semibold text-gray-800">Chi tiết danh mục</h3>
              <button onClick={() => setDetailCategory(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-gray-50 p-4 space-y-1"><p><strong>Tên:</strong> {detailCategory.name}</p><p><strong>Slug:</strong> {detailCategory.slug}</p><p><strong>Mô tả:</strong> {detailCategory.description || '—'}</p><p><strong>Trạng thái:</strong> {detailCategory.status === 'hidden' ? 'Ẩn' : 'Hiển thị'}</p></div>
              <div className="rounded-lg bg-gray-50 p-4 space-y-1"><p><strong>Số bài:</strong> {detailCategory.postCount ?? 0}</p><p><strong>Published:</strong> {detailCategory.publishedPostCount ?? 0}</p><p><strong>Lượt xem:</strong> {detailCategory.viewCount ?? 0}</p><p><strong>Người tạo:</strong> {detailCategory.createdByName || '—'}</p></div>
              <div className="rounded-lg bg-gray-50 p-4 space-y-1 md:col-span-2"><p><strong>Thumbnail:</strong> {detailCategory.thumbnail_url || '—'}</p><p><strong>SEO Title:</strong> {detailCategory.seo_title || '—'}</p><p><strong>SEO Description:</strong> {detailCategory.seo_description || '—'}</p><p><strong>Bài mới nhất:</strong> {detailCategory.latestPost?.title || '—'}</p><p><strong>Ngày tạo:</strong> {formatDate(detailCategory.created_at)}</p><p><strong>Cập nhật:</strong> {formatDate(detailCategory.updated_at)}</p></div>
            </div>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-gray-800 mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-gray-600 mb-5">{getMessage('CATEGORY-C-001')} <strong>"{deleteModal.name}"</strong></p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteModal({ open: false, id: null, name: '' })} disabled={deleting} className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700">Hủy</button>
              <button onClick={confirmDelete} disabled={deleting} className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white">{deleting ? 'Đang xóa...' : 'Xóa mềm'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
}
