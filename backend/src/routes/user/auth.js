const router = require('express').Router();
const ctrl = require('../../controllers/user/authController');
const {
  validate,
  loginRules,
  registerRules,
  emailRules,
  resetPasswordRules,
} = require('../../utils/validators');

router.post('/register', registerRules, validate, ctrl.register);
router.get('/verify-email/:token', ctrl.verifyEmail);
router.post('/login', loginRules, validate, ctrl.login);
router.post('/forgot-password', emailRules, validate, ctrl.forgotPassword);
router.post('/reset-password', resetPasswordRules, validate, ctrl.resetPassword);

module.exports = router;
