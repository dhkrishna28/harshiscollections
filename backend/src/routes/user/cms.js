const router = require('express').Router();
const ctrl = require('../../controllers/user/cmsController');
const { contactRules, validate } = require('../../utils/validators');

router.get('/pages/:key', ctrl.getPage);
router.post('/contact', contactRules, validate, ctrl.submitContact);
router.get('/categories', ctrl.getCategories);

module.exports = router;
