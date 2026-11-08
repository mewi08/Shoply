const router = require('express').Router();
const controller = require('./stores.controller');
const { requireLevel } = require('../../shared/middlewares/auth');

router.get('/', requireLevel('superadmin'), controller.list);
router.get('/mi-tienda', requireLevel('admin', 'user'), controller.get);
router.post('/', requireLevel('superadmin'), controller.create);
router.put('/mi-tienda', requireLevel('admin'), controller.update);
router.put('/:id', requireLevel('superadmin'), controller.update);
router.patch('/:id/estado', requireLevel('superadmin'), controller.remove);

module.exports = router;