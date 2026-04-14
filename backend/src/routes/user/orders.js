const router = require('express').Router();
const ctrl = require('../../controllers/user/orderController');

router.post('/', ctrl.placeOrder);
router.get('/', ctrl.myOrders);
router.get('/:id', ctrl.getOrderDetail);

module.exports = router;
