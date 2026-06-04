import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api, { parseApiError } from '../../services/api';
import { getMessage } from '../../constants/messages';

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

const normalizeResponse = (data, currentPage, limit) => {
  const items = Array.isArray(data) ? data : data?.items || [];
  return {
    items,
    pagination: data?.pagination || { page: currentPage, limit, totalItems: items.length, totalPages: 1 },
  };
};

export default function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('created_at_desc');
  const [pagination, setPagination] = useState({ page: 1, limit: 5, totalItems: 0, totalPages: 1 });
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

  const busy = loading || adding || saving || deleting || exporting;
  const canSubmitAdd = addForm.name.trim().length >= 2 && addForm.slug.trim().length > 0 && !adding;

  const load = async (page = pagination.page, overrides = {}) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        keyword: (overrides.keyword ?? keyword).trim(),
        status: overrides.status ?? statusFilter,
        sort: overrides.sort ?? sort,
        page,
        limit: pagination.limit,
      };
      const { data } = await api.get('/categories', { params });
      const normalized = normalizeResponse(data, page, pagination.limit);
      setCategories(normalized.items);
      setPagination(normalized.pagination);
    } catch (err) {
      setError(parseApiError(err, 'CATEGORY-E-001'));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const pageStart = useMemo(() => ((pagination.page || 1) - 1) * (pagination.limit || 5), [pagination]);

  const handleSearch = () => {
    const nextKeyword = searchDraft.trim();
    setKeyword(nextKeyword);
    load(1, { keyword: nextKeyword });
  };

  const resetFilters = () => {
    setSearchDraft('');
    setKeyword('');
    setStatusFilter('all');
    setSort('created_at_desc');
    load(1, { keyword: '', status: 'all', sort: 'created_at_desc' });
  };

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
        params: { keyword: keyword.trim(), status: statusFilter, sort, page: 1, limit: exportLimit },
      });
      const firstPage = normalizeResponse(firstResponse.data, 1, exportLimit);
      let items = [...firstPage.items];
      for (let page = 2; page <= (firstPage.pagination.totalPages || 1); page += 1) {
        const { data } = await api.get('/categories', {
          params: { keyword: keyword.trim(), status: statusFilter, sort, page, limit: exportLimit },
        });
        items = [...items, ...normalizeResponse(data, page, exportLimit).items];
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
      load(pagination.page);
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
      load(pagination.page);
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
      load(pagination.page);
    } catch (err) {
      setError(parseApiError(err, 'CATEGORY-E-003'));
    } finally {
      setDeleting(false);
    }
  };

  const changePage = (page) => { if (!busy && page >= 1 && page <= pagination.totalPages) load(page); };

  return (
    <AdminLayout title="Quản Lý Danh Mục">
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tìm kiếm</label>
            <input value={searchDraft} onChange={(e) => setSearchDraft(e.target.value.slice(0, 100))} onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} disabled={busy} placeholder="Tên hoặc slug" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Trạng thái</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} disabled={busy} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100">
              <option value="all">Tất cả</option><option value="active">Đang hiển thị</option><option value="hidden">Đã ẩn</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Sắp xếp</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} disabled={busy} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100">
              <option value="created_at_desc">Mới tạo trước</option><option value="name_asc">Tên A-Z</option><option value="post_count_desc">Nhiều bài nhất</option><option value="view_count_desc">Nhiều lượt xem nhất</option><option value="latest_post_desc">Bài mới nhất</option>
            </select>
          </div>
          <div className="flex gap-2 md:col-span-2">
            <button type="button" onClick={handleSearch} disabled={busy} className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium">Search</button>
            <button type="button" onClick={resetFilters} disabled={busy} className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">Reset</button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500">Kết quả theo điều kiện hiện tại: <span className="font-medium text-gray-700">{pagination.totalItems}</span> danh mục</p>
          <div className="flex gap-2">
            <button type="button" onClick={exportCsv} disabled={busy} className="bg-emerald-50 hover:bg-emerald-100 disabled:opacity-60 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium">{exporting ? 'Đang export...' : 'Export CSV'}</button>
            <button type="button" onClick={() => { setAddError(''); setAddForm(emptyForm); setAddModalOpen(true); }} disabled={busy} className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Thêm danh mục</button>
          </div>
        </div>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        {success && <p className="text-sm text-green-600 mb-3">{success}</p>}
      </div>

      {addModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Thêm danh mục mới</h2>
                <p className="text-sm text-gray-500 mt-1">Sau khi tạo xong, danh sách sẽ reload theo điều kiện search hiện tại.</p>
              </div>
              <button type="button" onClick={() => setAddModalOpen(false)} disabled={adding} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
        {addError && <p className="text-sm text-red-600 mb-3">{addError}</p>}
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-end">
          <div className="flex-1 min-w-36">
            <label className="block text-xs text-gray-500 mb-1">Tên *</label>
            <input name="name" value={addForm.name} onChange={handleAddChange} placeholder="Du lịch" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="flex-1 min-w-36">
            <label className="block text-xs text-gray-500 mb-1">Slug *</label>
            <input name="slug" value={addForm.slug} onChange={handleAddChange} placeholder="du-lich" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Mô tả</label>
            <input name="description" value={addForm.description} onChange={handleAddChange} placeholder="Mô tả ngắn..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div><label className="block text-xs text-gray-500 mb-1">Trạng thái</label><select name="status" value={addForm.status} onChange={handleAddChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"><option value="active">Đang hiển thị</option><option value="hidden">Ẩn</option></select></div>
          <div><label className="block text-xs text-gray-500 mb-1">Thumbnail URL</label><input name="thumbnail_url" value={addForm.thumbnail_url} onChange={handleAddChange} placeholder="/uploads/categories/..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" /></div>
          <div><label className="block text-xs text-gray-500 mb-1">SEO Title</label><input name="seo_title" value={addForm.seo_title} onChange={handleAddChange} maxLength={70} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" /></div>
          <div><label className="block text-xs text-gray-500 mb-1">SEO Description</label><input name="seo_description" value={addForm.seo_description} onChange={handleAddChange} maxLength={160} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" /></div>
          <button type="submit" disabled={!canSubmitAdd} className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
            {adding ? 'Đang thêm...' : 'Thêm'}
          </button>
          <button type="button" onClick={() => setAddModalOpen(false)} disabled={adding} className="bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors">Hủy</button>
        </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Đang tải...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!</div>
        ) : (
          <div className="overflow-x-auto"><table className="w-full text-sm min-w-[1100px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">STT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tên</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Mô tả</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Số bài</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Lượt xem</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Metadata</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{pageStart + idx + 1}</td>
                  {editingId === cat.id ? (
                    <>
                      <td className="px-4 py-2"><input name="name" value={editForm.name} onChange={handleEditChange} className="border border-gray-300 rounded px-2 py-1 w-full text-sm" /></td>
                      <td className="px-4 py-2"><input name="slug" value={editForm.slug} onChange={handleEditChange} className="border border-gray-300 rounded px-2 py-1 w-full text-sm" /></td>
                      <td className="px-4 py-2"><input name="description" value={editForm.description} onChange={handleEditChange} className="border border-gray-300 rounded px-2 py-1 w-full text-sm" /></td>
                      <td className="px-4 py-2"><select name="status" value={editForm.status} onChange={handleEditChange} className="border border-gray-300 rounded px-2 py-1 w-full text-sm"><option value="active">Hiển thị</option><option value="hidden">Ẩn</option></select></td>
                      <td className="px-4 py-2 text-center text-gray-400">{cat.postCount ?? 0} / {cat.publishedPostCount ?? 0}</td>
                      <td className="px-4 py-2 text-center text-gray-400">{cat.viewCount ?? 0}</td>
                      <td className="px-4 py-2 space-y-2"><input name="thumbnail_url" value={editForm.thumbnail_url} onChange={handleEditChange} placeholder="Thumbnail URL" className="border border-gray-300 rounded px-2 py-1 w-full text-xs" /><input name="seo_title" value={editForm.seo_title} onChange={handleEditChange} placeholder="SEO title" className="border border-gray-300 rounded px-2 py-1 w-full text-xs" /><input name="seo_description" value={editForm.seo_description} onChange={handleEditChange} placeholder="SEO description" className="border border-gray-300 rounded px-2 py-1 w-full text-xs" /></td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button onClick={() => handleSave(cat.id)} disabled={saving} className="text-xs bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-3 py-1 rounded-lg">Lưu</button>
                        <button onClick={cancelEdit} disabled={saving} className="text-xs bg-gray-200 hover:bg-gray-300 disabled:opacity-60 text-gray-700 px-3 py-1 rounded-lg">Hủy</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium text-gray-800">{cat.name}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                      <td className="px-4 py-3 text-gray-500 truncate max-w-xs">{cat.description || '—'}</td>
                      <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${cat.status === 'hidden' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>{cat.status === 'hidden' ? 'Ẩn' : 'Hiển thị'}</span></td>
                      <td className="px-4 py-3 text-center text-gray-600"><span>{cat.postCount ?? 0}</span><span className="text-gray-400"> / {cat.publishedPostCount ?? 0} publish</span></td>
                      <td className="px-4 py-3 text-center text-gray-600">{cat.viewCount ?? 0}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs"><div>Người tạo: {cat.createdByName || '—'}</div><div>Bài mới nhất: {cat.latestPost?.title || '—'}</div><div>Cập nhật: {formatDate(cat.updated_at)}</div></td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => setDetailCategory(cat)} disabled={busy} className="text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 px-3 py-1 rounded-lg">Xem</button>
                        <button onClick={() => startEdit(cat)} disabled={busy} className="text-xs bg-blue-50 hover:bg-blue-100 disabled:opacity-60 text-blue-600 px-3 py-1 rounded-lg">Sửa</button>
                        <button onClick={() => setDeleteModal({ open: true, id: cat.id, name: cat.name })} disabled={busy} className="text-xs bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-600 px-3 py-1 rounded-lg">Xóa mềm</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-sm text-gray-600">
          <p>Trang {pagination.page} / {pagination.totalPages} · {pagination.totalItems} danh mục</p>
          <div className="flex gap-2">
            <button onClick={() => changePage(pagination.page - 1)} disabled={busy || pagination.page <= 1} className="px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50">Trước</button>
            <button onClick={() => changePage(pagination.page + 1)} disabled={busy || pagination.page >= pagination.totalPages} className="px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50">Sau</button>
          </div>
        </div>
      )}

      {/* Delete modal */}
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
    </AdminLayout>
  );
}
