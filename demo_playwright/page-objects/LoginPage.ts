import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    // Dựa vào Section 5 của [Design][SCREEN] ADMIN_LOGIN_DangNhap.md
    this.emailInput = page.getByPlaceholder('admin@hoianblog.vn');
    this.passwordInput = page.getByPlaceholder('••••••••');
    this.submitButton = page.getByRole('button', { name: 'Đăng Nhập' });
    // Error banner thường có class bg-red-50 text-red-700
    this.errorBanner = page.locator('.bg-red-50'); 
  }

  async goto() {
    await this.page.goto('/admin/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
