import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const image = post.thumbnail_url 
    ? (post.thumbnail_url.startsWith('http') ? post.thumbnail_url : `http://localhost:3000${post.thumbnail_url}`)
    : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=900&auto=format&fit=crop';
  const excerpt = post.excerpt || post.content?.replace(/<[^>]*>/g, '').slice(0, 140) || 'Khám phá thêm những câu chuyện mới nhất về du lịch Việt Nam và văn hóa địa phương.';

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/post/${post.slug}`} className="block overflow-hidden relative h-56">
        <img className="h-full w-full object-cover transition duration-500 group-hover:scale-110" src={image} alt={post.title} />
        {post.category_name && (
          <span className="absolute top-4 left-4 inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
            {post.category_name}
          </span>
        )}
      </Link>
      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center text-xs text-gray-500 mb-3 gap-3">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            {post.author_name || 'Admin'}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {formatDate(post.created_at)}
          </span>
        </div>
        <h3 className="line-clamp-2 text-xl font-bold text-gray-900 mb-3">
          <Link className="hover:text-blue-600 transition-colors" to={`/post/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 mb-4 flex-grow">{excerpt}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span key={tag.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors" to={`/post/${post.slug}`}>
            Đọc tiếp 
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
