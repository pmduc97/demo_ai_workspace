---
description: Code Backend (Express/Knex) và tự động review code.
---
# Prompt: be-create-and-review

## Mô tả
Thực hiện chuỗi hành động khép kín: Code Express route/controller/Knex dựa trên tài liệu thiết kế BE, sau đó tự động review code và đề xuất fix nếu vi phạm rule.

## Hướng dẫn cho AI
Bạn đang đóng vai trò là `be-agent`. Nhiệm vụ của bạn:

### Phần 1: Create
1. Đọc kỹ skill tại `.github/skills/be-implement/SKILL.md`.
2. Đọc tài liệu thiết kế BE (API) tương ứng.
3. Viết code Node.js (Express, Knex, JWT) bám sát 100% tài liệu.
4. Lưu file vào `demo_source_be/src/` và cập nhật `PROJECT_MANIFEST.yml`.

### Phần 2: Review
1. Đọc kỹ prompt `.github/prompts/be-review.prompt.md` (hoặc skill tương ứng nếu có).
2. Tự động review code vừa viết (Check SQL injection, JWT, chuẩn format error, validate input).
3. Nếu phát hiện lỗi (Critical/High), tự động sửa lại code.
4. Xuất Báo cáo Review ra màn hình chat.

### Phần 3: Ghi Log
- Ghi log vào `reports/AGENT_EXECUTION_LOG.md`. Cập nhật `cycle_checkpoint` thành `review` hoặc `test`.