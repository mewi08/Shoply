const router = require('express').Router();
const { verifyToken, requireLevel } = require('../shared/middlewares/auth');

router.use('/auth', require('./auth/auth.routes'));
router.use('/marcas', verifyToken, requireLevel('superadmin', 'admin', 'user'), require('./catalogs/brands/brands.routes'));
router.use('/categorias', verifyToken, requireLevel('superadmin', 'admin', 'user'), require('./catalogs/categories/categories.routes'));
router.use('/unidades-medida', verifyToken, requireLevel('superadmin', 'admin', 'user'), require('./catalogs/units/units.routes'));
router.use('/tiendas', verifyToken, require('./stores/stores.routes'));
router.use('/productos', verifyToken, require('./products/products.routes'));
router.use('/lotes', verifyToken, requireLevel('admin', 'user'), require('./batches/batches.routes'));
router.use('/usuarios', verifyToken, require('./users/users.routes'));
router.use('/clientes', verifyToken, require('./clients/clients.routes'));
router.use('/ventas', verifyToken, requireLevel('admin', 'user'), require('./sales/sales.routes'));

module.exports = router;