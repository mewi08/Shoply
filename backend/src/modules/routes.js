const router = require('express').Router();
const { verifyToken, requireLevel } = require('../shared/middlewares/auth');

router.use('/auth', require('./auth/auth.routes'));
router.use('/marcas', require('./catalogs/brands/brands.routes'));
router.use('/categorias', require('./catalogs/categories/categories.routes'));
router.use('/unidades-medida', require('./catalogs/units/units.routes'));
router.use('/tiendas', verifyToken, require('./stores/stores.routes'));
router.use('/productos', verifyToken, require('./products/products.routes'));
router.use('/personas', verifyToken, require('./people/people.routes'));
router.use('/lotes', verifyToken, requireLevel('superadmin','admin', 'user'), require('./batches/batches.routes'));
router.use('/usuarios', verifyToken, requireLevel('superadmin', 'admin'), require('./users/users.routes'));

module.exports = router;