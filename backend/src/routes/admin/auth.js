const router = require('express').Router();
const { login, me, changePassword } = require('../../controllers/admin/authController');
const { adminAuth } = require('../../middleware/adminAuth');
const { changePasswordRules, loginRules, validate } = require('../../utils/validators');

router.post('/login', loginRules, validate, login);
router.get('/me', adminAuth, me);
router.put('/change-password', adminAuth, changePasswordRules, validate, changePassword);

module.exports = router;
