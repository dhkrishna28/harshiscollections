const router = require('express').Router();
const { login, me, changePassword } = require('../../controllers/admin/authController');
const { adminAuth } = require('../../middleware/adminAuth');

router.post('/login', login);
router.get('/me', adminAuth, me);
router.put('/change-password', adminAuth, changePassword);

module.exports = router;
