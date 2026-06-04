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

## Change Log (bắt buộc, ngay sau frontmatter)
- Bảng gồm 4 cột: `Ver | Nội dung thay đổi | Ngày | Người tạo`
- Mỗi lần sửa doc phải thêm 1 dòng mới, tăng `Ver` và cập nhật `updated` trong frontmatter
- Ví dụ: `| 1.1 | Bổ sung Section 12 Message List | 2026-06-04 | docs-agent |`

## Quy tắc 12 sections (bắt buộc, đúng thứ tự)

| # | Section | Bắt buộc | Ghi chú |
|---|---------|---------|---------|
| — | Change Log | ✅ | Bảng Ver/Nội dung/Ngày/Người tạo, ngay sau frontmatter |
| 1 | Tổng quan | ✅ | 1-3 câu |
| 2 | Thông tin chung | ✅ | Bảng 4 trường |
| 3 | Navigation | ✅ | 2 bảng vào/ra |
| 4 | Layout & Components | ✅ | JSX tree. Các component dùng lại phải có mặt trong `COMPONENT_DanhSach.md`. Nếu là component mới, phải thêm vào danh sách đó. |
| 5 | Ma trận trạng thái UI | ✅* | Bảng enable/disable/ẩn của button theo từng trạng thái. Ghi "Không có" nếu màn hình chỉ có form/display đơn giản. |
| 6 | Chi tiết UI từng section | ✅ | Bảng 9 cột: Control / Loại / I/O / Ràng buộc / Giá trị khởi tạo / Nguồn dữ liệu / Event ID / JSON Field / Ghi chú |
| 7 | API Calls | ✅* | Bảng + Request Mapping + Response Mapping + link API doc; ghi "Không có" nếu không gọi API |
| 8 | State Management | ✅ | Snippet code hoặc "Không có" |
| 9 | Xử lý lỗi & Edge Cases | ✅ | Bảng có cột HTTP Status + Component hiển thị, hoặc "Không có" |
| 10 | Responsive | ✅ | Bảng 3 breakpoint |
| 11 | Events & Actions | ✅ | Bảng tóm tắt (Event ID / Tên / Control / Trigger / API / Mô tả) + Chi tiết từng event quan trọng kèm Sequence Diagram Mermaid |
| 12 | Message List | ✅ | Bảng: MessageId / Loại (E/C/S/I) / Nội dung / Component hiển thị / Điều kiện |

## Section 2 — Thông tin chung (4 trường bắt buộc)
| Thuộc tính | Mô tả |
|-----------|-------|
| Route | Path React Router (e.g. `/admin/categories`) |
| Auth yêu cầu | `Không` / `Có (role: member)` / `Có (role: admin)` |
| Redirect nếu chưa login | Path redirect (e.g. `/admin/login`) hoặc `Không` |
| URL Params | `Không có` hoặc list params (e.g. `:slug`) |

## Section 5 — Ma trận trạng thái UI
- Liệt kê tất cả button/action chính của màn hình làm cột
- Các trạng thái cần cover: `Khởi tạo`, `Đang loading`, `Chọn 1 dòng`, `Chọn nhiều dòng`, `Không có quyền`
- Giá trị ô: `Enable` / `Disable` / `Ẩn`
- Mục đích: chuẩn hóa behavior FE, chống double-click, không dùng message FE-only thay cho disabled

## Section 6 — Chi tiết UI (9 cột bắt buộc)
| Cột | Mô tả |
|-----|-------|
| UI Control | Tên control (e.g. `Input email`, `Nút Submit`) |
| Loại | `Input text`, `Select`, `Button`, `Checkbox`, `Table`, v.v. |
| I/O | `Input` (user nhập) / `Output` (hiển thị) / `Both` |
| Ràng buộc | Min/Max/Format/Required |
| Giá trị khởi tạo | Giá trị mặc định khi màn hình load |
| Nguồn dữ liệu | `N/A` / `GET /api/...` / `enum: [...]` / `static` |
| Event ID | Event trigger (e.g. `E01`) hoặc `—` |
| JSON Field | Field trong request/response body hoặc `N/A` |
| Ghi chú | Ghi chú thêm |

## Section 7 — API Calls
- Bảng chính có cột: `# | Event ID | Endpoint | Method | Khi nào gọi | Auth | Link spec`
- Mỗi row PHẢI có link đến file API doc tương ứng
- Format link: `[[Design][API] API{ID}_...](../api/[Design][API]%20API{ID}_...md)`
- Gọi API thông qua `api.get/post/put/patch/delete()` từ `src/services/api.js`
- Không gọi `fetch()` trực tiếp
- Bắt buộc có sub-section **7.1 Request Mapping** và **7.2 Response Mapping**

## Section 9 — Xử lý lỗi & Edge Cases
- Bảng có cột: `Tình huống | HTTP Status | Xử lý | Component hiển thị`
- Phân biệt rõ: lỗi do **axios interceptor** xử lý (401/403/5xx) vs lỗi **màn hình tự xử lý** (400 nghiệp vụ)
- Lỗi interceptor: ghi chú "do interceptor xử lý" thay vì mô tả lại logic

## Section 11 — Events & Actions
- **11.1 Bảng tóm tắt**: liệt kê tất cả Event ID (E00, E01...) với cột `Event ID / Tên / Control / Trigger / API Endpoint / Mô tả`
- **11.2 Chi tiết**: mỗi event phức tạp (có gọi API, có confirm, có nhánh lỗi) phải có Sequence Diagram Mermaid
- Event ID format: `E00` (load screen), `E01`, `E02`... theo thứ tự nghiệp vụ
- Sequence Diagram phải cover: nhánh thành công, nhánh lỗi 400, nhánh lỗi 5xx (nếu có)

## Section 12 — Message List
- Phân loại: `E` = Error, `C` = Confirm, `S` = Success, `I` = Info/Empty-state
- MessageId format: `{Loại}-{3 chữ số}` (e.g. `E-001`, `C-001`, `S-001`, `I-001`)
- Lỗi HTTP chung (401/403/5xx) do interceptor xử lý → không khai báo ở đây
- Mỗi message phải ghi rõ component hiển thị: `AlertBanner`, `Toast`, `ConfirmDialog`, `Text inline`, v.v.

## Không được để trống
Nếu section không áp dụng, ghi rõ: `> Không có.`

## Phong cách viết
- Tiêu đề heading level 2 (`##`) cho sections chính
- Sub-sections dùng `###`, event details dùng `####`
- Dùng bảng markdown thay vì bullet list khi có cấu trúc 2 chiều
- Code snippet dùng fenced code block với ngôn ngữ (` ```js `, ` ```jsx `, ` ```mermaid `)
