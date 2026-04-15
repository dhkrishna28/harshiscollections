const router = require('express').Router();
const ctrl = require('../../controllers/admin/cmsController');
const { cmsPageRules, contactUpdateRules, validate } = require('../../utils/validators');

// CMS Pages
router.get('/pages', ctrl.listPages);
router.get('/pages/:key', ctrl.getPage);
router.put('/pages/:key', cmsPageRules, validate, ctrl.upsertPage);

// Contact Enquiries
router.get('/contacts', ctrl.listContacts);
router.patch('/contacts/:id', contactUpdateRules, validate, ctrl.updateContact);

module.exports = router;
