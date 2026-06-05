---
name: doc-workflow-implement
description: "Workflow tạo tài liệu Workflow Design (Business Flow). Sử dụng để tổng hợp logic từ các tài liệu FE/BE rời rạc thành một luồng nghiệp vụ xuyên suốt, làm đầu vào chuẩn cho việc viết Test Case ITb. Trigger phrases: tạo workflow, viết luồng nghiệp vụ, doc workflow."
argument-hint: "Tên luồng nghiệp vụ và danh sách các file FE/BE liên quan"
---

# Skill: doc-workflow-implement

## Mục đích
Tạo tài liệu Workflow Design (Business Flow) chuẩn hóa. Tài liệu này đóng vai trò là "Single Source of Truth" cho logic nghiệp vụ của một luồng xuyên suốt, giúp con người dễ dàng review trước khi AI tiến hành sinh Test Case ITb.

## Khi nào sử dụng
- Trước khi tạo Test Case ITb.
- Khi cần tài liệu hóa một luồng nghiệp vụ phức tạp đi qua nhiều màn hình và API.

## Hướng dẫn thực hiện

**Bước 1: Thu thập thông tin**
- Đọc yêu cầu của user về luồng nghiệp vụ cần tạo.
- Đọc các tài liệu thiết kế FE (Screen) và BE (API) liên quan đến luồng này.
- Đọc `demo_docs/workflow/TEMPLATE_WORKFLOW.md` để nắm cấu trúc chuẩn.

**Bước 2: Phân tích và Tổng hợp**
- Xác định các Actor tham gia vào luồng.
- Xác định Pre-conditions và Post-conditions.
- Xây dựng Main Flow (Happy Path) từng bước rõ ràng.
- Xác định các Alternative Flows (rẽ nhánh hợp lệ) và Exception Flows (lỗi nghiệp vụ).

**Bước 3: Vẽ sơ đồ Mermaid**
- Tạo `sequenceDiagram` mô tả trực quan sự tương tác giữa Actor, Frontend, Backend và Database.

**Bước 4: Xuất file**
- Lưu file vào `demo_docs/workflow/[Design][WORKFLOW] WF{ID}_{TênLuồng}.md`.
- Cập nhật `PROJECT_MANIFEST.yml` (nếu cần thiết, thêm mục `workflow` vào feature tương ứng).

## Yêu cầu đầu ra
- File Markdown tuân thủ 100% cấu trúc của `TEMPLATE_WORKFLOW.md`.
- Sơ đồ Mermaid render không bị lỗi syntax.
- Logic nghiệp vụ phải khớp với các tài liệu FE/BE đã có.

---

## 📝 Ghi Log Bắt Buộc
Sau khi hoàn thành, ghi log vào `reports/AGENT_EXECUTION_LOG.md` với `Skill Used: doc-workflow-implement`.
