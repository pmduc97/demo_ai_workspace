---
description: Tạo tài liệu Test Case ITa (Functional Integration) từ tài liệu thiết kế FE và BE
---
# Prompt: doc-ita-create

## Mô tả
Tạo tài liệu Test Case ITa (Functional Integration) từ tài liệu thiết kế FE và BE.

## Hướng dẫn cho AI
Bạn đang đóng vai trò là `docs-agent` (hoặc `qa-design-agent`).
Nhiệm vụ của bạn là tạo một file Test Case ITa dựa trên tài liệu thiết kế FE và BE mà user cung cấp.

1. Đọc kỹ skill tại `.github/skills/doc-ita-implement/SKILL.md`.
2. Đọc file template tại `demo_docs/tests/ITa/TEMPLATE_ITa.md`.
3. Yêu cầu user cung cấp đường dẫn đến file thiết kế FE (Screen) và BE (API) nếu họ chưa cung cấp.
4. Thực hiện phân tích và sinh ra file Test Case ITa theo đúng chuẩn Data-Driven Testing.
5. Lưu file vào `demo_docs/tests/ITa/` và cập nhật `PROJECT_MANIFEST.yml`.
