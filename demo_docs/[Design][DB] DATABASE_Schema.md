# Tài Liệu Database (PostgreSQL) - Blog Du Lịch

## 1) Tổng quan
- DB name: `hoian_blog`
- Engine: PostgreSQL 16
- ORM/Query Builder: Knex.js

## 2) Lược đồ bảng

## 2.1 Common columns
Các bảng nghiệp vụ phải có nhóm cột audit/soft-delete sau:
- `created_at` (timestamp, default now)
- `created_by` (FK -> users.id, null với dữ liệu hệ thống/seed)
- `updated_at` (timestamp, default now)
- `updated_by` (FK -> users.id, null nếu chưa cập nhật)
- `deleted_at` (timestamp, null) — soft delete, record active khi `deleted_at IS NULL`
- `deleted_by` (FK -> users.id, null nếu chưa xóa)

> Quy ước: dùng `deleted_at` thay vì boolean `is_delete` để vừa xác định trạng thái xóa mềm vừa lưu được thời điểm xóa.

### `users`
- `id` (PK, serial)
- `email` (varchar, unique, not null)
- `password_hash` (varchar, not null)
- `name` (varchar, not null)
- `phone` (varchar(20), null)
- `address` (varchar(255), null)
- `avatar_url` (varchar(255), null)
- `role` (enum: `admin|member`, default `member`)
- `status` (enum: `active|locked`, default `active`)
- `bio` (text, null)
- `birthdate` (date, null)
- `gender` (enum: `male|female|other|unknown`, default `unknown`)
- `locked_reason` (text, null) — bắt buộc khi `status='locked'` ở tầng API; API validate tối đa 255 ký tự
- `last_login_at` (timestamp, null)
- common columns: `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`

### `categories`
- `id` (PK, serial)
- `name` (varchar, not null)
- `slug` (varchar, not null)
- `description` (text, null)
- `status` (enum: `active|hidden`, default `active`)
- `thumbnail_url` (varchar, null)
- `seo_title` (varchar, null)
- `seo_description` (varchar, null)
- common columns: `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`

Index/constraint:
- Unique slug chỉ áp dụng cho record chưa xóa: `UNIQUE(slug) WHERE deleted_at IS NULL`

### `posts`
- `id` (PK, serial)
- `title` (varchar, not null)
- `slug` (varchar, unique, not null)
- `content` (text, null)
- `thumbnail_url` (varchar, null)
- `status` (enum: `draft|published`, default `draft`)
- `view_count` (integer, default 0)
- `author_id` (FK -> users.id, on delete cascade)
- `category_id` (FK -> categories.id, on delete set null)
- common columns: `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`

### `tags`
- `id` (PK, serial)
- `name` (varchar, not null)
- `slug` (varchar, not null)
- `description` (text, null)
- common columns: `created_at`, `created_by`, `updated_at`, `updated_by`, `deleted_at`, `deleted_by`

Index/constraint:
- Unique slug chỉ áp dụng cho record chưa xóa: `UNIQUE(slug) WHERE deleted_at IS NULL`

### `post_tags`
- `post_id` (FK -> posts.id, on delete cascade)
- `tag_id` (FK -> tags.id, on delete cascade)
- `created_at` (timestamp, default now)
- PK: `(post_id, tag_id)`

## 3) Quan hệ
- 1 user có nhiều posts (`users.id` -> `posts.author_id`)
- 1 category có nhiều posts (`categories.id` -> `posts.category_id`)
- 1 user có thể tạo/cập nhật/xóa nhiều categories qua `created_by`, `updated_by`, `deleted_by`
- Quan hệ n-n giữa `posts` và `tags` thông qua bảng trung gian `post_tags`

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
- Categories: 24 bản ghi mẫu để kiểm thử filter/sort/pagination với màn admin mặc định `limit=5`, gồm 22 `active` và 2 `hidden`.
- Posts: 3 bản ghi mẫu (published + draft) có `view_count`, `created_by`, `updated_by`.

## 6) Index/khuyến nghị tối ưu
- Đã có unique index tự nhiên qua `email`, `slug`
- Khuyến nghị thêm index:
  - `posts(status, created_at)`
  - `posts(author_id, created_at)`
  - `posts(category_id, created_at)`
  - `posts(category_id, status, deleted_at)`
  - `categories(status, deleted_at, created_at)`
  - `categories(slug) WHERE deleted_at IS NULL`

## 7) Quy ước cho unit test DB
- Mỗi test suite chạy transaction riêng và rollback sau test
- Không phụ thuộc dữ liệu seed production
- Dùng factory tạo users/categories/posts cho từng scenario
