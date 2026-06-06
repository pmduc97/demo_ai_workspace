import { Page, Locator, expect } from '@playwright/test';

export class AdminDashboardPage {
  readonly page: Page;
  readonly totalPostsStat: Locator;
  readonly publishedPostsStat: Locator;
  readonly draftPostsStat: Locator;
  readonly totalCategoriesStat: Locator;
  readonly recentPostsTable: Locator;
  readonly viewAllLink: Locator;
  readonly emptyStateMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.totalPostsStat = page.locator('div.rounded-2xl').filter({ hasText: 'Tổng bài viết' }).locator('p.text-3xl');
    this.publishedPostsStat = page.locator('div.rounded-2xl').filter({ hasText: 'Đã xuất bản' }).locator('p.text-3xl');
    this.draftPostsStat = page.locator('div.rounded-2xl').filter({ hasText: 'Bản nháp' }).locator('p.text-3xl');
    this.totalCategoriesStat = page.locator('div.rounded-2xl').filter({ hasText: 'Danh mục' }).locator('p.text-3xl');
    this.recentPostsTable = page.locator('table');
    this.viewAllLink = page.getByRole('link', { name: 'Xem tất cả' });
    this.emptyStateMessage = page.getByText('Chưa có bài viết nào');
    this.errorMessage = page.locator('.text-red-700');
  }

  async goto() {
    await this.page.goto('/admin/dashboard');
  }

  async getStatValue(statName: 'totalPosts' | 'publishedPosts' | 'draftPosts' | 'totalCategories') {
    switch (statName) {
      case 'totalPosts':
        return await this.totalPostsStat.innerText();
      case 'publishedPosts':
        return await this.publishedPostsStat.innerText();
      case 'draftPosts':
        return await this.draftPostsStat.innerText();
      case 'totalCategories':
        return await this.totalCategoriesStat.innerText();
    }
  }

  async getRecentPostTitles() {
    return await this.recentPostsTable.locator('tbody tr td:first-child').allInnerTexts();
  }

  async clickEditPost(index: number) {
    await this.recentPostsTable.locator('tbody tr').nth(index).getByRole('link', { name: 'Sửa' }).click();
  }
}
