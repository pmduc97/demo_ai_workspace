import { test, expect } from '@playwright/test';
import { AdminPostListPage } from '../../page-objects/AdminPostListPage';
import { captureEvidence } from '../../utils/evidence';
import { Client } from 'pg';

const PASSWORD_HASH = '$2b$10$Q/sIfyktWXWUzv9f9JYHqOhbvIXUEWTsRewKBh0oRMukaoAyw1WXC';

test.describe('ITa: Kiểm thử chức năng Quản Lý Bài Viết', () => {
  let postPage: AdminPostListPage;

  test.beforeAll(async () => {
    const client = new Client({ host: 'localhost', port: 5432, database: 'postgres', user: 'postgres', password: 'trteam10T@123' });
    await client.connect();
    await client.query(`DELETE FROM posts WHERE slug LIKE 'ita-post-%' OR slug IN ('admin-post-1', 'member-post-1', 'member-post-2');`);
    await client.query(`DELETE FROM categories WHERE slug IN ('ita-post-category', 'cat-1', 'cat-2');`);
    await client.query(`DELETE FROM users WHERE email IN ('ita.admin.post@hoianblog.vn', 'ita.member.post@hoianblog.vn');`);
    await client.query(`
      INSERT INTO users (email, password_hash, name, role, status) VALUES
      ('ita.admin.post@hoianblog.vn', $1, 'ITa Admin Post', 'admin', 'active'),
      ('ita.member.post@hoianblog.vn', $1, 'ITa Member Post', 'member', 'active')
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, status = 'active';
    `, [PASSWORD_HASH]);
    await client.query(`
      INSERT INTO categories (name, slug, status) VALUES ('ITa Post Category', 'ita-post-category', 'active')
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, status = 'active', deleted_at = NULL;
    `);
    await client.query(`
      INSERT INTO posts (title, slug, content, author_id, category_id, status, view_count)
      SELECT 'ITa Post Draft', 'ita-post-draft', 'Content', u.id, c.id, 'draft', 1
      FROM users u CROSS JOIN categories c WHERE u.email = 'ita.member.post@hoianblog.vn' AND c.slug = 'ita-post-category';
    `);
    await client.query(`
      INSERT INTO posts (title, slug, content, author_id, category_id, status, view_count)
      SELECT 'ITa Post Delete', 'ita-post-delete', 'Content', u.id, c.id, 'published', 2
      FROM users u CROSS JOIN categories c WHERE u.email = 'ita.member.post@hoianblog.vn' AND c.slug = 'ita-post-category';
    `);
    await client.end();
  });

  test.beforeEach(async ({ page }) => {
    postPage = new AdminPostListPage(page);
  });

  test('TC_POST_01: Hiển thị danh sách bài viết mặc định', async ({ page }, testInfo) => {
    await postPage.openWithAdmin();
    await expect(postPage.table).toBeVisible();
    await expect(postPage.rowByTitle('ITa Post Draft')).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_POST_01-Success');
  });

  test('TC_POST_02: Tìm kiếm bài viết theo tiêu đề', async ({ page }, testInfo) => {
    await postPage.openWithAdmin();
    await postPage.search('ITa Post Draft');
    await expect(postPage.rowByTitle('ITa Post Draft')).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_POST_02-Search');
  });

  test('TC_POST_03: Tạo mới bài viết bằng popup', async ({ page }, testInfo) => {
    await postPage.openWithAdmin();
    await postPage.createPost({ title: 'ITa Post New', slug: 'ita-post-new', categoryName: 'ITa Post Category', content: 'Nội dung ITa Post New', status: 'draft' });
    await postPage.search('ITa Post New');
    await expect(postPage.rowByTitle('ITa Post New')).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_POST_03-Create');
  });

  test('TC_POST_04: Đổi trạng thái bài viết', async ({ page }, testInfo) => {
    await postPage.openWithAdmin();
    await postPage.search('ITa Post Draft');
    await postPage.toggleStatus('ITa Post Draft');
    await expect(page.getByText('Đổi trạng thái bài viết thành công')).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_POST_04-Status');
  });

  test('TC_POST_05: Xóa bài viết', async ({ page }, testInfo) => {
    await postPage.openWithAdmin();
    await postPage.search('ITa Post Delete');
    await postPage.deletePost('ITa Post Delete');
    await expect(postPage.rowByTitle('ITa Post Delete')).toHaveCount(0);
    await captureEvidence(page, testInfo, 'TC_POST_05-Delete');
  });
});
