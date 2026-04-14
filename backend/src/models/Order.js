const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  order_number: { type: DataTypes.STRING(40), allowNull: false, unique: true },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
    defaultValue: 'pending',
  },
  payment_status: {
    type: DataTypes.ENUM('unpaid', 'paid', 'failed', 'refunded'),
    defaultValue: 'unpaid',
  },
  payment_method: { type: DataTypes.STRING(60), allowNull: true },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  shipping_charge: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  notes: { type: DataTypes.TEXT, allowNull: true },
  // Shipping address snapshot
  shipping_name: { type: DataTypes.STRING(160), allowNull: false },
  shipping_phone: { type: DataTypes.STRING(20), allowNull: true },
  shipping_address: { type: DataTypes.STRING(255), allowNull: false },
  shipping_city: { type: DataTypes.STRING(100), allowNull: false },
  shipping_state: { type: DataTypes.STRING(100), allowNull: false },
  shipping_postal: { type: DataTypes.STRING(20), allowNull: false },
  shipping_country: { type: DataTypes.STRING(80), allowNull: false, defaultValue: 'India' },
}, {
  tableName: 'orders',
});

module.exports = Order;
