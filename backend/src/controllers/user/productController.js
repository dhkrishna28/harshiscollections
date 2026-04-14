const { Product, Category, ProductImage } = require('../../models');
const { Op } = require('sequelize');

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, search, category_id, min_price, max_price, featured, sort = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;
    const where = { is_active: true };

    if (search) where.name = { [Op.like]: `%${search}%` };
    if (category_id) where.category_id = category_id;
    if (featured === 'true') where.is_featured = true;
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = min_price;
      if (max_price) where.price[Op.lte] = max_price;
    }

    const allowedSorts = ['price', 'name', 'created_at'];
    const sortField = allowedSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: ProductImage, as: 'images', attributes: ['id', 'image_path', 'sort_order'], limit: 1 },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortField, sortOrder]],
    });

    res.json({ success: true, total: count, page: parseInt(page), data: rows });
  } catch (err) {
    next(err);
  }
};

const getBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug, is_active: true },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: ProductImage, as: 'images', attributes: ['id', 'image_path', 'alt_text', 'sort_order'] },
      ],
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getBySlug };
