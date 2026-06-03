---
description: Tạo tài liệu Test Case ITb (Scenario Integration) từ tài liệu thiết kế FE và BE
---
# Prompt: doc-itb-create

## Mô tả
Tạo tài liệu Test Case ITb (Scenario Integration - Test Luồng) từ các tài liệu thiết kế FE và BE.

## Hướng dẫn cho AI
Bạn đang đóng vai trò là `qa-design-agent` (hoặc `docs-agent`).
Nhiệm vụ của bạn là tạo một file Test Case ITb mô phỏng một luồng nghiệp vụ xuyên suốt dựa trên các tài liệu thiết kế FE và BE mà user cung cấp.

1. Đọc kỹ skill tại `.github/skills/doc-itb-implement/SKILL.md`.
2. Đọc file template tại `demo_docs/tests/ITb/TEMPLATE_ITb.md`.
3. Yêu cầu user cung cấp danh sách các file thiết kế FE (Screen) và BE (API) liên quan đến luồng nếu họ chưa cung cấp.
4. Thực hiện phân tích và sinh ra file Test Case ITb theo đúng chuẩn Scenario Testing (có Setup Data và Flow Data).
5. Lưu file vào `demo_docs/tests/ITb/` và cập nhật `PROJECT_MANIFEST.yml`.
