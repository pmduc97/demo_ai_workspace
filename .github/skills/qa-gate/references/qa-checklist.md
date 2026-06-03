## QA Checklist Day Du

### Public Flow
- [ ] GET /api/posts tra ve danh sach bai viet published
- [ ] GET /api/posts?category=:slug filter dung
- [ ] GET /api/posts/:slug tra ve day du noi dung bai viet
- [ ] FE: Home render PostCard list
- [ ] FE: Category page filter theo slug
- [ ] FE: PostDetail hien thi title, content, author, date
- [ ] FE: About + Contact render khong crash

### Auth Flow
- [ ] POST /api/auth/register tao duoc user moi
- [ ] POST /api/auth/login tra JWT khi dung email/password
- [ ] GET /api/auth/me tra dung user khi co token hop le
- [ ] GET /api/auth/me tra 401 khi khong co token
- [ ] FE: Login form luu token vao AuthContext
- [ ] FE: Logout xoa token, redirect ve /

### Member Flow
- [ ] POST /api/posts tao duoc bai viet (draft) voi token member
- [ ] PUT /api/posts/:id sua duoc bai cua minh
- [ ] PUT /api/posts/:id tra 403 khi sua bai cua nguoi khac
- [ ] DELETE /api/posts/:id tra 403 khi xoa bai cua nguoi khac

### Admin Flow
- [ ] GET /api/admin/stats tra ve so lieu dashboard
- [ ] PATCH /api/admin/posts/:id/status doi duoc status bai viet
- [ ] GET /api/admin/posts list day du ca draft + published
- [ ] DELETE /api/admin/posts/:id xoa duoc bai bat ki
- [ ] POST /api/categories tao duoc category moi
- [ ] PUT /api/categories/:id cap nhat duoc
- [ ] DELETE /api/categories/:id xoa duoc
- [ ] GET /api/admin/users tra ve danh sach users
- [ ] PATCH /api/admin/users/:id/role doi duoc role

### Upload Flow
- [ ] POST /api/upload tra ve { url } hop le
- [ ] URL co the access duoc (khong 404)
- [ ] FE: Upload trong PostForm hien thi preview anh

### Docs Sync
- [ ] Tat ca 22 endpoint trong code deu co file docs tuong ung
- [ ] Response fields trong docs khop voi controller thuc te
- [ ] Status code trong docs khop voi code thuc te
- [ ] DB schema trong database.md khop voi migration thuc te
