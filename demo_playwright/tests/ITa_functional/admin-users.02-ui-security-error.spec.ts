import { expect, test } from '@playwright/test';
import { AdminUserListPage } from '../../page-objects/AdminUserListPage';
import { captureEvidence } from '../../utils/evidence';
import { authHeaders, loginApi, memberCreds, normalizeAdminUsersData, seedBrowserAuth, td } from '../../utils/adminUsersFixtures';

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
    await page.getByPlaceholder('Họ tên').fill('Invalid Email User');
    await page.getByPlaceholder('Email').fill('invalid-email');
    await page.getByPlaceholder('Mật khẩu').fill('password123');
    await captureEvidence(page, testInfo, 'invalid-email');
    await usersPage.saveModal();
    await expect(page.getByPlaceholder('Email')).toHaveJSProperty('validationMessage', expect.stringMatching(/.{1,}/));
  });

  test('TC_UI_013 Chặn mật khẩu tạo mới dưới 6 ký tự', async ({ page, request }, testInfo) => {
    await normalizeAdminUsersData(request);
    const usersPage = new AdminUserListPage(page);
    await usersPage.openWithAdmin();
    await usersPage.openCreate();
    await page.getByPlaceholder('Họ tên').fill('Short Password User');
    await page.getByPlaceholder('Email').fill('short.password@hoianblog.vn');
    await page.getByPlaceholder('Mật khẩu').fill('12345');
    await captureEvidence(page, testInfo, 'short-password');
    await usersPage.saveModal();
    await expect(page.getByPlaceholder('Mật khẩu')).toHaveJSProperty('validationMessage', expect.stringMatching(/.{1,}/));
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
    const headers = await authHeaders(request);
    await seedBrowserAuth(page, headers.Authorization.replace('Bearer ', ''), { id: 3, email: 'admin@hoianblog.vn', role: 'admin', name: 'Admin' });
    await page.route('**/api/admin/users**', (route) => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ messageId: 'COMMON-E-001', message: 'Lỗi hệ thống' }) }));
    await page.goto('/admin/users');
    await expect(page.locator('.bg-red-50')).toContainText(/COMMON-E-001|Lỗi hệ thống/);
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
    await Promise.all([usersPage.saveModal(), usersPage.saveModal().catch(() => undefined)]);
    await expect(usersPage.successBanner).toBeVisible();
    expect(count).toBe(1);
  });
});
