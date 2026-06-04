---
description: Tạo Test Case ITb (có dùng MCP lấy data thật) và tự động Review chấm điểm ngay sau đó.
---
# Prompt: doc-itb-create-and-review

## Mô tả
Thực hiện chuỗi hành động khép kín: Tạo tài liệu Test Case ITb (Scenario Integration) từ tài liệu thiết kế FE/BE, sử dụng MCP để lấy dữ liệu mẫu thực tế, sau đó tự động review và chấm điểm file vừa tạo.

## Hướng dẫn cho AI
Bạn đang đóng vai trò là `qa-design-agent` (hoặc `docs-agent`). Nhiệm vụ của bạn:

### Phần 1: Create
1. Đọc kỹ skill tại `.github/skills/doc-itb-implement/SKILL.md`.
2. Đọc các file chuẩn: `demo_docs/tests/ITb/TEMPLATE_ITb.md`, `demo_docs/tests/ITb/VIEWPOINT_ITb.md`.
3. **BẮT BUỘC SỬ DỤNG MCP:** Gọi các tool từ `mcp-db-sampler` để lấy cấu trúc bảng và dữ liệu mẫu thực tế từ Database.
4. Thực hiện sinh file Test Case ITb tuân thủ nghiêm ngặt 5 Phase (có Mermaid Flowchart và DB Confirmation Matrix).
5. Lưu file vào `demo_docs/tests/ITb/` và cập nhật `PROJECT_MANIFEST.yml`.

### Phần 2: Review
1. Đọc kỹ skill tại `.github/skills/doc-itb-review/SKILL.md`.
2. Đọc file checklist tại `demo_docs/tests/ITb/CHECKLIST_TC_ITb.md`.
3. Tự động review file Test Case ITb vừa tạo.
4. Xuất Báo cáo Review ra màn hình chat với Verdict (PASS/FAIL). Nếu FAIL, đề xuất điểm cần sửa.

### Phần 3: Ghi Log
- Ghi log vào `reports/AGENT_EXECUTION_LOG.md`. Cập nhật `cycle_checkpoint` thành `create`.