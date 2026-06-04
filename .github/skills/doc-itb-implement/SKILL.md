---
name: doc-itb-implement
description: "Workflow tạo tài liệu Test Case ITb (Scenario Integration). Sử dụng khi cần định nghĩa kịch bản kiểm thử luồng nghiệp vụ xuyên suốt qua nhiều màn hình và role. Trigger phrases: tạo test case itb, viết test case luồng, doc itb."
argument-hint: "Tên luồng nghiệp vụ hoặc danh sách file thiết kế liên quan"
---

# Skill: doc-itb-implement

## Mục đích
Tạo tài liệu Test Case ITb (Scenario Integration) dựa trên các tài liệu thiết kế FE (Screen) và BE (API). Tài liệu này dùng để định nghĩa các kịch bản kiểm thử luồng nghiệp vụ xuyên suốt qua nhiều màn hình và nhiều vai trò (Role), kèm theo Test Data và Flow Data cụ thể.

## Khi nào sử dụng
- Khi user yêu cầu tạo test case ITb cho một luồng nghiệp vụ (VD: Luồng xuất bản bài viết, Luồng đăng ký và đăng nhập).
- Khi user gõ lệnh `/doc-itb-implement`.

## Hướng dẫn thực hiện (Workflow - 5 Phases)
Để tránh timeout và đảm bảo kịch bản luồng đạt chuẩn Enterprise, AI PHẢI thực hiện theo 5 Phase sau. Dừng lại và hỏi ý kiến user sau mỗi Phase.

**Phase 1: Phân tích & Vẽ Sơ đồ Luồng (Mermaid Flowchart)**
- Đọc các tài liệu thiết kế FE/BE liên quan, `TEMPLATE_ITb.md`, `VIEWPOINT_ITb.md`.
- **Bắt buộc:** Đọc tài liệu `demo_docs/[Design][DB] DATABASE_Schema.md` để nắm chính xác cấu trúc DB, phục vụ cho việc lập DB Confirmation Matrix ở bước sau.
- Xác định các Actor, Nodes (Screen/API).
- Vẽ sơ đồ `Mermaid sequenceDiagram` mô tả luồng đi qua các node.
- *Dừng lại và yêu cầu user xác nhận sơ đồ luồng.*

**Phase 2: Lập Ma trận Dữ liệu (DB Confirmation Matrix) & Setup Data**
- Viết câu lệnh SQL Setup Data (DELETE/INSERT).
- Lập bảng `DB Confirmation Matrix` mapping Step -> Table -> Column -> Expected Value -> SQL Verify.
- *Dừng lại và yêu cầu user xác nhận ma trận dữ liệu.*

**Phase 3: Lập Checklist (ITb Checklist)**
- Dựa vào 9 Pattern Taxonomy (HP, ALT, IDEM, PIPE-INT, PRE-MISS, DEL-CASC, STATE-VIO, CONC, ISO), lập bảng `ITb Checklist` tóm tắt các TC sẽ viết.
- Đảm bảo tuân thủ Anti-pattern: Mọi TC phải đi qua >= 2 nodes.
- *Dừng lại và yêu cầu user xác nhận checklist.*

**Phase 4: Viết Kịch bản Chi tiết (Happy Path & Alternative)**
- Viết bảng `TC Detail` cho các pattern `HP` và `ALT`.
- Step và Expected Result phải đánh số tương ứng (1-1).
- *Dừng lại và hỏi user có muốn viết tiếp các TC Error không.*

**Phase 5: Viết Kịch bản Chi tiết (Error & Edge Cases) & Hoàn thiện file**
- Viết bảng `TC Detail` cho các pattern còn lại (IDEM, PIPE-INT, PRE-MISS, DEL-CASC, STATE-VIO, CONC, ISO).
- Tổng hợp toàn bộ nội dung từ Phase 1 đến Phase 5 thành 1 file hoàn chỉnh.
- Lưu file vào `demo_docs/tests/ITb/[Test][ITb] TC_{TênLuồng}.md`.
- Cập nhật `PROJECT_MANIFEST.yml` để thêm đường dẫn file test case vừa tạo vào section `test_cases.itb` của feature tương ứng (hoặc tạo một feature group mới cho luồng).

## Yêu cầu đầu ra
- File Markdown tuân thủ 100% cấu trúc của `TEMPLATE_ITb.md`.
- Dữ liệu SQL phải hợp lệ với PostgreSQL.
- Các bước phải logic, không bị đứt gãy dữ liệu.

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
