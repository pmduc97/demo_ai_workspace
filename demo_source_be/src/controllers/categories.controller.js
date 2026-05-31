const db = require('../db');

exports.list = async (req, res) => res.json({ items: await db('categories').orderBy('id', 'asc') });
exports.getBySlug = async (req, res) => { const item = await db('categories').where({ slug: req.params.slug }).first(); if (!item) return res.status(404).json({ message: 'Category not found' }); return res.json(item); };
exports.create = async (req, res) => { const { name, slug, description } = req.body; if (!name || !slug) return res.status(400).json({ message: 'Missing name or slug' }); const rows = await db('categories').insert({ name, slug, description }).returning('*'); res.status(201).json(rows[0]); };
exports.update = async (req, res) => { const rows = await db('categories').where({ id: req.params.id }).update(req.body).returning('*'); if (!rows[0]) return res.status(404).json({ message: 'Category not found' }); return res.json(rows[0]); };
exports.remove = async (req, res) => { await db('categories').where({ id: req.params.id }).del(); res.json({ message: 'Deleted' }); };
