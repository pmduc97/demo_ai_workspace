import { useEffect, useState } from 'react';
import api from '../../services/api';
import PostCard from '../../components/PostCard';

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get('/posts')
      .then((r) => {
        if (mounted) setItems(r.data.items || r.data.posts || []);
      })
      .catch(() => {
        if (mounted) setError('Không thể tải bài viết. Vui lòng thử lại.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const featured = items[0];
  const latest = items.slice(1);

  return (
    <main className="bg-gradient-to-b from-amber-50 via-white to-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.20),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_30%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-4 w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm">Tin tức du lịch • Ẩm thực • Văn hóa</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">Khám phá Hội An & Đà Nẵng</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">Cập nhật những câu chuyện mới nhất, gợi ý trải nghiệm và góc nhìn địa phương về miền Trung.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#latest-posts" className="rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200 transition hover:bg-amber-700">Xem bài mới</a>
              <a href="/about" className="rounded-full border border-amber-200 bg-white px-6 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-50">Về blog</a>
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-3 shadow-2xl shadow-amber-100">
            <img className="h-72 w-full rounded-[1.5rem] object-cover sm:h-96" src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80" alt="Hội An về đêm" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-80 animate-pulse rounded-2xl bg-amber-100/70" />)}
          </div>
        )}

        {!loading && error && <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">{error}</div>}

        {!loading && !error && items.length === 0 && (
          <div className="rounded-2xl border border-amber-100 bg-white p-10 text-center text-gray-600">Chưa có bài viết nào. Hãy quay lại sau!</div>
        )}

        {!loading && !error && featured && (
          <div className="mb-14 overflow-hidden rounded-3xl bg-amber-50 shadow-sm ring-1 ring-amber-100 lg:grid lg:grid-cols-2">
            <img className="h-72 w-full object-cover lg:h-full" src={featured.thumbnail_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'} alt={featured.title} />
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <span className="mb-4 w-fit rounded-full bg-amber-200 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-900">Bài nổi bật</span>
              <h2 className="text-3xl font-extrabold text-gray-950">{featured.title}</h2>
              <p className="mt-4 text-gray-600">{featured.excerpt || featured.content?.replace(/<[^>]*>/g, '').slice(0, 180) || 'Câu chuyện nổi bật mới nhất từ Blog Hội An / Đà Nẵng.'}</p>
              <a className="mt-6 w-fit rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-700" href={`/post/${featured.slug}`}>Đọc bài viết →</a>
            </div>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div id="latest-posts">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Cập nhật mới</p>
                <h2 className="mt-2 text-3xl font-extrabold text-gray-950">Bài viết mới nhất</h2>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(latest.length ? latest : items).map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
