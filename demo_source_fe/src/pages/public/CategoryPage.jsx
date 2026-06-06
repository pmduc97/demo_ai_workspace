import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import PostCard from '../../components/PostCard';

export default function CategoryPage() {
  const { slug } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.get(`/posts?category=${slug}`).then((r) => {
      if (mounted) setItems(r.data.items || []);
    });
    return () => { mounted = false; };
  }, [slug]);

  return <div className="p-4 grid gap-3">{items.map((p) => <PostCard key={p.id} post={p} />)}</div>;
}
