import { Page, Locator, expect } from '@playwright/test';

export class AdminTagListPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly addTagButton: Locator;
  readonly tagTable: Locator;
  readonly tagRows: Locator;
  readonly pagination: Locator;

  // Modal Thêm
  readonly addModal: Locator;
  readonly addNameInput: Locator;
  readonly addSlugInput: Locator;
  readonly addDescriptionInput: Locator;
  readonly addSubmitButton: Locator;
  readonly addCancelButton: Locator;
  readonly addErrorMsg: Locator;

  // Inline Sửa
  readonly editNameInput: Locator;
  readonly editSlugInput: Locator;
  readonly editDescriptionInput: Locator;
  readonly editSaveButton: Locator;
  readonly editCancelButton: Locator;

  // Modal Xóa
  readonly deleteModal: Locator;
  readonly deleteConfirmButton: Locator;
  readonly deleteCancelButton: Locator;

  // Global Messages
  readonly successMsg: Locator;
  readonly errorMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Tên hoặc slug');
    this.addTagButton = page.getByRole('button', { name: '+ Tạo mới' });
    this.tagTable = page.getByRole('table');
    this.tagRows = this.tagTable.locator('tbody tr');
    this.pagination = page.locator('.pagination'); // Adjust if needed

    // Modal Thêm
    this.addModal = page.locator('.fixed.inset-0', { hasText: 'Thêm Tag' });
    this.addNameInput = this.addModal.getByPlaceholder('Tên tag');
    this.addSlugInput = this.addModal.getByPlaceholder('slug-tag');
    this.addDescriptionInput = this.addModal.getByPlaceholder('Mô tả');
    this.addSubmitButton = this.addModal.getByRole('button', { name: 'Thêm Tag' });
    this.addCancelButton = this.addModal.getByRole('button', { name: 'Hủy' });
    this.addErrorMsg = this.addModal.locator('.text-red-600');

    // Inline Sửa
    this.editNameInput = page.locator('input[name="name"]');
    this.editSlugInput = page.locator('input[name="slug"]');
    this.editDescriptionInput = page.locator('input[name="description"]');
    this.editSaveButton = page.getByRole('button', { name: 'Lưu' });
    this.editCancelButton = page.getByRole('button', { name: 'Hủy' });

    // Modal Xóa
    this.deleteModal = page.locator('.fixed.inset-0', { hasText: 'Xác nhận xóa' });
    this.deleteConfirmButton = this.deleteModal.getByRole('button', { name: 'Xóa', exact: true });
    this.deleteCancelButton = this.deleteModal.getByRole('button', { name: 'Hủy', exact: true });

    // Global Messages
    this.successMsg = page.locator('.text-green-600');
    this.errorMsg = page.locator('.text-red-600').first();
  }

  async goto() {
    await this.page.goto('/admin/tags');
    await expect(this.page).toHaveURL(/\/admin\/tags/);
  }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    // The search is triggered by typing (debounced) or pressing enter.
    // Let's press Enter.
    await this.searchInput.press('Enter');
  }

  async openAddModal() {
    await this.addTagButton.click();
    await expect(this.addModal).toBeVisible();
  }

  async openEditInline(tagName: string) {
    const row = this.tagRows.filter({ hasText: tagName });
    await row.getByRole('button', { name: 'Sửa' }).click();
    await expect(this.editNameInput).toBeVisible();
  }

  async openDeleteModal(tagName: string) {
    const row = this.tagRows.filter({ hasText: tagName });
    await row.getByRole('button', { name: 'Xóa' }).click();
    await expect(this.deleteModal).toBeVisible();
  }

  async fillAddForm(name: string, slug: string, description: string) {
    await this.addNameInput.fill(name);
    await this.addSlugInput.fill(slug);
    await this.addDescriptionInput.fill(description);
  }

  async fillEditForm(name: string, slug: string, description: string) {
    await this.editNameInput.fill(name);
    await this.editSlugInput.fill(slug);
    await this.editDescriptionInput.fill(description);
  }

  async submitAddForm() {
    await this.addSubmitButton.click();
  }

  async saveEditForm() {
    await this.editSaveButton.click();
  }

  async confirmDelete() {
    await this.deleteConfirmButton.click();
  }

  async cancelDelete() {
    await this.deleteCancelButton.click();
  }
}
