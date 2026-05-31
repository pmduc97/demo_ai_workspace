const router = require('express').Router();
const c = require('../controllers/categories.controller');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

router.get('/', c.list);
router.get('/:slug', c.getBySlug);
router.post('/', auth, role('admin'), c.create);
router.put('/:id', auth, role('admin'), c.update);
router.delete('/:id', auth, role('admin'), c.remove);

module.exports = router;
