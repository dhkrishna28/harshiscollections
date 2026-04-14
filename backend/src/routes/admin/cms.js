const router = require('express').Router();
const ctrl = require('../../controllers/admin/cmsController');

// CMS Pages
router.get('/pages', ctrl.listPages);
router.get('/pages/:key', ctrl.getPage);
router.put('/pages/:key', ctrl.upsertPage);

// Contact Enquiries
router.get('/contacts', ctrl.listContacts);
router.patch('/contacts/:id', ctrl.updateContact);

module.exports = router;
