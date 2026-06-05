import { test, expect } from '@playwright/test';
import { AdminCategoryListPage } from '../../page-objects/AdminCategoryListPage';
import { captureEvidence } from '../../utils/evidence';

test.describe('ITa: Quản lý danh mục - Smoke Test', () => {
  let categoryPage: AdminCategoryListPage;

  test.beforeEach(async ({ page }) => {
    categoryPage = new AdminCategoryListPage(page);
  });

  test('TC_PER_01: Truy cập trang quản lý danh mục với role member', async ({ page }, testInfo) => {
    // Login as member
    await page.goto('/admin/login');
    await page.getByPlaceholder('admin@hoianblog.vn').fill('member@hoianblog.vn');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Đăng Nhập' }).click();
    await page.waitForURL(/\/admin\/dashboard/);

    // Try to access categories page
    await page.goto('/admin/categories');
    
    // Should be redirected to dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    
    // Should see error toast
    await expect(page.getByText('Bạn không có quyền quản lý danh mục')).toBeVisible();
    
    await captureEvidence(page, testInfo, 'TC_PER_01-Redirected');
  });

  test('TC_HP_04: Tìm kiếm, lọc, sắp xếp và phân trang danh sách', async ({ page }, testInfo) => {
    await categoryPage.openWithAdmin();
    
    // Search
    await categoryPage.search('Du lịch');
    await captureEvidence(page, testInfo, 'TC_HP_04-Search');
    
    // Filter status
    await categoryPage.filterByStatus('active');
    await categoryPage.searchButton.click();
    await categoryPage.waitForTableReady();
    await captureEvidence(page, testInfo, 'TC_HP_04-Filter');
    
    // Reset
    await categoryPage.resetFilters();
    await captureEvidence(page, testInfo, 'TC_HP_04-Reset');
  });

  test('TC_HP_01: Tạo danh mục thành công với đầy đủ thông tin', async ({ page }, testInfo) => {
    await categoryPage.openWithAdmin();
    
    const timestamp = Date.now();
    const categoryName = `Smoke Category ${timestamp}`;
    const categorySlug = `smoke-category-${timestamp}`;
    
    await categoryPage.openAddModal();
    await captureEvidence(page, testInfo, 'TC_HP_01-Modal-Open');
    
    await categoryPage.fillAddForm({
      name: categoryName,
      slug: categorySlug,
      description: 'Smoke test description',
      status: 'active',
      thumbnail_url: '/uploads/categories/smoke.jpg',
      seo_title: 'Smoke SEO Title',
      seo_description: 'Smoke SEO Description'
    });
    
    await captureEvidence(page, testInfo, 'TC_HP_01-Form-Filled');
    
    // Intercept API call
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/categories') && response.request().method() === 'POST'
    );
    
    await categoryPage.submitAddForm();
    
    const response = await responsePromise;
    expect(response.status()).toBe(201);
    
    await expect(categoryPage.addModal).toBeHidden();
    await expect(categoryPage.successText).toBeVisible();
    
    // Verify in list
    await categoryPage.search(categoryName);
    await expect(categoryPage.rowByName(categoryName)).toBeVisible();
    
    await captureEvidence(page, testInfo, 'TC_HP_01-Created');
  });
});
