const router = require('express').Router();
const ctrl = require('../../controllers/user/accountController');
const { changePasswordRules, profileRules, validate } = require('../../utils/validators');

router.get('/profile', ctrl.getProfile);
router.put('/profile', profileRules, validate, ctrl.updateProfile);
router.put('/change-password', changePasswordRules, validate, ctrl.changePassword);

module.exports = router;
