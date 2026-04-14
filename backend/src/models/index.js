const sequelize = require('../config/database');
const AdminUser = require('./AdminUser');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Transaction = require('./Transaction');
const CmsPage = require('./CmsPage');
const Contact = require('./Contact');

// ─── Associations ─────────────────────────────────────────────────────────────

// Category ↔ Product
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Product ↔ ProductImage
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

// User ↔ Cart
User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// Cart ↔ CartItem ↔ Product
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(CartItem, { foreignKey: 'product_id' });

// User ↔ Order
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Order ↔ OrderItem ↔ Product
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Order ↔ Transaction (1-to-1)
Order.hasOne(Transaction, { foreignKey: 'order_id', as: 'transaction' });
Transaction.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = {
  sequelize,
  AdminUser,
  User,
  Category,
  Product,
  ProductImage,
  Order,
  OrderItem,
  Cart,
  CartItem,
  Transaction,
  CmsPage,
  Contact,
};
