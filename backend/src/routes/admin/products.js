const router = require('express').Router();
const ctrl = require('../../controllers/admin/productController');
const { uploadProduct } = require('../../middleware/upload');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
// Accept both a single 'featured_image' and multiple 'images' in the same request
router.post('/', uploadProduct.fields([{ name: 'featured_image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), ctrl.create);
router.put('/:id', uploadProduct.fields([{ name: 'featured_image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), ctrl.update);
router.delete('/:id', ctrl.remove);

// Product gallery images
router.post('/:id/images', uploadProduct.array('images', 10), ctrl.addImages);
router.delete('/:id/images/:imageId', ctrl.deleteImage);

module.exports = router;
