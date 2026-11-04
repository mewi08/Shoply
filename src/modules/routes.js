const router = require('express').Router();
const { verifyToken, requireLevel } = require('../shared/middlewares/auth');

router.use('/marcas', require('./catalogs/brands/brands.routes'));
router.use('/categorias', require('./catalogs/categories/categories.routes'));


module.exports = router;