const {Router} = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const usersController = require('../modules/users/users_controller');

const router = Router()

router.post('/register', usersController.register);
router.put('/update/:id', authMiddleware, usersController.update);
router.delete('/delete/:id', authMiddleware, usersController.delete);

module.exports = router