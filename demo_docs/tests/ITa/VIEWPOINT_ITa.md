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
