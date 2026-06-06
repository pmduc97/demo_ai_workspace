import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';
import { captureEvidence } from '../../utils/evidence';
import { Client } from 'pg';

// Pre-computed bcrypt hash for 'password123'
const PASSWORD_HASH = '$2b$10$Q/sIfyktWXWUzv9f9JYHqOhbvIXUEWTsRewKBh0oRMukaoAyw1WXC';

test.describe('ITa: Kiểm thử chức năng Đăng Nhập Admin', () => {
  let loginPage: LoginPage;

  test.beforeAll(async () => {
    const client = new Client({
      host: 'db.tvsdhpzpqxobkkotuhkh.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'trteam10T@123',
    });
    await client.connect();
    await client.query(`
      INSERT INTO users (email, password_hash, name, role, status) VALUES 
      ('admin_test@hoianblog.vn', $1, 'Admin Test', 'admin', 'active'),
      ('member_test@hoianblog.vn', $1, 'Member Test', 'member', 'active')
      ON CONFLICT (email) DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        status = EXCLUDED.status;
    `, [PASSWORD_HASH]);
    await client.end();
  });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC_LOGIN_01: Bỏ trống email', async ({ page }, testInfo) => {
    await loginPage.login('', 'password123');
    await expect(loginPage.errorBanner).toBeVisible();
    await expect(loginPage.errorBanner).toContainText('Email và mật khẩu là bắt buộc'); // AUTH-E-001
    await captureEvidence(page, testInfo, 'TC_LOGIN_01-Error');
  });

  test('TC_LOGIN_02: Sai định dạng email', async ({ page }, testInfo) => {
    await loginPage.login('admin_test', 'password123');
    await expect(loginPage.errorBanner).toBeVisible();
    await expect(loginPage.errorBanner).toContainText('Email không đúng định dạng'); // AUTH-E-004
    await captureEvidence(page, testInfo, 'TC_LOGIN_02-Error');
  });

  test('TC_LOGIN_03: Bỏ trống password', async ({ page }, testInfo) => {
    await loginPage.login('admin_test@hoianblog.vn', '');
    await expect(loginPage.errorBanner).toBeVisible();
    await expect(loginPage.errorBanner).toContainText('Email và mật khẩu là bắt buộc'); // AUTH-E-001
    await captureEvidence(page, testInfo, 'TC_LOGIN_03-Error');
  });

  test('TC_LOGIN_04: Password dưới 6 ký tự', async ({ page }, testInfo) => {
    await loginPage.login('admin_test@hoianblog.vn', '12345');
    await expect(loginPage.errorBanner).toBeVisible();
    await expect(loginPage.errorBanner).toContainText('Mật khẩu tối thiểu 6 ký tự'); // AUTH-E-005
    await captureEvidence(page, testInfo, 'TC_LOGIN_04-Error');
  });

  test('TC_LOGIN_05: Đăng nhập thành công với tài khoản admin', async ({ page }, testInfo) => {
    const responsePromise = page.waitForResponse(response => response.url().includes('/api/auth/login') && response.status() === 200);
    await loginPage.login('admin_test@hoianblog.vn', 'password123');
    await responsePromise;
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await captureEvidence(page, testInfo, 'TC_LOGIN_05-Success');
  });

  test('TC_LOGIN_06: Đăng nhập thành công với tài khoản member', async ({ page }, testInfo) => {
    const responsePromise = page.waitForResponse(response => response.url().includes('/api/auth/login') && response.status() === 200);
    await loginPage.login('member_test@hoianblog.vn', 'password123');
    await responsePromise;
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await captureEvidence(page, testInfo, 'TC_LOGIN_06-Success');
  });

  test('TC_LOGIN_07: Đăng nhập thất bại do sai email/password', async ({ page }, testInfo) => {
    const responsePromise = page.waitForResponse(response => response.url().includes('/api/auth/login') && response.status() === 401);
    await loginPage.login('admin_test@hoianblog.vn', 'wrongpass');
    await responsePromise;
    await expect(loginPage.errorBanner).toBeVisible();
    await expect(loginPage.errorBanner).toContainText('Email hoặc mật khẩu không đúng'); // AUTH-E-002
    await captureEvidence(page, testInfo, 'TC_LOGIN_07-Error');
  });

  test('TC_LOGIN_08: Auto redirect khi đã login', async ({ page }, testInfo) => {
    // Login first
    const responsePromise = page.waitForResponse(response => response.url().includes('/api/auth/login') && response.status() === 200);
    await loginPage.login('admin_test@hoianblog.vn', 'password123');
    await responsePromise;
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    
    // Try to go to login page again
    await page.goto('/admin/login');
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await captureEvidence(page, testInfo, 'TC_LOGIN_08-Redirect');
  });
});