const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing required fields' });
    const existing = await db('users').where({ email }).first();
    if (existing) return res.status(409).json({ message: 'Email already exists' });
    const password_hash = await bcrypt.hash(password, 10);
    const rows = await db('users').insert({ email, password_hash, name, role: 'member' }).returning(['id', 'email', 'name', 'role', 'created_at']);
    return res.status(201).json({ user: rows[0] });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });
    const user = await db('users').where({ email }).first();
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name, created_at: user.created_at } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.me = async (req, res) => {
  const user = await db('users').where({ id: req.user.id }).select('id', 'name', 'email', 'role', 'created_at').first();
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
};
