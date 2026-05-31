import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function PostListPage() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/admin/posts').then((r) => setItems(r.data.items || [])); }, []);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link className="border px-3 py-1" to="/admin/posts/new">New</Link>
      </div>
      <ul className="space-y-2">{items.map((p) => <li key={p.id} className="border p-2"><Link to={`/admin/posts/${p.id}/edit`}>{p.title}</Link> ({p.status})</li>)}</ul>
    </div>
  );
}
