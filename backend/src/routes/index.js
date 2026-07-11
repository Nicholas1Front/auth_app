const {Router} = require('express');

const router = Router();
const authRoutes = require('./auth_routes');
const usersRoutes = require('./users_routes');
const notesRoutes = require('./notes_routes');

router.use('/users', usersRoutes);
router.use('/auth', authRoutes);
router.use('/notes', notesRoutes)

module.exports = router;

