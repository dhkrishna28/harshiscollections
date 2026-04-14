const { Category } = require('../../models');
const slugify = require('slugify');

const list = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Category, as: 'children', attributes: ['id', 'name', 'slug'] }],
      where: { parent_id: null },
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
    });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.params.id, {
      include: [{ model: Category, as: 'children' }],
    });
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: cat });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const data = req.body;
    data.slug = slugify(data.name, { lower: true, strict: true });
    if (req.file) data.image = `/uploads/cms/${req.file.filename}`;
    const cat = await Category.create(data);
    res.status(201).json({ success: true, data: cat });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found.' });
    const data = req.body;
    if (data.name) data.slug = slugify(data.name, { lower: true, strict: true });
    if (req.file) data.image = `/uploads/cms/${req.file.filename}`;
    await cat.update(data);
    res.json({ success: true, data: cat });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const cat = await Category.findByPk(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found.' });
    await cat.destroy();
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove };
