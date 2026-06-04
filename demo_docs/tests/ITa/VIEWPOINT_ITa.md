# Quan điểm Kiểm thử ITa (Functional Integration Test Viewpoints)

Tài liệu này định nghĩa các góc độ (viewpoints) bắt buộc phải xem xét khi thiết kế Test Case ITa, đảm bảo độ bao phủ (coverage) cao nhất cho cả FE và BE.

## 1. Viewpoint: Design Specification Coverage (Bao phủ tài liệu thiết kế)
*Mục tiêu: Đảm bảo Test Case không bỏ sót bất kỳ yêu cầu nào đã được chốt trong tài liệu thiết kế.*
- **FE Screen Design:** Phải test đầy đủ 100% các trường dữ liệu (fields), tất cả các quy tắc validate (Validation Rules - required, min, max, regex, format, test giá trị biên), và tất cả các sự kiện (Events Mapping - onClick, onBlur, onChange) được định nghĩa trong tài liệu.
- **BE API Design:** Phải test đầy đủ 100% các tham số đầu vào (Request params/query/body), các trường hợp thành công (Success Response), và tất cả các mã lỗi/trường hợp ngoại lệ (Error Response) được định nghĩa trong tài liệu.

## 2. Viewpoint: UI & Input Validation (FE)
*Mục tiêu: Đảm bảo FE chặn các dữ liệu rác trước khi gửi xuống BE.*
- **Bắt buộc (Required):** Bỏ trống các trường bắt buộc.
- **Độ dài (Length):** Vượt quá số ký tự tối đa (VD: 256 chars cho title), hoặc dưới mức tối thiểu.
- **Định dạng (Format):** Sai format email, số điện thoại, URL, ngày tháng.
- **Kiểu dữ liệu (Type):** Nhập chữ vào trường số, số âm vào trường yêu cầu số dương.
- **Trạng thái UI (UI State):** Nút submit phải bị disable khi form lỗi hoặc đang loading.

## 3. Viewpoint: Happy Path (FE + BE + DB)
*Mục tiêu: Đảm bảo luồng chính hoạt động trơn tru từ đầu đến cuối.*
- **Data chuẩn:** Nhập dữ liệu hợp lệ hoàn toàn -> Gọi API thành công (200/201) -> DB lưu đúng -> UI hiển thị thông báo thành công và chuyển hướng đúng theo Design.
- **Data biên (Boundary):** Nhập dữ liệu vừa đúng giới hạn (VD: đúng 255 ký tự).

## 4. Viewpoint: Negative Path & Error Handling (BE -> FE)
*Mục tiêu: Đảm bảo BE bắt lỗi logic và FE hiển thị lỗi thân thiện cho user.*
- **Lỗi Logic (400/422):** Trùng lặp dữ liệu (Unique constraint), tham chiếu sai (Foreign key không tồn tại - VD: category_id sai).
- **Lỗi Xác thực (401):** Không có token, token hết hạn, token sai format.
- **Lỗi Phân quyền (403):** User có token nhưng không đủ role (VD: member cố gắng xóa bài của người khác).
- **Lỗi Không tìm thấy (404):** Cố gắng cập nhật/xóa một record không tồn tại.
- **Lỗi Server (500):** Giả lập server crash, FE phải hiện thông báo "Lỗi hệ thống" thay vì trắng trang.

## 5. Viewpoint: Security (Bảo mật cơ bản)
*Mục tiêu: Chống các cuộc tấn công phổ biến.*
- **XSS (Cross-Site Scripting):** Nhập `<script>alert(1)</script>` vào các trường text. Đảm bảo BE lưu chuỗi an toàn hoặc FE render an toàn (không thực thi script).
- **SQL Injection:** Nhập `' OR 1=1 --` vào các trường search/login.

## 6. Viewpoint: Network & Exception
*Mục tiêu: Đảm bảo UX tốt khi môi trường mạng không ổn định.*
- **Mất mạng (Offline):** Submit form khi ngắt kết nối mạng -> FE báo lỗi kết nối.
- **Timeout:** API phản hồi quá chậm (> 10s) -> FE báo timeout, không bị treo.

## 7. Viewpoint: Initial State & UI Layout (Trạng thái khởi tạo & Giao diện)
*Mục tiêu: Đảm bảo giao diện hiển thị đúng thiết kế và trạng thái ban đầu chuẩn xác.*
- **Initial State:** Giá trị mặc định (default value) của các form tạo mới đúng spec. Trạng thái loading ban đầu hoạt động đúng.
- **Empty State:** Khi danh sách không có dữ liệu (0 record), UI hiển thị thông báo phù hợp, không bị vỡ layout.
- **Layout & Responsive:** Không vỡ khung khi thu nhỏ màn hình. Text quá dài (maxlength) được xử lý cắt chữ (ellipsis) hoặc wrap đúng cách.

## 8. Viewpoint: Pagination / Sort / Filter (Hành vi Danh sách)
*Mục tiêu: Đảm bảo các tính năng điều hướng và tìm kiếm dữ liệu hoạt động chính xác.*
- **Phân trang (Pagination):** Nút Next/Prev hoạt động đúng, số lượng record trên mỗi trang và tổng số trang hiển thị chính xác.
- **Lọc/Tìm kiếm (Filter/Search):** Kết hợp nhiều điều kiện lọc hoạt động đúng. Giữ nguyên điều kiện lọc khi chuyển trang hoặc khi ấn Back từ trang chi tiết quay lại.

## 9. Viewpoint: Composite Validation & Sanitization (Validate tương quan & Tiền xử lý)
*Mục tiêu: Đảm bảo tính toàn vẹn của dữ liệu phức tạp và làm sạch dữ liệu trước khi gửi.*
- **Validate tương quan (Composite):** Bắt lỗi logic liên quan đến nhiều trường cùng lúc (VD: Ngày kết thúc phải lớn hơn ngày bắt đầu).
- **Tiền xử lý (Sanitization):** Tự động trim khoảng trắng (space) ở đầu/cuối khi submit form. Xóa các số 0 vô nghĩa ở đầu (leading zeros) đối với trường số.

## 10. Viewpoint: Usability & Double-click Prevention (Trải nghiệm & Ngăn thao tác sai)
*Mục tiêu: Cải thiện trải nghiệm người dùng (UX) và tránh rác dữ liệu do thao tác nhầm.*
- **Double-click:** Click liên tục nhiều lần vào nút submit (Tạo mới/Đăng nhập) -> FE disable nút ngay lập tức, không gọi API 2 lần, không tạo ra dữ liệu trùng lặp.
- **Focus & Navigation:** Khi form có lỗi, tự động focus vào trường bị lỗi đầu tiên. Hỗ trợ Tab order chuẩn từ trên xuống dưới, từ trái qua phải.

## 11. Viewpoint: File Upload (Xử lý tệp tin)
*Mục tiêu: Đảm bảo tính năng tải lên tệp tin hoạt động an toàn và đúng thiết kế.*
- **Validate File:** Kiểm tra định dạng file (chỉ cho phép jpg, png, webp...), dung lượng file (VD: tối đa 5MB).
- **Upload Behavior:** Xử lý khi upload lỗi (file hỏng, mất mạng). UI hiển thị preview ảnh chính xác sau khi upload thành công.

## 12. Viewpoint: Concurrency / Exclusion (Xử lý đồng thời)
*Mục tiêu: Đảm bảo tính nhất quán của dữ liệu khi có nhiều người dùng thao tác cùng lúc.*
- **Ghi đè dữ liệu (Locking/Exclusion):** Kịch bản 2 user cùng mở trang Edit của 1 record. User A lưu trước, User B lưu sau -> Hệ thống xử lý đúng theo spec (Báo lỗi cho User B hoặc áp dụng Last write wins).

---

## 13. Nguyên tắc thiết kế Test Case (Golden Rules)
*Mục tiêu: Đảm bảo Test Case rõ ràng, dễ đọc, không bị gộp case lộn xộn và dễ dàng chuyển đổi thành Automation Test.*

- **Tách bạch [UI] và [API]:** 
  - `[UI]`: Chỉ kiểm tra hành vi hiển thị trên màn hình (không mở Network tab).
  - `[API]`: Mở Network tab để verify endpoint + method + status code + response body.
- **1 Condition = 1 TC:** Không gộp nhiều field hoặc nhiều rule vào cùng 1 TC.
- **Tách Boundary:** Giá trị biên hợp lệ (exact-max) và không hợp lệ (over-max) phải là 2 TC riêng biệt.
- **Thứ tự viết TC (Flow chuẩn):** Validate (từng field một) -> Happy Path -> Permission -> Pagination -> Error Handling.
- **Format chuyên nghiệp:** 
  - Step procedure đánh số `1, 2, 3...`.
  - Expected result bắt buộc có prefix số tương ứng `1., 2., 3...` để biết kết quả nào thuộc bước nào.
  - Tên UI element để trong ngoặc vuông (VD: `[Button Submit]`).
