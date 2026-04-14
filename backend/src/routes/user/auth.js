const router = require('express').Router();
const ctrl = require('../../controllers/user/authController');

router.post('/register', ctrl.register);
router.get('/verify-email/:token', ctrl.verifyEmail);
router.post('/login', ctrl.login);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);

module.exports = router;
