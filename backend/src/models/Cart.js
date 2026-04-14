const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, unique: true },
  session_token: { type: DataTypes.STRING(255), allowNull: true }, // for guest carts
}, {
  tableName: 'carts',
});

module.exports = Cart;
