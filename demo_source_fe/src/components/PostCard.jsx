import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <article className="border p-4 rounded">
      <h3 className="font-semibold text-lg"><Link to={`/post/${post.slug}`}>{post.title}</Link></h3>
      <p className="text-sm text-gray-600">{post.category_name} - {post.author_name}</p>
    </article>
  );
}
