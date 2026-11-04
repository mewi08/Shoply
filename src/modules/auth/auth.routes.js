const router = require('express').Router();
const controller = require('./auth.controller');
const { verifyToken } = require('../../shared/middlewares/auth');
const { loginLimiter } = require('../../shared/middlewares/rate-limit');

router.post('/login', loginLimiter, controller.login);
router.post('/logout', controller.logout);
router.get('/me', verifyToken, controller.me);

module.exports = router;