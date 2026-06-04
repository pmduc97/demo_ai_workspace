import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const image = post.thumbnail_url || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=80';
  const excerpt = post.excerpt || post.content?.replace(/<[^>]*>/g, '').slice(0, 140) || 'Khám phá thêm những câu chuyện mới nhất về Hội An, Đà Nẵng và văn hóa miền Trung.';

  return (
    <article className="group overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/post/${post.slug}`} className="block overflow-hidden">
        <img className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" src={image} alt={post.title} />
      </Link>
      <div className="space-y-3 p-5">
        {post.category_name && (
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
            {post.category_name}
          </span>
        )}
        <h3 className="line-clamp-2 text-lg font-bold text-gray-900">
          <Link className="hover:text-amber-700" to={`/post/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-6 text-gray-600">{excerpt}</p>
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
          <span>{post.author_name || 'Ban biên tập'}</span>
          <Link className="font-semibold text-amber-700 hover:text-amber-800" to={`/post/${post.slug}`}>Đọc tiếp →</Link>
        </div>
      </div>
    </article>
  );
}
