const { CmsPage, Contact, Category } = require('../../models');

const getPage = async (req, res, next) => {
  try {
    const page = await CmsPage.findOne({ where: { page_key: req.params.key, is_active: true } });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found.' });
    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
};

const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, message: 'Your message has been sent. We will get back to you soon.' });
  } catch (err) {
    next(err);
  }
};

const getCategories = async (_req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: { is_active: true, parent_id: null },
      include: [{ model: Category, as: 'children', where: { is_active: true }, required: false }],
      order: [['sort_order', 'ASC']],
    });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPage, submitContact, getCategories };
