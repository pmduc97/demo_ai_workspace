import { expect, test } from '@playwright/test';
import { AdminUserListPage } from '../../page-objects/AdminUserListPage';
import { captureEvidence } from '../../utils/evidence';
import { loginApi, memberCreds, normalizeAdminUsersData, seedBrowserAuth, td } from '../../utils/adminUsersFixtures';

test.describe('ITa Admin Users - Chunk 02 UI security error', () => {
  test('TC_UI_011 Disabled khóa tài khoản chính mình', async ({ page, request }, testInfo) => {
    await normalizeAdminUsersData(request);
    const usersPage = new AdminUserListPage(page);
    await usersPage.openWithAdmin();
    await captureEvidence(page, testInfo, 'self-status-button');
    await expect(usersPage.rowByEmail('admin@hoianblog.vn').getByRole('button', { name: 'active' })).toBeDisabled();
  });

  test('TC_UI_012 Chặn email tạo mới sai format', async ({ page, request }, testInfo) => {
    await normalizeAdminUsersData(request);
    const usersPage = new AdminUserListPage(page);
    await usersPage.openWithAdmin();
    await usersPage.openCreate();
    const form = page.locator('form').filter({ has: page.locator('input[type="password"]') });
    await form.getByPlaceholder('Họ tên').fill('Invalid Email User');
    await form.locator('input[type="email"]').fill('invalid-email');
    await form.locator('input[type="password"]').fill('password123');
    await captureEvidence(page, testInfo, 'invalid-email');
    await usersPage.saveModal();
    await expect.poll(async () => form.locator('input[type="email"]').evaluate((element: HTMLInputElement) => element.validationMessage)).toMatch(/.+/);
  });

  test('TC_UI_013 Chặn mật khẩu tạo mới dưới 6 ký tự', async ({ page, request }, testInfo) => {
    await normalizeAdminUsersData(request);
    const usersPage = new AdminUserListPage(page);
    await usersPage.openWithAdmin();
    await usersPage.openCreate();
    const form = page.locator('form').filter({ has: page.locator('input[type="password"]') });
    await form.getByPlaceholder('Họ tên').fill('Short Password User');
    await form.locator('input[type="email"]').fill('short.password@hoianblog.vn');
    await form.locator('input[type="password"]').fill('12345');
    await captureEvidence(page, testInfo, 'short-password');
    await expect(page.getByRole('button', { name: 'Lưu' })).toBeDisabled();
  });

  test('TC_UI_014 Chặn giới thiệu vượt 500 ký tự', async ({ page, request }, testInfo) => {
    await normalizeAdminUsersData(request);
    const usersPage = new AdminUserListPage(page);
    await usersPage.openWithAdmin();
    await usersPage.openEditByEmail('member@hoianblog.vn');
    await usersPage.fillProfile({ bio: td.bio501 });
    await captureEvidence(page, testInfo, 'bio-over-max');
    await expect(page.getByPlaceholder('Giới thiệu')).toHaveValue('a'.repeat(500));
  });

  test('TC_UI_015 Chặn ngày sinh lớn hơn hôm nay', async ({ page, request }, testInfo) => {
    await normalizeAdminUsersData(request);
    const usersPage = new AdminUserListPage(page);
    await usersPage.openWithAdmin();
    await usersPage.openEditByEmail('member@hoianblog.vn');
    await usersPage.fillProfile({ birthdate: td.futureBirthdate });
    await captureEvidence(page, testInfo, 'future-birthdate');
    const responsePromise = page.waitForResponse((res) => /\/api\/admin\/users\/\d+$/.test(res.url()) && res.request().method() === 'PUT');
    await usersPage.saveModal();
    expect((await responsePromise).status()).toBe(422);
  });

  test('TC_UI_016 Bắt nhập lý do khi khóa user', async ({ page, request }, testInfo) => {
    await normalizeAdminUsersData(request);
    const usersPage = new AdminUserListPage(page);
    await usersPage.openWithAdmin();
    await usersPage.rowByEmail('ita.member.lock@hoianblog.vn').getByRole('button', { name: 'active' }).click();
    await captureEvidence(page, testInfo, 'lock-no-reason');
    await expect(page.getByRole('button', { name: 'Xác nhận' })).toBeDisabled();
  });

  test('TC_UI_017 Member truy cập bị redirect/ẩn màn quản lý', async ({ page, request }, testInfo) => {
    const member = await loginApi(request, memberCreds.email, memberCreds.password);
    await seedBrowserAuth(page, member.token, member.user);
    await page.goto('/admin/users');
    await captureEvidence(page, testInfo, 'member-access-denied');
    await expect(page.getByText(/Quản Lý Người Dùng/)).not.toBeVisible();
  });

  test('TC_UI_018 Hiển thị empty state khi không có kết quả', async ({ page, request }, testInfo) => {
    await normalizeAdminUsersData(request);
    const usersPage = new AdminUserListPage(page);
    await usersPage.openWithAdmin();
    await usersPage.search('zzzz-no-user');
    await expect(page.getByText('Không tìm thấy người dùng phù hợp')).toBeVisible();
    await expect(usersPage.exportButton).toBeDisabled();
    await captureEvidence(page, testInfo, 'empty-state');
  });

  test('TC_UI_019 Hiển thị ErrorBanner khi API lỗi hệ thống', async ({ page, request }, testInfo) => {
    await normalizeAdminUsersData(request);
    const usersPage = new AdminUserListPage(page);
    await usersPage.loginAs('admin@hoianblog.vn', 'password123');
    await page.route('**/api/admin/users**', (route) => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ messageId: 'COMMON-E-001', message: 'Lỗi hệ thống' }) }));
    await page.locator('a[href="/admin/users"]').first().click();
    await expect(page).toHaveURL(/\/admin\/users/);
    await expect(page.locator('.bg-red-50')).toContainText(/COMMON-E-001|Lỗi hệ thống|Có lỗi xảy ra/);
    await captureEvidence(page, testInfo, 'network-error');
  });

  test('TC_UI_020 Ngăn double-click khi lưu profile', async ({ page, request }, testInfo) => {
    await normalizeAdminUsersData(request);
    const usersPage = new AdminUserListPage(page);
    await usersPage.openWithAdmin();
    await usersPage.openEditByEmail('ita.member.lock@hoianblog.vn');
    let count = 0;
    page.on('request', (req) => { if (req.method() === 'PUT' && /\/api\/admin\/users\/\d+$/.test(req.url())) count += 1; });
    await usersPage.fillProfile({ name: 'Double Click User' });
    await captureEvidence(page, testInfo, 'before-double-click');
    const saveButton = page.getByRole('button', { name: 'Lưu' });
    await saveButton.click();
    await saveButton.click({ timeout: 500 }).catch(() => undefined);
    await expect(usersPage.successBanner).toBeVisible();
    expect(count).toBe(1);
  });
});
