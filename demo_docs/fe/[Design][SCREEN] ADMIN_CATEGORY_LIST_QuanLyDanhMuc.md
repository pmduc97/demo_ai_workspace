---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable
---

# [Design][SCREEN] ADMIN_CATEGORY_LIST_QuanLyDanhMuc

## 1. Tổng quan
Trang quản lý danh mục bài viết. Chỉ Admin mới truy cập được. Cho phép xem, thêm, sửa inline, và xóa danh mục ngay trên trang.

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Route | `/admin/categories` |
| Auth yêu cầu | Có (role: admin) |
| Redirect nếu chưa login | `/admin/login` |
| URL Params | Không có |

## 3. Navigation

### Vào từ đâu
| Nguồn | Điều kiện |
|-------|----------|
| Sidebar Admin | Click "Danh Mục" |
| `ProtectedRoute` | Đã login với role `admin` |

### Đi đến đâu
| Hành động | Destination |
|----------|------------|
| Member truy cập | Redirect `/admin/dashboard` (403 guard) |

## 4. Layout & Components

```jsx
<AdminLayout>
  <PageHeader title="Quản Lý Danh Mục" />
  <AddCategoryForm />   {/* Card thêm mới */}
  <CategoryTable>       {/* Bảng danh sách */}
    <InlineEditRow />   {/* Row ở chế độ edit */}
    <NormalRow />       {/* Row bình thường */}
  </CategoryTable>
  <DeleteModal />       {/* Modal xác nhận xóa */}
</AdminLayout>
```

Components dùng lại: `AdminLayout`, `ProtectedRoute` (role: admin).

## 5. Chi tiết UI từng section

### 5.1 PageHeader
- Tiêu đề: "Quản Lý Danh Mục"
- Không có nút thêm riêng (form thêm inline bên dưới)

### 5.2 AddCategoryForm
- Card tiêu đề "Thêm Danh Mục Mới"
- Layout ngang: Input Tên + Input Slug + Input Mô tả + Nút "Thêm"
- Slug: auto-generate từ tên khi người dùng nhập, có thể sửa thủ công
- Validation: tên bắt buộc, slug bắt buộc

### 5.3 CategoryTable
| Cột | Mô tả |
|-----|-------|
| STT | Số thứ tự |
| Tên | Tên danh mục |
| Slug | Slug URL |
| Mô tả | Mô tả ngắn |
| Số bài | `postCount` từ API |
| Hành động | Nút Sửa + Nút Xóa |

### 5.4 Inline Edit
- Click Sửa: dòng chuyển thành input fields (Tên, Slug, Mô tả)
- Nút "Lưu" (`text-green-600`) + Nút "Hủy" (`text-gray-400`) thay thế nút Sửa/Xóa
- Submit Lưu: gọi API update, reload danh sách

### 5.5 DeleteModal
- Text: "Xóa danh mục này? Các bài viết thuộc danh mục sẽ không còn danh mục."
- Nút "Xóa" (`bg-red-500`) + Nút "Hủy"

## 6. API Calls

| # | Endpoint | Method | Khi nào gọi | Auth |
|---|---------|--------|------------|------|
| 1 | `/api/categories` | GET | On mount | Không |
| 2 | `/api/categories` | POST | Submit AddForm | Admin |
| 3 | `/api/categories/:id` | PUT | Submit inline edit | Admin |
| 4 | `/api/categories/:id` | DELETE | Confirm xóa | Admin |

```js
// Load danh sách
const { data } = await api.get('/categories');
// data là array trực tiếp: [{ id, name, slug, description, postCount }]

// Thêm mới
await api.post('/categories', { name, slug, description });
// Response 201: { id, name, slug, description }

// Cập nhật
await api.put(`/categories/${id}`, { name, slug, description });

// Xóa
await api.delete(`/categories/${id}`);
```

> API14 Danh sách: [[Design][API] API14_Categories_DanhSach.md](../api/[Design][API]%20API14_Categories_DanhSach.md)
> API16 Tạo: [[Design][API] API16_Categories_Tao.md](../api/[Design][API]%20API16_Categories_Tao.md)
> API17 Cập nhật: [[Design][API] API17_Categories_CapNhat.md](../api/[Design][API]%20API17_Categories_CapNhat.md)
> API18 Xóa: [[Design][API] API18_Categories_Xoa.md](../api/[Design][API]%20API18_Categories_Xoa.md)

## 7. State Management

```js
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);
const [editingId, setEditingId] = useState(null);
const [editForm, setEditForm] = useState({ name: '', slug: '', description: '' });
const [addForm, setAddForm] = useState({ name: '', slug: '', description: '' });
const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
```

## 8. Xử lý lỗi & Edge Cases

| Tình huống | Xử lý |
|-----------|-------|
| Slug trùng (409) | Hiển thị lỗi inline dưới field slug |
| Xóa danh mục có bài | API cho xóa, bài viết `category_id = null` (thông báo trong modal) |
| API lỗi 403 | Redirect `/admin/dashboard` (chỉ admin) |
| Danh sách rỗng | Hiển thị row "Chưa có danh mục nào" |
| Inline edit đang mở, click Sửa dòng khác | Hủy edit cũ, mở edit mới |

## 9. Responsive

| Breakpoint | Layout |
|-----------|--------|
| Mobile (< 768px) | AddForm stack dọc, bảng scroll ngang |
| Tablet (768–1024px) | AddForm ngang, bảng đầy đủ cột |
| Desktop (> 1024px) | Full layout với AdminLayout sidebar |
- Không có danh mục: "Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!"
