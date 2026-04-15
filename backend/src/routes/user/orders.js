const router = require('express').Router();
const ctrl = require('../../controllers/user/orderController');
const { orderRules, validate } = require('../../utils/validators');

router.post('/', orderRules, validate, ctrl.placeOrder);
router.get('/', ctrl.myOrders);
router.get('/:id', ctrl.getOrderDetail);

module.exports = router;
