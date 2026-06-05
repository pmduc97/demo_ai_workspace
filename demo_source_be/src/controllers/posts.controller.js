const db = require('../db');
const { validate } = require('../middlewares/validate');

exports.listPublic = async (req, res) => {
  const { category, page = 1, pageSize = 10 } = req.query;
  const p = Math.max(1, Number(page) || 1);
  const ps = Math.min(50, Math.max(1, Number(pageSize) || 10));
  let q = db('posts as p').leftJoin('categories as c', 'p.category_id', 'c.id').leftJoin('users as u', 'p.author_id', 'u.id').where('p.status', 'published').select('p.id', 'p.title', 'p.slug', 'p.thumbnail_url', 'p.created_at', 'c.name as category_name', 'c.slug as category_slug', 'u.name as author_name').orderBy('p.created_at', 'desc');
  if (category) q = q.andWhere('c.slug', category);
  const [items, countRow] = await Promise.all([q.clone().limit(ps).offset((p - 1) * ps), q.clone().countDistinct('p.id as c').first()]);
  res.json({ items, page: p, pageSize: ps, total: Number(countRow.c || 0) });
};

exports.getBySlug = async (req, res) => {
  const item = await db('posts as p').leftJoin('categories as c', 'p.category_id', 'c.id').leftJoin('users as u', 'p.author_id', 'u.id').where('p.slug', req.params.slug).andWhere('p.status', 'published').select('p.*', 'c.name as category_name', 'c.slug as category_slug', 'u.name as author_name').first();
  if (!item) return res.status(404).json({ message: 'Post not found' });
  return res.json(item);
};

exports.listMy = async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(50, Math.max(1, Number(limit) || 10));
  let q = db('posts as p').leftJoin('categories as c', 'p.category_id', 'c.id').where('p.author_id', req.user.id);
  if (status) q = q.andWhere('p.status', status);
  if (search) q = q.andWhereILike('p.title', `%${search}%`);
  const rows = await q.clone().select('p.id', 'p.title', 'p.slug', 'p.thumbnail_url', 'p.status', 'p.created_at', 'c.id as category_id', 'c.name as category_name', 'c.slug as category_slug').orderBy('p.created_at', 'desc').limit(l).offset((p - 1) * l);
  const countRow = await q.clone().count('* as count').first();
  const total = Number(countRow.count || 0);
  return res.json({ posts: rows.map((r) => ({ id: r.id, title: r.title, slug: r.slug, thumbnail_url: r.thumbnail_url, status: r.status, created_at: r.created_at, category: { id: r.category_id, name: r.category_name, slug: r.category_slug } })), total, page: p, totalPages: Math.max(1, Math.ceil(total / l)) });
};

exports.create = async (req, res) => {
  const errors = validate([
    { field: 'title', required: true, type: 'string', min: 5 },
    { field: 'slug', required: true, type: 'string', pattern: /^[a-z0-9-]+$/ },
    { field: 'content', required: true, type: 'string' },
    { field: 'status', required: false, enum: ['draft', 'published'] },
    { field: 'category_id', required: true, type: 'number' },
  ], req.body);
  if (errors.length) return res.status(422).json({ message: 'Validation failed', details: errors });
  const { title, slug, content, thumbnail_url, status = 'draft', category_id } = req.body;
  const rows = await db('posts').insert({ title, slug, content, thumbnail_url, status, category_id, author_id: req.user.id }).returning('*');
  return res.status(201).json(rows[0]);
};

exports.update = async (req, res) => {
  const post = await db('posts').where({ id: req.params.id }).first();
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (req.user.role !== 'admin' && post.author_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  const errors = validate([
    { field: 'title', required: false, type: 'string', min: 5 },
    { field: 'slug', required: false, type: 'string', pattern: /^[a-z0-9-]+$/ },
    { field: 'content', required: false, type: 'string' },
    { field: 'status', required: false, enum: ['draft', 'published'] },
    { field: 'category_id', required: false, type: 'number' },
  ], req.body);
  if (errors.length) return res.status(422).json({ message: 'Validation failed', details: errors });

  const { title, slug, content, thumbnail_url, status, category_id } = req.body;
  const updateData = { updated_at: db.fn.now() };
  if (title !== undefined) updateData.title = title;
  if (slug !== undefined) updateData.slug = slug;
  if (content !== undefined) updateData.content = content;
  if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url;
  if (status !== undefined) updateData.status = status;
  if (category_id !== undefined) updateData.category_id = category_id;

  const rows = await db('posts').where({ id: req.params.id }).update(updateData).returning('*');
  return res.json(rows[0]);
};
exports.remove = async (req, res) => { const post = await db('posts').where({ id: req.params.id }).first(); if (!post) return res.status(404).json({ message: 'Post not found' }); if (req.user.role !== 'admin' && post.author_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' }); await db('posts').where({ id: req.params.id }).del(); return res.json({ message: 'Deleted' }); };
exports.listAdmin = async (req, res) => res.json({ items: await db('posts').orderBy('created_at', 'desc') });
exports.getAdminById = async (req, res) => { const post = await db('posts').where({ id: req.params.id }).first(); if (!post) return res.status(404).json({ message: 'Post not found' }); return res.json(post); };
exports.updateStatus = async (req, res) => { if (!['draft', 'published'].includes(req.body.status)) return res.status(422).json({ message: 'Validation failed', details: [{ field: 'status', message: 'status must be draft or published' }] }); const rows = await db('posts').where({ id: req.params.id }).update({ status: req.body.status, updated_at: db.fn.now() }).returning('*'); if (!rows[0]) return res.status(404).json({ message: 'Post not found' }); return res.json(rows[0]); };
exports.adminStats = async (req, res) => { const scoped = req.user.role === 'admin' ? db('posts') : db('posts').where('author_id', req.user.id); const [totalRow, pubRow, draftRow, catRow] = await Promise.all([scoped.clone().count('* as c').first(), scoped.clone().where('status', 'published').count('* as c').first(), scoped.clone().where('status', 'draft').count('* as c').first(), db('categories').count('* as c').first()]); res.json({ totalPosts: Number(totalRow.c || 0), publishedPosts: Number(pubRow.c || 0), draftPosts: Number(draftRow.c || 0), totalCategories: Number(catRow.c || 0) }); };
