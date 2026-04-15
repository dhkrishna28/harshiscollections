const router = require('express').Router();
const ctrl = require('../../controllers/admin/orderController');
const { adminOrderStatusRules, validate } = require('../../utils/validators');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.patch('/:id/status', adminOrderStatusRules, validate, ctrl.updateStatus);

module.exports = router;
