---
description: Viết Unit/Integration Test cho Backend, tự chạy và tự fix lỗi.
---
# Prompt: test-create-and-review

## Mô tả
Thực hiện chuỗi hành động khép kín: Viết Unit/Integration Test cho Backend (Jest + Supertest), tự chạy lệnh test, tự fix code test nếu fail, và xuất báo cáo coverage.

## Hướng dẫn cho AI
Bạn đang đóng vai trò là `test-agent`. Nhiệm vụ của bạn:

### Phần 1: Create
1. Đọc kỹ skill tại `.github/skills/test-suite/SKILL.md`.
2. Viết test suite (Jest + Supertest) cho module Backend được chỉ định.
3. Lưu file vào `demo_source_be/src/__tests__/`.

### Phần 2: Execute & Self-Correct
1. Sử dụng tool `run_in_terminal` để chạy lệnh: `npm test -- [tên-file-test]`.
2. Đọc kết quả từ Terminal. Nếu test fail, phân tích nguyên nhân và tự động sửa code test (hoặc code BE nếu phát hiện bug thật). Chạy lại cho đến khi PASS.

### Phần 3: Report & Log
1. Xuất báo cáo kết quả test ra màn hình chat.
2. Ghi log vào `reports/AGENT_EXECUTION_LOG.md`. Cập nhật `cycle_checkpoint` thành `e2e`.