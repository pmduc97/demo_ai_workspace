const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middlewares/auth');
const c = require('../controllers/upload.controller');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

router.post('/', auth, upload.single('file'), c.upload);

module.exports = router;
