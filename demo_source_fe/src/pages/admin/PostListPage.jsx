import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { parseApiError } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useMasterData } from '../../hooks/useMasterData';
import AdminPageLayout from '../../components/layout/AdminPageLayout';
import DataToolbar from '../../components/ui/DataToolbar';
import DataTable from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import ConfirmModal from '../../components/ui/ConfirmModal';
import ErrorBanner from '../../components/ui/ErrorBanner';
import Toast from '../../components/ui/Toast';

const toSlug = (str) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

const emptyCreateForm = { title: '', slug: '', content: '', status: 'draft', category_id: '', thumbnail_url: '' };

export default function PostListPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', data: null });
  const [detailPost, setDetailPost] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchPosts = React.useCallback(async (params) => {
    const endpoint = user?.role === 'admin' ? '/admin/posts' : '/posts/my';
    const { data } = await api.get(endpoint, {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.keyword,
        category_id: params.category_id,
        status: params.status,
        author_id: params.author_id,
        sort_by: params.sortField,
        sort_order: params.sortOrder,
      }
    });
    // /posts/my returns { posts, total }, /admin/posts returns { items, total }
    return { data: data.items || data.posts || [], total: data.total || 0 };
  }, [user?.role]);

  const {
    data: items,
    total,
    loading,
    error,
    page,
    limit,
    filters,
    sort,
    fetchData,
    handlePageChange,
    handleLimitChange,
    handleFilterChange,
    handleSortChange,
  } = useMasterData(
    fetchPosts,
    { keyword: '', category_id: '', status: '', author_id: '' },
    { field: 'created_at', order: 'desc' },
    10
  );

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories', { params: { status: user?.role === 'admin' ? 'all' : 'active' } });
      setCategories(data.items || []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchAuthors = async () => {
    if (user?.role !== 'admin') return;
    try {
      const { data } = await api.get('/admin/users', { params: { role: 'all' } });
      setAuthors(data.items || []);
    } catch (err) {
      console.error('Failed to fetch authors', err);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) fetchCategories();
    if (mounted) fetchAuthors();
    return () => { mounted = false; };
  }, [user?.role]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleDelete = async (id) => {
    try {
      const endpoint = user?.role === 'admin' ? `/admin/posts/${id}` : `/posts/${id}`;
      await api.delete(endpoint);
      showToast('Deleted', 'success');
      fetchData();
    } catch (err) {
      showToast(parseApiError(err), 'error');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    try {
      if (user?.role === 'admin') {
        await api.put(`/admin/posts/${id}/status`, { status: newStatus });
      } else {
        await api.put(`/posts/${id}`, { status: newStatus });
      }
      showToast('Đổi trạng thái bài viết thành công', 'success');
      fetchData();
    } catch (err) {
      showToast(parseApiError(err), 'error');
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateError('');
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'title' ? { slug: toSlug(value) } : {}),
    }));
  };

  const createPost = async (e) => {
    e.preventDefault();
    if (createForm.title.trim().length < 5 || !createForm.slug || !createForm.content.trim() || !createForm.category_id) {
      setCreateError('Vui lòng nhập đầy đủ tiêu đề, slug, nội dung và danh mục');
      return;
    }
    setCreating(true);
    setCreateError('');
    try {
      await api.post('/posts', {
        ...createForm,
        category_id: Number(createForm.category_id),
        thumbnail_url: createForm.thumbnail_url.trim() || null,
      });
      setCreateOpen(false);
      setCreateForm(emptyCreateForm);
      showToast('Tạo bài viết thành công', 'success');
      fetchData();
    } catch (err) {
      setCreateError(parseApiError(err));
    } finally {
      setCreating(false);
    }
  };

  const exportCsv = () => {
    const header = ['id', 'title', 'slug', 'category', 'author', 'status', 'view_count', 'created_at'];
    const csv = [
      header.join(','),
      ...items.map((post) => [
        post.id,
        post.title,
        post.slug,
        post.category?.name || '',
        post.author?.name || '',
        post.status,
        post.view_count || 0,
        post.created_at || '',
      ].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admin-posts.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const confirmAction = () => {
    const { type, data } = confirmModal;
    if (type === 'delete') handleDelete(data);
    setConfirmModal({ isOpen: false, type: '', data: null });
  };

  const postColumns = [
    {
      key: 'post',
      label: 'Bài viết',
      sortable: false,
      render: (post) => (
        <div className="flex items-center gap-3">
          {post.thumbnail_url ? (
            <img src={post.thumbnail_url} alt={post.title} className="w-12 h-12 object-cover rounded" />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">No img</div>
          )}
          <div>
            <div className="font-medium text-gray-900 line-clamp-1">{post.title}</div>
            <div className="text-xs text-gray-500">{post.slug}</div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Danh mục',
      sortable: false,
      render: (post) => post.category?.name || '-'
    },
    {
      key: 'status',
      label: 'Trạng thái',
      sortable: false,
      render: (post) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {post.status}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Thao tác',
      sortable: false,
      render: (post) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => setDetailPost(post)} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200">Xem</button>
          <a
            href={`/posts/${post.slug}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
          >
            Preview
          </a>
          <Link to={`/admin/posts/${post.id}/edit`} className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100">
            Sửa
          </Link>
          <button
            onClick={() => handleToggleStatus(post.id, post.status)}
            className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
          >
            {post.status === 'draft' ? 'Publish' : 'Draft'}
          </button>
          <button
            onClick={() => setConfirmModal({ isOpen: true, type: 'delete', data: post.id })}
            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
          >
            Xóa
          </button>
        </div>
      )
    }
  ];

  const customFilters = (
    <>
      <select value={filters.category_id} onChange={(e) => handleFilterChange({ category_id: e.target.value })} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
        <option value="">Tất cả danh mục</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <select value={filters.status} onChange={(e) => handleFilterChange({ status: e.target.value })} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
        <option value="">Tất cả trạng thái</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
      {user?.role === 'admin' && (
        <select value={filters.author_id} onChange={(e) => handleFilterChange({ author_id: e.target.value })} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="">Tất cả tác giả</option>
          {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      )}
    </>
  );

  const headerActions = (
    <>
      <button type="button" onClick={exportCsv} disabled={loading || items.length === 0} className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50">Export CSV</button>
      <button type="button" onClick={() => { setCreateError(''); setCreateForm(emptyCreateForm); setCreateOpen(true); }} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">
        + Tạo mới
      </button>
    </>
  );

  return (
    <AdminPageLayout title="Quản Lý Bài Viết" headerActions={headerActions}>
      <div className="space-y-4">
        <ErrorBanner message={error} />

        <DataToolbar
          searchPlaceholder="Tìm kiếm tiêu đề..."
          onSearch={(keyword) => handleFilterChange({ keyword })}
          customFilters={customFilters}
        />

        <DataTable
          columns={postColumns}
          data={items}
          loading={loading}
          sort={sort}
          onSort={handleSortChange}
          emptyMessage={filters.keyword || filters.category_id || filters.status || filters.author_id 
            ? 'Không tìm thấy bài viết phù hợp với bộ lọc.' 
            : 'Chưa có bài viết nào.'}
        />

        <Pagination
          page={page}
          total={total}
          limit={limit}
          onPageChange={handlePageChange}
        />
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn xóa bài viết này?"
        isDanger={confirmModal.type === 'delete'}
        onConfirm={confirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: '', data: null })}
      />
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="font-semibold text-gray-800">Tạo mới bài viết</h3>
              <button onClick={() => !creating && setCreateOpen(false)} className="text-xl leading-none text-gray-400 hover:text-gray-600">×</button>
            </div>
            {createError && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{createError}</p>}
            <form onSubmit={createPost} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input name="title" value={createForm.title} onChange={handleCreateChange} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Tiêu đề bài viết" />
                <input name="slug" value={createForm.slug} onChange={handleCreateChange} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="slug-bai-viet" />
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <select name="category_id" value={createForm.category_id} onChange={handleCreateChange} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
                <select name="status" value={createForm.status} onChange={handleCreateChange} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <input name="thumbnail_url" value={createForm.thumbnail_url} onChange={handleCreateChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Thumbnail URL" />
              <textarea name="content" value={createForm.content} onChange={handleCreateChange} className="min-h-48 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Nội dung bài viết" />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setCreateOpen(false)} disabled={creating} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 disabled:opacity-60">Hủy</button>
                <button type="submit" disabled={creating} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60">{creating ? 'Đang tạo...' : 'Tạo mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {detailPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="font-semibold text-gray-800">Chi tiết bài viết</h3>
              <button onClick={() => setDetailPost(null)} className="text-xl leading-none text-gray-400 hover:text-gray-600">×</button>
            </div>
            <div className="grid gap-4 text-sm md:grid-cols-2">
              <div className="space-y-1 rounded-lg bg-gray-50 p-4"><p><strong>Tiêu đề:</strong> {detailPost.title}</p><p><strong>Slug:</strong> {detailPost.slug}</p><p><strong>Trạng thái:</strong> {detailPost.status}</p><p><strong>Lượt xem:</strong> {detailPost.view_count || 0}</p></div>
              <div className="space-y-1 rounded-lg bg-gray-50 p-4"><p><strong>Danh mục:</strong> {detailPost.category?.name || '—'}</p><p><strong>Tác giả:</strong> {detailPost.author?.name || '—'}</p><p><strong>Email:</strong> {detailPost.author?.email || '—'}</p><p><strong>Ngày tạo:</strong> {detailPost.created_at ? new Date(detailPost.created_at).toLocaleString('vi-VN') : '—'}</p></div>
              <div className="space-y-1 rounded-lg bg-gray-50 p-4 md:col-span-2"><p><strong>Thumbnail:</strong> {detailPost.thumbnail_url || '—'}</p><p><strong>Cập nhật:</strong> {detailPost.updated_at ? new Date(detailPost.updated_at).toLocaleString('vi-VN') : '—'}</p></div>
            </div>
          </div>
        </div>
      )}
      
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </AdminPageLayout>
  );
}
