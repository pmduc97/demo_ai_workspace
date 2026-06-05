import { test, expect } from '@playwright/test';
import { AdminUserListPage } from '../../page-objects/AdminUserListPage';
import { captureEvidence } from '../../utils/evidence';
import { Client } from 'pg';

const PASSWORD_HASH = '$2b$10$Q/sIfyktWXWUzv9f9JYHqOhbvIXUEWTsRewKBh0oRMukaoAyw1WXC';

test.describe('ITa: Kiểm thử chức năng Quản Lý Người Dùng', () => {
  test.describe.configure({ mode: 'serial' });

  let userListPage: AdminUserListPage;

  test.beforeAll(async () => {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'trteam10T@123',
    });
    await client.connect();
    await client.query(`DELETE FROM users WHERE email LIKE '%@testuser.vn';`);
    await client.query(`
      INSERT INTO users (email, password_hash, name, role, status) VALUES 
      ('admin1@testuser.vn', $1, 'Admin One', 'admin', 'active'),
      ('member1@testuser.vn', $1, 'Member One', 'member', 'active'),
      ('member2@testuser.vn', $1, 'Member Two', 'member', 'locked')
      ON CONFLICT (email) DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        status = EXCLUDED.status;
    `, [PASSWORD_HASH]);
    await client.end();
  });

  test.beforeEach(async ({ page }) => {
    userListPage = new AdminUserListPage(page);
  });

  test('TC_USER_01: Hiển thị danh sách user mặc định', async ({ page }, testInfo) => {
    await userListPage.openWithAdmin();
    await expect(userListPage.table).toBeVisible();
    await expect(userListPage.rowByEmail('admin1@testuser.vn')).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_USER_01-Success');
  });

  test('TC_USER_02: Tìm kiếm user theo keyword', async ({ page }, testInfo) => {
    await userListPage.openWithAdmin();
    const responsePromise = page.waitForResponse(response => response.url().includes('/api/admin/users') && response.status() === 200);
    await userListPage.search('Member');
    await responsePromise;
    await expect(userListPage.rowByEmail('member1@testuser.vn')).toBeVisible();
    await expect(userListPage.rowByEmail('member2@testuser.vn')).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_USER_02-Success');
  });

  test('TC_USER_06: Bỏ trống tên khi sửa user', async ({ page }, testInfo) => {
    await userListPage.openWithAdmin();
    await userListPage.openEditByEmail('member1@testuser.vn');
    await userListPage.fillProfile({ name: '' });
    await expect(page.getByRole('button', { name: 'Lưu' })).toBeDisabled();
    await captureEvidence(page, testInfo, 'TC_USER_06-Error');
  });

  test('TC_USER_08: Đổi role user thành công', async ({ page }, testInfo) => {
    await userListPage.openWithAdmin();
    await userListPage.changeRoleByEmail('member1@testuser.vn', 'admin');
    await expect(page.getByText('Cập nhật role thành công')).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_USER_08-Success');
  });

  test('TC_USER_09: Bỏ trống lý do khi khóa user', async ({ page }, testInfo) => {
    await userListPage.openWithAdmin();
    await userListPage.openStatusModalByEmail('member1@testuser.vn');
    await userListPage.expectNoPutProfileRequest(async () => {
      await page.getByRole('button', { name: 'Xác nhận' }).click();
    });
    await expect(page.getByRole('button', { name: 'Xác nhận' })).toBeDisabled();
    await captureEvidence(page, testInfo, 'TC_USER_09-Error');
  });

  test('TC_USER_10: Khóa user thành công', async ({ page }, testInfo) => {
    await userListPage.openWithAdmin();
    await userListPage.openStatusModalByEmail('member1@testuser.vn');
    await page.getByPlaceholder('Lý do khóa (tối thiểu 5 ký tự)').fill('Vi phạm');
    const responsePromise = page.waitForResponse(response => response.url().includes('/api/admin/users/') && response.status() === 200);
    await page.getByRole('button', { name: 'Xác nhận' }).click();
    await responsePromise;
    await expect(page.getByText('Cập nhật trạng thái tài khoản thành công')).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_USER_10-Success');
  });

  test('TC_USER_11: Member truy cập bị từ chối', async ({ page }, testInfo) => {
    await userListPage.loginAs('member1@testuser.vn', 'password123');
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await captureEvidence(page, testInfo, 'TC_USER_11-Redirect');
  });
});