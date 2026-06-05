import { expect, type Locator, type Page } from '@playwright/test';

export class AdminPostListPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly categoryFilter: Locator;
  readonly statusFilter: Locator;
  readonly authorFilter: Locator;
  readonly createButton: Locator;
  readonly table: Locator;
  readonly errorBanner: Locator;
  readonly successBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Tìm kiếm tiêu đề...');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.categoryFilter = page.locator('select').nth(0);
    this.statusFilter = page.locator('select').nth(1);
    this.authorFilter = page.locator('select').nth(2);
    this.createButton = page.getByRole('button', { name: '+ Tạo mới' });
    this.table = page.getByRole('table');
    this.errorBanner = page.locator('.bg-red-50');
    this.successBanner = page.locator('.bg-green-50');
  }

  async goto() {
    await this.page.goto('/admin/posts');
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
    await this.page.locator('a[href="/admin/posts"]').first().click();
    await expect(this.page).toHaveURL(/\/admin\/posts/);
    await expect(this.searchInput).toBeVisible();
    await expect(this.createButton).toBeVisible();
  }

  async openWithMember() {
    await this.loginAs('member@hoianblog.vn', 'password123');
    await this.page.locator('a[href="/admin/posts"]').first().click();
    await expect(this.page).toHaveURL(/\/admin\/posts/);
    await expect(this.searchInput).toBeVisible();
  }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    // The search button might not exist if it's auto-search or handled by DataToolbar
    // Let's press Enter
    await this.searchInput.press('Enter');
  }

  rowByTitle(title: string) {
    return this.page.getByRole('row').filter({ hasText: title });
  }

  async toggleStatus(title: string) {
    const row = this.rowByTitle(title);
    await expect(row).toBeVisible();
    // The button text is either 'Publish' or 'Draft'
    await row.getByRole('button', { name: /Publish|Draft/ }).click();
  }

  async deletePost(title: string) {
    const row = this.rowByTitle(title);
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'Xóa' }).click();
    await this.page.getByRole('button', { name: 'Xóa' }).click(); // Confirm modal
  }

  async openCreateModal() {
    await this.createButton.click();
    await expect(this.page.getByText('Tạo mới bài viết')).toBeVisible();
  }

  async createPost(data: { title: string; slug?: string; categoryName: string; content: string; status?: 'draft' | 'published'; thumbnail_url?: string }) {
    await this.openCreateModal();
    await this.page.getByPlaceholder('Tiêu đề bài viết').fill(data.title);
    if (data.slug !== undefined) await this.page.getByPlaceholder('slug-bai-viet').fill(data.slug);
    await this.page.getByRole('combobox').first().selectOption({ label: data.categoryName });
    if (data.status) await this.page.locator('select[name="status"]').selectOption(data.status);
    if (data.thumbnail_url !== undefined) await this.page.getByPlaceholder('Thumbnail URL').fill(data.thumbnail_url);
    await this.page.getByPlaceholder('Nội dung bài viết').fill(data.content);
    await this.page.getByRole('button', { name: 'Tạo mới' }).click();
    await expect(this.page.getByText('Tạo bài viết thành công')).toBeVisible({ timeout: 8000 });
  }
}