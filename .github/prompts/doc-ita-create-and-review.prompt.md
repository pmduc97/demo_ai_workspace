---
description: Tạo Test Case ITa (có dùng MCP lấy data thật) và tự động Review chấm điểm ngay sau đó.
---
# Prompt: doc-ita-create-and-review

## Mô tả
Thực hiện chuỗi hành động khép kín: Tạo tài liệu Test Case ITa (Functional Integration) từ tài liệu thiết kế FE/BE, sử dụng MCP để lấy dữ liệu mẫu thực tế, sau đó tự động review và chấm điểm file vừa tạo.

## Hướng dẫn cho AI
Bạn đang đóng vai trò là `qa-design-agent` (hoặc `docs-agent`). Nhiệm vụ của bạn là thực hiện quy trình Create & Review liên hoàn:

### Phần 1: Create (Tạo Test Case)
1. Đọc kỹ skill tại `.github/skills/doc-ita-implement/SKILL.md`.
2. Đọc các file chuẩn: `demo_docs/tests/ITa/TEMPLATE_ITa.md`, `demo_docs/tests/ITa/VIEWPOINT_ITa.md`.
3. Yêu cầu user cung cấp đường dẫn đến file thiết kế FE (Screen) và BE (API) nếu chưa có.
4. **BẮT BUỘC SỬ DỤNG MCP:** Gọi các tool từ `mcp-db-sampler` (`get_live_schema_info`, `get_sample_data`, `get_valid_foreign_keys`) để lấy cấu trúc bảng và dữ liệu mẫu thực tế từ Database. Tuyệt đối không tự bịa data (hallucinate).
5. Thực hiện sinh file Test Case ITa tuân thủ nghiêm ngặt 4 Phase (Inventory -> Checklist -> Detail -> Data) như định nghĩa trong skill.
6. Lưu file vào `demo_docs/tests/ITa/` và cập nhật `PROJECT_MANIFEST.yml`.

### Phần 2: Review (Đánh giá & Báo cáo)
1. Đọc kỹ skill tại `.github/skills/doc-ita-review/SKILL.md`.
2. Đọc file checklist tại `demo_docs/tests/ITa/CHECKLIST_TC_ITa.md`.
3. Tự động review file Test Case ITa vừa tạo ở Phần 1.
4. Đánh giá khắt khe theo 3 tiêu chí: Cấu trúc & Format (20%), Tuân thủ Golden Rules (30%), Độ bao phủ Viewpoint & Dữ liệu (50%).
5. Xuất Báo cáo Review ra màn hình chat theo đúng Output Format quy định trong skill review.
6. Đưa ra Verdict cuối cùng (PASS/FAIL). Nếu FAIL, đề xuất các điểm cần sửa.

### Phần 3: Ghi Log
- Ghi log toàn bộ quá trình vào `reports/AGENT_EXECUTION_LOG.md`.