import { expect, type Locator, type Page } from '@playwright/test';

export class AdminUserListPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly roleFilter: Locator;
  readonly statusFilter: Locator;
  readonly sortFilter: Locator;
  readonly createButton: Locator;
  readonly exportButton: Locator;
  readonly table: Locator;
  readonly errorBanner: Locator;
  readonly successBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Tìm tên, email, SĐT');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.roleFilter = page.locator('select').nth(0);
    this.statusFilter = page.locator('select').nth(1);
    this.sortFilter = page.locator('select').nth(2);
    this.createButton = page.getByRole('button', { name: '+ Tạo mới' });
    this.exportButton = page.getByRole('button', { name: 'Export CSV' });
    this.table = page.getByRole('table');
    this.errorBanner = page.locator('.bg-red-50');
    this.successBanner = page.locator('.bg-green-50');
  }

  async goto() {
    await this.page.goto('/admin/users');
  }

  async loginAs(email: string, password: string) {
    await this.page.goto('/admin/login');
    await this.page.getByPlaceholder('admin@hoianblog.vn').fill(email);
    await this.page.getByPlaceholder('••••••••').fill(password);
    await this.page.getByRole('button', { name: 'Đăng Nhập' }).click();
    await this.page.waitForURL(/\/admin\/(dashboard|users|posts|categories)/);
  }

  async openWithAdmin() {
    await this.loginAs('admin@hoianblog.vn', 'password123');
    const responsePromise = this.page.waitForResponse(response => response.url().includes('/api/admin/users') && response.status() === 200);
    await this.page.locator('a[href="/admin/users"]').first().click();
    await responsePromise;
    await expect(this.page).toHaveURL(/\/admin\/users/);
    await expect(this.table).toBeVisible();
  }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
  }

  rowByEmail(email: string) {
    return this.page.getByRole('row').filter({ hasText: email });
  }

  async openEditByEmail(email: string) {
    await this.search(email);
    await expect(this.rowByEmail(email)).toBeVisible();
    await this.rowByEmail(email).getByRole('button', { name: 'Sửa' }).click();
    await expect(this.page.getByText('Cập nhật người dùng')).toBeVisible();
  }

  async openCreate() {
    await this.createButton.click();
    await expect(this.page.getByText('Tạo người dùng')).toBeVisible();
  }

  async changeRoleByEmail(email: string, nextRole: 'admin' | 'member') {
    await this.search(email);
    const row = this.rowByEmail(email);
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: /admin|member/i }).click();
    await expect(this.page.getByText('Xác nhận đổi role')).toBeVisible();
    const responsePromise = this.page.waitForResponse(response => response.url().includes('/api/admin/users/') && response.url().includes('/role') && response.status() === 200);
    await this.page.getByRole('button', { name: new RegExp(`Đổi thành ${nextRole}`, 'i') }).click();
    await responsePromise;
  }

  async openStatusModalByEmail(email: string) {
    await this.search(email);
    const row = this.rowByEmail(email);
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: /active|locked/i }).click();
    await expect(this.page.getByText('Xác nhận trạng thái')).toBeVisible();
  }

  async fillProfile(data: Partial<Record<'name' | 'phone' | 'address' | 'avatar_url' | 'bio' | 'birthdate' | 'gender', string>>) {
    if (data.name !== undefined) await this.page.getByPlaceholder('Họ tên').fill(data.name);
    if (data.phone !== undefined) await this.page.getByPlaceholder('Số điện thoại').fill(data.phone);
    if (data.address !== undefined) await this.page.getByPlaceholder('Địa chỉ').fill(data.address);
    if (data.avatar_url !== undefined) await this.page.getByPlaceholder('Avatar URL').fill(data.avatar_url);
    if (data.bio !== undefined) await this.page.getByPlaceholder('Giới thiệu').fill(data.bio);
    if (data.birthdate !== undefined) await this.page.locator('input[type="date"]').fill(data.birthdate);
    if (data.gender !== undefined) await this.page.locator('form select').last().selectOption(data.gender);
  }

  async saveModal() {
    await this.page.getByRole('button', { name: 'Lưu' }).click();
  }

  async expectNoPutProfileRequest(action: () => Promise<void>) {
    let called = false;
    this.page.on('request', (request) => {
      if (request.method() === 'PUT' && /\/api\/admin\/users\/\d+$/.test(request.url())) called = true;
    });
    await action();
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
    expect(called).toBeFalsy();
  }
}
