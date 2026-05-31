# Tài Liệu Database (PostgreSQL) - Blog Hội An/Đà Nẵng

## 1) Tổng quan
- DB name: `hoian_blog`
- Engine: PostgreSQL 16
- ORM/Query Builder: Knex.js

## 2) Lược đồ bảng

### `users`
- `id` (PK, serial)
- `email` (varchar, unique, not null)
- `password_hash` (varchar, not null)
- `name` (varchar, not null)
- `role` (enum: `admin|member`, default `member`)
- `created_at` (timestamp, default now)

### `categories`
- `id` (PK, serial)
- `name` (varchar, not null)
- `slug` (varchar, unique, not null)
- `description` (text, null)

### `posts`
- `id` (PK, serial)
- `title` (varchar, not null)
- `slug` (varchar, unique, not null)
- `content` (text, null)
- `thumbnail_url` (varchar, null)
- `status` (enum: `draft|published`, default `draft`)
- `author_id` (FK -> users.id, on delete cascade)
- `category_id` (FK -> categories.id, on delete set null)
- `created_at` (timestamp, default now)
- `updated_at` (timestamp, default now)

## 3) Quan hệ
- 1 user có nhiều posts (`users.id` -> `posts.author_id`)
- 1 category có nhiều posts (`categories.id` -> `posts.category_id`)

## 4) Migration & Seed
```bash
cd demo_source_be
npm run migrate
npm run seed
```

## 5) Dữ liệu seed mặc định
- Users:
  - `admin@hoianblog.vn` / `password123` (admin)
  - `member@hoianblog.vn` / `password123` (member)
- Categories: du-lich, am-thuc, van-hoa
- Posts: 3 bản ghi mẫu (published + draft)

## 6) Index/khuyến nghị tối ưu
- Đã có unique index tự nhiên qua `email`, `slug`
- Khuyến nghị thêm index:
  - `posts(status, created_at)`
  - `posts(author_id, created_at)`
  - `posts(category_id, created_at)`

## 7) Quy ước cho unit test DB
- Mỗi test suite chạy transaction riêng và rollback sau test
- Không phụ thuộc dữ liệu seed production
- Dùng factory tạo users/categories/posts cho từng scenario
