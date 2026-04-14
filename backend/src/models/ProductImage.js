const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductImage = sequelize.define('ProductImage', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  image_path: { type: DataTypes.STRING(255), allowNull: false },
  alt_text: { type: DataTypes.STRING(200), allowNull: true },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'product_images',
});

module.exports = ProductImage;
