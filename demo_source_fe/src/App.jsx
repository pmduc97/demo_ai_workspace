import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/public/HomePage';
import CategoryPage from './pages/public/CategoryPage';
import PostDetailPage from './pages/public/PostDetailPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import PostListPage from './pages/admin/PostListPage';
import PostFormPage from './pages/admin/PostFormPage';
import CategoryListPage from './pages/admin/CategoryListPage';
import UserListPage from './pages/admin/UserListPage';

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/post/:slug" element={<PostDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/admin/posts" element={<ProtectedRoute><PostListPage /></ProtectedRoute>} />
        <Route path="/admin/posts/new" element={<ProtectedRoute><PostFormPage /></ProtectedRoute>} />
        <Route path="/admin/posts/:id/edit" element={<ProtectedRoute><PostFormPage /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute role="admin"><CategoryListPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="admin"><UserListPage /></ProtectedRoute>} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}
