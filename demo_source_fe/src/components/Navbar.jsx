import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="p-4 border-b flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      {user && <Link to="/admin/dashboard">Admin</Link>}
      <div className="ml-auto">
        {user ? <button onClick={logout}>Logout ({user.name})</button> : <Link to="/admin/login">Login</Link>}
      </div>
    </nav>
  );
}
