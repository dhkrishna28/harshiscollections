const router = require('express').Router();
const ctrl = require('../../controllers/admin/orderController');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.patch('/:id/status', ctrl.updateStatus);

module.exports = router;
