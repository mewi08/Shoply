const router = require('express').Router();
const controller = require('./people.controller');
const { requireLevel } = require('../../shared/middlewares/auth');

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id/', controller.remove);

module.exports = router;