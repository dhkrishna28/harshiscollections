const { Order, OrderItem, Cart, CartItem, Product, ProductImage, Transaction } = require('../../models');
const { sequelize } = require('../../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { getSizeInventoryEntry, normalizeSizeInventory } = require('../../utils/sizeInventory');
const placeOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      payment_method,
      shipping_name, shipping_phone, shipping_address,
      shipping_city, shipping_state, shipping_postal, shipping_country,
      notes,
    } = req.body;

    const cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
      transaction: t,
    });

    if (!cart || !cart.items.length) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    const productIds = cart.items.map((item) => item.product_id);
    const lockedProducts = await Product.findAll({
      where: { id: { [Op.in]: productIds } },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    const productsById = new Map(lockedProducts.map((product) => [product.id, product]));

    // Validate stock and compute totals
    let subtotal = 0;
    const orderItems = [];
    for (const item of cart.items) {
      const product = productsById.get(item.product_id);
      if (!product || !product.is_active) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `"${item.product?.name || 'Product'}" is out of stock.`,
        });
      }

      const sizeEntry = getSizeInventoryEntry(product.size_inventory, item.selected_size);
      if (Array.isArray(product.size_inventory) && product.size_inventory.length > 0) {
        if (!item.selected_size) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            message: `Please select a size for "${item.product?.name || 'Product'}".`,
          });
        }
        if (!sizeEntry || sizeEntry.stock_quantity < item.quantity) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            message: `"${item.product?.name || 'Product'}" in size ${item.selected_size} is out of stock.`,
          });
        }
      } else if (product.stock_quantity < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `"${item.product?.name || 'Product'}" is out of stock.`,
        });
      }
      const unit_price = parseFloat(String(product.price)); // price is always the selling price
      const total_price = unit_price * item.quantity;
      subtotal += total_price;
      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        selected_size: item.selected_size || null,
        quantity: item.quantity,
        unit_price,
        total_price,
      });
    }

    const shipping_charge = 0; // implement shipping logic as needed
    const total = subtotal + shipping_charge;
    const order_number = `ORD-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    const order = await Order.create({
      user_id: req.user.id,
      order_number,
      status: 'pending',
      payment_method,
      subtotal,
      shipping_charge,
      total,
      notes,
      shipping_name, shipping_phone, shipping_address,
      shipping_city, shipping_state, shipping_postal,
      shipping_country: shipping_country || 'India',
    }, { transaction: t });

    for (const item of orderItems) {
      await OrderItem.create({ ...item, order_id: order.id }, { transaction: t });
      const product = productsById.get(item.product_id);
      if (Array.isArray(product.size_inventory) && product.size_inventory.length > 0 && item.selected_size) {
        const nextInventory = normalizeSizeInventory(product.size_inventory).map((entry) =>
          entry.size === item.selected_size
            ? {
                ...entry,
                stock_quantity: Math.max(0, entry.stock_quantity - item.quantity),
                availability_status: Math.max(0, entry.stock_quantity - item.quantity) > 0 ? 'in_stock' : 'out_of_stock',
              }
            : entry
        );
        const stock_quantity = nextInventory.reduce((sum, entry) => sum + entry.stock_quantity, 0);
        await product.update(
          {
            size_inventory: nextInventory,
            sizes: nextInventory.map((entry) => entry.size),
            stock_quantity,
            availability_status: stock_quantity > 0 ? 'in_stock' : 'out_of_stock',
          },
          { transaction: t }
        );
      } else {
        await product.update(
          { stock_quantity: product.stock_quantity - item.quantity },
          { transaction: t }
        );
      }
    }

    // Create transaction record
    await Transaction.create({
      order_id: order.id,
      gateway: payment_method,
      amount: total,
      status: payment_method === 'cod' ? 'pending' : 'pending',
    }, { transaction: t });

    // Clear cart
    await CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });

    await t.commit();
    res.status(201).json({ success: true, data: { order_id: order.id, order_number } });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

const myOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
      where: { user_id: req.user.id },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      attributes: ['id', 'order_number', 'status', 'payment_status', 'total', 'created_at'],
    });

    res.json({ success: true, total: count, page: parseInt(page), data: rows });
  } catch (err) {
    next(err);
  }
};

const getOrderDetail = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [
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

module.exports = { placeOrder, myOrders, getOrderDetail };
