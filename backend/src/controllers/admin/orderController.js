const { Order, OrderItem, User, Product, ProductImage, Transaction } = require('../../models');
const { Op } = require('sequelize');
const {
  canTransitionOrderStatus,
  canTransitionPaymentStatus,
} = require('../../utils/orderStatus');

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, payment_status, search } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (status) where.status = status;
    if (payment_status) where.payment_status = payment_status;
    if (search) where.order_number = { [Op.like]: `%${search}%` };

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    res.json({ success: true, total: count, page: parseInt(page), data: rows });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'phone'] },
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name'],
            include: [{ model: ProductImage, as: 'images', attributes: ['id', 'image_path', 'sort_order'] }],
          }],
        },
        { model: Transaction, as: 'transaction' },
      ],
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    const { status, payment_status } = req.body;
    if (!status && !payment_status) {
      return res.status(400).json({ success: false, message: 'No status changes provided.' });
    }
    const updates = {};
    if (status) {
      if (!canTransitionOrderStatus(order.status, status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid order status transition from ${order.status} to ${status}.`,
        });
      }
      updates.status = status;
    }
    if (payment_status) {
      if (!canTransitionPaymentStatus(order.payment_status, payment_status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment status transition from ${order.payment_status} to ${payment_status}.`,
        });
      }
      updates.payment_status = payment_status;
    }
    await order.update(updates);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, updateStatus };
