---
name: doc-ita-implement
description: "Workflow tạo tài liệu Test Case ITa (Functional Integration). Sử dụng khi cần định nghĩa kịch bản kiểm thử chức năng, UI Validation, Happy Path, Negative Path kèm Test Data. Trigger phrases: tạo test case ita, viết test case chức năng, doc ita."
argument-hint: "Tên chức năng hoặc đường dẫn file thiết kế FE/BE"
---

# Skill: doc-ita-implement

## Mục đích
Tạo tài liệu Test Case ITa (Functional Integration) dựa trên tài liệu thiết kế FE (Screen) và BE (API). Tài liệu này dùng để định nghĩa các kịch bản kiểm thử tích hợp chức năng, bao gồm UI Validation, Happy Path, và Negative Path, kèm theo Test Data cụ thể (SQL setup và Input Data Sets).

## Khi nào sử dụng
- Khi user yêu cầu tạo test case ITa cho một chức năng.
- Khi user gõ lệnh `/doc-ita-implement`.

## Hướng dẫn thực hiện (Workflow - 4 Phases)
Để tránh timeout và đảm bảo không sót case, AI PHẢI thực hiện theo 4 Phase sau. Dừng lại và hỏi ý kiến user sau mỗi Phase.

**Phase 1: Phân tích & Lập bảng kiểm kê (Validation Field Inventory)**
- Đọc tài liệu thiết kế FE/BE, `TEMPLATE_ITa.md`, `VIEWPOINT_ITa.md`.
- **Bắt buộc:** Đọc tài liệu `demo_docs/[Design][DB] DATABASE_Schema.md` để nắm chính xác tên bảng, tên cột, kiểu dữ liệu và các ràng buộc (Foreign Key, Not Null) trước khi chuẩn bị Test Data.
- Lập bảng `Validation Field Inventory` liệt kê toàn bộ các trường có validation (Required, MaxLength, Format, v.v.).
- *Dừng lại và yêu cầu user xác nhận bảng Inventory.*

**Phase 2: Lập Checklist (ITa Checklist)**
- Dựa vào bảng Inventory, lập bảng `ITa Checklist` tóm tắt các TC sẽ viết.
- Tuân thủ thứ tự: Validate -> Happy Path -> Permission -> Pagination -> Error.
- Tách bạch `[UI]` và `[API]`. 1 Condition = 1 TC. Tách riêng Boundary (exact-max và over-max).
- *Giới hạn: Tối đa 8 dòng checklist mỗi lần generate. Dừng lại và yêu cầu user xác nhận.*

**Phase 3: Viết Kịch bản Chi tiết (TC Detail)**
- Viết bảng `TC Detail` dựa trên Checklist đã chốt.
- Step và Expected Result phải đánh số tương ứng (1., 2., 3...).
- *Giới hạn: Tối đa 4 TC mỗi lần generate để tránh timeout. Dừng lại và hỏi user có muốn viết tiếp không.*

**Phase 4: Sinh dữ liệu Test & Hoàn thiện file**
- Viết SQL Setup Data và Input Data Sets.
- Tổng hợp toàn bộ nội dung từ Phase 1 đến Phase 4 thành 1 file hoàn chỉnh.
- Lưu file vào `demo_docs/tests/ITa/[Test][ITa] TC_{TênChứcNăng}.md`.
- Cập nhật `PROJECT_MANIFEST.yml` để thêm đường dẫn file test case vừa tạo vào section `test_cases.ita` của feature tương ứng.

## Yêu cầu đầu ra
- File Markdown tuân thủ 100% cấu trúc của `TEMPLATE_ITa.md`.
- Dữ liệu SQL phải hợp lệ với PostgreSQL.
- Các TC ID và Data ID phải được tham chiếu chéo chính xác.

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
