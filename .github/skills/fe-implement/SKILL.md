---
name: fe-implement
description: "Frontend implementation workflow for Blog Hoi An/Da Nang. Use when building React screens, components, auth flow, route guards, or fixing UI bugs. Loads screen specs, checklist, and component patterns. Trigger phrases: implement screen, React page, frontend component, auth context, protected route, admin UI, home page, category page, post form."
argument-hint: "Screen name or component to implement (e.g. HOME, ADMIN_POST_FORM, AuthContext)"
---

# FE Implement Skill

## Muc tieu
Implement man hinh hoac component dung spec, on dinh khi goi API, bao dam trai nghiem nguoi dung co ban.

## Khi nao dung
- Tao moi mot man hinh (page) hoac component
- Fix loi UI/UX
- Implement auth flow (AuthContext, ProtectedRoute)
- Them/sua route

## Procedure

### Buoc 1 — Doc spec truoc khi code
1. Tim man hinh trong [screen map](./references/screen-map.md)
2. Doc spec day du tai `demo_docs/fe/[Design][SCREEN] {ScreenCode}_{ScreenName}.md`
3. Doc API spec lien quan tai `demo_docs/api/[Design][API] API{ID}_{Group}_{Name}.md`
4. Doc `src/services/api.js` de tai dung ham da co
5. Doc `src/context/AuthContext.jsx` de lay auth state dung cach

### Buoc 2 — Implement theo checklist
Xem day du tai [checklist](./references/checklist.md).

Tom tat bat buoc:
- Route dung theo screen-list
- Moi API call co loading/error/success state
- Empty state khi list rong
- Chi dung TailwindCSS
- Khong hardcode URL/token

### Buoc 3 — Self-review
Truoc khi bao xong, check lai:
- Admin route co ProtectedRoute chua?
- Form co disable submit khi loading chua?
- Loi API co hien thi cho user chua?

### Buoc 4 — Verify
```powershell
cd demo_source_fe
npm run dev
# Mo http://localhost:5173 va test thu cong
```

## Output
```
### Files created/changed
- src/pages/...
- src/components/...

### Route changes (neu co)
App.jsx: them <Route path="..." element={...} />

### Manual verify steps
1. Mo http://localhost:5173/...
2. ...
3. Expect: ...
```
