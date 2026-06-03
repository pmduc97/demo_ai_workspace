# ADMIN_POST_FORM — Tạo / Sửa Bài Viết

## Tổng quan
Form soạn thảo bài viết dùng chung cho cả tạo mới và chỉnh sửa. Sử dụng TipTap làm rich text editor.

## Route & Navigation
- **Route tạo mới**: `/admin/posts/new`
- **Route chỉnh sửa**: `/admin/posts/:id/edit`
- Role: Admin, Member (member chỉ sửa bài của mình)
- Sau submit thành công: redirect về `/admin/posts`

## Layout & Components

```
<AdminLayout>
  <PageHeader /> <!-- Tiêu đề + nút Lưu/Xuất bản -->
  <div className="grid grid-cols-3 gap-6">
    <div className="col-span-2">
      <TitleInput />
      <RichEditor />
    </div>
    <div className="col-span-1">
      <PublishPanel />
      <ThumbnailPanel />
      <CategoryPanel />
    </div>
  </div>
</AdminLayout>
```

## Chi tiết UI từng section

### PageHeader
- Tiêu đề: "Tạo Bài Viết Mới" hoặc "Chỉnh Sửa Bài Viết"
- Nút "Lưu nháp" (outline) + Nút "Xuất bản" (filled amber) — góc phải
- Nút "← Quay lại" → `/admin/posts`

### TitleInput
- Input lớn, không có border rõ ràng (borderless style)
- Placeholder: "Nhập tiêu đề bài viết..."
- Font-size: text-3xl, font-bold
- Auto-generate slug từ tiêu đề (hiển thị bên dưới: "Slug: /post/ten-bai-viet", có thể edit thủ công)

### RichEditor (TipTap)
- Toolbar: Bold | Italic | Underline | | H2 | H3 | | BulletList | OrderedList | | Blockquote | | Image (upload) | Link
- Editor area: min-height 400px, border, padding
- Hỗ trợ upload ảnh inline: click icon Image → chọn file → upload lên `/api/upload` → insert vào editor

### PublishPanel (sidebar)
- Card "Xuất bản"
- Trạng thái hiện tại: badge Draft/Published
- Nút "Lưu nháp" và "Xuất bản" (hoặc "Chuyển về nháp" nếu đang published)
- Ngày tạo (khi edit)

### ThumbnailPanel (sidebar)
- Card "Ảnh đại diện"
- Preview ảnh hiện tại (nếu có), kích thước 100% width, aspect 16/9
- Nút "Chọn ảnh" → input file (accept: image/*)
- Upload ngay khi chọn file → hiển thị preview + lưu URL
- Nút "Xóa ảnh" nếu đã có ảnh

### CategoryPanel (sidebar)
- Card "Danh mục"
- Dropdown select danh mục (required)
- Placeholder: "-- Chọn danh mục --"

## API Calls

```js
// Lấy danh sách category cho dropdown
GET /api/categories
// Response: [{ id, name, slug }]

// Lấy bài viết khi edit
GET /api/admin/posts/:id  (admin)
GET /api/posts/my/:id     (member)
// Response: Post object đầy đủ

// Upload ảnh thumbnail / ảnh inline
POST /api/upload
Body: FormData { file: File }
Response: { url: '/uploads/filename.jpg' }

// Tạo bài mới
POST /api/posts
Body: { title, slug, content, thumbnail_url, status, category_id }
Response 201: Post

// Cập nhật bài
PUT /api/posts/:id
Body: { title, slug, content, thumbnail_url, status, category_id }
Response 200: Post
```

## State Management

```js
const { id } = useParams(); // undefined nếu tạo mới
const isEdit = Boolean(id);

const [form, setForm] = useState({
  title: '',
  slug: '',
  content: '',
  thumbnail_url: '',
  status: 'draft',
  category_id: '',
});
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);
const [errors, setErrors] = useState({});
```

- Khi `title` thay đổi: auto-generate slug (chỉ khi slug chưa bị edit thủ công)
- Khi edit: fetch bài viết và populate form

## Validation
| Field | Rule |
|---|---|
| Tiêu đề | Bắt buộc, tối thiểu 5 ký tự |
| Slug | Bắt buộc, chỉ chứa a-z, 0-9, dấu gạch ngang |
| Nội dung | Bắt buộc, không được rỗng |
| Danh mục | Bắt buộc |

## Xử lý lỗi & Edge Cases
- Slug trùng: API trả 409, hiển thị lỗi dưới field slug
- Upload ảnh thất bại: toast lỗi, không block form
- Member cố sửa bài người khác: API trả 403, redirect về `/admin/posts`
- Thoát khi có thay đổi chưa lưu: confirm dialog "Bạn có thay đổi chưa lưu. Thoát?"

## Responsive
- Mobile: sidebar panels xuống dưới editor (stack dọc)
- Desktop: 2/3 editor + 1/3 sidebar
