import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@hoianblog.vn');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      nav('/admin/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit} className="p-4 max-w-md space-y-3">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      {error && <p className="text-red-600">{error}</p>}
      <input className="border p-2 w-full" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="border p-2 w-full" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button className="border px-4 py-2">Login</button>
    </form>
  );
}
