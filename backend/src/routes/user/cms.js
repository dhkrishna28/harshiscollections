const router = require('express').Router();
const ctrl = require('../../controllers/user/cmsController');

router.get('/pages/:key', ctrl.getPage);
router.post('/contact', ctrl.submitContact);
router.get('/categories', ctrl.getCategories);

module.exports = router;
