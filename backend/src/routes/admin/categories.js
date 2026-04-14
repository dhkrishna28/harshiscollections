const router = require('express').Router();
const ctrl = require('../../controllers/admin/categoryController');
const { uploadCms } = require('../../middleware/upload');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', uploadCms.single('image'), ctrl.create);
router.put('/:id', uploadCms.single('image'), ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
