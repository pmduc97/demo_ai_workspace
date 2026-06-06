const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(422).json({ messageId: 'AUTH-E-001', message: 'Missing required fields' });
    const existing = await db('users').where({ email }).first();
    if (existing) return res.status(409).json({ messageId: 'AUTH-E-002', message: 'Email already exists' });
    const password_hash = await bcrypt.hash(password, 10);
    const rows = await db('users').insert({ email, password_hash, name, role: 'member' }).returning(['id', 'email', 'name', 'role', 'created_at']);
    return res.status(201).json({ user: rows[0] });
  } catch (err) {
    return res.status(500).json({ messageId: 'AUTH-E-003', message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(422).json({ messageId: 'AUTH-E-001', message: 'Email và mật khẩu là bắt buộc' });
    const user = await db('users').where({ email }).first();
    if (!user) return res.status(401).json({ messageId: 'AUTH-E-002', message: 'Email hoặc mật khẩu không đúng' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ messageId: 'AUTH-E-002', message: 'Email hoặc mật khẩu không đúng' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ messageId: 'AUTH-E-003', message: err.message || 'Đăng nhập thất bại' });
  }
};

exports.me = async (req, res) => {
  const user = await db('users').where({ id: req.user.id }).select('id', 'name', 'email', 'role', 'created_at').first();
  if (!user) return res.status(404).json({ messageId: 'AUTH-E-002', message: 'User not found' });
  return res.json(user);
};
