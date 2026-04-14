const router = require('express').Router();
const { adminAuth } = require('../../middleware/adminAuth');
const authRoutes = require('./auth');
const productRoutes = require('./products');
const categoryRoutes = require('./categories');
const orderRoutes = require('./orders');
const transactionRoutes = require('./transactions');
const dashboardRoutes = require('./dashboard');
const cmsRoutes = require('./cms');
const userRoutes = require('./users');

// Public
router.use('/auth', authRoutes);

// Protected
router.use(adminAuth);
router.use('/dashboard', dashboardRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/transactions', transactionRoutes);
router.use('/cms', cmsRoutes);
router.use('/users', userRoutes);

module.exports = router;
