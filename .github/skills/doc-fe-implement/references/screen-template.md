---
version: 1.0
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: draft
---

# [Design][SCREEN] {ScreenCode}_{ScreenName}

## 1. Tổng quan
> Mô tả ngắn mục đích của màn hình, ai dùng, khi nào dùng.

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Route | `/path` |
| Auth yêu cầu | Không / Có (role: member \| admin) |
| Redirect nếu chưa login | `/admin/login` |
| URL Params | Không có / `:id`, `:slug` |

## 3. Navigation

### Vào từ đâu
| Nguồn | Điều kiện |
|-------|----------|
| Sidebar Admin | Click menu item |

### Đi đến đâu
| Hành động | Destination |
|----------|------------|
| Click item | `/{route}/:id` |

## 4. Layout & Components

```jsx
<AdminLayout>
  <PageHeader title="..." />
  <MainContent>
    <ComponentA />
    <ComponentB />
  </MainContent>
</AdminLayout>
```

> Liệt kê components dùng lại: `AdminLayout`, `ProtectedRoute`, `Pagination`, v.v.

## 5. Chi tiết UI từng section

### 5.1 Header
- Tiêu đề trang
- Nút hành động chính (nếu có)

### 5.2 Main Content
- Mô tả bố cục chính
- Các trạng thái: loading / empty / error / success

## 6. API Calls

| # | Endpoint | Method | Khi nào gọi | Auth |
|---|---------|--------|------------|------|
| 1 | `/api/...` | GET | On mount | Có |

**Ví dụ fetch:**
```js
const { data } = await api.get('/api/...');
```

> Spec chi tiết: [[Design][API] API{ID}_Group_Name.md](../api/[Design][API]%20API{ID}_Group_Name.md)

## 7. State Management

```js
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

## 8. Xử lý lỗi & Edge Cases

| Tình huống | Xử lý |
|-----------|-------|
| API lỗi 401 | Redirect về login |
| Danh sách rỗng | Hiển thị empty state |
| Lỗi network | Hiển thị error banner |

## 9. Responsive

| Breakpoint | Layout |
|-----------|--------|
| Mobile (< 768px) | Stack dọc, ẩn sidebar |
| Tablet (768–1024px) | Sidebar thu gọn |
| Desktop (> 1024px) | Full layout |
