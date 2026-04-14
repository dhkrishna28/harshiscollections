const { Cart, CartItem, Product, ProductImage } = require('../../models');

async function getOrCreateCart(userId) {
  const [cart] = await Cart.findOrCreate({ where: { user_id: userId } });
  return cart;
}

const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'slug', 'price', 'compare_at_price', 'availability_status', 'stock_quantity', 'featured_image'],
            },
          ],
        },
      ],
    });
    res.json({ success: true, data: cart || { items: [] } });
  } catch (err) {
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product || !product.is_active) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock.' });
    }

    const cart = await getOrCreateCart(req.user.id);

    const [item, created] = await CartItem.findOrCreate({
      where: { cart_id: cart.id, product_id },
      defaults: { quantity },
    });
    if (!created) await item.update({ quantity: item.quantity + parseInt(quantity) });

    res.json({ success: true, message: 'Item added to cart.' });
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ success: false, message: 'Quantity must be at least 1.' });

    const cart = await getOrCreateCart(req.user.id);
    const item = await CartItem.findOne({ where: { id: req.params.itemId, cart_id: cart.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found.' });

    await item.update({ quantity });
    res.json({ success: true, message: 'Cart updated.' });
  } catch (err) {
    next(err);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const item = await CartItem.findOne({ where: { id: req.params.itemId, cart_id: cart.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found.' });
    await item.destroy();
    res.json({ success: true, message: 'Item removed from cart.' });
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (cart) await CartItem.destroy({ where: { cart_id: cart.id } });
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
