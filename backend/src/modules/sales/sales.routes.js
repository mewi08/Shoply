const router = require('express').Router();
const controller = require('./sales.controller');

router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:id', controller.get);
router.patch('/:id/anular', controller.cancel);

module.exports = router;