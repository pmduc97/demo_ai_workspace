## Screen Map — Frontend

| Screen | Route | Auth | Spec file |
|--------|-------|------|-----------|
| Home | `/` | public | `demo_docs/fe/HOME.md` |
| Category | `/category/:slug` | public | `demo_docs/fe/CATEGORY.md` |
| Post Detail | `/post/:slug` | public | `demo_docs/fe/POST_DETAIL.md` |
| About | `/about` | public | `demo_docs/fe/ABOUT.md` |
| Contact | `/contact` | public | `demo_docs/fe/CONTACT.md` |
| Admin Login | `/admin/login` | public (redirect nếu đã login) | `demo_docs/fe/ADMIN_LOGIN.md` |
| Admin Dashboard | `/admin/dashboard` | admin | `demo_docs/fe/ADMIN_DASHBOARD.md` |
| Admin Post List | `/admin/posts` | admin | `demo_docs/fe/ADMIN_POST_LIST.md` |
| Admin Post Form | `/admin/posts/new`, `/admin/posts/:id/edit` | admin | `demo_docs/fe/ADMIN_POST_FORM.md` |
| Admin Category List | `/admin/categories` | admin | `demo_docs/fe/ADMIN_CATEGORY_LIST.md` |
| Admin User List | `/admin/users` | admin | `demo_docs/fe/ADMIN_USER_LIST.md` |

## Auth Context API

```jsx
const { user, token, login, logout, isLoading } = useAuth();
// user: { id, name, email, role } | null
// login(email, password) → Promise
// logout() → void
```

## API Service Pattern

```jsx
// src/services/api.js exports:
api.get('/posts')           // public
api.post('/posts', data)    // member (auto attach token)
api.put('/posts/:id', data) // member/admin
api.delete('/posts/:id')    // member/admin
```
