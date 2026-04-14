const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, unique: true },
  transaction_id: { type: DataTypes.STRING(120), allowNull: true }, // gateway reference
  gateway: { type: DataTypes.STRING(60), allowNull: true }, // razorpay, stripe, cod, etc.
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  currency: { type: DataTypes.STRING(10), defaultValue: 'INR' },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  gateway_response: { type: DataTypes.JSON, allowNull: true }, // raw gateway payload
  paid_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'transactions',
});

module.exports = Transaction;
