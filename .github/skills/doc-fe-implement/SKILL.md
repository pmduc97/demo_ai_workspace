---
name: doc-fe-implement
description: "FE screen design doc workflow for Blog Hoi An/Da Nang. Use when writing, updating, or standardizing a frontend screen specification document. Ensures consistent 10-section format with YAML frontmatter, navigation, layout tree, API links, state snippets, error handling, responsive table, and events mapping. Trigger phrases: write screen doc, update screen spec, standardize doc, create design doc, doc fe, screen design, spec màn hình."
argument-hint: "ScreenCode cần viết/update (e.g. ADMIN_LOGIN, HOME, ADMIN_CATEGORY_LIST)"
---

# Doc FE Implement Skill

## Mục tiêu
Viết mới hoặc cập nhật một FE screen design doc đúng format chuẩn, đảm bảo đồng bộ với API spec và code thực tế.

## Khi nào dùng
- Tạo doc cho màn hình mới
- Cập nhật doc cũ thiếu section hoặc sai format
- Chuẩn hoá loạt doc trước khi merge

## Procedure

### Bước 1 — Xác định màn hình, Component và Utils
1. Xem danh sách tại `demo_docs/fe/[Design][LIST] SCREEN_DanhSachManHinh.md`
2. Đọc thư viện UI tại `demo_docs/fe/[Design][LIST] COMPONENT_DanhSach.md` để biết các component đã có sẵn (bắt buộc dùng lại nếu phù hợp).
3. Đọc thư viện Utils tại `demo_docs/fe/[Design][LIST] UTILS_DanhSach.md` để biết các hàm logic dùng chung (format, parse lỗi...).
4. **QUAN TRỌNG**: Nếu màn hình yêu cầu tạo một component mới hoặc hàm logic mới có khả năng tái sử dụng, bạn **BẮT BUỘC** phải cập nhật thêm vào file `COMPONENT_DanhSach.md` hoặc `UTILS_DanhSach.md` tương ứng.
5. File đích: `demo_docs/fe/[Design][SCREEN] {ScreenCode}_{ScreenName}.md`
6. Nếu màn hình gọi API, đọc trước các file API liên quan tại `demo_docs/api/`

### Bước 2 — Áp dụng 10-section template
Xem template đầy đủ tại [screen-template.md](./references/screen-template.md).

Bắt buộc có đủ 10 sections:
1. **Tổng quan** — mô tả ngắn mục đích màn hình
2. **Thông tin chung** — bảng Route / Auth / Redirect / Params
3. **Navigation** — bảng "Vào từ đâu" và "Đi đến đâu"
4. **Layout & Components** — JSX tree minh hoạ cấu trúc (phải sử dụng các component từ `COMPONENT_DanhSach.md`)
5. **Chi tiết UI từng section** — bảng mapping control, format, min/max, JSON field
6. **API Calls** — bảng endpoint + code snippet, link đến `[Design][API]` file
7. **State Management** — snippet `useState` / `useEffect` hoặc ghi "Không có"
8. **Xử lý lỗi & Edge Cases** — bảng hoặc ghi "Không có"
9. **Responsive** — bảng breakpoint mobile/tablet/desktop
10. **Events & Actions** — bảng mapping control với event và logic xử lý

### Bước 3 — Kiểm tra liên kết API
- Mỗi API Call phải có link `[Design][API] API{ID}_...md`
- Đối chiếu field trong bảng với API spec thực tế (đặc biệt request body, response shape)

### Bước 4 — Validate format
Xem rules đầy đủ tại [format-rules.md](./references/format-rules.md).

Checklist nhanh:
- [ ] Có YAML frontmatter (version, created, updated, status)
- [ ] Đủ 9 sections, đúng thứ tự
- [ ] Section 6 có link đến API docs
- [ ] Không có section trống (ghi "Không có" nếu không dùng)
- [ ] Bảng Thông tin chung có đủ 4 trường

## Output
```
### Files changed
- demo_docs/fe/[Design][SCREEN] {ScreenCode}_{ScreenName}.md

### Sections added/updated
- [x] YAML frontmatter
- [x] 1. Tổng quan
- ...

### API links verified
- API01 → ✓
```
