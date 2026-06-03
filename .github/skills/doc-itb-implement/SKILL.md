---
name: doc-itb-implement
description: "Workflow tạo tài liệu Test Case ITb (Scenario Integration). Sử dụng khi cần định nghĩa kịch bản kiểm thử luồng nghiệp vụ xuyên suốt qua nhiều màn hình và role. Trigger phrases: tạo test case itb, viết test case luồng, doc itb."
argument-hint: "Tên luồng nghiệp vụ hoặc danh sách file thiết kế liên quan"
---

# Skill: doc-itb-implement

## Mục đích
Tạo tài liệu Test Case ITb (Scenario Integration) dựa trên các tài liệu thiết kế FE (Screen) và BE (API). Tài liệu này dùng để định nghĩa các kịch bản kiểm thử luồng nghiệp vụ xuyên suốt qua nhiều màn hình và nhiều vai trò (Role), kèm theo Test Data và Flow Data cụ thể.

## Khi nào sử dụng
- Khi user yêu cầu tạo test case ITb cho một luồng nghiệp vụ (VD: Luồng xuất bản bài viết, Luồng đăng ký và đăng nhập).
- Khi user gõ lệnh `/doc-itb-implement`.

## Hướng dẫn thực hiện (Workflow)
1. **Thu thập thông tin**:
   - Đọc các file tài liệu thiết kế FE (Screen) liên quan đến luồng.
   - Đọc các file tài liệu thiết kế BE (API) liên quan đến luồng.
   - Đọc file `demo_docs/tests/ITb/TEMPLATE_ITb.md` để lấy cấu trúc chuẩn.
   - Đọc file `demo_docs/tests/ITb/VIEWPOINT_ITb.md` để nắm các góc độ kiểm thử luồng bắt buộc.
   - Đọc file `demo_docs/tests/ITb/CHECKLIST_TC_ITb.md` để tự kiểm tra chất lượng đầu ra.

2. **Phân tích & Thiết kế Luồng**:
   - Xác định các Actor (Role) tham gia vào luồng.
   - Xác định trình tự các bước (Steps) đi qua các màn hình nào, gọi API nào.
   - Xác định các dữ liệu cần luân chuyển giữa các bước (Flow Data - VD: ID bài viết tạo ở bước 1 dùng để xem ở bước 3).

3. **Sinh dữ liệu Test (Test Data)**:
   - Viết câu lệnh SQL (Setup Data) để chuẩn bị trạng thái DB trước khi chạy luồng (DELETE data rác, INSERT data nền).
   - Lập bảng Flow Data định nghĩa các biến sẽ được lưu trữ và truyền đi trong quá trình chạy luồng.

4. **Viết Kịch bản Luồng (Scenario Steps)**:
   - Viết từng bước theo thứ tự thời gian.
   - Mỗi bước phải ghi rõ: Actor, Màn hình, Hành động, và Kết quả mong đợi (bao gồm cả UI, API, và DB state).
   - Đảm bảo kịch bản bao phủ các Viewpoint: End-to-End, State Transition, và Multi-Actor.

5. **Tạo file**:
   - Lưu file vào thư mục `demo_docs/tests/ITb/` với định dạng tên `[Test][ITb] TC_{TênLuồng}.md`.
   - Cập nhật `PROJECT_MANIFEST.yml` để thêm đường dẫn file test case vừa tạo vào section `test_cases.itb` của feature tương ứng (hoặc tạo một feature group mới cho luồng).

## Yêu cầu đầu ra
- File Markdown tuân thủ 100% cấu trúc của `TEMPLATE_ITb.md`.
- Dữ liệu SQL phải hợp lệ với PostgreSQL.
- Các bước phải logic, không bị đứt gãy dữ liệu.
