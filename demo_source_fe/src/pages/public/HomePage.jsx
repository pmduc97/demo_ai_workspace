import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import PostCard from '../../components/PostCard';

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      api.get('/posts'),
      api.get('/tags', { params: { limit: 20 } })
    ])
      .then(([postsRes, tagsRes]) => {
        if (mounted) {
          setItems(postsRes.data.items || postsRes.data.posts || []);
          setTags(Array.isArray(tagsRes.data) ? tagsRes.data : tagsRes.data?.items || []);
        }
      })
      .catch(() => {
        if (mounted) setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';
    return url.startsWith('http') ? url : `http://localhost:3000${url}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  };

  const featuredPosts = items.slice(0, 3);
  const latestPosts = items.slice(3);

  return (
    <main className="bg-gray-50 min-h-[100dvh] pb-16">
      {/* Hero Section - Magazine Style Grid */}
      <section className="bg-white pt-8 pb-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px] animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-full"></div>
              <div className="grid grid-rows-2 gap-6 h-full">
                <div className="bg-gray-200 rounded-2xl"></div>
                <div className="bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700 text-center">{error}</div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center text-gray-500 text-lg">
              Chưa có bài viết nào. Hãy quay lại sau!
            </div>
          )}

          {!loading && !error && featuredPosts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[500px]">
              {/* Main Featured Post */}
              <Link to={`/post/${featuredPosts[0].slug}`} className="group relative rounded-2xl overflow-hidden h-[400px] lg:h-full block">
                <img 
                  src={getImageUrl(featuredPosts[0].thumbnail_url)} 
                  alt={featuredPosts[0].title} 
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-white uppercase bg-blue-600 rounded-full">
                    {featuredPosts[0].category_name || 'Nổi bật'}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-blue-200 transition-opacity">
                    {featuredPosts[0].title}
                  </h2>
                  <div className="flex items-center text-gray-300 text-sm">
                    <span className="font-medium text-white mr-4">{featuredPosts[0].author_name || 'Admin'}</span>
                    <span>{formatDate(featuredPosts[0].created_at)}</span>
                  </div>
                </div>
              </Link>

              {/* Secondary Featured Posts */}
              <div className="grid grid-rows-2 gap-6 h-[500px] lg:h-full">
                {featuredPosts.slice(1, 3).map((post) => (
                  <Link key={post.id} to={`/post/${post.slug}`} className="group relative rounded-2xl overflow-hidden h-full block">
                    <img 
                      src={getImageUrl(post.thumbnail_url)} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <span className="inline-block px-2 py-1 mb-3 text-xs font-bold tracking-wider text-white uppercase bg-blue-600 rounded-full">
                        {post.category_name || 'Tin tức'}
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight group-hover:text-blue-200 transition-opacity">
                        {post.title}
                      </h2>
                      <div className="flex items-center text-gray-300 text-xs">
                        <span className="font-medium text-white mr-3">{post.author_name || 'Admin'}</span>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area (2 Columns) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Latest Posts */}
          <div className="lg:w-2/3">
            <div className="flex items-center justify-between mb-8 border-b-2 border-gray-900 pb-2">
              <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Bài viết mới nhất</h2>
              <Link to="/category/all" className="text-sm font-semibold text-blue-600 hover:text-blue-800">Xem tất cả →</Link>
            </div>
            
            {!loading && !error && (
              <div className="grid gap-8 sm:grid-cols-2">
                {(latestPosts.length > 0 ? latestPosts : items).map((p) => <PostCard key={p.id} post={p} />)}
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <div className="mt-12 text-center">
                <button className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-opacity">
                  Tải thêm bài viết
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-10">
              
              {/* Newsletter Widget */}
              <div className="bg-blue-600 rounded-2xl p-8 text-center text-white shadow-lg">
                <svg className="w-12 h-12 mx-auto mb-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <h3 className="text-xl font-bold mb-2">Đăng ký nhận tin</h3>
                <p className="text-blue-100 text-sm mb-6">Nhận những bài viết mới nhất và cẩm nang du lịch hữu ích mỗi tuần.</p>
                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                  <input type="email" placeholder="Email của bạn..." className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                  <button type="submit" className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white font-bold hover:bg-gray-800 transition-opacity">Đăng ký ngay</button>
                </form>
              </div>

              {/* Categories Widget */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2 uppercase tracking-wider">Chuyên mục</h3>
                <ul className="space-y-3">
                  {['Du lịch biển', 'Khám phá núi rừng', 'Ẩm thực địa phương', 'Cẩm nang du lịch', 'Review khách sạn'].map((cat, idx) => (
                    <li key={idx}>
                      <Link to="#" className="flex items-center justify-between group">
                        <span className="text-gray-600 group-hover:text-blue-600 font-medium transition-opacity">{cat}</span>
                        <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-opacity">{Math.floor(Math.random() * 20) + 5}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags Widget */}
              {tags.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2 uppercase tracking-wider">Tags phổ biến</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Link key={tag.id} to={`/tag/${tag.slug}`} className="inline-block px-3 py-1.5 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 text-sm font-medium rounded-lg transition-opacity">
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Posts Widget (Mock) */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2 uppercase tracking-wider">Đọc nhiều nhất</h3>
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer">
                      <div className="w-20 h-20 rounded-xl bg-gray-200 flex-shrink-0 overflow-hidden">
                        <img src={`https://images.unsplash.com/photo-1506${i}05961270-5952a21dfa11?q=80&w=200&auto=format&fit=crop`} alt="Thumb" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-opacity line-clamp-2 mb-1">
                          Kinh nghiệm du lịch tự túc tiết kiệm nhất năm 2026
                        </h4>
                        <span className="text-xs text-gray-500">12/05/2026</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </aside>

        </div>
      </section>
    </main>
  );
}
