const router = require('express').Router();
const ctrl = require('../../controllers/admin/productController');
const { uploadProduct } = require('../../middleware/upload');
const { productCreateRules, productUpdateRules, validate } = require('../../utils/validators');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', uploadProduct.array('images', 10), productCreateRules, validate, ctrl.create);
router.put('/:id', uploadProduct.array('images', 10), productUpdateRules, validate, ctrl.update);
router.delete('/:id', ctrl.remove);

// Product gallery images
router.post('/:id/images', uploadProduct.array('images', 10), ctrl.addImages);
router.delete('/:id/images/:imageId', ctrl.deleteImage);

module.exports = router;
