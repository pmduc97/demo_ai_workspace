import { expect, test } from '@playwright/test';
import { AdminUserListPage } from '../../page-objects/AdminUserListPage';
import { captureEvidence } from '../../utils/evidence';
import { normalizeAdminUsersData, td } from '../../utils/adminUsersFixtures';

test.describe('ITa Admin Users - Chunk 01 UI validation', () => {
  test.beforeEach(async ({ page, request }) => {
    await normalizeAdminUsersData(request);
    const usersPage = new AdminUserListPage(page);
    await usersPage.openWithAdmin();
  });

  test('TC_UI_001 Chặn tìm kiếm khi keyword vượt 100 ký tự', async ({ page }, testInfo) => {
    const usersPage = new AdminUserListPage(page);
    let apiCalled = false;
    page.on('request', (request) => { if (request.url().includes('/api/admin/users') && request.method() === 'GET') apiCalled = true; });
    await captureEvidence(page, testInfo, 'before-search-over-max');
    await usersPage.searchInput.evaluate((el: HTMLInputElement, value) => { el.value = value; el.dispatchEvent(new Event('input', { bubbles: true })); }, td.keyword101);
    await usersPage.searchButton.click();
    await captureEvidence(page, testInfo, 'after-search-over-max');
    await expect(usersPage.searchInput).toHaveJSProperty('validationMessage', expect.stringMatching(/.{1,}/));
    expect(apiCalled).toBeFalsy();
  });

  test('TC_UI_002 Hiển thị lỗi khi bỏ trống họ tên trong EditUserModal', async ({ page }, testInfo) => {
    const usersPage = new AdminUserListPage(page);
    await usersPage.openEditByEmail('member@hoianblog.vn');
    await captureEvidence(page, testInfo, 'modal-open');
    await usersPage.expectNoPutProfileRequest(async () => {
      await usersPage.fillProfile({ name: '' });
      await usersPage.saveModal();
    });
    await expect(page.getByPlaceholder('Họ tên')).toHaveJSProperty('validationMessage', expect.stringMatching(/.{1,}/));
  });

  test('TC_UI_003 Hiển thị lỗi khi họ tên dưới 2 ký tự', async ({ page }, testInfo) => {
    const usersPage = new AdminUserListPage(page);
    await usersPage.openEditByEmail('member@hoianblog.vn');
    await captureEvidence(page, testInfo, 'modal-open');
    await usersPage.expectNoPutProfileRequest(async () => {
      await usersPage.fillProfile({ name: 'A' });
      await usersPage.saveModal();
    });
    await expect(page.getByPlaceholder('Họ tên')).toHaveJSProperty('validationMessage', expect.stringMatching(/.{1,}/));
  });

  test('TC_UI_004 Cho phép họ tên đúng 100 ký tự', async ({ page }, testInfo) => {
    const usersPage = new AdminUserListPage(page);
    await usersPage.openEditByEmail('ita.member.lock@hoianblog.vn');
    await captureEvidence(page, testInfo, 'before-valid-name-100');
    const responsePromise = page.waitForResponse((res) => /\/api\/admin\/users\/\d+$/.test(res.url()) && res.request().method() === 'PUT');
    await usersPage.fillProfile({ name: td.name100, phone: '0912345678', address: 'Đà Nẵng', bio: 'Yêu du lịch Việt Nam', birthdate: '1995-01-20', gender: 'male' });
    await usersPage.saveModal();
    expect((await responsePromise).status()).toBe(200);
    await expect(usersPage.successBanner).toContainText('Cập nhật người dùng thành công');
    await captureEvidence(page, testInfo, 'after-valid-name-100');
  });

  test('TC_UI_005 Hiển thị lỗi khi số điện thoại sai format', async ({ page }, testInfo) => {
    const usersPage = new AdminUserListPage(page);
    await usersPage.openEditByEmail('member@hoianblog.vn');
    await captureEvidence(page, testInfo, 'before-invalid-phone');
    await usersPage.fillProfile({ phone: td.phoneInvalid });
    const responsePromise = page.waitForResponse((res) => /\/api\/admin\/users\/\d+$/.test(res.url()) && res.request().method() === 'PUT');
    await usersPage.saveModal();
    expect((await responsePromise).status()).toBe(422);
    await expect(usersPage.errorBanner).toContainText(/USER-E-001|không hợp lệ/i);
  });

  test('TC_UI_006 Chặn địa chỉ vượt 255 ký tự', async ({ page }, testInfo) => {
    const usersPage = new AdminUserListPage(page);
    await usersPage.openEditByEmail('member@hoianblog.vn');
    await usersPage.fillProfile({ address: td.address256 });
    await captureEvidence(page, testInfo, 'address-over-max');
    await expect(page.getByPlaceholder('Địa chỉ')).toHaveValue('a'.repeat(255));
  });

  test('TC_UI_007 Chặn Avatar URL vượt 255 ký tự', async ({ page }, testInfo) => {
    const usersPage = new AdminUserListPage(page);
    await usersPage.openEditByEmail('member@hoianblog.vn');
    await usersPage.fillProfile({ avatar_url: td.avatar256 });
    await captureEvidence(page, testInfo, 'avatar-over-max');
    await expect(page.getByPlaceholder('Avatar URL')).toHaveValue(td.avatar256.slice(0, 255));
  });

  test('TC_UI_008 Chuyển trang giữ điều kiện search/filter/sort', async ({ page }, testInfo) => {
    const usersPage = new AdminUserListPage(page);
    await usersPage.searchInput.fill('ita');
    await usersPage.roleFilter.selectOption('member');
    await usersPage.statusFilter.selectOption('active');
    await usersPage.sortFilter.selectOption('created_at_desc');
    await usersPage.searchButton.click();
    await captureEvidence(page, testInfo, 'filtered-list');
    const next = page.getByRole('button', { name: 'Sau' });
    if (await next.isVisible()) await next.click();
    await expect(usersPage.searchInput).toHaveValue('ita');
    await expect(usersPage.roleFilter).toHaveValue('member');
    await expect(usersPage.statusFilter).toHaveValue('active');
  });

  test('TC_UI_009 Cập nhật profile user thành công và reload list', async ({ page }, testInfo) => {
    const usersPage = new AdminUserListPage(page);
    await usersPage.openEditByEmail('ita.member.lock@hoianblog.vn');
    await captureEvidence(page, testInfo, 'before-save-profile');
    const responsePromise = page.waitForResponse((res) => /\/api\/admin\/users\/\d+$/.test(res.url()) && res.request().method() === 'PUT');
    await usersPage.fillProfile({ name: td.nameValid, phone: '0912345678', address: 'Đà Nẵng', bio: 'Yêu du lịch Việt Nam', birthdate: '1995-01-20', gender: 'male' });
    await usersPage.saveModal();
    expect((await responsePromise).status()).toBe(200);
    await expect(page.getByText(td.nameValid)).toBeVisible();
    await captureEvidence(page, testInfo, 'after-save-profile');
  });

  test('TC_UI_010 Disabled đổi role chính mình', async ({ page }, testInfo) => {
    const usersPage = new AdminUserListPage(page);
    await captureEvidence(page, testInfo, 'self-role-button');
    await expect(usersPage.rowByEmail('admin@hoianblog.vn').getByRole('button', { name: 'admin' })).toBeDisabled();
  });
});
