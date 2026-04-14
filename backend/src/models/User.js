const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  first_name: { type: DataTypes.STRING(80), allowNull: false },
  last_name: { type: DataTypes.STRING(80), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(20), allowNull: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  verification_token: { type: DataTypes.STRING(255), allowNull: true },
  reset_token: { type: DataTypes.STRING(255), allowNull: true },
  reset_token_expiry: { type: DataTypes.DATE, allowNull: true },
  // Shipping / billing defaults
  address_line1: { type: DataTypes.STRING(255), allowNull: true },
  address_line2: { type: DataTypes.STRING(255), allowNull: true },
  city: { type: DataTypes.STRING(100), allowNull: true },
  state: { type: DataTypes.STRING(100), allowNull: true },
  postal_code: { type: DataTypes.STRING(20), allowNull: true },
  country: { type: DataTypes.STRING(80), allowNull: true, defaultValue: 'India' },
}, {
  tableName: 'users',
});

module.exports = User;
