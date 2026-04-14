const { Order, OrderItem, User, Product, Transaction } = require('../../models');
const { Op } = require('sequelize');

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
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'featured_image'] }] },
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
    const updates = {};
    if (status) updates.status = status;
    if (payment_status) updates.payment_status = payment_status;
    await order.update(updates);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, updateStatus };
