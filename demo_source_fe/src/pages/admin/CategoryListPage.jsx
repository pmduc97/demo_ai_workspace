import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function CategoryListPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const load = () => api.get('/categories').then((r) => setItems(r.data.items || []));
  useEffect(() => { load(); }, []);

  const create = async () => {
    await api.post('/categories', { name, slug });
    setName(''); setSlug('');
    load();
  };

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-2xl font-bold">Categories</h1>
      <div className="flex gap-2"><input className="border p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><input className="border p-2" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} /><button className="border px-3" onClick={create}>Add</button></div>
      <ul>{items.map((c) => <li key={c.id}>{c.name} ({c.slug})</li>)}</ul>
    </div>
  );
}
