const bcrypt = require('bcryptjs');
const db = require('../db');

const normalizeOptional = (value) => (value === undefined ? null : String(value).trim() || null);
const isPositiveId = (id) => Number.isInteger(id) && id > 0;

exports.list = async (req, res) => {
  try {
    let { keyword, role, status, sort, page, limit } = req.query;

    // Validation
    if (keyword && keyword.length > 100) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'Từ khóa quá dài' });
    }
    if (role && !['all', 'admin', 'member'].includes(role)) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'Role không hợp lệ' });
    }
    if (status && !['all', 'active', 'locked'].includes(status)) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'Status không hợp lệ' });
    }
    if (sort && !['created_at_desc', 'name_asc', 'post_count_desc', 'last_login_desc'].includes(sort)) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'Sort không hợp lệ' });
    }
    
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'Pagination không hợp lệ' });
    }

    role = role || 'all';
    status = status || 'all';
    sort = sort || 'created_at_desc';

    let query = db('users')
      .whereNull('users.deleted_at')
      .leftJoin('posts', 'posts.author_id', 'users.id')
      .select(
        'users.id', 'users.name', 'users.email', 'users.phone', 'users.address',
        'users.avatar_url', 'users.role', 'users.status', 'users.bio', 'users.birthdate',
        'users.gender', 'users.locked_reason', 'users.last_login_at', 'users.created_at', 'users.updated_at'
      )
      .count('posts.id as postCount')
      .sum(db.raw("CASE WHEN posts.status = 'published' THEN 1 ELSE 0 END")).as('publishedPostCount')
      .sum(db.raw("CASE WHEN posts.status = 'draft' THEN 1 ELSE 0 END")).as('draftPostCount')
      .groupBy('users.id');

    if (keyword) {
      query = query.where(function() {
        this.where('users.name', 'ilike', `%${keyword}%`)
            .orWhere('users.email', 'ilike', `%${keyword}%`)
            .orWhere('users.phone', 'ilike', `%${keyword}%`);
      });
    }
    if (role !== 'all') {
      query = query.where('users.role', role);
    }
    if (status !== 'all') {
      query = query.where('users.status', status);
    }

    // Count total items
    const countQuery = db('users').whereNull('deleted_at');
    if (keyword) {
      countQuery.where(function() {
        this.where('name', 'ilike', `%${keyword}%`)
            .orWhere('email', 'ilike', `%${keyword}%`)
            .orWhere('phone', 'ilike', `%${keyword}%`);
      });
    }
    if (role !== 'all') countQuery.where('role', role);
    if (status !== 'all') countQuery.where('status', status);
    
    const totalResult = await countQuery.count('id as total').first();
    const totalItems = parseInt(totalResult.total);

    // Sorting
    switch (sort) {
      case 'name_asc':
        query = query.orderBy('users.name', 'asc');
        break;
      case 'post_count_desc':
        query = query.orderBy('postCount', 'desc');
        break;
      case 'last_login_desc':
        query = query.orderBy('users.last_login_at', 'desc').orderBy('users.id', 'desc');
        break;
      case 'created_at_desc':
      default:
        query = query.orderBy('users.created_at', 'desc');
        break;
    }

    const items = await query.limit(limit).offset((page - 1) * limit);

    // Format counts
    const formattedItems = items.map(item => ({
      ...item,
      postCount: parseInt(item.postCount || 0),
      publishedPostCount: parseInt(item.publishedPostCount || 0),
      draftPostCount: parseInt(item.draftPostCount || 0)
    }));

    res.json({
      items: formattedItems,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ messageId: 'COMMON-E-001', message: 'Lỗi hệ thống' });
  }
};

exports.createAdminUser = async (req, res) => {
  try {
    let { name, email, password, role, status, phone, address, avatar_url, bio, birthdate, gender, locked_reason } = req.body;
    name = String(name || '').trim();
    email = String(email || '').trim().toLowerCase();
    password = String(password || '');
    role = role || 'member';
    status = status || 'active';
    gender = gender || 'unknown';

    if (name.length < 2 || name.length > 100 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'Dữ liệu người dùng không hợp lệ' });
    }
    if (!['admin', 'member'].includes(role) || !['active', 'locked'].includes(status) || !['male', 'female', 'other', 'unknown'].includes(gender)) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'Dữ liệu người dùng không hợp lệ' });
    }
    if (status === 'locked' && (!locked_reason || locked_reason.trim().length < 5 || locked_reason.trim().length > 255)) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'Lý do khóa không hợp lệ' });
    }

    const existing = await db('users').where({ email }).whereNull('deleted_at').first();
    if (existing) return res.status(409).json({ messageId: 'USER-E-002', message: 'Email người dùng đã tồn tại' });

    const password_hash = await bcrypt.hash(password, 10);
    const rows = await db('users')
      .insert({
        name,
        email,
        password_hash,
        role,
        status,
        phone: normalizeOptional(phone),
        address: normalizeOptional(address),
        avatar_url: normalizeOptional(avatar_url),
        bio: normalizeOptional(bio),
        birthdate: normalizeOptional(birthdate),
        gender,
        locked_reason: status === 'locked' ? locked_reason.trim() : null,
        created_by: req.user.id,
        updated_by: req.user.id
      })
      .returning(['id', 'name', 'email', 'role', 'status', 'phone', 'address', 'avatar_url', 'bio', 'birthdate', 'gender', 'locked_reason', 'created_at']);

    return res.status(201).json({ messageId: 'USER-S-004', message: 'Tạo người dùng thành công', data: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ messageId: 'COMMON-E-001', message: 'Lỗi hệ thống' });
  }
};

exports.deleteAdminUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!isPositiveId(id)) return res.status(422).json({ messageId: 'USER-E-001', message: 'ID không hợp lệ' });
    if (id === req.user.id) return res.status(400).json({ messageId: 'USER-E-007', message: 'Không thể tự xóa chính mình' });

    const user = await db('users').where({ id }).whereNull('deleted_at').first();
    if (!user) return res.status(404).json({ messageId: 'USER-E-003', message: 'Người dùng không tồn tại' });

    const rows = await db('users')
      .where({ id })
      .whereNull('deleted_at')
      .update({ deleted_at: db.fn.now(), deleted_by: req.user.id, updated_at: db.fn.now(), updated_by: req.user.id })
      .returning(['id', 'deleted_at']);

    return res.json({ messageId: 'USER-S-005', message: 'Xóa người dùng thành công', data: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ messageId: 'COMMON-E-001', message: 'Lỗi hệ thống' });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { role } = req.body;

    if (isNaN(id) || id <= 0) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'ID không hợp lệ' });
    }
    if (!['admin', 'member'].includes(role)) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'Role không hợp lệ' });
    }
    if (id === req.user.id) {
      return res.status(400).json({ messageId: 'USER-E-005', message: 'Không thể tự đổi role của chính mình' });
    }

    const user = await db('users').where({ id }).whereNull('deleted_at').first();
    if (!user) {
      return res.status(404).json({ messageId: 'USER-E-003', message: 'Người dùng không tồn tại' });
    }

    const rows = await db('users')
      .where({ id })
      .update({ role, updated_at: db.fn.now(), updated_by: req.user.id })
      .returning(['id', 'role']);

    res.json({
      messageId: 'USER-S-002',
      message: 'Cập nhật role thành công',
      data: rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ messageId: 'COMMON-E-001', message: 'Lỗi hệ thống' });
  }
};

exports.getAdminUserDetail = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'ID không hợp lệ' });
    }

    const user = await db('users')
      .where('users.id', id)
      .whereNull('users.deleted_at')
      .leftJoin('posts', 'posts.author_id', 'users.id')
      .select(
        'users.id', 'users.name', 'users.email', 'users.phone', 'users.address',
        'users.avatar_url', 'users.role', 'users.status', 'users.bio', 'users.birthdate',
        'users.gender', 'users.locked_reason', 'users.last_login_at', 'users.created_at', 'users.updated_at'
      )
      .count('posts.id as postCount')
      .sum(db.raw("CASE WHEN posts.status = 'published' THEN 1 ELSE 0 END")).as('publishedPostCount')
      .sum(db.raw("CASE WHEN posts.status = 'draft' THEN 1 ELSE 0 END")).as('draftPostCount')
      .groupBy('users.id')
      .first();

    if (!user) {
      return res.status(404).json({ messageId: 'USER-E-003', message: 'Người dùng không tồn tại' });
    }

    user.postCount = parseInt(user.postCount || 0);
    user.publishedPostCount = parseInt(user.publishedPostCount || 0);
    user.draftPostCount = parseInt(user.draftPostCount || 0);

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ messageId: 'COMMON-E-001', message: 'Lỗi hệ thống' });
  }
};

exports.updateAdminUserProfile = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'ID không hợp lệ' });
    }

    let { name, phone, address, avatar_url, bio, birthdate, gender } = req.body;

    if (!name || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'Tên không hợp lệ' });
    }

    phone = phone?.trim() || null;
    address = address?.trim() || null;
    avatar_url = avatar_url?.trim() || null;
    bio = bio?.trim() || null;
    birthdate = birthdate || null;
    gender = gender || 'unknown';

    if (!['male', 'female', 'other', 'unknown'].includes(gender)) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'Giới tính không hợp lệ' });
    }

    const user = await db('users').where({ id }).whereNull('deleted_at').first();
    if (!user) {
      return res.status(404).json({ messageId: 'USER-E-003', message: 'Người dùng không tồn tại' });
    }

    const rows = await db('users')
      .where({ id })
      .update({
        name: name.trim(),
        phone,
        address,
        avatar_url,
        bio,
        birthdate,
        gender,
        updated_at: db.fn.now(),
        updated_by: req.user.id
      })
      .returning(['id', 'name', 'phone', 'address', 'avatar_url', 'bio', 'birthdate', 'gender', 'updated_at']);

    res.json({
      messageId: 'USER-S-001',
      message: 'Cập nhật người dùng thành công',
      data: rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ messageId: 'COMMON-E-001', message: 'Lỗi hệ thống' });
  }
};

exports.updateAdminUserStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'ID không hợp lệ' });
    }

    const { status, locked_reason } = req.body;

    if (!['active', 'locked'].includes(status)) {
      return res.status(422).json({ messageId: 'USER-E-001', message: 'Trạng thái không hợp lệ' });
    }

    if (status === 'locked') {
      if (!locked_reason || locked_reason.trim().length < 5 || locked_reason.trim().length > 255) {
        return res.status(422).json({ messageId: 'USER-E-001', message: 'Lý do khóa không hợp lệ' });
      }
      if (id === req.user.id) {
        return res.status(400).json({ messageId: 'USER-E-006', message: 'Không thể tự khóa chính mình' });
      }
    }

    const user = await db('users').where({ id }).whereNull('deleted_at').first();
    if (!user) {
      return res.status(404).json({ messageId: 'USER-E-003', message: 'Người dùng không tồn tại' });
    }

    const rows = await db('users')
      .where({ id })
      .update({
        status,
        locked_reason: status === 'locked' ? locked_reason.trim() : null,
        updated_at: db.fn.now(),
        updated_by: req.user.id
      })
      .returning(['id', 'status', 'locked_reason', 'updated_at']);

    res.json({
      messageId: 'USER-S-003',
      message: 'Cập nhật trạng thái tài khoản thành công',
      data: rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ messageId: 'COMMON-E-001', message: 'Lỗi hệ thống' });
  }
};
