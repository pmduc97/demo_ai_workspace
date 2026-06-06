const router = require('express').Router();
const tags = require('../controllers/tags.controller');

router.get('/', tags.getTags);

module.exports = router;
