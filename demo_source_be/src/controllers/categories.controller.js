const db = require('../db');

const messages = {
	invalid: { messageId: 'CATEGORY-E-001', message: 'Dữ liệu danh mục không hợp lệ' },
	duplicate: { messageId: 'CATEGORY-E-002', message: 'Slug danh mục đã tồn tại' },
	notFound: { messageId: 'CATEGORY-E-003', message: 'Danh mục không tồn tại' },
	forbidden: { messageId: 'CATEGORY-E-004', message: 'Bạn không có quyền quản lý danh mục' },
};

const allowedStatuses = ['active', 'hidden'];
const allowedSorts = ['created_at_desc', 'name_asc', 'post_count_desc', 'view_count_desc', 'latest_post_desc'];
const slugPattern = /^[a-z0-9-]+$/;

const isAdmin = (req) => req.user && req.user.role === 'admin';
const parsePositiveInt = (value) => Number.isInteger(Number(value)) ? Number(value) : NaN;
const toNullableString = (value) => (value === undefined ? undefined : String(value).trim() || null);

const validationError = (res, details) => res.status(422).json({ ...messages.invalid, details });

const validateCategoryPayload = (body, isCreate) => {
	const errors = [];
	const data = {};

	if (isCreate || body.name !== undefined) {
		const name = String(body.name || '').trim();
		if (name.length < 2) errors.push({ field: 'name', message: 'name must be at least 2 characters' });
		else data.name = name;
	}

	if (isCreate || body.slug !== undefined) {
		const slug = String(body.slug || '').trim();
		if (!slugPattern.test(slug)) errors.push({ field: 'slug', message: 'slug must contain lowercase letters, numbers, and hyphen only' });
		else data.slug = slug;
	}

	if (body.description !== undefined) {
		const description = toNullableString(body.description);
		if (description && description.length > 500) errors.push({ field: 'description', message: 'description must not exceed 500 characters' });
		else data.description = description;
	}

	if (body.status !== undefined) {
		const status = String(body.status).trim();
		if (!allowedStatuses.includes(status)) errors.push({ field: 'status', message: 'status must be active or hidden' });
		else data.status = status;
	} else if (isCreate) {
		data.status = 'active';
	}

	for (const field of ['thumbnail_url', 'seo_title', 'seo_description']) {
		if (body[field] !== undefined) data[field] = toNullableString(body[field]);
	}
	if (data.thumbnail_url && data.thumbnail_url.length > 255) errors.push({ field: 'thumbnail_url', message: 'thumbnail_url must not exceed 255 characters' });
	if (data.seo_title && data.seo_title.length > 70) errors.push({ field: 'seo_title', message: 'seo_title must not exceed 70 characters' });
	if (data.seo_description && data.seo_description.length > 160) errors.push({ field: 'seo_description', message: 'seo_description must not exceed 160 characters' });

	return { errors, data };
};

const applyCategoryFilters = (query, { keyword, status }) => {
	query.whereNull('c.deleted_at');
	if (keyword) {
		query.andWhere((builder) => {
			builder.whereILike('c.name', `%${keyword}%`).orWhereILike('c.slug', `%${keyword}%`);
		});
	}
	if (status !== 'all') query.andWhere('c.status', status);
};

exports.list = async (req, res) => {
	const keyword = req.query.keyword ? String(req.query.keyword).trim() : '';
	const requestedStatus = req.query.status ? String(req.query.status).trim() : undefined;
	const status = requestedStatus || (isAdmin(req) ? 'all' : 'active');
	const sort = req.query.sort ? String(req.query.sort).trim() : 'created_at_desc';
	const page = req.query.page === undefined ? 1 : parsePositiveInt(req.query.page);
	const limit = req.query.limit === undefined ? 10 : parsePositiveInt(req.query.limit);
	const errors = [];

	if (keyword.length > 100) errors.push({ field: 'keyword', message: 'keyword must not exceed 100 characters' });
	if (!['active', 'hidden', 'all'].includes(status)) errors.push({ field: 'status', message: 'status must be active, hidden, or all' });
	if (!allowedSorts.includes(sort)) errors.push({ field: 'sort', message: 'sort is not supported' });
	if (!Number.isInteger(page) || page < 1) errors.push({ field: 'page', message: 'page must be an integer greater than or equal to 1' });
	if (!Number.isInteger(limit) || limit < 1 || limit > 100) errors.push({ field: 'limit', message: 'limit must be an integer from 1 to 100' });
	if (errors.length) return validationError(res, errors);
	if (!isAdmin(req) && ['hidden', 'all'].includes(status)) return res.status(403).json(messages.forbidden);

	const effectiveStatus = isAdmin(req) ? status : 'active';
	const base = db('categories as c').modify(applyCategoryFilters, { keyword, status: effectiveStatus });
	const countRow = await base.clone().count('c.id as total').first();

	const latestPostSubquery = db('posts as lp')
		.select(db.raw("json_build_object('id', lp.id, 'title', lp.title, 'slug', lp.slug, 'created_at', lp.created_at)"))
		.whereRaw('lp.category_id = c.id')
		.whereNull('lp.deleted_at')
		.orderBy('lp.created_at', 'desc')
		.limit(1);

	const query = base.clone()
		.leftJoin('users as u', 'u.id', 'c.created_by')
		.leftJoin('posts as p', function joinPosts() {
			this.on('p.category_id', '=', 'c.id').andOnNull('p.deleted_at');
		})
		.select('c.id', 'c.name', 'c.slug', 'c.description', 'c.status', 'c.thumbnail_url', 'c.seo_title', 'c.seo_description', 'c.created_at', 'c.updated_at', 'u.name as createdByName')
		.select(db.raw('COUNT(p.id) as "postCount"'))
		.select(db.raw("SUM(CASE WHEN p.status = 'published' THEN 1 ELSE 0 END) as \"publishedPostCount\""))
		.select(db.raw('SUM(COALESCE(p.view_count, 0)) as "viewCount"'))
		.select({ latestPost: latestPostSubquery })
		.groupBy('c.id', 'u.name')
		.limit(limit)
		.offset((page - 1) * limit);

	if (sort === 'name_asc') query.orderBy('c.name', 'asc');
	else if (sort === 'post_count_desc') query.orderBy('postCount', 'desc');
	else if (sort === 'view_count_desc') query.orderBy('viewCount', 'desc');
	else if (sort === 'latest_post_desc') query.orderByRaw('MAX(p.created_at) DESC NULLS LAST');
	else query.orderBy('c.created_at', 'desc');

	const rows = await query;
	const totalItems = Number(countRow.total || 0);
	return res.json({
		items: rows.map((row) => ({ ...row, postCount: Number(row.postCount || 0), publishedPostCount: Number(row.publishedPostCount || 0), viewCount: Number(row.viewCount || 0) })),
		pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
	});
};

exports.getBySlug = async (req, res) => {
	const item = await db('categories').where({ slug: req.params.slug, status: 'active' }).whereNull('deleted_at').first();
	if (!item) return res.status(404).json(messages.notFound);
	return res.json(item);
};

exports.create = async (req, res) => {
	const { errors, data } = validateCategoryPayload(req.body, true);
	if (errors.length) return validationError(res, errors);
	const exists = await db('categories').where({ slug: data.slug }).whereNull('deleted_at').first();
	if (exists) return res.status(409).json(messages.duplicate);
	const userId = req.user ? req.user.id : null;
	const rows = await db('categories').insert({ ...data, created_by: userId, updated_by: userId }).returning('*');
	return res.status(201).json({ messageId: 'CATEGORY-S-001', message: 'Tạo danh mục thành công', ...rows[0] });
};

exports.update = async (req, res) => {
	const id = parsePositiveInt(req.params.id);
	if (!Number.isInteger(id) || id < 1) return validationError(res, [{ field: 'id', message: 'id must be a positive integer' }]);
	const existing = await db('categories').where({ id }).whereNull('deleted_at').first();
	if (!existing) return res.status(404).json(messages.notFound);
	const { errors, data } = validateCategoryPayload(req.body, false);
	if (errors.length) return validationError(res, errors);
	if (!Object.keys(data).length) return validationError(res, [{ field: 'body', message: 'at least one field is required' }]);
	if (data.slug) {
		const duplicate = await db('categories').where({ slug: data.slug }).whereNull('deleted_at').andWhere('id', '!=', id).first();
		if (duplicate) return res.status(409).json(messages.duplicate);
	}
	const rows = await db('categories').where({ id }).whereNull('deleted_at').update({ ...data, updated_at: db.fn.now(), updated_by: req.user.id }).returning('*');
	return res.json({ messageId: 'CATEGORY-S-002', message: 'Cập nhật danh mục thành công', ...rows[0] });
};

exports.remove = async (req, res) => {
	const id = parsePositiveInt(req.params.id);
	if (!Number.isInteger(id) || id < 1) return validationError(res, [{ field: 'id', message: 'id must be a positive integer' }]);
	const existing = await db('categories').where({ id }).whereNull('deleted_at').first();
	if (!existing) return res.status(404).json(messages.notFound);
	const rows = await db('categories').where({ id }).whereNull('deleted_at').update({ deleted_at: db.fn.now(), deleted_by: req.user.id, updated_at: db.fn.now(), updated_by: req.user.id }).returning(['id', 'deleted_at']);
	return res.json({ messageId: 'CATEGORY-S-003', message: 'Xóa danh mục thành công', id: rows[0].id, deleted_at: rows[0].deleted_at });
};
