# PLAN — Full System Retrospective Audit

## Tổng quan

Audit toàn bộ artifacts của Blog Du Lịch sau 4 phase nâng cấp agent/skill/instruction. Quét 8 nhóm, ~80+ files.

---

## Nhóm 1: FE Design Docs (16 files) — Priority: High

### Files
| # | File | 
|---|------|
| 1 | `demo_docs/fe/[Design][SCREEN] ABOUT_GioiThieu.md` |
| 2 | `demo_docs/fe/[Design][SCREEN] ADMIN_CATEGORY_LIST_QuanLyDanhMuc.md` |
| 3 | `demo_docs/fe/[Design][SCREEN] ADMIN_DASHBOARD_TongQuan.md` |
| 4 | `demo_docs/fe/[Design][SCREEN] ADMIN_LOGIN_DangNhap.md` |
| 5 | `demo_docs/fe/[Design][SCREEN] ADMIN_POST_FORM_TaoSuaBai.md` |
| 6 | `demo_docs/fe/[Design][SCREEN] ADMIN_POST_LIST_DanhSachBai.md` |
| 7 | `demo_docs/fe/[Design][SCREEN] ADMIN_TAG_LIST_QuanLyTags.md` |
| 8 | `demo_docs/fe/[Design][SCREEN] ADMIN_USER_LIST_QuanLyNguoiDung.md` |
| 9 | `demo_docs/fe/[Design][SCREEN] CATEGORY_DanhMuc.md` |
| 10 | `demo_docs/fe/[Design][SCREEN] CONTACT_LienHe.md` |
| 11 | `demo_docs/fe/[Design][SCREEN] HOME_TrangChu.md` |
| 12 | `demo_docs/fe/[Design][SCREEN] POST_DETAIL_ChiTietBai.md` |
| 13 | `demo_docs/fe/[Design][LIST] SCREEN_DanhSachManHinh.md` |
| 14 | `demo_docs/fe/[Design][LIST] COMPONENT_DanhSach.md` |
| 15 | `demo_docs/fe/[Design][LIST] UTILS_DanhSach.md` |
| 16 | `demo_docs/[Design][COMMON] MESSAGE_Catalog.md` |

### Rules check
- [ ] Đúng format 12-section? (YAML frontmatter, Change Log, 12 sections)
- [ ] Anti-Slop: không emoji, AI cliché?
- [ ] Component list mapping khớp COMPONENT_DanhSach.md?
- [ ] Section 7 (API Calls) có link API doc đúng?
- [ ] Section 12 (Message List) dùng Message ID từ Catalog?
- [ ] Defense-in-Depth validation mapping?

---

## Nhóm 2: BE Design Docs (34 files) — Priority: Critical

### Files
| # | File Range |
|---|------------|
| 1-32 | `demo_docs/api/[Design][API] API{01-32}_*.md` |
| 33 | `demo_docs/api/[Design][LIST] API_DanhSachEndpoint.md` |
| 34 | `demo_docs/api/[Design][LIST] UTILS_DanhSach.md` |

### Rules check
- [ ] Đúng format 10-section? (YAML frontmatter, Change Log, 10 sections)
- [ ] Defense-in-Depth: ghi rõ validation ở từng lớp (Boundary → Business → Data)?
- [ ] Error format đã dùng `{messageId, message, details?}`?
- [ ] Message ID tồn tại trong MESSAGE_Catalog.md?
- [ ] Section 4 có Validation Rules dạng ID (V-01...)?
- [ ] Section 7-8 có Query IDs mapping?
- [ ] Section 6 có Sequence Diagram Mermaid?
- [ ] Section 8 có Knex.js snippet + Data Mapping?

---

## Nhóm 3: Workflow Docs (1 file) — Priority: High

### Files
| # | File |
|---|------|
| 1 | `demo_docs/workflow/[Design][WORKFLOW] WF01_AdminQuanLyUserVaDangNhap.md` |

### Rules check
- [ ] Mermaid diagram có đủ branch? Không dead-end?
- [ ] Mỗi bước có mapping đến API endpoint, screen?
- [ ] Coverage đủ cho ITb scenarios?

---

## Nhóm 4: ITa Test Docs (6 files) — Priority: High

### Files
| # | File |
|---|------|
| 1 | `demo_docs/tests/ITa/[Test][ITa] TC_ADMIN_CATEGORY_LIST_QuanLyDanhMuc.md` |
| 2 | `demo_docs/tests/ITa/[Test][ITa] TC_ADMIN_DASHBOARD_TongQuan.md` |
| 3 | `demo_docs/tests/ITa/[Test][ITa] TC_ADMIN_LOGIN_DangNhap.md` |
| 4 | `demo_docs/tests/ITa/[Test][ITa] TC_ADMIN_POST_LIST_DanhSachBai.md` |
| 5 | `demo_docs/tests/ITa/[Test][ITa] TC_ADMIN_TAG_LIST_QuanLyTags.md` |
| 6 | `demo_docs/tests/ITa/[Test][ITa] TC_ADMIN_USER_LIST_QuanLyNguoiDung.md` |

### Rules check
- [ ] Test Data lấy từ DB thật qua MCP? (không data giả)
- [ ] Condition-Based Waiting được yêu cầu (không hard sleep)?
- [ ] Đúng format TEMPLATE_ITa.md?
- [ ] 12 Viewpoints coverage?
- [ ] Setup Data có SQL DELETE + INSERT?

---

## Nhóm 5: ITb Test Docs (4 files) — Priority: High

### Files
| # | File |
|---|------|
| 1 | `demo_docs/tests/ITb/[Test][ITb] TC_WF01_AdminQuanLyUserVaDangNhap.md` |
| 2 | `demo_docs/tests/ITb/[Test][ITb] TC_WF_Admin_Manage_Posts.md` |
| 3 | `demo_docs/tests/ITb/[Test][ITb] TC_WF_Admin_Manage_System.md` |
| 4 | `demo_docs/tests/ITb/[Test][ITb] TC_WF_Member_Manage_Posts.md` |

### Rules check
- [ ] Có Mermaid Flowchart?
- [ ] Có DB Confirmation Matrix?
- [ ] >= 2 nodes (anti-pattern check)?
- [ ] 9 Pattern Taxonomy coverage?
- [ ] Setup Data có SQL?

---

## Nhóm 6: FE Code (15+ files) — Priority: Critical

### Files (ước lượng)
| # | File |
|---|------|
| 1 | `demo_source_fe/src/App.jsx` |
| 2 | `demo_source_fe/src/services/api.js` |
| 3 | `demo_source_fe/src/context/AuthContext.jsx` |
| 4 | `demo_source_fe/src/constants/messages.js` |
| 5-7 | `demo_source_fe/src/pages/admin/LoginPage.jsx, DashboardPage.jsx, PostListPage.jsx` |
| 8-10 | `demo_source_fe/src/pages/admin/PostFormPage.jsx, CategoryListPage.jsx, UserListPage.jsx` |
| 11 | `demo_source_fe/src/pages/admin/TagList.jsx` |
| 12-16 | `demo_source_fe/src/pages/public/HomePage.jsx, CategoryPage.jsx, PostDetailPage.jsx, AboutPage.jsx, ContactPage.jsx` |
| 17-21 | `demo_source_fe/src/components/Navbar.jsx, Footer.jsx, PostCard.jsx, ProtectedRoute.jsx, AdminLayout.jsx` |

### Rules check
- [ ] Anti-Slop: không emoji trong UI string, không `#000000`, không AI cliché?
- [ ] `useEffect` có cleanup function?
- [ ] `min-h-[100dvh]` cho layout chính?
- [ ] Animation chỉ dùng `transform`/`opacity`?
- [ ] Loading/Success/Error state đủ cho mọi API call?
- [ ] Empty state handling?
- [ ] Responsive desktop/mobile?

---

## Nhóm 7: BE Code (12+ files) — Priority: Critical

### Files (ước lượng)
| # | File |
|---|------|
| 1-6 | `demo_source_be/src/controllers/*.js` |
| 7-9 | `demo_source_be/src/middlewares/auth.js, role.js, validate.js` |
| 10-12 | `demo_source_be/src/routes/*.js` |
| 13 | `demo_source_be/src/app.js` |

### Rules check
- [ ] Defense-in-Depth: validate 3 lớp (Boundary → Business → Data)?
- [ ] Error format: `{messageId, message, details?}`?
- [ ] Auth/role guard đúng?
- [ ] Không expose password_hash?
- [ ] Pagination/filter/sort cho list endpoints?

---

## Nhóm 8: Unit Tests (7 files) — Priority: High

### Files
| # | File |
|---|------|
| 1 | `demo_source_be/src/__tests__/auth.test.js` |
| 2 | `demo_source_be/src/__tests__/posts.test.js` |
| 3 | `demo_source_be/src/__tests__/category.test.js` |
| 4 | `demo_source_be/src/__tests__/adminPosts.test.js` |
| 5 | `demo_source_be/src/__tests__/adminStats.test.js` |
| 6 | `demo_source_be/src/__tests__/tags.test.js` |
| 7 | `demo_source_be/src/__tests__/health.test.js` |

### Rules check
- [ ] Mỗi test có cleanup (afterEach/afterAll)?
- [ ] Không phụ thuộc thứ tự chạy?
- [ ] Coverage: happy path + error cases (401/403/404/422) đủ?
- [ ] Assertions check cả status + response body?
- [ ] Không hardcode token/ID thật?

---

## Nhóm 9: Playwright E2E (7 files) — Priority: High

### Files
| # | File |
|---|------|
| 1 | `demo_playwright/tests/ITa_functional/admin-categories.01-list.spec.ts` |
| 2 | `demo_playwright/tests/ITa_functional/admin-dashboard.01-stats.spec.ts` |
| 3 | `demo_playwright/tests/ITa_functional/admin-login.01-auth.spec.ts` |
| 4 | `demo_playwright/tests/ITa_functional/admin-posts.01-list.spec.ts` |
| 5 | `demo_playwright/tests/ITa_functional/admin-tags.spec.ts` |
| 6 | `demo_playwright/tests/ITa_functional/admin-users.01-list.spec.ts` |
| 7 | `demo_playwright/tests/ITb_scenarios/member-posts.01-manage.spec.ts` |

### Rules check
- [ ] Condition-Based Waiting: không `page.waitForTimeout()`?
- [ ] POM: UI logic trong page-objects/, test chỉ assert?
- [ ] Evidence Capture ở bước quan trọng?
- [ ] Data-driven: setup data qua API?

---

## Priority & Severity Mapping

| Nhóm | Severity | Lý do |
|------|----------|-------|
| BE Docs | Critical | API spec sai → code sai → test sai |
| FE Code | Critical | Trực tiếp ảnh hưởng UX, dễ chứa anti-pattern |
| BE Code | Critical | Bảo mật, validation, error format |
| FE Docs | High | Hướng dẫn code nhưng không gây crash nếu sai |
| Workflow | High | Input cho ITb, thiếu → test thiếu |
| ITa/ITb Docs | High | Test coverage quan trọng |
| Unit Tests | High | Regression, quality gate |
| Playwright | High | E2E reliability |

---

## Thứ tự thực thi

```
1. FE Design Docs (16 files) → audit + fix
2. BE Design Docs (34 files) → audit + fix
3. Workflow Docs (1 file) → audit + fix
4. ITa Test Docs (6 files) → audit + fix
5. ITb Test Docs (4 files) → audit + fix
6. FE Code (21 files) → audit + fix
7. BE Code (13 files) → audit + fix
8. Unit Tests (7 files) → audit + fix
9. Playwright E2E (7 files) → audit + fix
10. Final verification: npm test + FE build
11. AUDIT_REPORT.md + log
```

---

**Tổng số file audit: ~110 files**

Bạn có duyệt plan này không? Nếu OK, tôi sẽ bắt đầu audit từng nhóm theo thứ tự.