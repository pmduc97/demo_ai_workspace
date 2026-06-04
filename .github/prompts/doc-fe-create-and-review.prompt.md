---
description: Tạo tài liệu thiết kế màn hình FE và tự động review chấm điểm.
---
# Prompt: doc-fe-create-and-review

## Mô tả
Thực hiện chuỗi hành động khép kín: Tạo tài liệu thiết kế màn hình FE (10 sections) từ yêu cầu, sau đó tự động review và chấm điểm file vừa tạo.

## Hướng dẫn cho AI
Bạn đang đóng vai trò là `docs-agent`. Nhiệm vụ của bạn:

### Phần 1: Create
1. Đọc kỹ skill tại `.github/skills/doc-fe-implement/SKILL.md`.
2. Yêu cầu user cung cấp thông tin tính năng nếu chưa có.
3. Sinh file tài liệu thiết kế FE tuân thủ 10 sections.
4. Lưu file vào `demo_docs/fe/` và cập nhật `PROJECT_MANIFEST.yml`.

### Phần 2: Review
1. Đọc kỹ skill tại `.github/skills/doc-fe-review/SKILL.md`.
2. Tự động review file vừa tạo.
3. Xuất Báo cáo Review ra màn hình chat với Verdict (PASS/FAIL). Nếu FAIL, đề xuất điểm cần sửa.

### Phần 3: Ghi Log
- Ghi log vào `reports/AGENT_EXECUTION_LOG.md`. Cập nhật `cycle_checkpoint` thành `plan`.