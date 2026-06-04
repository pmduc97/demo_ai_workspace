import { expect, test } from '@playwright/test';
import { authHeaders, expectMessageIdOrMessage, getUserByEmail, normalizeAdminUsersData, td, API_BASE } from '../../utils/adminUsersFixtures';

test.describe('ITa Admin Users - Chunk 03 API list detail', () => {
  test.beforeEach(async ({ request }) => { await normalizeAdminUsersData(request); });

  test('TC_API_001 GET list với keyword đúng 100 ký tự trả 200', async ({ request }) => {
    const headers = await authHeaders(request);
    const response = await request.get(`${API_BASE}/admin/users`, { headers, params: { keyword: td.keyword100, role: 'all', status: 'all', sort: 'created_at_desc', page: 1, limit: 10 } });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(expect.objectContaining({ items: expect.any(Array), pagination: expect.any(Object) }));
  });

  for (const tc of [
    ['TC_API_002', { keyword: td.keyword101 }, 'USER-E-001'],
    ['TC_API_003', { role: 'owner' }, 'USER-E-001'],
    ['TC_API_004', { status: 'disabled' }, 'USER-E-001'],
    ['TC_API_005', { sort: 'email_desc' }, 'USER-E-001'],
    ['TC_API_006', { page: 0 }, 'USER-E-001'],
    ['TC_API_008', { limit: 101 }, 'USER-E-001'],
  ] as const) {
    test(`${tc[0]} invalid list query trả 422`, async ({ request }) => {
      const headers = await authHeaders(request);
      const response = await request.get(`${API_BASE}/admin/users`, { headers, params: tc[1] });
      expect(response.status()).toBe(422);
      await expectMessageIdOrMessage(await response.json(), tc[2]);
    });
  }

  test('TC_API_007 GET list với limit=100 trả 200', async ({ request }) => {
    const headers = await authHeaders(request);
    const response = await request.get(`${API_BASE}/admin/users`, { headers, params: { limit: 100 } });
    expect(response.status()).toBe(200);
    expect((await response.json()).pagination.limit).toBe(100);
  });

  test('TC_API_009 GET chi tiết user tồn tại trả đủ field và post counters', async ({ request }) => {
    const headers = await authHeaders(request);
    const user = await getUserByEmail(request, headers, 'member@hoianblog.vn');
    const response = await request.get(`${API_BASE}/admin/users/${user.id}`, { headers });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.password_hash).toBeUndefined();
    expect(body).toEqual(expect.objectContaining({ id: user.id, email: 'member@hoianblog.vn', postCount: expect.any(Number), publishedPostCount: expect.any(Number), draftPostCount: expect.any(Number) }));
  });

  test('TC_API_010 GET chi tiết user không tồn tại trả 404', async ({ request }) => {
    const headers = await authHeaders(request);
    const response = await request.get(`${API_BASE}/admin/users/999999`, { headers });
    expect(response.status()).toBe(404);
    await expectMessageIdOrMessage(await response.json(), 'USER-E-003');
  });
});
