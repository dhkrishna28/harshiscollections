const bcrypt = require('bcryptjs');
const { User } = require('../../models');
const { Op } = require('sequelize');

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', is_active } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (search) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password', 'verification_token', 'reset_token', 'reset_token_expiry'] },
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
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'verification_token', 'reset_token', 'reset_token_expiry'] },
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const toggleStatus = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    await user.update({ is_active: !user.is_active });
    res.json({ success: true, is_active: user.is_active });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, toggleStatus };
