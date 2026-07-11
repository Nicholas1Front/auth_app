const {Router} = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const notesController = require('../modules/notes/notes_controller');

const router = Router();

router.use(authMiddleware);

router.post(
    '/create', notesController.create
)

router.put(
    '/update/:id', notesController.update
)

router.get(
    '/find', notesController.findUserNotes
)

router.delete(
    "/deactivate/:id", notesController.deactivate
)

router.patch(
    "/activate/:id",notesController.activate
)

module.exports = router