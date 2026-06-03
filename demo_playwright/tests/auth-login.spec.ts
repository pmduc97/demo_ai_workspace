import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { captureEvidence } from '../utils/evidence';

test.describe('Auth Login E2E', () => {
  test('Scenario 1: Đăng nhập thành công -> Chuyển hướng sang /admin/dashboard', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Chụp ảnh trước khi thao tác
    await captureEvidence(page, testInfo, 'Truoc-Khi-Dang-Nhap');

    // Sử dụng tài khoản admin đã được seed sẵn trong DB
    await loginPage.login('admin@hoianblog.vn', 'password123');

    // Kiểm tra xem URL có chuyển hướng đúng không
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);

    // Chụp ảnh sau khi thành công
    await captureEvidence(page, testInfo, 'Sau-Khi-Dang-Nhap-Thanh-Cong');
  });

  test('Scenario 2: Sai mật khẩu -> Hiển thị Error Banner', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Chụp ảnh trước khi thao tác
    await captureEvidence(page, testInfo, 'Truoc-Khi-Nhap-Sai');

    // Nhập sai mật khẩu
    await loginPage.login('admin@hoianblog.vn', 'wrongpassword');

    // Kiểm tra xem Error Banner có xuất hiện và chứa text lỗi từ API không
    await expect(loginPage.errorBanner).toBeVisible();
    await expect(loginPage.errorBanner).toContainText('Email hoặc mật khẩu không đúng');

    // Chụp ảnh sau khi hiển thị lỗi
    await captureEvidence(page, testInfo, 'Sau-Khi-Hien-Thi-Loi');
  });
});
