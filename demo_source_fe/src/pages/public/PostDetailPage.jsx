import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

export default function PostDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => { api.get(`/posts/${slug}`).then((r) => setPost(r.data)); }, [slug]);
  if (!post) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
    </div>
  );
}
