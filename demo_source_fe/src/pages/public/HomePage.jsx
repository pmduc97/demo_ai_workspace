import { useEffect, useState } from 'react';
import api from '../../services/api';
import PostCard from '../../components/PostCard';

export default function HomePage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get('/posts').then((r) => setItems(r.data.items || []));
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Tin moi nhat</h1>
      <div className="grid gap-3">{items.map((p) => <PostCard key={p.id} post={p} />)}</div>
    </div>
  );
}
