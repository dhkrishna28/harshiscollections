const { Transaction, Order, OrderItem, User, Product, ProductImage } = require('../../models');
const { Op } = require('sequelize');

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, gateway } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (status) where.status = status;
    if (gateway) where.gateway = gateway;

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['order_number', 'total'],
          include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name', 'email'] }],
        },
      ],
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
    const txn = await Transaction.findByPk(req.params.id, {
      include: [
        {
          model: Order,
          as: 'order',
          include: [
            { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'phone'] },
            {
              model: OrderItem,
              as: 'items',
              include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'sku'],
                include: [{ model: ProductImage, as: 'images', attributes: ['id', 'image_path', 'sort_order'] }],
              }],
            },
          ],
        },
      ],
    });
    if (!txn) return res.status(404).json({ success: false, message: 'Transaction not found.' });
    res.json({ success: true, data: txn });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById };
