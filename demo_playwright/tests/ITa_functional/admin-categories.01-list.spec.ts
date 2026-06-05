import { test, expect } from '@playwright/test';
import { AdminCategoryListPage } from '../../page-objects/AdminCategoryListPage';
import { captureEvidence } from '../../utils/evidence';
import { Client } from 'pg';

const PASSWORD_HASH = '$2b$10$Q/sIfyktWXWUzv9f9JYHqOhbvIXUEWTsRewKBh0oRMukaoAyw1WXC';

test.describe('ITa: Kiểm thử chức năng Quản Lý Danh Mục', () => {
  let categoryPage: AdminCategoryListPage;

  test.beforeAll(async () => {
    const client = new Client({ host: 'localhost', port: 5432, database: 'postgres', user: 'postgres', password: 'trteam10T@123' });
    await client.connect();
    await client.query(`DELETE FROM categories WHERE slug LIKE 'ita-category-%' OR slug IN ('duplicate-slug', 'test-category-1', 'test-category-2');`);
    await client.query(`
      INSERT INTO users (email, password_hash, name, role, status) VALUES
      ('ita.admin.category@hoianblog.vn', $1, 'ITa Admin Category', 'admin', 'active')
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin', status = 'active';
    `, [PASSWORD_HASH]);
    await client.query(`
      INSERT INTO categories (name, slug, description, status) VALUES
      ('Duplicate Slug', 'duplicate-slug', 'Category for duplicate slug test', 'active'),
      ('Test Category 1', 'test-category-1', 'Test category 1', 'active'),
      ('Test Category 2', 'test-category-2', 'Test category 2', 'hidden')
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, status = EXCLUDED.status, deleted_at = NULL;
    `);
    await client.end();
  });

  test.beforeEach(async ({ page }) => {
    categoryPage = new AdminCategoryListPage(page);
  });

  test('TC_CAT_01: Hiển thị danh sách danh mục mặc định', async ({ page }, testInfo) => {
    await categoryPage.openWithAdmin();
    await expect(categoryPage.table).toBeVisible();
    await expect(categoryPage.rowBySlug('test-category-1')).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_CAT_01-Success');
  });

  test('TC_CAT_02: Tạo mới danh mục bằng popup', async ({ page }, testInfo) => {
    await categoryPage.openWithAdmin();
    await categoryPage.createCategory({ name: 'ITa Category New', slug: 'ita-category-new', description: 'Mô tả ITa', status: 'active' });
    await categoryPage.search('ITa Category New');
    await expect(categoryPage.rowBySlug('ita-category-new')).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_CAT_02-Success');
  });

  test('TC_CAT_03: Xem popup chi tiết danh mục', async ({ page }, testInfo) => {
    await categoryPage.openWithAdmin();
    await categoryPage.search('Test Category 1');
    await categoryPage.openDetailByName('Test Category 1');
    await expect(categoryPage.detailModal).toContainText('test-category-1');
    await captureEvidence(page, testInfo, 'TC_CAT_03-Detail');
  });

  test('TC_CAT_04: Xóa mềm danh mục', async ({ page }, testInfo) => {
    await categoryPage.openWithAdmin();
    await categoryPage.search('Test Category 2');
    await categoryPage.deleteCategory('Test Category 2');
    await expect(categoryPage.rowByName('Test Category 2')).toHaveCount(0);
    await captureEvidence(page, testInfo, 'TC_CAT_04-Deleted');
  });
});
