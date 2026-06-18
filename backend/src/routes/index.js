const {Router} = require('express');

const router = Router();
const authRoutes = require('./auth_routes');
const usersRoutes = require('./users_routes');

router.use('/users', usersRoutes);
router.use('/auth', authRoutes);

module.exports = router;

