const db = require('../db');

exports.getTags = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(422).json({ messageId: 'TAG-E-001', message: 'Validation failed', details: 'Page and limit must be positive integers' });
    }

    const offset = (page - 1) * limit;

    const query = db('tags').whereNull('deleted_at');

    const [countResult, tags] = await Promise.all([
      query.clone().count('* as total').first(),
      query.clone().select('id', 'name', 'slug', 'description').limit(limit).offset(offset).orderBy('created_at', 'desc')
    ]);

    const total = parseInt(countResult.total);

    res.json({
      message: 'Lấy danh sách tags thành công',
      data: tags,
      meta: {
        total,
        page,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ messageId: 'COMMON-E-001', message: 'Internal server error', details: error.message });
  }
};

exports.getAdminTags = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    if (page < 1 || limit < 1) {
      return res.status(422).json({ messageId: 'TAG-E-001', message: 'Validation failed', details: 'Page and limit must be positive integers' });
    }

    const offset = (page - 1) * limit;

    const query = db('tags').whereNull('deleted_at');

    if (search) {
      query.where('name', 'ilike', `%${search}%`);
    }

    const [countResult, tags] = await Promise.all([
      query.clone().count('* as total').first(),
      query.clone().select('id', 'name', 'slug', 'description', 'created_at').limit(limit).offset(offset).orderBy('created_at', 'desc')
    ]);

    const total = parseInt(countResult.total);

    res.json({
      message: 'Lấy danh sách tags thành công',
      data: tags,
      meta: {
        total,
        page,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ messageId: 'COMMON-E-001', message: 'Internal server error', details: error.message });
  }
};

exports.createTag = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(422).json({ messageId: 'TAG-E-001', message: 'Validation failed', details: 'Name is required' });
    }
    if (!slug || !slug.trim()) {
      return res.status(422).json({ messageId: 'TAG-E-001', message: 'Validation failed', details: 'Slug is required' });
    }

    const normalizedSlug = slug.trim().toLowerCase();

    const existingTag = await db('tags').where({ slug: normalizedSlug }).whereNull('deleted_at').first();
    if (existingTag) {
      return res.status(409).json({ messageId: 'TAG-E-002', message: 'Conflict', details: 'Slug already exists' });
    }

    const [newTag] = await db('tags').insert({
      name: name.trim(),
      slug: normalizedSlug,
      description: description ? description.trim() : null,
      created_by: req.user.id,
      updated_by: req.user.id
    }).returning(['id']);

    res.status(201).json({
      message: 'Tạo tag thành công',
      data: { id: newTag.id }
    });
  } catch (error) {
    res.status(500).json({ messageId: 'COMMON-E-001', message: 'Internal server error', details: error.message });
  }
};

exports.updateTag = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(422).json({ messageId: 'TAG-E-001', message: 'Validation failed', details: 'Invalid ID' });
    }

    const { name, slug, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(422).json({ messageId: 'TAG-E-001', message: 'Validation failed', details: 'Name is required' });
    }
    if (!slug || !slug.trim()) {
      return res.status(422).json({ messageId: 'TAG-E-001', message: 'Validation failed', details: 'Slug is required' });
    }

    const normalizedSlug = slug.trim().toLowerCase();

    const tag = await db('tags').where({ id }).whereNull('deleted_at').first();
    if (!tag) {
      return res.status(404).json({ messageId: 'TAG-E-003', message: 'Not found', details: 'Tag not found' });
    }

    const existingTag = await db('tags').where({ slug: normalizedSlug }).whereNot({ id }).whereNull('deleted_at').first();
    if (existingTag) {
      return res.status(409).json({ messageId: 'TAG-E-002', message: 'Conflict', details: 'Slug already exists' });
    }

    await db('tags').where({ id }).update({
      name: name.trim(),
      slug: normalizedSlug,
      description: description ? description.trim() : null,
      updated_at: db.fn.now(),
      updated_by: req.user.id
    });

    res.json({
      message: 'Cập nhật tag thành công',
      data: { id }
    });
  } catch (error) {
    res.status(500).json({ messageId: 'COMMON-E-001', message: 'Internal server error', details: error.message });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(422).json({ messageId: 'TAG-E-001', message: 'Validation failed', details: 'Invalid ID' });
    }

    const tag = await db('tags').where({ id }).whereNull('deleted_at').first();
    if (!tag) {
      return res.status(404).json({ messageId: 'TAG-E-003', message: 'Not found', details: 'Tag not found' });
    }

    await db('tags').where({ id }).update({
      deleted_at: db.fn.now(),
      deleted_by: req.user.id
    });

    res.json({
      message: 'Xóa tag thành công'
    });
  } catch (error) {
    res.status(500).json({ messageId: 'COMMON-E-001', message: 'Internal server error', details: error.message });
  }
};
