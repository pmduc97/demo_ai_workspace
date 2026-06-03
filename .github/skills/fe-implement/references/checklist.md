## Checklist CREATE — Frontend Screen

### Routing
- [ ] Route đúng theo `demo_docs/fe/screen-list.md`
- [ ] Admin routes wrap bằng `<ProtectedRoute role="admin">`
- [ ] Member routes wrap bằng `<ProtectedRoute>`
- [ ] Redirect đúng sau login (→ /admin/dashboard) và logout (→ /)

### API Integration
- [ ] Mọi gọi API đi qua `src/services/api.js`
- [ ] Có `loading` state — hiển thị spinner/skeleton
- [ ] Có `error` state — hiển thị thông báo lỗi rõ ràng
- [ ] Có `success` state — feedback cho user
- [ ] Empty state khi list rỗng
- [ ] Tên field khớp với API response (không đổi tên tuỳ tiện)

### Form
- [ ] Validate phía client cho required fields trước khi submit
- [ ] Disable submit button khi đang loading
- [ ] Reset form sau submit thành công
- [ ] Hiển thị lỗi từ API phía server

### Auth
- [ ] Lấy user/token từ `useAuth()` hook của AuthContext
- [ ] KHÔNG lưu token vào state local hay localStorage trực tiếp
- [ ] KHÔNG hardcode user role trong component

### Style
- [ ] Chỉ dùng TailwindCSS classes
- [ ] KHÔNG dùng inline style (`style={{...}}`)
- [ ] KHÔNG dùng CSS module hay styled-components
- [ ] Responsive: desktop (md:) và mobile

### Quality
- [ ] Không crash khi API timeout / trả lỗi 500
- [ ] KHÔNG hardcode URL, ID, token trong component
- [ ] Import paths dùng relative path từ `src/`
