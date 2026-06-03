# Kế hoạch Triển khai Test Case ITa & ITb (Integration Testing)

Tài liệu này lưu trữ các bước cần thiết để tích hợp quy trình thiết kế và thực thi Test Case ITa (Functional) và ITb (Scenario) vào AI Workflow của dự án.

## Giai đoạn 1: Chuẩn bị Cấu trúc & Template (Đã hoàn thành)
- [x] **Cập nhật `PROJECT_MANIFEST.yml`**: Thêm section theo dõi trạng thái tài liệu Test Case (ITa/ITb).
- [x] **Tạo Template, Viewpoint, Checklist cho ITa**: Đã tạo trong `demo_docs/tests/ITa/`.
- [x] **Tạo Template, Viewpoint, Checklist cho ITb**: Đã tạo trong `demo_docs/tests/ITb/`.
- [x] **Tạo AI Skills & Prompts**: Đã tạo `/doc-ita-create`, `/doc-ita-review`, `/doc-itb-create`, `/doc-itb-review`.

## Giai đoạn 2: Nâng cấp AI Workflow & Skills (Đang thực hiện)
- [ ] **Tổ chức lại thư mục code test**: Tạo `demo_playwright/tests/ITa_functional/` và `demo_playwright/tests/ITb_scenarios/`.
- [ ] **Cập nhật AI Skill `/playwright-suite`**: Bắt buộc `playwright-agent` phải đọc file Test Case Markdown (ITa/ITb) để map 1-1 ra code Playwright (Data-Driven Testing).
- [ ] **Cập nhật `Orchestrator`**: Thêm bước `test design` vào vòng lặp phát triển chuẩn.

## Giai đoạn 3: Thực thi & Kiểm chứng (Proof of Concept)
- [ ] **Sinh tài liệu ITa**: Chạy thử `/doc-ita-create` cho chức năng Auth (Login).
- [ ] **Sinh code Playwright**: Chạy thử `/playwright-create` để AI tự động sinh code test từ file ITa vừa tạo.
- [ ] **Verify**: Chạy lệnh test Playwright để xác nhận code test hoạt động đúng.
