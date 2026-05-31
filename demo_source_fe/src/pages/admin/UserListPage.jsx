import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function UserListPage() {
  const [items, setItems] = useState([]);
  const load = () => api.get('/admin/users').then((r) => setItems(r.data.items || []));
  useEffect(() => { load(); }, []);

  const updateRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role });
    load();
  };

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-2xl font-bold">Users</h1>
      <ul className="space-y-2">{items.map((u) => <li className="border p-2" key={u.id}>{u.email} - {u.role} <button className="border px-2 ml-2" onClick={() => updateRole(u.id, u.role === 'admin' ? 'member' : 'admin')}>Toggle role</button></li>)}</ul>
    </div>
  );
}
