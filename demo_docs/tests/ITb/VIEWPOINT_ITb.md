# Quan điểm Kiểm thử ITb (Scenario Integration Test Viewpoints)

Tài liệu này định nghĩa các góc độ (viewpoints) bắt buộc phải xem xét khi thiết kế Test Case ITb (Test Luồng/Workflow). Khác với ITa (chỉ test 1 chức năng), ITb tập trung vào sự liên kết giữa nhiều chức năng, nhiều màn hình và nhiều người dùng.

## 1. Viewpoint: Design Specification Coverage (Bao phủ tài liệu thiết kế)
*Mục tiêu: Đảm bảo kịch bản luồng không bỏ sót bất kỳ màn hình, action hay API nào đã được định nghĩa cho luồng đó trong tài liệu thiết kế.*
- **FE Screen Design:** Phải bao phủ tất cả các màn hình tham gia vào luồng, tất cả các action chuyển trang (Navigation), và các event trigger luồng được định nghĩa.
- **BE API Design:** Phải bao phủ tất cả các API liên quan trong luồng, kiểm tra sự thay đổi trạng thái DB qua từng API call nối tiếp nhau.

## 2. Viewpoint: End-to-End Business Flow (Luồng nghiệp vụ xuyên suốt)
*Mục tiêu: Đảm bảo một quy trình nghiệp vụ thực tế có thể hoàn thành từ đầu đến cuối.*
- **Tính liên tục:** Dữ liệu tạo ra ở bước A phải được hiển thị và sử dụng đúng ở bước B, C. (VD: Tạo Category -> Tạo Post chọn Category đó -> Ra trang chủ filter theo Category đó).
- **Tính toàn vẹn (Data Consistency):** Nếu xóa/sửa dữ liệu ở một bước, các bước sau phải phản ánh đúng sự thay đổi đó (VD: Xóa bài viết -> Ra trang chủ không còn thấy bài viết đó nữa).

## 3. Viewpoint: State Transition (Chuyển đổi trạng thái)
*Mục tiêu: Đảm bảo vòng đời của một đối tượng (Entity Lifecycle) hoạt động đúng.*
- **Chuyển trạng thái hợp lệ:** VD: Bài viết từ `draft` -> `published`.
- **Hiệu ứng phụ (Side-effects):** Khi trạng thái thay đổi, quyền truy cập hoặc hiển thị phải thay đổi theo (VD: Bài `draft` thì Guest không thấy, bài `published` thì Guest thấy).

## 4. Viewpoint: Role-based Access Control & Multi-Actor (Phân quyền & Đa người dùng)
*Mục tiêu: Đảm bảo luồng nghiệp vụ an toàn khi có nhiều role tương tác.*
- **Chuyển đổi Role (Role Switching):** Kịch bản yêu cầu đăng nhập Admin làm việc A, sau đó đăng xuất, đăng nhập Member làm việc B để kiểm tra sự cô lập dữ liệu.
- **Bảo mật luồng (Flow Security):** Đảm bảo user không thể "nhảy cóc" các bước trong luồng nếu không có quyền (VD: Member lấy được URL duyệt bài của Admin và cố gắng truy cập).

## 5. Viewpoint: Concurrency & Edge Cases (Đồng thời & Ngoại lệ trong luồng)
*Mục tiêu: Xử lý các tình huống thực tế khi luồng bị gián đoạn.*
- **Dữ liệu bị thay đổi giữa chừng:** Đang ở màn hình Edit bài viết, nhưng một Admin khác đã xóa bài viết đó -> Khi bấm Save sẽ xử lý thế nào?
- **Hủy ngang (Cancellation):** Đi được nửa luồng rồi bấm Cancel/Back -> Dữ liệu rác có bị dọn dẹp không? Trạng thái hệ thống có bị lỗi không?
