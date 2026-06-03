import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';
import { captureEvidence } from '../../utils/evidence';

test.describe('ITa_AUTH_LOGIN: Kiểm thử chức năng Đăng nhập', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.describe('4.1. UI Validation', () => {
    test('TC_UI_01: Bỏ trống email', async ({ page }, testInfo) => {
      await captureEvidence(page, testInfo, 'TC_UI_01_Before_Action');
      await loginPage.login('', 'password123');
      
      const emailInput = loginPage.emailInput;
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBeTruthy();
      
      await captureEvidence(page, testInfo, 'TC_UI_01_Empty_Email');
    });

    test('TC_UI_02: Bỏ trống password', async ({ page }, testInfo) => {
      await captureEvidence(page, testInfo, 'TC_UI_02_Before_Action');
      await loginPage.login('admin@hoianblog.vn', '');
      
      const passwordInput = loginPage.passwordInput;
      const isInvalid = await passwordInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBeTruthy();
      
      await captureEvidence(page, testInfo, 'TC_UI_02_Empty_Password');
    });

    test('TC_UI_03: Sai format email', async ({ page }, testInfo) => {
      await captureEvidence(page, testInfo, 'TC_UI_03_Before_Action');
      await loginPage.login('admin_hoianblog.vn', 'password123');
      
      const emailInput = loginPage.emailInput;
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBeTruthy();
      
      await captureEvidence(page, testInfo, 'TC_UI_03_Invalid_Email_Format');
    });

    test('TC_UI_04: Password dưới 6 ký tự', async ({ page }, testInfo) => {
      await captureEvidence(page, testInfo, 'TC_UI_04_Before_Action');
      await loginPage.login('admin@hoianblog.vn', '12345');
      
      const passwordInput = loginPage.passwordInput;
      const isInvalid = await passwordInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBeTruthy();
      
      await captureEvidence(page, testInfo, 'TC_UI_04_Short_Password');
    });
  });

  test.describe('4.2. Happy Path', () => {
    test('TC_HP_01: Đăng nhập thành công với role admin', async ({ page }, testInfo) => {
      await captureEvidence(page, testInfo, 'TC_HP_01_Before_Action');
      await loginPage.login('admin@hoianblog.vn', 'password123');
      
      await page.waitForURL('**/admin/dashboard');
      await expect(page).toHaveURL(/.*\/admin\/dashboard/);
      
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeTruthy();
      
      await captureEvidence(page, testInfo, 'TC_HP_01_Admin_Success');
    });

    test('TC_HP_02: Đăng nhập thành công với role member', async ({ page }, testInfo) => {
      await captureEvidence(page, testInfo, 'TC_HP_02_Before_Action');
      await loginPage.login('member@hoianblog.vn', 'password123');
      
      await page.waitForURL('**/admin/dashboard');
      await expect(page).toHaveURL(/.*\/admin\/dashboard/);
      
      await captureEvidence(page, testInfo, 'TC_HP_02_Member_Success');
    });

    test('TC_HP_03: Truy cập /admin/login khi đã có token', async ({ page }, testInfo) => {
      await captureEvidence(page, testInfo, 'TC_HP_03_Before_Action');
      await loginPage.login('admin@hoianblog.vn', 'password123');
      await page.waitForURL('**/admin/dashboard');
      
      await loginPage.goto();
      
      await page.waitForURL('**/admin/dashboard');
      await expect(page).toHaveURL(/.*\/admin\/dashboard/);
      
      await captureEvidence(page, testInfo, 'TC_HP_03_Auto_Redirect');
    });
  });

  test.describe('4.3. Negative Path', () => {
    test('TC_NP_01: Sai mật khẩu', async ({ page }, testInfo) => {
      await captureEvidence(page, testInfo, 'TC_NP_01_Before_Action');
      await loginPage.login('admin@hoianblog.vn', 'wrongpassword');
      
      await expect(loginPage.errorBanner).toBeVisible();
      await expect(loginPage.errorBanner).toContainText('Email hoặc mật khẩu không đúng');
      
      await captureEvidence(page, testInfo, 'TC_NP_01_Wrong_Password');
    });

    test('TC_NP_02: Email không tồn tại', async ({ page }, testInfo) => {
      await captureEvidence(page, testInfo, 'TC_NP_02_Before_Action');
      await loginPage.login('notfound@hoianblog.vn', 'password123');
      
      await expect(loginPage.errorBanner).toBeVisible();
      await expect(loginPage.errorBanner).toContainText('Email hoặc mật khẩu không đúng');
      
      await captureEvidence(page, testInfo, 'TC_NP_02_Email_Not_Found');
    });

    test('TC_NP_03: SQL Injection', async ({ page }, testInfo) => {
      await captureEvidence(page, testInfo, 'TC_NP_03_Before_Action');
      await loginPage.login("' OR 1=1 --", 'password123');
      
      const emailInput = loginPage.emailInput;
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      
      if (!isInvalid) {
        await expect(loginPage.errorBanner).toBeVisible();
      }
      
      await captureEvidence(page, testInfo, 'TC_NP_03_SQL_Injection');
    });
  });
});
