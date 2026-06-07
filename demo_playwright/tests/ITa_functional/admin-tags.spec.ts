import { test, expect } from '@playwright/test';
import { AdminTagListPage } from '../../page-objects/AdminTagListPage';
import { captureEvidence } from '../../utils/evidence';
import { Client } from 'pg';

const PASSWORD_HASH = '$2b$10$Q/sIfyktWXWUzv9f9JYHqOhbvIXUEWTsRewKBh0oRMukaoAyw1WXC';

test.describe('ITa: Quản lý Tags', () => {
  let tagPage: AdminTagListPage;

  test.beforeAll(async () => {
    const client = new Client({ host: 'db.tvsdhpzpqxobkkotuhkh.supabase.co', port: 5432, database: 'postgres', user: 'postgres', password: 'trteam10T@123' });
    await client.connect();
    await client.query(`
      INSERT INTO users (email, password_hash, name, role, status) VALUES
      ('admin@hoianblog.vn', $1, 'Admin', 'admin', 'active')
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin', status = 'active';
    `, [PASSWORD_HASH]);
    await client.end();
  });

  test.beforeEach(async ({ page, request }) => {
    // Login via API
    const loginRes = await request.post('/api/auth/login', {
      data: { email: 'admin@hoianblog.vn', password: 'password123' }
    });
    const loginData = await loginRes.json();
    
    await page.addInitScript((data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }, loginData);

    // Go to dashboard first to let AuthContext initialize
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    
    // Navigate to Tags page via sidebar
    await page.click('a[href="/admin/tags"]');
    
    tagPage = new AdminTagListPage(page);
    await expect(page).toHaveURL(/\/admin\/tags/);
  });

  test('TC_TAG_VAL_02 & TC_TAG_VAL_03 & TC_TAG_VAL_04: Validate Name and Slug required/min length', async ({ page }, testInfo) => {
    await tagPage.openAddModal();
    
    // TC_TAG_VAL_02: Empty name
    await tagPage.fillAddForm('', 'slug-test', 'Mô tả');
    await expect(tagPage.addSubmitButton).toBeDisabled();
    await captureEvidence(page, testInfo, 'TC_TAG_VAL_02_EmptyName');

    // TC_TAG_VAL_03: Name < 2 chars
    await tagPage.fillAddForm('A', 'a', 'Mô tả');
    await expect(tagPage.addSubmitButton).toBeDisabled();
    await captureEvidence(page, testInfo, 'TC_TAG_VAL_03_NameMinLength');

    // TC_TAG_VAL_04: Empty slug
    await tagPage.fillAddForm('Test', '', 'Mô tả');
    await expect(tagPage.addSubmitButton).toBeDisabled();
    await captureEvidence(page, testInfo, 'TC_TAG_VAL_04_EmptySlug');
  });

  test('TC_TAG_HP_01: Thêm mới Tag thành công', async ({ page }, testInfo) => {
    await tagPage.openAddModal();
    const uniqueName = `Văn hóa ${Date.now()}`;
    const uniqueSlug = `van-hoa-${Date.now()}`;
    await tagPage.fillAddForm(uniqueName, uniqueSlug, 'Khám phá văn hóa');
    await captureEvidence(page, testInfo, 'TC_TAG_HP_01_BeforeSubmit');
    
    await tagPage.submitAddForm();
    
    await expect(tagPage.successMsg).toBeVisible();
    await expect(tagPage.successMsg).toContainText('thành công');
    await captureEvidence(page, testInfo, 'TC_TAG_HP_01_Success');
    
    // Verify in list
    await expect(tagPage.tagRows.filter({ hasText: uniqueName })).toBeVisible();
  });

  test('TC_TAG_HP_02: Cập nhật Tag thành công', async ({ page }, testInfo) => {
    // Create a tag first
    const uniqueName = `Tag To Edit ${Date.now()}`;
    const uniqueSlug = `tag-to-edit-${Date.now()}`;
    await tagPage.openAddModal();
    await tagPage.fillAddForm(uniqueName, uniqueSlug, 'Mô tả');
    await tagPage.submitAddForm();
    await expect(tagPage.successMsg).toBeVisible();

    // Edit it
    await tagPage.openEditInline(uniqueName);
    const newName = `${uniqueName} Edited`;
    await tagPage.fillEditForm(newName, `${uniqueSlug}-edited`, 'Mô tả mới');
    await captureEvidence(page, testInfo, 'TC_TAG_HP_02_BeforeSave');
    
    await tagPage.saveEditForm();
    
    await expect(tagPage.successMsg).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_TAG_HP_02_Success');
    
    // Verify in list
    await expect(tagPage.tagRows.filter({ hasText: newName })).toBeVisible();
  });

  test('TC_TAG_HP_03 & TC_TAG_HP_04: Xóa Tag và Hủy xóa', async ({ page }, testInfo) => {
    // Create a tag first
    const uniqueName = `Tag To Delete ${Date.now()}`;
    const uniqueSlug = `tag-to-delete-${Date.now()}`;
    await tagPage.openAddModal();
    await tagPage.fillAddForm(uniqueName, uniqueSlug, 'Mô tả');
    await tagPage.submitAddForm();
    await expect(tagPage.successMsg).toBeVisible();

    // TC_TAG_HP_04: Cancel delete
    await tagPage.openDeleteModal(uniqueName);
    await captureEvidence(page, testInfo, 'TC_TAG_HP_04_DeleteModal');
    await tagPage.cancelDelete();
    await expect(tagPage.deleteModal).toBeHidden();
    await expect(tagPage.tagRows.filter({ hasText: uniqueName })).toBeVisible();

    // TC_TAG_HP_03: Confirm delete
    await tagPage.openDeleteModal(uniqueName);
    await tagPage.confirmDelete();
    
    await expect(tagPage.successMsg).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_TAG_HP_03_Success');
    
    // Verify removed from list
    await expect(tagPage.tagRows.filter({ hasText: uniqueName })).toBeHidden();
  });

  test('TC_TAG_LIST_02: Tìm kiếm Tag', async ({ page }, testInfo) => {
    // Create a specific tag to search
    const uniqueName = `Searchable Tag ${Date.now()}`;
    const uniqueSlug = `searchable-tag-${Date.now()}`;
    await tagPage.openAddModal();
    await tagPage.fillAddForm(uniqueName, uniqueSlug, 'Mô tả');
    await tagPage.submitAddForm();
    await expect(tagPage.successMsg).toBeVisible();

    // Search
    await tagPage.search(uniqueName);
    // Wait for the table to update with the search result
    await expect(tagPage.tagRows).toHaveCount(1, { timeout: 10000 });
    
    await captureEvidence(page, testInfo, 'TC_TAG_LIST_02_SearchResult');
    await expect(tagPage.tagRows.first()).toContainText(uniqueName);
  });

  test('TC_TAG_ERR_01: Lỗi trùng Slug khi thêm mới', async ({ page }, testInfo) => {
    // Create a tag first
    const uniqueName = `Duplicate Tag ${Date.now()}`;
    const uniqueSlug = `duplicate-slug-${Date.now()}`;
    await tagPage.openAddModal();
    await tagPage.fillAddForm(uniqueName, uniqueSlug, 'Mô tả');
    await tagPage.submitAddForm();
    await expect(tagPage.successMsg).toBeVisible();
    // Wait for success message to disappear or close modal to ensure clean state
    await expect(tagPage.addModal).toBeHidden();

    // Try to create another with same slug
    await tagPage.openAddModal();
    await tagPage.fillAddForm('Another Tag', uniqueSlug, 'Mô tả');
    await tagPage.submitAddForm();
    
    await expect(tagPage.addErrorMsg).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_TAG_ERR_01_DuplicateSlug');
  });
});
