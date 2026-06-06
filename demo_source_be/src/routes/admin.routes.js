const router = require('express').Router();
const posts = require('../controllers/posts.controller');
const users = require('../controllers/users.controller');
const tags = require('../controllers/tags.controller');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

router.use(auth);
router.get('/stats', posts.adminStats);
router.get('/posts', role('admin'), posts.listAdmin);
router.get('/posts/:id', role('admin'), posts.getAdminById);
router.put('/posts/:id/status', role('admin'), posts.updateStatus);
router.delete('/posts/:id', role('admin'), posts.remove);
router.get('/users', role('admin'), users.list);
router.post('/users', role('admin'), users.createAdminUser);
router.put('/users/:id/role', role('admin'), users.updateRole);
router.get('/users/:id', role('admin'), users.getAdminUserDetail);
router.put('/users/:id', role('admin'), users.updateAdminUserProfile);
router.put('/users/:id/status', role('admin'), users.updateAdminUserStatus);
router.delete('/users/:id', role('admin'), users.deleteAdminUser);
router.get('/tags', role('admin'), tags.getAdminTags);
router.post('/tags', role('admin'), tags.createTag);
router.put('/tags/:id', role('admin'), tags.updateTag);
router.delete('/tags/:id', role('admin'), tags.deleteTag);

module.exports = router;
