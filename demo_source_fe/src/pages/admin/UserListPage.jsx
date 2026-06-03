import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AVATAR_COLORS = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400', 'bg-pink-400'];

export default function UserListPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleModal, setRoleModal] = useState({ open: false, userId: null, userName: '', newRole: '' });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.items || data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openRoleModal = (u, newRole) => {
    setRoleModal({ open: true, userId: u.id, userName: u.name, newRole });
  };

  const confirmRoleChange = async () => {
    try {
      await api.patch(`/admin/users/${roleModal.userId}/role`, { role: roleModal.newRole });
      setRoleModal({ open: false, userId: null, userName: '', newRole: '' });
      load();
    } catch {
      alert('Đổi role thất bại.');
    }
  };

  const formatDate = (str) => {
    if (!str) return '—';
    return new Date(str).toLocaleDateString('vi-VN');
  };

  return (
    <AdminLayout title={`Quản Lý Người Dùng${!loading ? ` — ${users.length} người dùng` : ''}`}>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Đang tải...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Chưa có người dùng nào.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Người dùng</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Số bài</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ngày tham gia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => {
                const isSelf = u.id === currentUser?.id;
                const avatarColor = AVATAR_COLORS[u.id % AVATAR_COLORS.length];
                return (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3 text-center">
                      {isSelf ? (
                        <span title="Không thể đổi role của chính mình" className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-not-allowed opacity-70 ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {u.role === 'admin' ? 'Admin' : 'Member'}
                        </span>
                      ) : (
                        <button
                          onClick={() => openRoleModal(u, u.role === 'admin' ? 'member' : 'admin')}
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80 ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
                        >
                          {u.role === 'admin' ? 'Admin' : 'Member'}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{u.postCount ?? 0}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(u.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Role confirm modal */}
      {roleModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-gray-800 mb-2">Xác nhận đổi role</h3>
            <p className="text-sm text-gray-600 mb-5">
              Đổi role của <strong>{roleModal.userName}</strong> thành <strong>{roleModal.newRole === 'admin' ? 'Admin' : 'Member'}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRoleModal({ open: false, userId: null, userName: '', newRole: '' })} className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">Hủy</button>
              <button onClick={confirmRoleChange} className="px-4 py-2 text-sm rounded-lg bg-amber-500 hover:bg-amber-600 text-white">Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
