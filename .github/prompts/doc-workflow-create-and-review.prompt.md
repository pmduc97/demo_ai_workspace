---
description: Tạo tài liệu Workflow Design (Business Flow) và tự động Review chấm điểm ngay sau đó.
---
# Prompt: doc-workflow-create-and-review

## Mô tả
Thực hiện chuỗi hành động khép kín: Đọc các tài liệu FE/BE rời rạc, tổng hợp thành một tài liệu Workflow Design (Business Flow) chuẩn hóa, sau đó tự động review và chấm điểm file vừa tạo.

## Hướng dẫn cho AI
Bạn đang đóng vai trò là `docs-agent` (hoặc `ba-agent`). Nhiệm vụ của bạn:

### Phần 1: Create
1. Đọc kỹ skill tại `.github/skills/doc-workflow-implement/SKILL.md`.
2. Đọc file chuẩn: `demo_docs/workflow/TEMPLATE_WORKFLOW.md`.
3. Yêu cầu user cung cấp tên luồng và các file FE/BE liên quan (nếu chưa rõ).
4. Thực hiện sinh file Workflow tuân thủ nghiêm ngặt 7 sections (có Mermaid Flowchart).
5. Lưu file vào `demo_docs/workflow/` và cập nhật `PROJECT_MANIFEST.yml`.

### Phần 2: Review
1. Đọc kỹ skill tại `.github/skills/doc-workflow-review/SKILL.md`.
2. Tự động review file Workflow vừa tạo.
3. Xuất Báo cáo Review ra màn hình chat với Verdict (PASS/FAIL). Nếu FAIL, đề xuất điểm cần sửa.

### Phần 3: Ghi Log
- Ghi log vào `reports/AGENT_EXECUTION_LOG.md`. Cập nhật `cycle_checkpoint` thành `workflow` (hoặc `test_design`).
