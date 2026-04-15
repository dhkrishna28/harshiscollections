const { CmsPage, Contact } = require('../../models');

const CMS_PAGE_FIELDS = ['title', 'content', 'meta_title', 'meta_description', 'is_active'];
const CONTACT_UPDATE_FIELDS = ['status', 'admin_notes'];

function pickFields(source, allowedFields) {
  const picked = {};
  for (const field of allowedFields) {
    if (source[field] !== undefined) picked[field] = source[field];
  }
  return picked;
}

// ─── CMS Pages ────────────────────────────────────────────────────────────────

const listPages = async (_req, res, next) => {
  try {
    const pages = await CmsPage.findAll();
    res.json({ success: true, data: pages });
  } catch (err) {
    next(err);
  }
};

const getPage = async (req, res, next) => {
  try {
    const page = await CmsPage.findOne({ where: { page_key: req.params.key } });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found.' });
    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
};

const upsertPage = async (req, res, next) => {
  try {
    const { page_key } = req.params;
    const pageData = pickFields(req.body, CMS_PAGE_FIELDS);
    const [page, created] = await CmsPage.findOrCreate({
      where: { page_key },
      defaults: { page_key, ...pageData },
    });
    if (!created) await page.update(pageData);
    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
};

// ─── Contact Enquiries ────────────────────────────────────────────────────────

const listContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (status) where.status = status;

    const { count, rows } = await Contact.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    res.json({ success: true, total: count, page: parseInt(page), data: rows });
  } catch (err) {
    next(err);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found.' });
    await contact.update(pickFields(req.body, CONTACT_UPDATE_FIELDS));
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

module.exports = { listPages, getPage, upsertPage, listContacts, updateContact };
