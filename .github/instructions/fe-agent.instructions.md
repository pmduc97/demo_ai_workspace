---
applyTo: "demo_source_fe/**"
---
# FE Agent Instructions

## Vai trò
Implement và review frontend: pages, components, auth flow, routing.

## Nguyên tắc
- Đọc `demo_docs/fe/*.md` trước khi implement màn hình nào. Chú ý Section 5 (Ma trận trạng thái UI), Section 11 (Events & Actions với Event ID), Section 12 (Message List).
- Đọc API spec tương ứng trong `demo_docs/api/[Design][API] API{ID}_*.md` trước khi gọi API. Đối chiếu với Section 7 Request/Response Mapping trong screen doc.
- Không dùng CSS module, styled-components, hay inline style — chỉ TailwindCSS.
- Button phải tuân thủ Ma trận trạng thái UI (Section 5): disable khi loading, ẩn khi không có quyền — không dùng message FE-only thay cho disabled.
- Message hiển thị cho user phải khớp với Message List (Section 12) trong screen doc.
- Trước khi implement message hiển thị cho user, bắt buộc đọc `demo_docs/[Design][COMMON] MESSAGE_Catalog.md`; ưu tiên map text theo `messageId` qua `parseApiError()`.
- Nếu cần message mới, cập nhật Message Catalog và screen/API docs trước khi dùng trong code.

## Checklist CREATE
- [ ] Route/component đúng theo screen-list (`demo_docs/fe/[Design][LIST] SCREEN_DanhSachManHinh.md`)
- [ ] Guard auth/role hoạt động qua `ProtectedRoute`
- [ ] Form có validate phía client tối thiểu
- [ ] Mọi API call có `loading` / `success` / `error` state
- [ ] Xử lý empty state khi không có dữ liệu
- [ ] Không crash khi API trả lỗi / timeout
- [ ] Điều hướng sau hành động đúng (create/edit/login/logout)
- [ ] Responsive cơ bản desktop/mobile
- [ ] Tên field đồng bộ với API response

## Checklist REVIEW
- [ ] Guard route có hoạt động — không thể truy cập admin khi chưa login
- [ ] AuthContext cập nhật đúng sau login/logout
- [ ] Form không submit khi đang loading (tránh double submit)
- [ ] Lỗi API hiển thị rõ cho user
- [ ] Không có hardcode URL/token trong component

## Cấu trúc thư mục chuẩn
```
src/
  context/AuthContext.jsx       ← auth state toàn cục
  services/api.js               ← mọi axios call
  components/
    ProtectedRoute.jsx          ← route guard
    Navbar.jsx / Footer.jsx
    PostCard.jsx
  pages/
    public/                     ← Home, Category, PostDetail, About, Contact
    admin/                      ← Dashboard, PostList, PostForm, CategoryList, UserList
    AdminLogin.jsx
```
