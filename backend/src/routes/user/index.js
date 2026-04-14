const router = require('express').Router();
const { userAuth } = require('../../middleware/userAuth');
const authRoutes = require('./auth');
const productRoutes = require('./products');
const cartRoutes = require('./cart');
const orderRoutes = require('./orders');
const accountRoutes = require('./account');
const cmsRoutes = require('./cms');

// Public routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cms', cmsRoutes);

// Protected routes (require user login)
router.use('/cart', userAuth, cartRoutes);
router.use('/orders', userAuth, orderRoutes);
router.use('/account', userAuth, accountRoutes);

module.exports = router;
