const router = require('express').Router();
const controller = require('./users.controller');
const { requireLevel } = require('../../shared/middlewares/auth');

router.get('/', requireLevel('admin'), controller.list);
router.get('/:id', requireLevel('admin'), controller.get);
router.post('/', requireLevel('admin'), controller.create);
router.put('/:id', requireLevel('admin'), controller.update);
router.patch('/:id', requireLevel('admin'), controller.toggleStatus);
router.patch('/me/password', requireLevel('admin', 'user'), controller.changePassword);

module.exports = router;