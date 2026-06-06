import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItem = 'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity';
  const activeClass = 'bg-amber-100 text-amber-700';
  const inactiveClass = 'text-gray-600 hover:bg-gray-100';

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 z-30 flex flex-col transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:z-auto`}
      >
        <div className="px-5 py-4 border-b border-gray-200">
          <span className="text-xl font-bold text-amber-600">Blog Du Lịch</span>
          <p className="text-xs text-gray-400 mt-0.5">Quản lý nội dung</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavLink to="/admin/dashboard" className={({ isActive }) => `${navItem} ${isActive ? activeClass : inactiveClass}`}>
            <span>📊</span> Dashboard
          </NavLink>
          <NavLink to="/admin/posts" className={({ isActive }) => `${navItem} ${isActive ? activeClass : inactiveClass}`}>
            <span>📝</span> Bài viết
          </NavLink>
          {user?.role === 'admin' && (
            <>
              <NavLink to="/admin/categories" className={({ isActive }) => `${navItem} ${isActive ? activeClass : inactiveClass}`}>
                <span>🗂️</span> Danh mục
              </NavLink>
              <NavLink to="/admin/tags" className={({ isActive }) => `${navItem} ${isActive ? activeClass : inactiveClass}`}>
                <span>🏷️</span> Tags
              </NavLink>
              <NavLink to="/admin/users" className={({ isActive }) => `${navItem} ${isActive ? activeClass : inactiveClass}`}>
                <span>👥</span> Người dùng
              </NavLink>
            </>
          )}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-opacity"
          >
            <span>🚪</span> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold text-gray-800 flex-1">{title}</h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
