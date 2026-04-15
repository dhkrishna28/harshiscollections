const router = require('express').Router();
const ctrl = require('../../controllers/admin/categoryController');
const { uploadCms } = require('../../middleware/upload');
const { categoryCreateRules, categoryUpdateRules, validate } = require('../../utils/validators');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', uploadCms.single('image'), categoryCreateRules, validate, ctrl.create);
router.put('/:id', uploadCms.single('image'), categoryUpdateRules, validate, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
