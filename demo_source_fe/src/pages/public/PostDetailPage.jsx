import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

export default function PostDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    api.get(`/posts/${slug}`)
      .then((r) => {
        if (mounted) {
          setPost(r.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.response?.status === 404 ? 'Bài viết không tồn tại' : 'Đã có lỗi xảy ra');
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-white min-h-[100dvh] pb-12">
        <div className="animate-pulse">
          <div className="w-full h-[400px] md:h-[500px] bg-gray-200"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="flex gap-4 mb-8">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
            <div className="lg:w-1/3 hidden lg:block">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-4">
                <div className="h-24 bg-gray-200 rounded w-full"></div>
                <div className="h-24 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-gray-50 min-h-[100dvh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{error || 'Bài viết không tồn tại'}</h2>
          <p className="text-gray-500 mb-8 text-lg">Rất tiếc, chúng tôi không thể tìm thấy bài viết bạn đang yêu cầu.</p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-opacity">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  };

  const imageUrl = post.thumbnail_url 
    ? (post.thumbnail_url.startsWith('http') ? post.thumbnail_url : `http://localhost:3000${post.thumbnail_url}`)
    : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop';

  return (
    <div className="bg-white min-h-[100dvh] pb-16">
      {/* Hero Banner */}
      <div className="relative w-full h-[400px] md:h-[550px] bg-gray-900">
        <img 
          src={imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover opacity-70" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-16">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 mb-4 text-sm font-semibold tracking-wider text-white uppercase bg-blue-600 rounded-full">
                {post.category_name || 'Du lịch'}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center text-gray-300 text-sm md:text-base">
                <div className="flex items-center mr-6">
                  <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold mr-3 border-2 border-white">
                    {post.author_name ? post.author_name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <span className="font-medium text-white">{post.author_name || 'Admin'}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {formatDate(post.created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Article */}
          <article className="lg:w-2/3">
            {/* Breadcrumbs */}
            <nav className="flex text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link to="/" className="hover:text-blue-600 transition-opacity">Trang chủ</Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mx-2" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span className="text-gray-700 font-medium">{post.category_name || 'Danh mục'}</span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Social Share (Mock) */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Chia sẻ:</span>
              <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </button>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg md:prose-xl max-w-none text-gray-800 prose-headings:font-bold prose-headings:text-gray-900 prose-p:leading-relaxed prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-2xl prose-img:shadow-md" 
              dangerouslySetInnerHTML={{ __html: post.content || '<p>Nội dung đang cập nhật...</p>' }} 
            />
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link key={tag.id} to={`/tag/${tag.slug}`} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 cursor-pointer transition-opacity">
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Right Column: Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8">
              {/* Author Widget */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider text-center">Về tác giả</h3>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl mb-4">
                    {post.author_name ? post.author_name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{post.author_name || 'Admin'}</h4>
                  <p className="text-gray-600 text-sm mb-4">Đam mê xê dịch và khám phá những vùng đất mới. Chia sẻ kinh nghiệm du lịch thực tế và hữu ích.</p>
                  <button className="w-full py-2 px-4 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-opacity">
                    Xem tất cả bài viết
                  </button>
                </div>
              </div>

              {/* Popular Posts Widget (Mock) */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Bài viết nổi bật</h3>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer">
                      <div className="w-20 h-20 rounded-xl bg-gray-200 flex-shrink-0 overflow-hidden">
                        <img src={`https://images.unsplash.com/photo-1506${i}05961270-5952a21dfa11?q=80&w=200&auto=format&fit=crop`} alt="Thumb" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-opacity line-clamp-2 mb-1">
                          Top {i * 5} địa điểm không thể bỏ lỡ khi đến Việt Nam
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
      </div>
    </div>
  );
}
