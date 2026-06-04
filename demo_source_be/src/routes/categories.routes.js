const router = require('express').Router();
const jwt = require('jsonwebtoken');
const c = require('../controllers/categories.controller');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

const optionalAuth = (req, res, next) => {
	const header = req.headers.authorization || '';
	const token = header.startsWith('Bearer ') ? header.slice(7) : null;
	if (!token) return next();
	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
	} catch (err) {
		req.user = null;
	}
	return next();
};

router.get('/', optionalAuth, c.list);
router.get('/:slug', c.getBySlug);
router.post('/', auth, role('admin'), c.create);
router.put('/:id', auth, role('admin'), c.update);
router.delete('/:id', auth, role('admin'), c.remove);

module.exports = router;
