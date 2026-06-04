# POST_DETAIL — Chi Tiết Bài Viết

## Tổng quan
Hiển thị toàn bộ nội dung một bài viết. Bao gồm header bài, nội dung rich text, và các bài liên quan cùng danh mục.

## Route & Navigation
- **Route**: `/post/:slug`
- Params: `slug` — slug của bài viết
- Điều hướng đến: `/category/:slug`, `/post/:slug` (bài liên quan)
- Điều hướng từ: PostCard, FeaturedPost

## Layout & Components

```
<Navbar />
<main>
  <ArticleHeader />
  <ArticleContent />
  <ShareBar />
  <RelatedPosts />
</main>
<Footer />
```

## Chi tiết UI từng section

### ArticleHeader
- Thumbnail full-width, max-height 480px, object-cover
- Category badge (link đến `/category/:slug`)
- Tiêu đề bài (h1, text-3xl font-bold)
- Meta row: avatar tác giả (32px) + tên tác giả + dấu "·" + ngày đăng (format: DD/MM/YYYY) + dấu "·" + thời gian đọc ước tính (tính từ độ dài content: ~200 từ/phút)

### ArticleContent
- Render HTML từ TipTap bằng `dangerouslySetInnerHTML`
- Bọc trong `<div className="prose prose-lg max-w-none">` (cần `@tailwindcss/typography`)
- Styling prose: heading có border-bottom, blockquote có border-left vàng, code có nền xám nhạt
- Max-width: 768px, căn giữa

### ShareBar
- Sticky bottom trên mobile, inline dưới ArticleHeader trên desktop
- Nút: Copy link (icon + "Sao chép liên kết")
- Khi copy: đổi text thành "Đã sao chép!" trong 2 giây

### RelatedPosts
- Tiêu đề: "Bài Viết Liên Quan"
- Grid 3 cột desktop / 1 cột mobile
- Lấy 3 bài cùng danh mục, loại trừ bài hiện tại
- PostCard nhỏ hơn: chỉ thumbnail + title + date

## API Calls

```js
// Lấy chi tiết bài viết
GET /api/posts/:slug
// Response: { id, title, slug, content, thumbnail_url, status, author: {name}, category: {id, name, slug}, created_at }
// 404 nếu không tìm thấy hoặc status = draft

// Lấy bài liên quan
GET /api/posts?category=:categorySlug&status=published&limit=3&exclude=:postId
// Response: { posts: [Post] }
```

## State Management

```js
const { slug } = useParams();
const [post, setPost] = useState(null);
const [relatedPosts, setRelatedPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [copied, setCopied] = useState(false);
```

- Khi `slug` thay đổi: fetch lại post và related posts
- `useEffect` cập nhật `document.title = post.title + " | Blog Du Lịch"`

## Xử lý lỗi & Edge Cases
- Slug không tồn tại hoặc bài là draft: hiển thị trang 404 ("Bài viết không tồn tại hoặc chưa được xuất bản")
- Không có thumbnail: ẩn section thumbnail, ArticleHeader chỉ hiển thị text
- Không có bài liên quan: ẩn section RelatedPosts
- Loading: skeleton (thumbnail placeholder + text lines)

## Responsive
| Element | Mobile | Desktop |
|---|---|---|
| ArticleContent | padding 16px | max-width 768px, centered |
| RelatedPosts | 1 cột | 3 cột |
| ShareBar | sticky bottom bar | inline dưới meta |
