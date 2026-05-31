const db = require('../db');

exports.list = async (req, res) => {
  const items = await db('users').select('id', 'email', 'name', 'role', 'created_at').orderBy('id', 'asc');
  res.json({ items });
};

exports.updateRole = async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'member'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  const rows = await db('users').where({ id: req.params.id }).update({ role }).returning(['id', 'email', 'name', 'role']);
  if (!rows[0]) return res.status(404).json({ message: 'User not found' });
  res.json(rows[0]);
};
