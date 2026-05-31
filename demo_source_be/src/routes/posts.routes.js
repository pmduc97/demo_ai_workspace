const router = require('express').Router();
const c = require('../controllers/posts.controller');
const auth = require('../middlewares/auth');

router.get('/', c.listPublic);
router.get('/my', auth, c.listMy);
router.get('/:slug', c.getBySlug);
router.post('/', auth, c.create);
router.put('/:id', auth, c.update);
router.delete('/:id', auth, c.remove);

module.exports = router;
