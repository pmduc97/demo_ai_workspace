# Format Rules — FE Screen Design Doc

## Tên file
- Pattern: `[Design][SCREEN] {ScreenCode}_{ScreenName}.md`
- ScreenCode: UPPERCASE, dấu gạch dưới (e.g. `ADMIN_LOGIN`, `HOME`, `CATEGORY`)
- ScreenName: PascalCase tiếng Việt không dấu (e.g. `DangNhap`, `TrangChu`)
- Ví dụ: `[Design][SCREEN] ADMIN_LOGIN_DangNhap.md`

## YAML Frontmatter
```yaml
---
version: 1.0          # Tăng khi có breaking change
created: YYYY-MM-DD   # Ngày tạo doc lần đầu
updated: YYYY-MM-DD   # Ngày cập nhật gần nhất
status: draft | stable | deprecated
---
```

## Quy tắc 10 sections (bắt buộc, đúng thứ tự)

| # | Section | Bắt buộc | Ghi chú |
|---|---------|---------|---------|
| 1 | Tổng quan | ✅ | 1-3 câu |
| 2 | Thông tin chung | ✅ | Bảng 4 trường |
| 3 | Navigation | ✅ | 2 bảng vào/ra |
| 4 | Layout & Components | ✅ | JSX tree. Các component dùng lại phải có mặt trong `COMPONENT_DanhSach.md`. Nếu là component mới, phải thêm vào danh sách đó. |
| 5 | Chi tiết UI từng section | ✅ | Bảng mapping control, format, JSON field |
| 6 | API Calls | ✅* | Bảng + link API doc; ghi "Không có" nếu không gọi API |
| 7 | State Management | ✅ | Snippet code hoặc "Không có" |
| 8 | Xử lý lỗi & Edge Cases | ✅ | Bảng hoặc "Không có" |
| 9 | Responsive | ✅ | Bảng 3 breakpoint |
| 10 | Events & Actions | ✅ | Bảng mapping control với event. Các hàm xử lý logic chung (format, parse lỗi...) phải tham chiếu từ `UTILS_DanhSach.md`. Nếu có hàm mới, phải thêm vào danh sách đó. |

## Section 2 — Thông tin chung (4 trường bắt buộc)
| Thuộc tính | Mô tả |
|-----------|-------|
| Route | Path React Router (e.g. `/admin/categories`) |
| Auth yêu cầu | `Không` / `Có (role: member)` / `Có (role: admin)` |
| Redirect nếu chưa login | Path redirect (e.g. `/admin/login`) hoặc `Không` |
| URL Params | `Không có` hoặc list params (e.g. `:slug`) |

## Section 6 — API Calls
- Mỗi row trong bảng PHẢI có link đến file API doc tương ứng
- Format link: `[[Design][API] API{ID}_...](../api/[Design][API]%20API{ID}_...md)`
- Gọi API thông qua `api.get/post/put/patch/delete()` từ `src/services/api.js`
- Không gọi `fetch()` trực tiếp

## Section 7 — State Management
- Chỉ liệt kê state THỰC SỰ dùng trong màn hình
- Format: snippet `useState` ngắn gọn

## Không được để trống
Nếu section không áp dụng, ghi rõ: `> Không có.`

## Phong cách viết
- Tiêu đề heading level 2 (`##`) cho sections chính
- Sub-sections dùng `###`
- Dùng bảng markdown thay vì bullet list khi có cấu trúc 2 chiều
- Code snippet dùng fenced code block với ngôn ngữ (` ```js `, ` ```jsx `)
