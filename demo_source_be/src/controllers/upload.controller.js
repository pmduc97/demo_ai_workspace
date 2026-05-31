exports.upload = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  return res.status(201).json({ url: `/uploads/${req.file.filename}` });
};
