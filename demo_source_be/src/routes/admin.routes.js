const router = require('express').Router();
const posts = require('../controllers/posts.controller');
const users = require('../controllers/users.controller');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

router.use(auth);
router.get('/stats', posts.adminStats);
router.get('/posts', role('admin'), posts.listAdmin);
router.get('/posts/:id', role('admin'), posts.getAdminById);
router.put('/posts/:id/status', role('admin'), posts.updateStatus);
router.delete('/posts/:id', role('admin'), posts.remove);
router.get('/users', role('admin'), users.list);
router.put('/users/:id/role', role('admin'), users.updateRole);

module.exports = router;
