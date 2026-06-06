import { test, expect } from '@playwright/test';
import { AdminDashboardPage } from '../../page-objects/AdminDashboardPage';
import { captureEvidence } from '../../utils/evidence';
import { Client } from 'pg';

const dbConfig = {
  host: 'db.tvsdhpzpqxobkkotuhkh.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'trteam10T@123',
};

test.describe('ITa: Kiểm thử chức năng Dashboard Tổng Quan', () => {
  let adminPage: AdminDashboardPage;
  let memberPage: AdminDashboardPage;

  test.beforeAll(async () => {
    const client = new Client(dbConfig);
    await client.connect();
    
    // Setup data
    await client.query(`
      DELETE FROM posts;
      DELETE FROM categories;
      DELETE FROM users;

      INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) VALUES 
      (1, 'admin1', 'admin1@test.com', '$2b$10$5jdhxsPVgrHFPCBmnzf/XeKiuaXdXZIRTyr8S4Qj2BQMRC5cPylQW', 'admin', NOW(), NOW()),
      (2, 'member1', 'member1@test.com', '$2b$10$5jdhxsPVgrHFPCBmnzf/XeKiuaXdXZIRTyr8S4Qj2BQMRC5cPylQW', 'member', NOW(), NOW()),
      (3, 'member2', 'member2@test.com', '$2b$10$5jdhxsPVgrHFPCBmnzf/XeKiuaXdXZIRTyr8S4Qj2BQMRC5cPylQW', 'member', NOW(), NOW());

      INSERT INTO categories (id, name, slug, created_at, updated_at) VALUES 
      (1, 'Du lịch biển', 'du-lich-bien', NOW(), NOW()),
      (2, 'Du lịch núi', 'du-lich-nui', NOW(), NOW());

      INSERT INTO posts (id, title, slug, content, status, author_id, category_id, created_at, updated_at) VALUES 
      (1, 'Admin Post 1', 'admin-post-1', 'Content', 'published', 1, 1, NOW() - INTERVAL '1 day', NOW()),
      (2, 'Admin Post 2', 'admin-post-2', 'Content', 'published', 1, 1, NOW() - INTERVAL '2 days', NOW()),
      (3, 'Admin Post 3', 'admin-post-3', 'Content', 'draft', 1, 2, NOW() - INTERVAL '3 days', NOW()),
      (4, 'Admin Post 4', 'admin-post-4', 'Content', 'draft', 1, 2, NOW() - INTERVAL '4 days', NOW()),
      (5, 'Member Post 1', 'member-post-1', 'Content', 'published', 2, 1, NOW() - INTERVAL '5 days', NOW()),
      (6, 'Member Post 2', 'member-post-2', 'Content', 'draft', 2, 2, NOW() - INTERVAL '6 days', NOW());
    `);
    await client.end();
  });

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminDashboardPage(page);
  });

  async function login(page: any, email: string) {
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Mật khẩu').fill('password123');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.waitForURL('/admin/dashboard');
  }

  test('TC_DB_01: Admin xem Dashboard hiển thị toàn bộ thống kê và bài viết', async ({ page }, testInfo) => {
    await login(page, 'admin1@test.com');
    await adminPage.goto();
    
    await expect(adminPage.totalPostsStat).toHaveText('6');
    await expect(adminPage.publishedPostsStat).toHaveText('3');
    await expect(adminPage.draftPostsStat).toHaveText('3');
    await expect(adminPage.totalCategoriesStat).toHaveText('2');

    const titles = await adminPage.getRecentPostTitles();
    expect(titles.length).toBe(5);
    expect(titles[0]).toBe('Admin Post 1');

    await captureEvidence(page, testInfo, 'TC_DB_01-Admin-Dashboard');
  });

  test('TC_DB_02: Member xem Dashboard chỉ hiển thị thống kê và bài viết của mình', async ({ page }, testInfo) => {
    await login(page, 'member1@test.com');
    await adminPage.goto();
    
    await expect(adminPage.totalPostsStat).toHaveText('2');
    await expect(adminPage.publishedPostsStat).toHaveText('1');
    await expect(adminPage.draftPostsStat).toHaveText('1');
    await expect(adminPage.totalCategoriesStat).toHaveText('2');

    const titles = await adminPage.getRecentPostTitles();
    expect(titles.length).toBe(2);
    expect(titles[0]).toBe('Member Post 1');

    await captureEvidence(page, testInfo, 'TC_DB_02-Member-Dashboard');
  });

  test('TC_DB_03: Hiển thị Skeleton loading khi đang gọi API', async ({ page }, testInfo) => {
    await login(page, 'admin1@test.com');
    
    // Intercept API to delay response
    await page.route('**/api/admin/stats', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });

    await adminPage.goto();
    
    // Check for skeleton loading
    await expect(page.locator('.animate-pulse').first()).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_DB_03-Skeleton-Loading');
  });

  test('TC_DB_04: Xử lý khi API /api/admin/stats lỗi 500', async ({ page }, testInfo) => {
    await login(page, 'admin1@test.com');
    
    await page.route('**/api/admin/stats', route => {
      route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await adminPage.goto();
    
    await expect(adminPage.errorMessage).toBeVisible();
    await expect(adminPage.errorMessage).toContainText('Có lỗi xảy ra');
    await captureEvidence(page, testInfo, 'TC_DB_04-API-Stats-Error');
  });

  test('TC_DB_05: Xử lý khi API /api/posts lỗi 500', async ({ page }, testInfo) => {
    await login(page, 'admin1@test.com');
    
    await page.route('**/api/admin/posts', route => {
      route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await adminPage.goto();
    
    await expect(adminPage.errorMessage).toBeVisible();
    await expect(adminPage.errorMessage).toContainText('Có lỗi xảy ra');
    await captureEvidence(page, testInfo, 'TC_DB_05-API-Posts-Error');
  });

  test('TC_DB_06: Click "Xem tất cả" chuyển hướng đến /admin/posts', async ({ page }, testInfo) => {
    await login(page, 'admin1@test.com');
    await adminPage.goto();
    
    await adminPage.viewAllLink.click();
    await page.waitForURL('/admin/posts');
    
    expect(page.url()).toContain('/admin/posts');
    await captureEvidence(page, testInfo, 'TC_DB_06-View-All-Navigation');
  });

  test('TC_DB_07: Click "Sửa" trên bài viết chuyển hướng đến /admin/posts/:id/edit', async ({ page }, testInfo) => {
    await login(page, 'admin1@test.com');
    await adminPage.goto();
    
    await adminPage.clickEditPost(0);
    await page.waitForURL(/\/admin\/posts\/\d+\/edit/);
    
    expect(page.url()).toMatch(/\/admin\/posts\/\d+\/edit/);
    await captureEvidence(page, testInfo, 'TC_DB_07-Edit-Post-Navigation');
  });

  test('TC_DB_08: Hiển thị Empty state khi không có bài viết gần đây', async ({ page }, testInfo) => {
    await login(page, 'member2@test.com');
    await adminPage.goto();
    
    await expect(adminPage.totalPostsStat).toHaveText('0');
    await expect(adminPage.emptyStateMessage).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_DB_08-Empty-State');
  });
});
