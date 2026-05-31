# ADMIN_CATEGORY_LIST — Quản Lý Danh Mục

## Tổng quan
Trang quản lý danh mục bài viết. Chỉ Admin mới truy cập được. CRUD danh mục trực tiếp trên trang (inline form).

## Route & Navigation
- **Route**: `/admin/categories`
- Role: **Admin only** (Member bị redirect về `/admin/dashboard`)

## Layout & Components

```
<AdminLayout>
  <PageHeader />
  <AddCategoryForm />
  <CategoryTable />
</AdminLayout>
```

## Chi tiết UI từng section

### PageHeader
- Tiêu đề: "Quản Lý Danh Mục"
- Không có nút thêm riêng (form thêm inline bên dưới)

### AddCategoryForm
- Card "Thêm Danh Mục Mới"
- Layout ngang: Input tên + Input slug + Input mô tả + Nút "Thêm"
- Slug: auto-generate từ tên, có thể edit thủ công
- Validation: tên bắt buộc, slug bắt buộc và unique

### CategoryTable
- Bảng với các cột: STT | Tên | Slug | Mô tả | Số bài | Hành động
- Hành động: Nút Sửa (inline edit) + Nút Xóa

### Inline Edit
- Click Sửa: dòng đó chuyển thành input fields
- Nút Lưu (xanh) + Nút Hủy (xám) thay thế nút Sửa/Xóa
- Submit: gọi API update, reload danh sách

### Xóa danh mục
- Modal confirm: "Xóa danh mục này? Các bài viết thuộc danh mục sẽ không còn danh mục."
- Confirm: gọi API xóa

## API Calls

```js
// Lấy danh sách (kèm số bài)
GET /api/categories
// Response: [{ id, name, slug, description, postCount }]

// Thêm danh mục
POST /api/categories
Body: { name, slug, description }
Response 201: Category

// Cập nhật
PUT /api/categories/:id
Body: { name, slug, description }
Response 200: Category

// Xóa
DELETE /api/categories/:id
Response 200: { message }
```

## State Management

```js
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);
const [editingId, setEditingId] = useState(null);
const [editForm, setEditForm] = useState({});
const [addForm, setAddForm] = useState({ name: '', slug: '', description: '' });
const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
```

## Xử lý lỗi & Edge Cases
- Slug trùng: hiển thị lỗi inline dưới field slug
- Xóa danh mục có bài: API vẫn cho xóa, bài viết sẽ có `category_id = null`
- Không có danh mục: "Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!"
