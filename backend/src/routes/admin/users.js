const router = require('express').Router();
const ctrl = require('../../controllers/admin/userController');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.patch('/:id/toggle-status', ctrl.toggleStatus);

module.exports = router;
