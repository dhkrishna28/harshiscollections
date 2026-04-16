const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  product_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  product_name: { type: DataTypes.STRING(200), allowNull: false }, // snapshot
  product_sku: { type: DataTypes.STRING(80), allowNull: true },
  selected_size: { type: DataTypes.STRING(40), allowNull: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  tableName: 'order_items',
});

module.exports = OrderItem;
