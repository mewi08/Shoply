const router = require('express').Router();
const controller = require('./products.controller');
const { requireLevel } = require('../../shared/middlewares/auth');

router.get('/', requireLevel('superadmin', 'admin', 'user'), controller.list);
router.get('/:id', requireLevel('superadmin', 'admin', 'user'), controller.get);
router.post('/', requireLevel('admin'), controller.create);
router.put('/:id', requireLevel('superadmin', 'admin'), controller.update);
router.patch('/:id/estado', requireLevel('superadmin', 'admin'), controller.remove);

module.exports = router;