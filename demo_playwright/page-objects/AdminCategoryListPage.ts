/// <reference types="node" />
import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model — Admin Category List (/admin/categories)
 * Source: CategoryListPage.jsx
 * Spec: [Design][SCREEN] ADMIN_CATEGORY_LIST_QuanLyDanhMuc.md
 */
export class AdminCategoryListPage {
  readonly page: Page;

  // ── Toolbar ──────────────────────────────────────────────────────────────
  readonly searchInput: Locator;
  readonly statusFilter: Locator;
  readonly sortFilter: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly exportButton: Locator;
  readonly addButton: Locator;

  // ── Banners ───────────────────────────────────────────────────────────────
  readonly errorText: Locator;
  readonly successText: Locator;

  // ── Table ─────────────────────────────────────────────────────────────────
  readonly table: Locator;
  readonly loadingState: Locator;
  readonly emptyState: Locator;
  readonly totalCountLabel: Locator;

  // ── Pagination ────────────────────────────────────────────────────────────
  readonly prevPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly pageInfo: Locator;

  // ── Add Modal ─────────────────────────────────────────────────────────────
  readonly addModal: Locator;
  readonly addModalTitle: Locator;
  readonly addNameInput: Locator;
  readonly addSlugInput: Locator;
  readonly addDescriptionInput: Locator;
  readonly addStatusSelect: Locator;
  readonly addThumbnailInput: Locator;
  readonly addSeoTitleInput: Locator;
  readonly addSeoDescriptionInput: Locator;
  readonly addSubmitButton: Locator;
  readonly addCancelButton: Locator;
  readonly addErrorText: Locator;

  // ── Detail Modal ──────────────────────────────────────────────────────────
  readonly detailModal: Locator;

  // ── Delete Modal ──────────────────────────────────────────────────────────
  readonly deleteModal: Locator;
  readonly deleteConfirmButton: Locator;
  readonly deleteCancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Toolbar — placeholder từ source FE: "Tên hoặc slug"
    this.searchInput = page.getByPlaceholder('Tên hoặc slug');
    // Select thứ 0: statusFilter, thứ 1: sortFilter (trong toolbar, không có trong modal)
    this.statusFilter = page.locator('div.grid select').nth(0);
    this.sortFilter = page.locator('div.grid select').nth(1);
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.exportButton = page.getByRole('button', { name: /Export CSV/ });
    this.addButton = page.getByRole('button', { name: '+ Thêm danh mục' });

    // Banners — dùng text color class (inline p tag)
    this.errorText = page.locator('p.text-red-600').first();
    this.successText = page.locator('p.text-green-600').first();

    // Table
    this.table = page.getByRole('table');
    this.loadingState = page.getByText('Đang tải...');
    this.emptyState = page.getByText('Chưa có danh mục nào');
    this.totalCountLabel = page.getByText(/Kết quả theo điều kiện/);

    // Pagination
    this.prevPageButton = page.getByRole('button', { name: 'Trước' });
    this.nextPageButton = page.getByRole('button', { name: 'Sau' });
    this.pageInfo = page.getByText(/Trang \d+ \/ \d+/);

    // Add Modal
    this.addModal = page.locator('div.fixed').filter({ has: page.getByText('Thêm danh mục mới') });
    this.addModalTitle = page.getByText('Thêm danh mục mới');
    // Scoped vào modal để tránh conflict với inline edit
    this.addNameInput = this.addModal.getByPlaceholder('Du lịch');
    this.addSlugInput = this.addModal.getByPlaceholder('du-lich');
    this.addDescriptionInput = this.addModal.getByPlaceholder('Mô tả ngắn...');
    this.addStatusSelect = this.addModal.locator('select[name="status"]');
    this.addThumbnailInput = this.addModal.getByPlaceholder('/uploads/categories/...');
    this.addSeoTitleInput = this.addModal.locator('input[name="seo_title"]');
    this.addSeoDescriptionInput = this.addModal.locator('input[name="seo_description"]');
    this.addSubmitButton = this.addModal.getByRole('button', { name: /^Thêm$/ });
    this.addCancelButton = this.addModal.getByRole('button', { name: 'Hủy' });
    this.addErrorText = this.addModal.locator('p.text-red-600');

    // Detail Modal
    this.detailModal = page.locator('div.fixed').filter({ has: page.getByText('Chi tiết danh mục') });

    // Delete Modal
    this.deleteModal = page.locator('div.fixed').filter({ has: page.getByText('Xác nhận xóa') });
    this.deleteConfirmButton = this.deleteModal.getByRole('button', { name: /Xóa mềm/ });
    this.deleteCancelButton = this.deleteModal.getByRole('button', { name: 'Hủy' });
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async loginAs(email: string, password: string) {
    await this.page.goto('/admin/login');
    await this.page.getByPlaceholder('admin@hoianblog.vn').fill(email);
    await this.page.getByPlaceholder('••••••••').fill(password);
    await this.page.getByRole('button', { name: 'Đăng Nhập' }).click();
    await this.page.waitForURL(/\/admin\/(dashboard|users|posts|categories)/);
  }

  /** Login admin + navigate via sidebar link để tránh AuthContext race condition */
  async openWithAdmin() {
    await this.loginAs('admin@hoianblog.vn', 'password123');
    await this.page.locator('a[href="/admin/categories"]').first().click();
    await expect(this.page).toHaveURL(/\/admin\/categories/);
    await expect(this.searchInput).toBeVisible();
    await expect(this.addButton).toBeVisible();
  }

  // ── Toolbar Actions ────────────────────────────────────────────────────────

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    await this.waitForTableReady();
  }

  async resetFilters() {
    await this.resetButton.click();
    await this.waitForTableReady();
  }

  async filterByStatus(value: 'all' | 'active' | 'hidden') {
    await this.statusFilter.selectOption(value);
  }

  async sortBy(value: 'created_at_desc' | 'name_asc' | 'post_count_desc' | 'view_count_desc' | 'latest_post_desc') {
    await this.sortFilter.selectOption(value);
  }

  // ── Table Helpers ──────────────────────────────────────────────────────────

  /** Lấy row theo tên danh mục */
  rowByName(name: string): Locator {
    return this.page.getByRole('row').filter({ hasText: name });
  }

  /** Lấy row theo slug (hiển thị dạng monospace trong cột slug) */
  rowBySlug(slug: string): Locator {
    return this.page.getByRole('row').filter({ hasText: slug });
  }

  async waitForTableReady() {
    // Đợi loading spinner biến mất
    await this.loadingState.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => undefined);
  }

  // ── Add Modal Actions ──────────────────────────────────────────────────────

  async openAddModal() {
    await this.addButton.click();
    await expect(this.addModalTitle).toBeVisible();
  }

  async fillAddForm(data: {
    name?: string;
    slug?: string;
    description?: string;
    status?: 'active' | 'hidden';
    thumbnail_url?: string;
    seo_title?: string;
    seo_description?: string;
  }) {
    if (data.name !== undefined) {
      await this.addNameInput.fill(data.name);
      // Đợi auto-generate slug
      await this.page.waitForTimeout(100);
    }
    if (data.slug !== undefined) await this.addSlugInput.fill(data.slug);
    if (data.description !== undefined) await this.addDescriptionInput.fill(data.description);
    if (data.status !== undefined) await this.addStatusSelect.selectOption(data.status);
    if (data.thumbnail_url !== undefined) await this.addThumbnailInput.fill(data.thumbnail_url);
    if (data.seo_title !== undefined) await this.addSeoTitleInput.fill(data.seo_title);
    if (data.seo_description !== undefined) await this.addSeoDescriptionInput.fill(data.seo_description);
  }

  async submitAddForm() {
    await this.addSubmitButton.click();
  }

  async closeAddModal() {
    await this.addCancelButton.click();
    await expect(this.addModal).toBeHidden();
  }

  /** Workflow đầy đủ: mở modal, fill, submit, đợi modal đóng */
  async createCategory(data: Parameters<typeof this.fillAddForm>[0]) {
    await this.openAddModal();
    await this.fillAddForm(data);
    await this.submitAddForm();
    await expect(this.addModal).toBeHidden({ timeout: 8000 });
    await this.waitForTableReady();
  }

  // ── Inline Edit Actions ────────────────────────────────────────────────────

  /** Mở inline edit cho row theo tên. Search trước nếu có nhiều trang. */
  async openInlineEditByName(name: string) {
    await this.search(name);
    const row = this.rowByName(name);
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'Sửa' }).click();
    // Sau khi click Sửa, row chuyển sang inline edit — có input[name="name"]
    await expect(row.locator('input[name="name"]')).toBeVisible();
  }

  /** Lấy inline edit inputs của row đang edit */
  inlineEditInputs(row: Locator) {
    return {
      name: row.locator('input[name="name"]'),
      slug: row.locator('input[name="slug"]'),
      description: row.locator('input[name="description"]'),
      status: row.locator('select[name="status"]'),
      thumbnail_url: row.locator('input[name="thumbnail_url"]'),
      seo_title: row.locator('input[name="seo_title"]'),
      seo_description: row.locator('input[name="seo_description"]'),
    };
  }

  async saveInlineEdit(row: Locator) {
    await row.getByRole('button', { name: 'Lưu' }).click();
    await this.waitForTableReady();
  }

  async cancelInlineEdit(row: Locator) {
    await row.getByRole('button', { name: 'Hủy' }).click();
  }

  // ── Detail Modal Actions ───────────────────────────────────────────────────

  async openDetailByName(name: string) {
    const row = this.rowByName(name);
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'Xem' }).click();
    await expect(this.detailModal).toBeVisible();
  }

  async closeDetailModal() {
    await this.detailModal.locator('button').filter({ hasText: '×' }).click();
    await expect(this.detailModal).toBeHidden();
  }

  // ── Delete Modal Actions ───────────────────────────────────────────────────

  async openDeleteByName(name: string) {
    const row = this.rowByName(name);
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'Xóa mềm' }).click();
    await expect(this.deleteModal).toBeVisible();
  }

  async confirmDelete() {
    await this.deleteConfirmButton.click();
    await expect(this.deleteModal).toBeHidden({ timeout: 8000 });
    await this.waitForTableReady();
  }

  async cancelDelete() {
    await this.deleteCancelButton.click();
    await expect(this.deleteModal).toBeHidden();
  }

  /** Workflow đầy đủ: click xóa mềm → confirm */
  async deleteCategory(name: string) {
    await this.openDeleteByName(name);
    await this.confirmDelete();
  }

  // ── Guard: verify no POST/PUT/DELETE request was sent ─────────────────────

  async expectNoMutationRequest(
    method: 'POST' | 'PUT' | 'DELETE',
    urlPattern: RegExp,
    action: () => Promise<void>
  ) {
    let called = false;
    this.page.on('request', (req) => {
      if (req.method() === method && urlPattern.test(req.url())) called = true;
    });
    await action();
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
    expect(called).toBeFalsy();
  }
}
