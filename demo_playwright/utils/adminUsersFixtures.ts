import { expect, type APIRequestContext, type Page } from '@playwright/test';

export const API_BASE = 'http://localhost:3001/api';
export const adminCreds = { email: 'admin@hoianblog.vn', password: 'password123' };
export const memberCreds = { email: 'member@hoianblog.vn', password: 'password123' };

export const td = {
  keyword100: 'a'.repeat(100),
  keyword101: 'a'.repeat(101),
  sqlInjection: "' OR 1=1 --",
  nameValid: 'Nguyễn Văn A Updated',
  name100: 'a'.repeat(100),
  name101: 'a'.repeat(101),
  phoneInvalid: 'abc123',
  address256: 'a'.repeat(256),
  avatar256: `https://cdn.hoianblog.vn/${'a'.repeat(214)}.png`,
  bio501: 'a'.repeat(501),
  futureBirthdate: '2999-01-01',
  xssName: '<script>alert(1)</script>',
  createValid: { email: 'ita.new.user@hoianblog.vn', password: 'password123', role: 'member', status: 'active' },
};

export async function loginApi(request: APIRequestContext, email = adminCreds.email, password = adminCreds.password) {
  const response = await request.post(`${API_BASE}/auth/login`, { data: { email, password } });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  return body as { token: string; user: { id: number; email: string; role: string; name: string } };
}

export async function authHeaders(request: APIRequestContext, email = adminCreds.email, password = adminCreds.password) {
  const { token } = await loginApi(request, email, password);
  return { Authorization: `Bearer ${token}` };
}

export async function getUserByEmail(request: APIRequestContext, headers: Record<string, string>, email: string) {
  const response = await request.get(`${API_BASE}/admin/users`, { headers, params: { keyword: email, limit: 10 } });
  expect(response.status()).toBe(200);
  const body = await response.json();
  return body.items.find((item: { email: string }) => item.email === email);
}

export async function ensureUser(request: APIRequestContext, headers: Record<string, string>, email: string, name: string, role = 'member') {
  const existing = await getUserByEmail(request, headers, email);
  if (existing) return existing;
  const response = await request.post(`${API_BASE}/admin/users`, {
    headers,
    data: { name, email, password: 'password123', role, status: 'active', gender: 'unknown' },
  });
  expect([201, 409]).toContain(response.status());
  return getUserByEmail(request, headers, email);
}

export async function normalizeAdminUsersData(request: APIRequestContext) {
  const headers = await authHeaders(request);
  await request.put(`${API_BASE}/admin/users/${(await loginApi(request)).user.id}`, {
    headers,
    data: { name: 'Admin', phone: '', address: '', avatar_url: '', bio: '', birthdate: '', gender: 'unknown' },
  }).catch(() => undefined);
  const lockUser = await ensureUser(request, headers, 'ita.member.lock@hoianblog.vn', 'ITa Member Lock');
  const deleteUser = await ensureUser(request, headers, 'ita.member.delete@hoianblog.vn', 'ITa Member Delete');
  const admin2 = await ensureUser(request, headers, 'ita.admin2@hoianblog.vn', 'ITa Admin Two', 'admin');
  if (lockUser?.id) await request.put(`${API_BASE}/admin/users/${lockUser.id}/status`, { headers, data: { status: 'active', locked_reason: '' } });
  if (deleteUser?.id) await request.put(`${API_BASE}/admin/users/${deleteUser.id}/status`, { headers, data: { status: 'active', locked_reason: '' } });
  return { headers, lockUser, deleteUser, admin2 };
}

export async function seedBrowserAuth(page: Page, token: string, user: unknown) {
  await page.addInitScript(({ savedToken, savedUser }) => {
    window.localStorage.setItem('token', savedToken);
    window.localStorage.setItem('user', JSON.stringify(savedUser));
  }, { savedToken: token, savedUser: user });
}

export async function expectMessageIdOrMessage(responseBody: unknown, expected: string) {
  expect(JSON.stringify(responseBody)).toContain(expected);
}
