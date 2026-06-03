---
name: doc-ita-implement
description: "Workflow tạo tài liệu Test Case ITa (Functional Integration). Sử dụng khi cần định nghĩa kịch bản kiểm thử chức năng, UI Validation, Happy Path, Negative Path kèm Test Data. Trigger phrases: tạo test case ita, viết test case chức năng, doc ita."
argument-hint: "Tên chức năng hoặc đường dẫn file thiết kế FE/BE"
---

# Skill: doc-ita-implement

## Mục đích
Tạo tài liệu Test Case ITa (Functional Integration) dựa trên tài liệu thiết kế FE (Screen) và BE (API). Tài liệu này dùng để định nghĩa các kịch bản kiểm thử tích hợp chức năng, bao gồm UI Validation, Happy Path, và Negative Path, kèm theo Test Data cụ thể (SQL setup và Input Data Sets).

## Khi nào sử dụng
- Khi user yêu cầu tạo test case ITa cho một chức năng.
- Khi user gõ lệnh `/doc-ita-implement`.

## Hướng dẫn thực hiện (Workflow)
1. **Thu thập thông tin**:
   - Đọc file tài liệu thiết kế FE (Screen) được chỉ định.
   - Đọc file tài liệu thiết kế BE (API) tương ứng.
   - Đọc file `demo_docs/tests/ITa/TEMPLATE_ITa.md` để lấy cấu trúc chuẩn.
   - Đọc file `demo_docs/tests/ITa/VIEWPOINT_ITa.md` để nắm các góc độ kiểm thử bắt buộc.
   - Đọc file `demo_docs/tests/ITa/CHECKLIST_TC_ITa.md` để tự kiểm tra chất lượng đầu ra.
2. **Phân tích & Trích xuất**:
   - Từ FE: Lấy các Validation Rules, Events Mapping, Error Handling.
   - Từ BE: Lấy Request Payload, Success Response, Error Response, Database interaction.
3. **Sinh dữ liệu Test (Test Data)**:
   - Viết câu lệnh SQL (Setup Data) để chuẩn bị trạng thái DB trước khi test (DELETE data rác, INSERT data mẫu).
   - Lập bảng Input Data Sets (Data ID, các trường dữ liệu, ghi chú). Phải bao phủ đủ các Viewpoint (Valid, Empty, Max Length, Invalid Format, Security XSS/SQLi).
4. **Viết Kịch bản Kiểm thử (Test Cases)**:
   - **4.1. UI Validation**: Map các lỗi validation từ FE với Input Data Sets tương ứng. Đảm bảo API KHÔNG được gọi.
   - **4.2. Happy Path**: Map luồng thành công từ FE gọi xuống BE. Kiểm tra API response, UI update, và DB state.
   - **4.3. Negative Path**: Map các lỗi từ BE trả về (400, 401, 403, 404, 500) và cách FE hiển thị lỗi đó.
5. **Tạo file**:
   - Lưu file vào thư mục `demo_docs/tests/ITa/` với định dạng tên `[Test][ITa] TC_{TênChứcNăng}.md`.
   - Cập nhật `PROJECT_MANIFEST.yml` để thêm đường dẫn file test case vừa tạo vào section `test_cases.ita` của feature tương ứng.

## Yêu cầu đầu ra
- File Markdown tuân thủ 100% cấu trúc của `TEMPLATE_ITa.md`.
- Dữ liệu SQL phải hợp lệ với PostgreSQL.
- Các TC ID và Data ID phải được tham chiếu chéo chính xác.
