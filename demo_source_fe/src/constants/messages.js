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
};

export function getMessage(messageId, fallback = MESSAGES['COMMON-E-001']) {
  return MESSAGES[messageId] || fallback;
}
