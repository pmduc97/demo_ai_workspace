import { expect, test } from '@playwright/test';
import { API_BASE } from '../../utils/adminUsersFixtures';
import { AdminUserListPage } from '../../page-objects/AdminUserListPage';

test.describe('Smoke - Admin Users environment gate', () => {
  test('SMOKE_001 backend public API available', async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${API_BASE}/categories`, { signal: controller.signal });
    clearTimeout(timeout);
    expect(response.status).toBe(200);
  });

  test('SMOKE_002 frontend home page renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toContainText(/Blog/i);
  });

  test('SMOKE_003 admin login and users route reachable', async ({ page }) => {
    const usersPage = new AdminUserListPage(page);
    await usersPage.loginAs('admin@hoianblog.vn', 'password123');
    await page.locator('a[href="/admin/users"]').first().click();
    await expect(page).toHaveURL(/\/admin\/users/);
    await expect(usersPage.createButton).toBeVisible();
    await expect(usersPage.searchInput).toBeVisible();
  });
});
