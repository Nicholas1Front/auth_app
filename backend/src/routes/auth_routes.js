const {Router} = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const authController = require('../modules/auth/auth_controller');

const router = Router();

router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);

module.exports = router;