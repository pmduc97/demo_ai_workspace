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

## 6. Viewpoint: Cross-screen Constraint & Dependency (Ràng buộc dữ liệu chéo)
*Mục tiêu: Đảm bảo tính toàn vẹn dữ liệu khi có sự phụ thuộc giữa các thực thể ở nhiều màn hình khác nhau.*
- **Ràng buộc xóa/sửa (Foreign Key/Business Logic):** Kiểm tra việc chặn thao tác khi dữ liệu đang được sử dụng. (VD: Admin tạo `Category X` -> Member tạo `Post Y` thuộc `Category X` -> Admin cố gắng xóa `Category X` -> Hệ thống phải chặn lại và báo lỗi, không làm hỏng dữ liệu bài viết).

## 7. Viewpoint: Global Data Consistency (Tính nhất quán dữ liệu toàn cục)
*Mục tiêu: Đảm bảo trạng thái DB và UI đồng bộ hoàn toàn trên toàn hệ thống sau khi một luồng kết thúc.*
- **Đồng bộ chéo hệ thống:** Dữ liệu thay đổi ở một luồng phải lập tức phản ánh đúng ở các màn hình thống kê hoặc luồng khác. (VD: Member tạo bài viết -> Admin duyệt bài -> Dashboard Stats tổng số bài viết phải tự động tăng lên 1, trang chủ Public phải hiển thị bài viết đó ngay lập tức).

## 8. Viewpoint: Workflow Error Recovery & Session (Khôi phục lỗi & Phiên làm việc)
*Mục tiêu: Kiểm tra khả năng phục hồi của hệ thống khi luồng bị gián đoạn bởi lỗi kỹ thuật hoặc hết hạn phiên.*
- **Session Timeout:** Đang thao tác giữa luồng thì hết hạn token -> Bấm Submit -> Hệ thống văng ra trang Login -> Sau khi Login lại, hệ thống xử lý thế nào (quay lại luồng cũ hay bắt đầu lại từ đầu).
- **Rác dữ liệu khi lỗi (Orphan Data):** Upload ảnh thành công nhưng Submit form bị lỗi 500 -> User Submit lại thành công -> Đảm bảo không sinh ra dữ liệu rác (duplicate ảnh) trên server.

---

## 9. Nguyên tắc cốt lõi & Anti-pattern (Bắt buộc)
- **Định nghĩa 1 TC ITb:** 1 TC ITb = 1 workflow segment đi qua **>= 2 nodes** (2 màn hình khác nhau, hoặc 2 role khác nhau).
- **Anti-pattern (CẤM):** Viết TC chỉ chạy trên 1 màn hình, check 1 bảng DB rồi dừng. Đó là scope của ITa. ITb bắt buộc phải có sự luân chuyển dữ liệu/trạng thái sang node tiếp theo.
- **Độ dài TC:** Mỗi TC nên từ 5-6 steps (tối đa 10). Nếu luồng quá dài, phải cắt thành các segment hợp lý.

## 10. Phân loại 9 Pattern Taxonomy (Coverage bắt buộc)
*Mọi kịch bản ITb phải được phân loại vào 1 trong 9 nhóm sau để đảm bảo không sót case:*
1. **`HP` (Happy Path):** Luồng chuẩn thành công xuyên màn hình (VD: Member tạo bài -> Admin duyệt -> Guest xem).
2. **`ALT` (Alternative Branch):** Luồng rẽ nhánh hợp lệ (VD: Admin từ chối duyệt bài, trả về cho Member).
3. **`IDEM` (Idempotency):** Tính lũy đẳng (VD: Bấm nút "Duyệt bài" 2 lần liên tiếp do mạng lag -> DB chỉ cập nhật 1 lần, không sinh lỗi).
4. **`PIPE-INT` (Pipeline Interruption):** Đứt gãy luồng (VD: Đang tạo bài thì hết hạn Token -> Login lại -> Luồng đi tiếp thế nào).
5. **`PRE-MISS` (Missing Prerequisite):** Thiếu dữ liệu tiền quyết (VD: Đang ở form tạo bài, một Admin khác xóa mất Category đang chọn -> Bấm Submit xử lý ra sao).
6. **`DEL-CASC` (Cascade Effect):** Hiệu ứng dây chuyền (VD: Xóa Category -> Các bài viết thuộc Category đó bị xóa theo hay set về Null?).
7. **`STATE-VIO` (State Transition Violation):** Vi phạm vòng đời (VD: Bài viết đang `draft`, dùng Postman gọi thẳng API đổi status sang `archived` bỏ qua bước `published` -> Hệ thống phải chặn).
8. **`CONC` (Concurrency):** Tranh chấp dữ liệu (VD: 2 Admin cùng duyệt 1 bài viết cùng lúc).
9. **`ISO` (Role Isolation):** Cô lập dữ liệu (VD: Member A không thể nhìn thấy bài `draft` của Member B).
