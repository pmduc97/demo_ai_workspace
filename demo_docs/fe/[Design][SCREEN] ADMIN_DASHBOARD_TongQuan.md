---
version: 1.0
created: 2026-06-03
updated: 2026-06-06
status: stable
---

# [Design][SCREEN] ADMIN_DASHBOARD_TongQuan

## Change Log
| Ver | Ngày | Nội dung | Người tạo |
|-----|------|----------|-----------|
| 1.0 | 2026-06-03 | Tạo tài liệu ban đầu | GitHub Copilot |
| 1.1 | 2026-06-06 | Chuẩn hóa 12 sections, bổ sung state matrix, events, message list, responsive | docs-agent |

## 1. Tổng quan
Trang tổng quan sau khi đăng nhập. Hiển thị thống kê nhanh (StatsRow) và danh sách bài viết gần đây (RecentPosts). Gọi API22 để lấy thống kê, API10/API04 để lấy bài viết gần đây.

## 2. Thông tin chung
| Thuộc tính | Giá trị |
|-----------|---------|
| Route | `/admin/dashboard` |
| Auth yêu cầu | Có (admin/member) |
| Redirect nếu chưa login | `/admin/login` |
| URL Params | Không có |

## 3. Navigation

### Vào từ đâu
| Nguồn | Điều kiện |
|-------|----------|
| Sidebar Admin | Click "Dashboard" |
| Login thành công | Redirect từ LoginPage |
| ProtectedRoute | Đã login |

### Đi đến đâu
| Hành động | Destination | Điều kiện |
|-----------|-------------|-----------|
| Click "Xem tất cả" | `/admin/posts` | Admin/member |
| Click Sửa bài | `/admin/posts/:id/edit` | Admin/member |
| Chưa login | `/admin/login` | ProtectedRoute guard |

## 4. Layout & Components
```jsx
<AdminLayout>
  <AdminPageLayout title="Dashboard">
    <StatsRow>         {/* Grid 4 cột stats */}
      <StatCard icon={UsersIcon} label="Tổng bài" value={stats.totalPosts} />
      <StatCard icon={CheckIcon} label="Đã xuất bản" value={stats.publishedPosts} />
      <StatCard icon={EditIcon} label="Bản nháp" value={stats.draftPosts} />
      <StatCard icon={FolderIcon} label="Danh muc" value={stats.totalCategories} />
    </StatsRow>
    <RecentPosts>
      <SectionHeader title="Bai Viet Gan Day" action="Xem tat ca" to="/admin/posts" />
      <DataTable columns={columns} data={recentPosts} loading={loading} />
    </RecentPosts>
  </AdminPageLayout>
</AdminLayout>
```
Components dùng lại: `AdminLayout`, `AdminPageLayout`, `DataTable`, `ProtectedRoute`, `ErrorBanner`, `LoadingSpinner`.

## 5. Ma trận trạng thái UI
| Trạng thái | StatsRow | RecentPosts | Pagination | Error Banner |
|------------|----------|-------------|------------|-------------|
| Init/Loading | Skeleton cards | Skeleton rows | Ẩn | Ẩn |
| Loaded có dữ liệu | Hiển thị | Hiển thị bảng | Hiển thị nếu > 1 page | Ẩn |
| Empty | Hiển thị (0) | EmptyState | Ẩn | Ẩn |
| Error | Ẩn | Ẩn | Ẩn | Hiển thị |

## 6. Chi tiết UI từng section

### 6.1 StatsRow
| UI Control | Loại | I/O | Ràng buộc | Giá trị khởi tạo | Nguồn dữ liệu | Event ID | JSON Field mapping | Ghi chú |
|-----------|------|-----|-----------|------------------|---------------|----------|--------------------|---------|
| StatCard: Tổng bài | Card | Output | number >= 0 | 0 | API22 | N/A | `totalPosts` | |
| StatCard: Đã xuất bản | Card | Output | number >= 0 | 0 | API22 | N/A | `publishedPosts` | |
| StatCard: Bản nháp | Card | Output | number >= 0 | 0 | API22 | N/A | `draftPosts` | |
| StatCard: Danh mục | Card | Output | number >= 0 | 0 | API22 | N/A | `totalCategories` | |

### 6.2 RecentPosts
| UI Control | Loại | I/O | Ràng buộc | Giá trị khởi tạo | Nguồn dữ liệu | Event ID | JSON Field mapping | Ghi chú |
|-----------|------|-----|-----------|------------------|---------------|----------|--------------------|---------|
| "Xem tất cả" link | Link | Input | N/A | N/A | Static | N/A | N/A | `/admin/posts` |
| Bảng bài viết | Table | Output | limit 5 | `[]` | API10/API04 | E01 | `items[]` | Admin dùng API10, member dùng API04 |
| Tiêu đề | Text | Output | N/A | N/A | API10/API04 | N/A | `title` | |
| Danh mục | Text | Output | N/A | N/A | API10/API04 | N/A | `category.name` | |
| Trạng thái | Badge | Output | draft/published | N/A | API10/API04 | N/A | `status` | Xanh cho published, xám cho draft |
| Ngày tạo | Text | Output | Format DD/MM/YYYY | N/A | API10/API04 | N/A | `created_at` | |
| Hành động: Sửa | Button | Input | Disable khi loading | N/A | Row | E02 | `id` | `/admin/posts/:id/edit` |

## 7. API Calls
| Event ID | API | Endpoint | Khi goi | Link |
|----------|-----|----------|---------|------|
| E01 | API22 | `GET /api/admin/stats` | On mount | [[Design][API] API22_AdminStats_ThongKe.md](../api/%5BDesign%5D%5BAPI%5D%20API22_AdminStats_ThongKe.md) |
| E01 | API10 | `GET /api/admin/posts?limit=5&sort_by=created_at&sort_order=desc` | On mount (admin) | [[Design][API] API10_AdminPosts_DanhSach.md](../api/%5BDesign%5D%5BAPI%5D%20API10_AdminPosts_DanhSach.md) |
| E01 | API04 | `GET /api/posts?limit=5&sort=newest` | On mount (member) | [[Design][API] API04_Posts_DanhSach.md](../api/%5BDesign%5D%5BAPI%5D%20API04_Posts_DanhSach.md) |

### Request Mapping
| Event ID | Endpoint | Ghi chú |
|----------|----------|---------|
| E01 | `GET /api/admin/stats` | Lấy thống kê |
| E01 | `GET /api/admin/posts?limit=5&sort_by=created_at&sort_order=desc` | Admin xem 5 bài mới nhất |
| E01 | `GET /api/posts?limit=5&sort=newest` | Member xem 5 bài mới nhất của mình |

### Response Mapping
| API Field | UI State |
|-----------|----------|
| `totalPosts` | StatsRow.Tổng bài |
| `publishedPosts` | StatsRow.Đã xuất bản |
| `draftPosts` | StatsRow.Bản nháp |
| `totalCategories` | StatsRow.Danh mục |
| `items[]` | RecentPosts bảng |

## 8. State Management
```js
const { user } = useAuth();
const [stats, setStats] = useState(null);
const [recentPosts, setRecentPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  // fetch stats + recent posts on mount
  // cleanup: khong can
}, []);
```

## 9. Xử lý lỗi & Edge Cases
| Tình huống | HTTP Status | Component | Xử lý |
|-----------|-------------|-----------|--------|
| API stats lỗi | 500 | ErrorBanner | Hiển thị `COMMON-E-001`, không crash trang |
| API posts lỗi | 500 | ErrorBanner | Hiển thị `COMMON-E-001`, RecentPosts ẩn |
| Empty stats | 200 | StatsRow | Hiển thị 0 |
| Empty recent | 200 | RecentPosts | EmptyState: `POST-I-001` |
| Token hết hạn | 401 | ProtectedRoute | Redirect `/admin/login` |

## 10. Responsive
| Breakpoint | StatsRow | RecentPosts |
|-----------|----------|-------------|
| Mobile (< 640px) | 1 cột | Bảng scroll ngang |
| Tablet (640-1024px) | 2 cột | Bảng đầy đủ |
| Desktop (> 1024px) | 4 cột | Bảng đầy đủ |

## 11. Events & Actions
| Event ID | Tên | Control | Trigger | API | Mô tả |
|----------|-----|---------|---------|-----|-------|
| E01 | Load dashboard | Page | Mount | API22 + API10/API04 | Lấy thống kê và bài viết gần đây |
| E02 | Edit post | Button "Sửa" | Click | N/A | Điều hướng `/admin/posts/:id/edit` |

## 12. Message List
| MessageId | Loại | HTTP Status | Nội dung | Component | Điều kiện |
|-----------|------|-------------|----------|-----------|-----------|
| COMMON-E-001 | E | N/A | Có lỗi xảy ra | ErrorBanner | API stats hoặc posts lỗi |
| POST-I-001 | I | N/A | Chưa có bài viết nào. | EmptyState | Danh sách bài viết rỗng |
