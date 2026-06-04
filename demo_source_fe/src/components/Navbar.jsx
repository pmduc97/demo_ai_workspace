import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="sticky top-0 z-40 border-b border-amber-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-bold text-amber-700">Blog Hội An</Link>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
          <Link className="hover:text-amber-700" to="/">Trang chủ</Link>
          <Link className="hover:text-amber-700" to="/about">Giới thiệu</Link>
          <Link className="hover:text-amber-700" to="/contact">Liên hệ</Link>
        </div>
        {user && (
          <div className="ml-auto flex items-center gap-3 text-sm">
            <Link className="rounded-full bg-amber-100 px-4 py-2 font-semibold text-amber-800 hover:bg-amber-200" to="/admin/dashboard">
              Quản trị
            </Link>
            <button className="text-gray-500 hover:text-gray-900" onClick={logout}>Đăng xuất ({user.name})</button>
          </div>
        )}
      </div>
    </nav>
  );
}
