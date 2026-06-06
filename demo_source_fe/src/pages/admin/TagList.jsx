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

const emptyForm = { name: '', slug: '', description: '' };

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('vi-VN');
};

export default function TagList() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });

  const fetchTags = React.useCallback(async (params) => {
    const { data } = await api.get('/tags', {
      params: {
        page: params.page,
        limit: params.limit,
        keyword: params.keyword,
      }
    });
    const items = Array.isArray(data) ? data : data?.items || [];
    return { data: items, total: data?.pagination?.totalItems || items.length };
  }, []);

  const {
    data: tags,
    total,
    loading,
    page,
    limit,
    filters,
    fetchData: load,
    handlePageChange,
    handleFilterChange,
  } = useMasterData(fetchTags, { keyword: '' }, { field: 'created_at', order: 'desc' }, 10);

  const busy = loading || adding || saving || deleting;
  const canSubmitAdd = addForm.name.trim().length >= 2 && addForm.slug.trim().length > 0 && !adding;

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
    if (!canSubmitAdd) { setAddError(getMessage('TAG-E-001')); return; }
    setAdding(true); setAddError(''); setSuccess('');
    try {
      await api.post('/tags', addForm);
      setAddForm(emptyForm);
      setAddModalOpen(false);
      setSuccess(getMessage('TAG-S-001'));
      load();
    } catch (err) {
      setAddError(parseApiError(err, 'TAG-E-001'));
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (tag) => {
    setEditingId(tag.id);
    setEditForm({
      name: tag.name || '', slug: tag.slug || '', description: tag.description || ''
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
      await api.put(`/tags/${id}`, editForm);
      setEditingId(null);
      setSuccess(getMessage('TAG-S-002'));
      load();
    } catch (err) {
      setError(parseApiError(err, 'TAG-E-001'));
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const confirmDelete = async () => {
    setDeleting(true); setError(''); setSuccess('');
    try {
      await api.delete(`/tags/${deleteModal.id}`);
      setDeleteModal({ open: false, id: null, name: '' });
      setSuccess(getMessage('TAG-S-003'));
      load();
    } catch (err) {
      setError(parseApiError(err, 'TAG-E-001'));
    } finally {
      setDeleting(false);
    }
  };

  const tagColumns = [
    {
      key: 'id',
      label: 'ID',
      sortable: false,
      render: (tag) => <span className="text-gray-500 text-xs">{tag.id}</span>
    },
    {
      key: 'name',
      label: 'Tên',
      sortable: false,
      render: (tag) => editingId === tag.id ? <input name="name" value={editForm.name} onChange={handleEditChange} className="border border-gray-300 rounded px-2 py-1 w-full text-sm" /> : <span className="font-medium text-gray-800">{tag.name}</span>
    },
    {
      key: 'slug',
      label: 'Slug',
      sortable: false,
      render: (tag) => editingId === tag.id ? <input name="slug" value={editForm.slug} onChange={handleEditChange} className="border border-gray-300 rounded px-2 py-1 w-full text-sm" /> : <span className="text-gray-500 font-mono text-xs">{tag.slug}</span>
    },
    {
      key: 'description',
      label: 'Mô tả',
      sortable: false,
      render: (tag) => editingId === tag.id ? <input name="description" value={editForm.description} onChange={handleEditChange} className="border border-gray-300 rounded px-2 py-1 w-full text-sm" /> : <span className="text-gray-600 text-sm">{tag.description || '—'}</span>
    },
    {
      key: 'created_at',
      label: 'Ngày tạo',
      sortable: false,
      render: (tag) => <span className="text-gray-500 text-sm">{formatDate(tag.created_at)}</span>
    },
    {
      key: 'actions',
      label: 'Hành động',
      sortable: false,
      render: (tag) => editingId === tag.id ? (
        <div className="flex justify-end gap-2">
          <button onClick={() => handleSave(tag.id)} disabled={saving} className="text-xs bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-3 py-1 rounded-lg">Lưu</button>
          <button onClick={cancelEdit} disabled={saving} className="text-xs bg-gray-200 hover:bg-gray-300 disabled:opacity-60 text-gray-700 px-3 py-1 rounded-lg">Hủy</button>
        </div>
      ) : (
        <div className="flex justify-end gap-2">
          <button onClick={() => startEdit(tag)} disabled={busy} className="text-xs font-medium bg-amber-50 hover:bg-amber-100 disabled:opacity-60 text-amber-700 px-3 py-1.5 rounded-lg">Sửa</button>
          <button onClick={() => setDeleteModal({ open: true, id: tag.id, name: tag.name })} disabled={busy} className="text-xs font-medium bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-600 px-3 py-1.5 rounded-lg">Xóa</button>
        </div>
      )
    }
  ];

  const headerActions = (
    <button type="button" onClick={() => { setAddError(''); setAddForm(emptyForm); setAddModalOpen(true); }} disabled={busy} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60">+ Tạo mới</button>
  );

  return (
    <AdminPageLayout title="Quản Lý Tags" headerActions={headerActions}>
      <div className="space-y-4">
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        {success && <p className="text-sm text-green-600 mb-3">{success}</p>}

        <DataToolbar
          searchPlaceholder="Tên hoặc slug"
          onSearch={(keyword) => handleFilterChange({ keyword })}
        />

        <DataTable
          columns={tagColumns}
          data={tags}
          loading={loading}
          emptyMessage={getMessage('TAG-I-001')}
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
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-4 mb-4">
              <h3 className="font-semibold text-gray-800">Thêm Tag</h3>
              <button onClick={() => !adding && setAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            {addError && <p className="text-sm text-red-600 mb-3">{addError}</p>}
            <form onSubmit={handleAdd} className="space-y-3">
              <input name="name" value={addForm.name} onChange={handleAddChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Tên tag" />
              <input name="slug" value={addForm.slug} onChange={handleAddChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="slug-tag" />
              <textarea name="description" value={addForm.description} onChange={handleAddChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Mô tả" />
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setAddModalOpen(false)} disabled={adding} className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700">Hủy</button>
                <button type="submit" disabled={!canSubmitAdd} className="px-4 py-2 text-sm rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white">{adding ? 'Đang thêm...' : 'Thêm Tag'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-gray-800 mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-gray-600 mb-5">{getMessage('TAG-C-001')}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteModal({ open: false, id: null, name: '' })} disabled={deleting} className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700">Hủy</button>
              <button onClick={confirmDelete} disabled={deleting} className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white">{deleting ? 'Đang xóa...' : 'Xóa'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
}
