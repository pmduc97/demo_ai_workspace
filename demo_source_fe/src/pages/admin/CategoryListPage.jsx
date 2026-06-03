import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const toSlug = (str) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

export default function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addForm, setAddForm] = useState({ name: '', slug: '', description: '' });
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data.items || data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Add
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((f) => ({
      ...f,
      [name]: value,
      ...(name === 'name' ? { slug: toSlug(value) } : {}),
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.slug) { setAddError('Tên và slug là bắt buộc.'); return; }
    setAdding(true); setAddError('');
    try {
      await api.post('/categories', addForm);
      setAddForm({ name: '', slug: '', description: '' });
      load();
    } catch (err) {
      setAddError(err?.response?.data?.message || 'Thêm thất bại.');
    } finally {
      setAdding(false);
    }
  };

  // Edit
  const startEdit = (cat) => { setEditingId(cat.id); setEditForm({ name: cat.name, slug: cat.slug, description: cat.description || '' }); };
  const cancelEdit = () => setEditingId(null);
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  };
  const handleSave = async (id) => {
    try {
      await api.put(`/categories/${id}`, editForm);
      setEditingId(null);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || 'Cập nhật thất bại.');
    }
  };

  // Delete
  const confirmDelete = async () => {
    try {
      await api.delete(`/categories/${deleteModal.id}`);
      setDeleteModal({ open: false, id: null, name: '' });
      load();
    } catch {
      alert('Xóa thất bại.');
    }
  };

  return (
    <AdminLayout title="Quản Lý Danh Mục">
      {/* Add form */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Thêm Danh Mục Mới</h2>
        {addError && <p className="text-sm text-red-600 mb-3">{addError}</p>}
        <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-36">
            <label className="block text-xs text-gray-500 mb-1">Tên *</label>
            <input name="name" value={addForm.name} onChange={handleAddChange} placeholder="Du lịch" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="flex-1 min-w-36">
            <label className="block text-xs text-gray-500 mb-1">Slug *</label>
            <input name="slug" value={addForm.slug} onChange={handleAddChange} placeholder="du-lich" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="flex-1 min-w-48">
            <label className="block text-xs text-gray-500 mb-1">Mô tả</label>
            <input name="description" value={addForm.description} onChange={handleAddChange} placeholder="Mô tả ngắn..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <button type="submit" disabled={adding} className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
            {adding ? 'Đang thêm...' : 'Thêm'}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Đang tải...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">STT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tên</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Mô tả</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Số bài</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                  {editingId === cat.id ? (
                    <>
                      <td className="px-4 py-2"><input name="name" value={editForm.name} onChange={handleEditChange} className="border border-gray-300 rounded px-2 py-1 w-full text-sm" /></td>
                      <td className="px-4 py-2"><input name="slug" value={editForm.slug} onChange={handleEditChange} className="border border-gray-300 rounded px-2 py-1 w-full text-sm" /></td>
                      <td className="px-4 py-2"><input name="description" value={editForm.description} onChange={handleEditChange} className="border border-gray-300 rounded px-2 py-1 w-full text-sm" /></td>
                      <td className="px-4 py-2 text-center text-gray-400">{cat.postCount ?? 0}</td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button onClick={() => handleSave(cat.id)} className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg">Lưu</button>
                        <button onClick={cancelEdit} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg">Hủy</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium text-gray-800">{cat.name}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                      <td className="px-4 py-3 text-gray-500 truncate max-w-xs">{cat.description || '—'}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{cat.postCount ?? 0}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => startEdit(cat)} className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-lg">Sửa</button>
                        <button onClick={() => setDeleteModal({ open: true, id: cat.id, name: cat.name })} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-lg">Xóa</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-gray-800 mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-gray-600 mb-5">Xóa danh mục <strong>"{deleteModal.name}"</strong>? Các bài viết thuộc danh mục sẽ không còn danh mục.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteModal({ open: false, id: null, name: '' })} className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">Hủy</button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
