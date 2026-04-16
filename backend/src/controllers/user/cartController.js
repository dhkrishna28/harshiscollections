const { Cart, CartItem, Product, ProductImage } = require('../../models');
const { getSizeInventoryEntry } = require('../../utils/sizeInventory');

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
              attributes: ['id', 'name', 'slug', 'price', 'compare_at_price', 'availability_status', 'stock_quantity', 'sizes', 'size_inventory'],
              include: [{ model: ProductImage, as: 'images', attributes: ['id', 'image_path', 'sort_order'] }],
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
    const { product_id, quantity = 1, selected_size } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product || !product.is_active) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const sizeEntry = getSizeInventoryEntry(product.size_inventory, selected_size);
    if (Array.isArray(product.size_inventory) && product.size_inventory.length > 0) {
      if (!selected_size) {
        return res.status(400).json({ success: false, message: 'Please select a size.' });
      }
      if (!sizeEntry || sizeEntry.stock_quantity < quantity) {
        return res.status(400).json({ success: false, message: 'Selected size is out of stock.' });
      }
    } else if (product.stock_quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock.' });
    }

    const cart = await getOrCreateCart(req.user.id);

    const [item, created] = await CartItem.findOrCreate({
      where: { cart_id: cart.id, product_id, selected_size: selected_size || null },
      defaults: { quantity, selected_size: selected_size || null },
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
    const item = await CartItem.findOne({
      where: { id: req.params.itemId, cart_id: cart.id },
      include: [{ model: Product, as: 'product' }],
    });
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found.' });

    const product = item.product;
    const sizeEntry = getSizeInventoryEntry(product?.size_inventory, item.selected_size);
    if (Array.isArray(product?.size_inventory) && product.size_inventory.length > 0) {
      if (!item.selected_size) {
        return res.status(400).json({ success: false, message: 'Please select a size for this item.' });
      }
      if (!sizeEntry || sizeEntry.stock_quantity < quantity) {
        return res.status(400).json({ success: false, message: 'Selected size does not have enough stock.' });
      }
    } else if (product && product.stock_quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock.' });
    }

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
