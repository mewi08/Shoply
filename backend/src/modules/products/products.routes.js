const router = require('express').Router();
const controller = require('./products.controller');
const { requireLevel } = require('../../shared/middlewares/auth');

router.get('/', requireLevel('admin', 'user'), controller.list);
router.get('/:id', requireLevel('admin', 'user'), controller.get);
router.post('/', requireLevel('admin'), controller.create);
router.put('/:id', requireLevel('admin'), controller.update);
router.patch('/:id/estado', requireLevel('admin'), controller.remove);

module.exports = router;