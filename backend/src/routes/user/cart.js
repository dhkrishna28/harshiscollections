const router = require('express').Router();
const ctrl = require('../../controllers/user/cartController');

router.get('/', ctrl.getCart);
router.post('/items', ctrl.addItem);
router.put('/items/:itemId', ctrl.updateItem);
router.delete('/items/:itemId', ctrl.removeItem);
router.delete('/', ctrl.clearCart);

module.exports = router;
