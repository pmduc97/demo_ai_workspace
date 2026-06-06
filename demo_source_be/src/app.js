require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/posts', require('./routes/posts.routes'));
app.use('/api/categories', require('./routes/categories.routes'));
app.use('/api/tags', require('./routes/tags.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

app.use((err, req, res, next) => {
  if (err) return res.status(500).json({ message: err.message || 'Internal error' });
  return next();
});

module.exports = app;
