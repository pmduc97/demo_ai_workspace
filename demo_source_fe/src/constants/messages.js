export const MESSAGES = {
  'AUTH-E-001': 'Email và mật khẩu là bắt buộc',
  'AUTH-E-002': 'Email hoặc mật khẩu không đúng',
  'AUTH-E-003': 'Đăng nhập thất bại',
  'AUTH-E-004': 'Email không đúng định dạng',
  'AUTH-E-005': 'Mật khẩu tối thiểu 6 ký tự',
  'AUTH-S-001': 'Đăng nhập thành công',
  'AUTH-I-001': 'Tự động chuyển tới dashboard',
  'AUTH-C-001': 'Xác nhận gửi thông tin đăng nhập',
  'COMMON-E-001': 'Có lỗi xảy ra',
  'CATEGORY-E-001': 'Dữ liệu danh mục không hợp lệ',
  'CATEGORY-E-002': 'Slug danh mục đã tồn tại',
  'CATEGORY-E-003': 'Danh mục không tồn tại',
  'CATEGORY-E-004': 'Bạn không có quyền quản lý danh mục',
  'CATEGORY-S-001': 'Tạo danh mục thành công',
  'CATEGORY-S-002': 'Cập nhật danh mục thành công',
  'CATEGORY-S-003': 'Xóa danh mục thành công',
  'CATEGORY-C-001': 'Xóa mềm danh mục này? Danh mục sẽ bị ẩn khỏi danh sách public nhưng dữ liệu bài viết vẫn được giữ.',
  'CATEGORY-I-001': 'Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!',
};

export function getMessage(messageId, fallback = MESSAGES['COMMON-E-001']) {
  return MESSAGES[messageId] || fallback;
}
