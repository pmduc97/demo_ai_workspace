---
name: fe-implement
description: "Frontend implementation workflow for Blog Du Lịch. Use when building React screens, components, auth flow, route guards, or fixing UI bugs. Loads screen specs, checklist, and component patterns. Trigger phrases: implement screen, React page, frontend component, auth context, protected route, admin UI, home page, category page, post form."
argument-hint: "Screen name or component to implement (e.g. HOME, ADMIN_POST_FORM, AuthContext)"
---

# FE Implement Skill

## Mục tiêu
Implement màn hình hoặc component đúng spec, ổn định khi gọi API, đảm bảo trải nghiệm người dùng cơ bản.

## Khi nào dùng
- Tạo mới một màn hình (page) hoặc component
- Fix lỗi UI/UX
- Implement auth flow (AuthContext, ProtectedRoute)
- Thêm/sửa route

## Procedure

### Bước 1 — Đọc spec trước khi code
1. Xem danh sách màn hình tại `demo_docs/fe/[Design][LIST] SCREEN_DanhSachManHinh.md`
2. Đọc spec đầy đủ tại `demo_docs/fe/[Design][SCREEN] {ScreenCode}_{ScreenName}.md`
3. Đọc API spec liên quan tại `demo_docs/api/[Design][API] API{ID}_{Group}_{Name}.md`
4. Đọc `src/services/api.js` để tái dùng hàm đã có
5. Đọc `src/context/AuthContext.jsx` để lấy auth state đúng cách
6. Đọc `demo_docs/fe/[Design][LIST] COMPONENT_DanhSach.md` để tái dùng component đã có
7. Đọc `demo_docs/[Design][COMMON] MESSAGE_Catalog.md`; dùng lại Message ID đã có và ưu tiên `parseApiError()` khi hiển thị lỗi từ API.

### Bước 2 — Implement theo checklist
Xem đầy đủ tại [checklist](./references/checklist.md).

Tóm tắt bắt buộc:
- Route đúng theo screen-list
- Mọi API call có loading/error/success state
- Empty state khi list rỗng
- Chỉ dùng TailwindCSS
- Không hardcode URL/token
- Admin route có `ProtectedRoute` guard
- Form disable submit khi đang loading
- Lỗi API hiển thị rõ cho user
- Message hiển thị phải map từ Message Catalog hoặc từ `messageId` API response.

### Bước 3 — Self-review
Trước khi báo xong, check lại:
- Admin route có ProtectedRoute chưa?
- Form có disable submit khi loading chưa?
- Lỗi API có hiển thị cho user chưa?
- Tên field có đồng bộ với API response chưa?
- Responsive cơ bản desktop/mobile đã được kiểm tra chưa?

### Bước 4 — Verify
```powershell
cd demo_source_fe
npm run dev
# Mở http://localhost:5173 và test thủ công
```

## Output
```
### Files created/changed
- src/pages/...
- src/components/...

### Route changes (nếu có)
App.jsx: thêm <Route path="..." element={...} />

### Manual verify steps
1. Mở http://localhost:5173/...
2. ...
3. Expect: ...
```

---

## 📝 Ghi Log Bắt Buộc

Sau khi hoàn thành skill này, **PHẢI** ghi log vào `reports/AGENT_EXECUTION_LOG.md` trước khi báo cáo kết quả.

Dùng template sau (copy và điền vào):

```markdown
### [YYYY-MM-DD HH:mm:ss] - {be-agent | fe-agent | test-agent | playwright-agent | docs-agent}
- **Task**: {Mô tả ngắn gọn việc vừa làm}
- **Skill Used**: {tên skill này}
- **Target Feature**: {key trong PROJECT_MANIFEST.yml, ví dụ: auth_login}
- **Files Processed**:
  - `path/to/file` [Modified]
  - `path/to/file` [Verified/Unchanged]
- **Status**: SUCCESS | FAILED | PARTIAL
- **Notes**: {Ghi chú: findings, residual risks, việc chưa làm}
```

> ⚠️ Nếu bị interrupt, ghi `Status: PARTIAL` và ghi rõ đã làm đến bước nào.
> ⚠️ Sau khi ghi log, cập nhật `cycle_checkpoint` trong `PROJECT_MANIFEST.yml`.
