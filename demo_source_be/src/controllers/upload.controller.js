exports.upload = (req, res) => {
  if (!req.file) return res.status(422).json({ messageId: 'COMMON-E-001', message: 'No file uploaded' });
  return res.status(201).json({ url: `/uploads/${req.file.filename}` });
};
