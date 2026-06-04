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
4. Đọc `demo_docs/[Design][COMMON] MESSAGE_Catalog.md` trước khi định nghĩa lỗi, success, confirm hoặc info message.
5. **QUAN TRỌNG**: Nếu message đã có trong Message Catalog thì dùng lại đúng Message ID; nếu chưa có thì thêm mới vào Message Catalog trước khi reference trong Screen doc.
6. **QUAN TRỌNG**: Nếu màn hình yêu cầu tạo một component mới hoặc hàm logic mới có khả năng tái sử dụng, bạn **BẮT BUỘC** phải cập nhật thêm vào file `COMPONENT_DanhSach.md` hoặc `UTILS_DanhSach.md` tương ứng.
7. File đích: `demo_docs/fe/[Design][SCREEN] {ScreenCode}_{ScreenName}.md`
8. Nếu màn hình gọi API, đọc trước các file API liên quan tại `demo_docs/api/`

### Bước 2 — Áp dụng 12-section template
Xem template đầy đủ tại [screen-template.md](./references/screen-template.md).

Bắt buộc có đủ 12 sections (+ Change Log):
- **Change Log** — bảng Ver/Nội dung/Ngày/Người tạo, ngay sau frontmatter
1. **Tổng quan** — mô tả ngắn mục đích màn hình
2. **Thông tin chung** — bảng Route / Auth / Redirect / Params
3. **Navigation** — bảng "Vào từ đâu" và "Đi đến đâu"
4. **Layout & Components** — JSX tree minh hoạ cấu trúc (phải sử dụng các component từ `COMPONENT_DanhSach.md`)
5. **Ma trận trạng thái UI** — bảng enable/disable/ẩn của button theo từng trạng thái (init, loading, chọn 1 dòng, chọn nhiều, no-permission)
6. **Chi tiết UI từng section** — bảng 9 cột: Control / Loại / I/O / Ràng buộc / Giá trị khởi tạo / Nguồn dữ liệu / Event ID / JSON Field / Ghi chú
7. **API Calls** — bảng endpoint + Event ID + link API doc + sub-section Request Mapping + Response Mapping
8. **State Management** — snippet `useState` / `useEffect` hoặc ghi "Không có"
9. **Xử lý lỗi & Edge Cases** — bảng có cột HTTP Status + Component hiển thị, phân biệt interceptor vs màn hình tự xử lý
10. **Responsive** — bảng breakpoint mobile/tablet/desktop
11. **Events & Actions** — bảng tóm tắt (Event ID / Tên / Control / Trigger / API / Mô tả) + chi tiết từng event quan trọng kèm Sequence Diagram Mermaid
12. **Message List** — bảng MessageId / Loại (E/C/S/I) / Nội dung / Component hiển thị / Điều kiện

### Bước 3 — Kiểm tra liên kết API
- Mỗi API Call phải có link `[Design][API] API{ID}_...md`
- Đối chiếu field trong bảng với API spec thực tế (đặc biệt request body, response shape)

### Bước 4 — Validate format
Xem rules đầy đủ tại [format-rules.md](./references/format-rules.md).

Checklist nhanh:
- [ ] Có YAML frontmatter (version, created, updated, status)
- [ ] Có Change Log (bảng Ver/Nội dung/Ngày/Người tạo)
- [ ] Đủ 12 sections, đúng thứ tự
- [ ] Section 5 có bảng Ma trận trạng thái UI (hoặc ghi "Không có" nếu màn hình đơn giản)
- [ ] Section 6 có đủ 9 cột (bao gồm I/O, Giá trị khởi tạo, Nguồn dữ liệu, Event ID)
- [ ] Section 7 có link đến API docs + sub-section Request Mapping + Response Mapping
- [ ] Section 9 phân biệt lỗi interceptor vs lỗi màn hình tự xử lý
- [ ] Section 11 có Event ID nhất quán (E00, E01...) + Sequence Diagram cho event phức tạp
- [ ] Section 12 có Message List đầy đủ (E/C/S/I)
- [ ] Section 12 dùng Message ID từ `demo_docs/[Design][COMMON] MESSAGE_Catalog.md`; nếu có message mới thì catalog đã được cập nhật.
- [ ] Không có section trống (ghi "Không có" nếu không dùng)
- [ ] Bảng Thông tin chung có đủ 4 trường

## Output
```
### Files changed
- demo_docs/fe/[Design][SCREEN] {ScreenCode}_{ScreenName}.md

### Sections added/updated
- [x] YAML frontmatter
- [x] Change Log
- [x] 1. Tổng quan
- [x] 2. Thông tin chung
- [x] 3. Navigation
- [x] 4. Layout & Components
- [x] 5. Ma trận trạng thái UI
- [x] 6. Chi tiết UI từng section
- [x] 7. API Calls (+ Request/Response Mapping)
- [x] 8. State Management
- [x] 9. Xử lý lỗi & Edge Cases
- [x] 10. Responsive
- [x] 11. Events & Actions (+ Sequence Diagrams)
- [x] 12. Message List

### API links verified
- API01 → ✓
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
