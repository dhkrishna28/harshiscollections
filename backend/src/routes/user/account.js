const router = require('express').Router();
const ctrl = require('../../controllers/user/accountController');

router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);
router.put('/change-password', ctrl.changePassword);

module.exports = router;
