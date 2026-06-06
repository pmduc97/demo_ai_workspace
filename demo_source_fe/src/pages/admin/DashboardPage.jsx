import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import api, { parseApiError } from '../../services/api';

const fallbackStats = {
  totalPosts: 0,
  publishedPosts: 0,
  draftPosts: 0,
  totalCategories: 0,
};

const statusLabel = {
  published: 'Đã xuất bản',
  draft: 'Bản nháp',
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('vi-VN');
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(fallbackStats);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsRes, postsRes] = await Promise.all([
          api.get('/admin/stats'),
          user?.role === 'admin' ? api.get('/admin/posts') : api.get('/posts/my'),
        ]);

        if (!mounted) return;
        const postItems = Array.isArray(postsRes.data) ? postsRes.data : (postsRes.data?.items || postsRes.data?.posts || []);
        setStats({ ...fallbackStats, ...statsRes.data });
        setRecentPosts(postItems.slice(0, 5));
      } catch (err) {
        if (!mounted) return;
        setError(parseApiError(err, 'Không thể tải dashboard'));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();
    return () => { mounted = false; };
  }, [user?.role]);

  const cards = [
    { label: 'Tổng bài viết', value: stats.totalPosts, icon: '📄', color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50', text: 'text-sky-700' },
    { label: 'Đã xuất bản', value: stats.publishedPosts, icon: '✅', color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    { label: 'Bản nháp', value: stats.draftPosts, icon: '📝', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-700' },
    { label: 'Danh mục', value: stats.totalCategories, icon: '🏷️', color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-700' },
  ];

  return (
    <AdminLayout title="Dashboard quản trị">
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-white shadow-lg">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/20" />
          <div className="absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/10" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Xin chào, {user?.name || 'Admin'}</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Trung tâm quản trị Blog Du Lịch</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/85">Theo dõi nội dung, duyệt bài viết, quản lý danh mục và người dùng từ một màn hình tổng quan.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/admin/posts/new" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm hover:bg-amber-50">Tạo bài viết</Link>
              {user?.role === 'admin' && <Link to="/admin/categories" className="rounded-xl bg-black/20 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-black/30">Quản lý danh mục</Link>}
            </div>
          </div>
        </section>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-xl shadow-sm`}>{card.icon}</div>
                <span className={`rounded-full ${card.bg} px-3 py-1 text-xs font-semibold ${card.text}`}>{loading ? '...' : 'Live'}</span>
              </div>
              <p className="mt-5 text-sm font-medium text-gray-500">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{loading ? '—' : card.value}</p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Bài viết gần đây</h3>
                <p className="text-sm text-gray-500">5 bài mới nhất cần theo dõi</p>
              </div>
              <Link to="/admin/posts" className="text-sm font-semibold text-amber-600 hover:text-amber-700">Xem tất cả</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold">Tiêu đề</th>
                    <th className="px-5 py-3 text-left font-semibold">Danh mục</th>
                    <th className="px-5 py-3 text-left font-semibold">Trạng thái</th>
                    <th className="px-5 py-3 text-left font-semibold">Ngày tạo</th>
                    <th className="px-5 py-3 text-right font-semibold">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td className="px-5 py-4"><div className="h-4 w-48 animate-pulse rounded bg-gray-100" /></td>
                        <td className="px-5 py-4"><div className="h-4 w-24 animate-pulse rounded bg-gray-100" /></td>
                        <td className="px-5 py-4"><div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" /></td>
                        <td className="px-5 py-4"><div className="h-4 w-24 animate-pulse rounded bg-gray-100" /></td>
                        <td className="px-5 py-4" />
                      </tr>
                    ))
                  ) : recentPosts.length === 0 ? (
                    <tr><td colSpan="5" className="px-5 py-10 text-center text-gray-400">Chưa có bài viết nào</td></tr>
                  ) : recentPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-medium text-gray-800">{post.title}</td>
                      <td className="px-5 py-4 text-gray-500">{post.categoryName || post.category_name || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{statusLabel[post.status] || post.status}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{formatDate(post.created_at)}</td>
                      <td className="px-5 py-4 text-right"><Link to={`/admin/posts/${post.id}/edit`} className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100">Sửa</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Lối tắt quản trị</h3>
              <div className="mt-4 grid gap-3">
                <Link to="/admin/posts" className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-amber-300 hover:bg-amber-50">📝 Quản lý bài viết</Link>
                {user?.role === 'admin' && <Link to="/admin/categories" className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-amber-300 hover:bg-amber-50">🗂️ Quản lý danh mục</Link>}
                {user?.role === 'admin' && <Link to="/admin/users" className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-amber-300 hover:bg-amber-50">👥 Quản lý người dùng</Link>}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="text-base font-semibold text-amber-900">Gợi ý vận hành</h3>
              <ul className="mt-3 space-y-2 text-sm text-amber-800">
                <li>• Kiểm tra bài nháp và duyệt nội dung mới mỗi ngày.</li>
                <li>• Ẩn danh mục chưa sẵn sàng thay vì xóa dữ liệu.</li>
                <li>• Theo dõi số lượt xem để tối ưu nội dung nổi bật.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
