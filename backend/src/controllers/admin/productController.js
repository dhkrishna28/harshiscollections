const { Op } = require('sequelize');
const { Product, Category, ProductImage } = require('../../models');
const slugify = require('slugify');
const path = require('path');

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '', category_id, is_active } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (category_id) where.category_id = category_id;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: ProductImage, as: 'images', attributes: ['id', 'image_path', 'sort_order'] },
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
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: ProductImage, as: 'images' },
      ],
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    // DEBUG: log incoming file fields for troubleshooting uploads
    try {
      console.log('[DEBUG] create req.files keys:', Object.keys(req.files || {}));
      console.log('[DEBUG] create featured_image count:', (req.files && req.files.featured_image) ? req.files.featured_image.length : 0);
      console.log('[DEBUG] create images count:', (req.files && req.files.images) ? req.files.images.length : 0);
      console.log('[DEBUG] create req.body keys:', Object.keys(req.body || {}));
    } catch (e) {
      console.log('[DEBUG] create req.files parse error', e && e.message);
    }
    const data = req.body;
    // Respect user-provided slug; auto-generate only when blank
    data.slug = data.slug || slugify(data.name, { lower: true, strict: true });

    // NOTE: We no longer persist a single featured_image on the products table.
    // Instead, all uploaded files (featured_image + images) will be stored in product_images
    // and the UI will treat the first product_images entry as the featured image.

    // Normalize incoming typed fields
    try {
      if (typeof data.sizes === 'string' && data.sizes.length > 0) {
        try { data.sizes = JSON.parse(data.sizes); } catch (e) { /* leave as-is */ }
      }
      if (data.category_id) data.category_id = Number(data.category_id);
      if (data.price) data.price = Number(data.price);
      if (data.compare_at_price) data.compare_at_price = Number(data.compare_at_price);
      if (data.stock_quantity) data.stock_quantity = Number(data.stock_quantity);
    } catch (e) {
      console.log('[DEBUG] create normalize error', e && e.message);
    }

    let product;
    try {
      product = await Product.create(data);
    } catch (err) {
      console.log('[ERROR] Product.create failed:', err && err.message);
      if (err.errors && Array.isArray(err.errors)) {
        console.log('[ERROR] validation details:', err.errors.map((e) => ({ path: e.path, message: e.message, value: e.value })));
      }
      return res.status(400).json({ success: false, message: 'Validation error', details: err.errors });
    }

    // Persist any uploaded files (featured_image + images) into product_images.
    if (req.files) {
      const filesArr = [];
      if (Array.isArray(req.files.featured_image) && req.files.featured_image.length > 0) {
        filesArr.push(...req.files.featured_image);
      }
      if (Array.isArray(req.files.images) && req.files.images.length > 0) {
        filesArr.push(...req.files.images);
      }
      if (filesArr.length > 0) {
        const startOrder = 0;
        const images = filesArr.map((f, i) => ({
          product_id: product.id,
          image_path: `/uploads/products/${f.filename}`,
          sort_order: startOrder + i,
        }));
        await ProductImage.bulkCreate(images);
        await product.reload({ include: [{ model: ProductImage, as: 'images' }] });
      }
    }

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    // DEBUG: log incoming file fields for troubleshooting uploads
    try {
      console.log('[DEBUG] update req.files keys:', Object.keys(req.files || {}));
      console.log('[DEBUG] update featured_image count:', (req.files && req.files.featured_image) ? req.files.featured_image.length : 0);
      console.log('[DEBUG] update images count:', (req.files && req.files.images) ? req.files.images.length : 0);
      console.log('[DEBUG] update req.body keys:', Object.keys(req.body || {}));
    } catch (e) {
      console.log('[DEBUG] update req.files parse error', e && e.message);
    }

    const data = req.body;
    // Only re-generate slug when name changes but no custom slug was provided
    if (data.name && !data.slug) data.slug = slugify(data.name, { lower: true, strict: true });

    // NOTE: Do NOT persist featured_image on products table. All uploaded files will be
    // persisted to product_images below; the UI will pick the first as featured.

    // Normalize incoming typed fields for update
    try {
      if (typeof data.sizes === 'string' && data.sizes.length > 0) {
        try { data.sizes = JSON.parse(data.sizes); } catch (e) { /* ignore */ }
      }
      if (data.category_id) data.category_id = Number(data.category_id);
      if (data.price) data.price = Number(data.price);
      if (data.compare_at_price) data.compare_at_price = Number(data.compare_at_price);
      if (data.stock_quantity) data.stock_quantity = Number(data.stock_quantity);
    } catch (e) {
      console.log('[DEBUG] update normalize error', e && e.message);
    }

    try {
      await product.update(data);
    } catch (err) {
      console.log('[ERROR] Product.update failed:', err && err.message);
      if (err.errors && Array.isArray(err.errors)) {
        console.log('[ERROR] validation details:', err.errors.map((e) => ({ path: e.path, message: e.message, value: e.value })));
      }
      return res.status(400).json({ success: false, message: 'Validation error', details: err.errors });
    }

    // Persist any newly uploaded files (featured_image + images) into product_images and append
    if (req.files) {
      const filesArr = [];
      if (Array.isArray(req.files.featured_image) && req.files.featured_image.length > 0) {
        filesArr.push(...req.files.featured_image);
      }
      if (Array.isArray(req.files.images) && req.files.images.length > 0) {
        filesArr.push(...req.files.images);
      }
      if (filesArr.length > 0) {
        const maxOrder = await ProductImage.max('sort_order', { where: { product_id: product.id } });
        const startOrder = (typeof maxOrder === 'number' && !Number.isNaN(maxOrder)) ? maxOrder + 1 : 0;
        const images = filesArr.map((f, i) => ({
          product_id: product.id,
          image_path: `/uploads/products/${f.filename}`,
          sort_order: startOrder + i,
        }));
        await ProductImage.bulkCreate(images);
        await product.reload({ include: [{ model: ProductImage, as: 'images' }] });
      }
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    await product.destroy();
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
};

const addImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded.' });
    }
    // append images after existing ones, preserving sort order
    const maxOrder = await ProductImage.max('sort_order', { where: { product_id: req.params.id } });
    const startOrder = (typeof maxOrder === 'number' && !Number.isNaN(maxOrder)) ? maxOrder + 1 : 0;
    const images = req.files.map((f, i) => ({
      product_id: req.params.id,
      image_path: `/uploads/products/${f.filename}`,
      sort_order: startOrder + i,
    }));
    const created = await ProductImage.bulkCreate(images);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const image = await ProductImage.findByPk(req.params.imageId);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found.' });
    await image.destroy();
    res.json({ success: true, message: 'Image deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove, addImages, deleteImage };
