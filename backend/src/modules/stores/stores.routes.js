const router = require('express').Router();
const controller = require('./stores.controller');
const { requireLevel } = require('../../shared/middlewares/auth');

router.get('/', requireLevel('superadmin'), controller.list);
router.get('/mi-tienda', requireLevel('admin', 'user'), controller.getMyStore);
router.get('/:id', requireLevel('superadmin'), controller.get);
router.put('/mi-tienda', requireLevel('admin'), controller.updateMyStore);
router.put('/:id', requireLevel('superadmin'), controller.update);
router.patch('/:id/aprobar', requireLevel('superadmin'), controller.approve);
router.patch('/:id/rechazar', requireLevel('superadmin'), controller.reject);
router.patch('/:id/desactivar', requireLevel('superadmin'), controller.deactivate);
router.patch('/:id/reactivar', requireLevel('superadmin'), controller.reactivate);

module.exports = router;