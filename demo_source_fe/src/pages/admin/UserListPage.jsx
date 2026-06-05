import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api, { parseApiError } from '../../services/api';
import { useMasterData } from '../../hooks/useMasterData';
import AdminPageLayout from '../../components/layout/AdminPageLayout';
import DataToolbar from '../../components/ui/DataToolbar';
import DataTable from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';

const AVATAR_COLORS = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400', 'bg-pink-400'];
const blankForm = { name: '', email: '', password: '', role: 'member', status: 'active', phone: '', address: '', avatar_url: '', bio: '', birthdate: '', gender: 'unknown', locked_reason: '' };

export default function UserListPage() {
  const { user: currentUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [detailUser, setDetailUser] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState(blankForm);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(blankForm);
  const [roleModal, setRoleModal] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const fetchUsers = React.useCallback(async (params) => {
    const { data } = await api.get('/admin/users', {
      params: {
        page: params.page,
        limit: params.limit,
        keyword: params.keyword,
        role: params.role !== 'all' ? params.role : undefined,
        status: params.status !== 'all' ? params.status : undefined,
        sort: params.sortField ? `${params.sortField}_${params.sortOrder}` : 'created_at_desc'
      }
    });
    return { data: data.items, total: data.pagination.totalItems };
  }, []);

  const {
    data: users,
    total,
    loading,
    page,
    limit,
    filters,
    sort,
    fetchData: loadUsers,
    handlePageChange,
    handleLimitChange,
    handleFilterChange,
    handleSortChange,
  } = useMasterData(fetchUsers, { keyword: '', role: 'all', status: 'all' }, { field: 'created_at', order: 'desc' }, 5);

  const busy = loading || submitting;

  const showSuccess = (message) => {
    setSuccess(message);
    window.setTimeout(() => setSuccess(''), 2500);
  };

  const openDetail = async (user) => {
    try {
      const { data } = await api.get(`/admin/users/${user.id}`);
      setDetailUser(data);
    } catch (err) {
      setError(parseApiError(err, 'USER-E-003'));
    }
  };

  const openEdit = (user) => {
    setEditUserId(user.id);
    setEditForm({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      avatar_url: user.avatar_url || '',
      bio: user.bio || '',
      birthdate: user.birthdate ? String(user.birthdate).slice(0, 10) : '',
      gender: user.gender || 'unknown',
      email: user.email || '',
      password: '',
      role: user.role || 'member',
      status: user.status || 'active',
      locked_reason: user.locked_reason || '',
    });
  };

  const createUser = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/users', createForm);
      setCreateOpen(false);
      setCreateForm(blankForm);
      showSuccess('Tạo người dùng thành công');
      await loadUsers();
    } catch (err) {
      setError(parseApiError(err, 'USER-E-001'));
    } finally {
      setSubmitting(false);
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/admin/users/${editUserId}`, editForm);
      setEditUserId(null);
      showSuccess('Cập nhật người dùng thành công');
      await loadUsers();
    } catch (err) {
      setError(parseApiError(err, 'USER-E-001'));
    } finally {
      setSubmitting(false);
    }
  };

  const confirmRole = async () => {
    setSubmitting(true);
    try {
      await api.put(`/admin/users/${roleModal.id}/role`, { role: roleModal.nextRole });
      setRoleModal(null);
      showSuccess('Cập nhật role thành công');
      await loadUsers();
    } catch (err) {
      setError(parseApiError(err, 'USER-E-005'));
    } finally {
      setSubmitting(false);
    }
  };

  const confirmStatus = async () => {
    setSubmitting(true);
    try {
      await api.put(`/admin/users/${statusModal.id}/status`, {
        status: statusModal.nextStatus,
        locked_reason: statusModal.locked_reason,
      });
      setStatusModal(null);
      showSuccess('Cập nhật trạng thái tài khoản thành công');
      await loadUsers();
    } catch (err) {
      setError(parseApiError(err, 'USER-E-006'));
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/admin/users/${deleteModal.id}`);
      setDeleteModal(null);
      showSuccess('Xóa người dùng thành công');
      await loadUsers();
    } catch (err) {
      setError(parseApiError(err, 'USER-E-007'));
    } finally {
      setSubmitting(false);
    }
  };

  const exportCsv = () => {
    const header = ['id', 'name', 'email', 'phone', 'address', 'role', 'status', 'postCount'];
    const csv = [
      header.join(','),
      ...users.map((u) => header.map((key) => `"${String(u[key] || '').replaceAll('"', '""')}"`).join(',')),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admin-users.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (value, withTime = false) => {
    if (!value) return '—';
    return new Date(value).toLocaleString('vi-VN', withTime ? { dateStyle: 'short', timeStyle: 'short' } : { dateStyle: 'short' });
  };

  const userColumns = [
    {
      key: 'user',
      label: 'Người dùng',
      sortable: false,
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${AVATAR_COLORS[u.id % AVATAR_COLORS.length]} text-sm font-bold text-white`}>
            {u.avatar_url ? <img src={u.avatar_url} alt={u.name} className="h-10 w-10 rounded-full object-cover" /> : u.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-800">{u.name}</p>
            <p className="max-w-[180px] truncate text-xs text-gray-400">{u.bio || '—'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Liên hệ',
      sortable: false,
      render: (u) => (
        <div className="text-gray-600">
          <p>{u.email}</p>
          <p className="text-xs text-gray-400">{u.phone || '—'} · {u.address || '—'}</p>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (u) => {
        const isSelf = Number(u.id) === Number(currentUser?.id);
        return (
          <button disabled={busy || isSelf} title={isSelf ? 'Không thể đổi role của chính mình' : 'Đổi role'} onClick={() => setRoleModal({ id: u.id, nextRole: u.role === 'admin' ? 'member' : 'admin' })} className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize disabled:cursor-not-allowed disabled:opacity-60 ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</button>
        );
      }
    },
    {
      key: 'status',
      label: 'Trạng thái',
      sortable: true,
      render: (u) => {
        const isSelf = Number(u.id) === Number(currentUser?.id);
        return (
          <button disabled={busy || isSelf} title={isSelf ? 'Không thể khóa tài khoản của chính mình' : 'Đổi trạng thái'} onClick={() => setStatusModal({ id: u.id, nextStatus: u.status === 'locked' ? 'active' : 'locked', locked_reason: '' })} className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize disabled:cursor-not-allowed disabled:opacity-60 ${u.status === 'locked' ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}`}>{u.status || 'active'}</button>
        );
      }
    },
    {
      key: 'actions',
      label: 'Hành động',
      sortable: false,
      render: (u) => {
        const isSelf = Number(u.id) === Number(currentUser?.id);
        return (
          <div className="flex justify-end gap-2">
            <button onClick={() => openDetail(u)} disabled={busy} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50">Xem</button>
            <button onClick={() => openEdit(u)} disabled={busy} className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50">Sửa</button>
            <button onClick={() => setDeleteModal({ id: u.id, name: u.name })} disabled={busy || isSelf} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50">Xóa</button>
          </div>
        );
      }
    }
  ];

  const customFilters = (
    <>
      <select value={filters.role} onChange={(event) => handleFilterChange({ role: event.target.value })} disabled={busy} className="rounded-lg border border-gray-200 px-3 py-2 text-sm"><option value="all">Tất cả role</option><option value="admin">Admin</option><option value="member">Member</option></select>
      <select value={filters.status} onChange={(event) => handleFilterChange({ status: event.target.value })} disabled={busy} className="rounded-lg border border-gray-200 px-3 py-2 text-sm"><option value="all">Tất cả trạng thái</option><option value="active">Active</option><option value="locked">Locked</option></select>
    </>
  );

  const headerActions = (
    <>
      <button onClick={exportCsv} disabled={busy || users.length === 0} className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50">Export CSV</button>
      <button onClick={() => { setCreateForm(blankForm); setCreateOpen(true); }} disabled={busy} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50">+ Tạo mới</button>
    </>
  );

  return (
    <AdminPageLayout title={`Quản Lý Người Dùng — ${total} tài khoản`} headerActions={headerActions}>
      <div className="space-y-4">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {success && <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

        <DataToolbar
          searchPlaceholder="Tìm tên, email, SĐT"
          onSearch={(keyword) => handleFilterChange({ keyword })}
          customFilters={customFilters}
        />

        <DataTable
          columns={userColumns}
          data={users}
          loading={loading}
          sort={sort}
          onSort={handleSortChange}
          emptyMessage={filters.keyword || filters.role !== 'all' || filters.status !== 'all' ? 'Không tìm thấy người dùng phù hợp' : 'Chưa có người dùng nào.'}
        />

        <Pagination
          page={page}
          total={total}
          limit={limit}
          onPageChange={handlePageChange}
        />
      </div>

      {detailUser && <InfoModal title="Chi tiết người dùng" onClose={() => setDetailUser(null)}><UserDetail user={detailUser} formatDate={formatDate} /></InfoModal>}
      {createOpen && <InfoModal title="Tạo người dùng" onClose={() => !submitting && setCreateOpen(false)}><UserForm form={createForm} setForm={setCreateForm} submitting={submitting} onSubmit={createUser} close={() => setCreateOpen(false)} mode="create" /></InfoModal>}
      {editUserId && <InfoModal title="Cập nhật người dùng" onClose={() => !submitting && setEditUserId(null)}><EditForm editForm={editForm} setEditForm={setEditForm} submitting={submitting} saveProfile={saveProfile} close={() => setEditUserId(null)} /></InfoModal>}
      {roleModal && <ConfirmModal title="Xác nhận đổi role" message="Đổi role của người dùng này? Quyền truy cập của họ sẽ thay đổi ở lần xác thực tiếp theo." onCancel={() => setRoleModal(null)} onConfirm={confirmRole} disabled={submitting} confirmText={`Đổi thành ${roleModal.nextRole}`} />}
      {statusModal && <ConfirmModal title="Xác nhận trạng thái" message={statusModal.nextStatus === 'locked' ? 'Khóa tài khoản này? Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa.' : 'Mở khóa tài khoản này? Người dùng có thể đăng nhập lại.'} onCancel={() => setStatusModal(null)} onConfirm={confirmStatus} disabled={submitting || (statusModal.nextStatus === 'locked' && statusModal.locked_reason.trim().length < 5)} confirmText="Xác nhận">{statusModal.nextStatus === 'locked' && <textarea value={statusModal.locked_reason} onChange={(event) => setStatusModal({ ...statusModal, locked_reason: event.target.value })} className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Lý do khóa (tối thiểu 5 ký tự)" />}</ConfirmModal>}
      {deleteModal && <ConfirmModal title="Xác nhận xóa" message={`Xóa mềm người dùng "${deleteModal.name}"?`} onCancel={() => setDeleteModal(null)} onConfirm={confirmDelete} disabled={submitting} confirmText="Xóa" />}
    </AdminPageLayout>
  );
}

function UserForm({ form, setForm, submitting, onSubmit, close, mode }) {
  return <form onSubmit={onSubmit} className="space-y-3"><input required minLength={2} maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Họ tên" /><input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Email" />{mode === 'create' && <input required minLength={6} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Mật khẩu" />}<div className="grid grid-cols-2 gap-3"><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm"><option value="member">Member</option><option value="admin">Admin</option></select><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm"><option value="active">Active</option><option value="locked">Locked</option></select></div>{form.status === 'locked' && <textarea value={form.locked_reason} onChange={(event) => setForm({ ...form, locked_reason: event.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Lý do khóa" />}<EditFields editForm={form} setEditForm={setForm} /><div className="flex justify-end gap-2 pt-2"><button type="button" disabled={submitting} onClick={close} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700">Hủy</button><button disabled={submitting || form.name.trim().length < 2 || !form.email || (mode === 'create' && form.password.length < 6)} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Lưu</button></div></form>;
}

function EditForm({ editForm, setEditForm, submitting, saveProfile, close }) {
  return <form onSubmit={saveProfile} className="space-y-3"><input required minLength={2} maxLength={100} value={editForm.name} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Họ tên" /><EditFields editForm={editForm} setEditForm={setEditForm} /><div className="flex justify-end gap-2 pt-2"><button type="button" disabled={submitting} onClick={close} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700">Hủy</button><button disabled={submitting || editForm.name.trim().length < 2} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Lưu</button></div></form>;
}

function EditFields({ editForm, setEditForm }) {
  return <><input maxLength={20} value={editForm.phone} onChange={(event) => setEditForm({ ...editForm, phone: event.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Số điện thoại" /><textarea maxLength={255} value={editForm.address} onChange={(event) => setEditForm({ ...editForm, address: event.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Địa chỉ" /><input maxLength={255} value={editForm.avatar_url} onChange={(event) => setEditForm({ ...editForm, avatar_url: event.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Avatar URL" /><textarea maxLength={500} value={editForm.bio} onChange={(event) => setEditForm({ ...editForm, bio: event.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Giới thiệu" /><div className="grid grid-cols-2 gap-3"><input type="date" value={editForm.birthdate} onChange={(event) => setEditForm({ ...editForm, birthdate: event.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" /><select value={editForm.gender} onChange={(event) => setEditForm({ ...editForm, gender: event.target.value })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm"><option value="unknown">Không xác định</option><option value="male">Nam</option><option value="female">Nữ</option><option value="other">Khác</option></select></div></>;
}

function InfoModal({ title, children, onClose }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold text-gray-800">{title}</h3><button onClick={onClose} className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100">✕</button></div>{children}</div></div>;
}

function ConfirmModal({ title, message, children, onCancel, onConfirm, disabled, confirmText }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"><div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"><h3 className="mb-2 font-semibold text-gray-800">{title}</h3><p className="text-sm text-gray-600">{message}</p>{children}<div className="mt-5 flex justify-end gap-3"><button disabled={disabled} onClick={onCancel} className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 disabled:opacity-50">Hủy</button><button disabled={disabled} onClick={onConfirm} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{confirmText}</button></div></div></div>;
}

function UserDetail({ user, formatDate }) {
  return <div className="grid gap-4 text-sm md:grid-cols-2"><section className="rounded-lg bg-gray-50 p-4"><h4 className="mb-2 font-semibold text-gray-700">Thông tin cá nhân</h4><p><strong>Tên:</strong> {user.name}</p><p><strong>Email:</strong> {user.email}</p><p><strong>SĐT:</strong> {user.phone || '—'}</p><p><strong>Địa chỉ:</strong> {user.address || '—'}</p><p><strong>Ngày sinh:</strong> {user.birthdate ? String(user.birthdate).slice(0, 10) : '—'}</p><p><strong>Giới tính:</strong> {user.gender || 'unknown'}</p><p><strong>Bio:</strong> {user.bio || '—'}</p></section><section className="rounded-lg bg-gray-50 p-4"><h4 className="mb-2 font-semibold text-gray-700">Tài khoản</h4><p><strong>Role:</strong> {user.role}</p><p><strong>Trạng thái:</strong> {user.status || 'active'}</p><p><strong>Lý do khóa:</strong> {user.locked_reason || '—'}</p><p><strong>Đăng nhập:</strong> {formatDate(user.last_login_at, true)}</p><p><strong>Tham gia:</strong> {formatDate(user.created_at)}</p><p><strong>Cập nhật:</strong> {formatDate(user.updated_at)}</p><p><strong>Bài viết:</strong> {user.postCount || 0} / {user.publishedPostCount || 0} / {user.draftPostCount || 0}</p></section></div>;
}
