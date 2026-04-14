const { sequelize } = require('../../models');
const { Order, User, Product, Transaction } = require('../../models');
const { Op } = require('sequelize');

const overview = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      monthRevenue,
      lastMonthRevenue,
      recentOrders,
    ] = await Promise.all([
      User.count({ where: { is_active: true } }),
      Product.count({ where: { is_active: true } }),
      Order.count(),
      Order.count({ where: { status: 'pending' } }),
      Transaction.sum('amount', {
        where: { status: 'success', paid_at: { [Op.gte]: startOfMonth } },
      }),
      Transaction.sum('amount', {
        where: { status: 'success', paid_at: { [Op.between]: [startOfLastMonth, endOfLastMonth] } },
      }),
      Order.findAll({
        limit: 5,
        order: [['created_at', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }],
        attributes: ['id', 'order_number', 'status', 'total', 'created_at'],
      }),
    ]);

    res.json({
      success: true,
      data: {
        total_users: totalUsers,
        total_products: totalProducts,
        total_orders: totalOrders,
        pending_orders: pendingOrders,
        month_revenue: monthRevenue || 0,
        last_month_revenue: lastMonthRevenue || 0,
        recent_orders: recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { overview };
