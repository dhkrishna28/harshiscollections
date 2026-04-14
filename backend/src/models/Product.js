const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  category_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(220), allowNull: false, unique: true },
  // ── Descriptive attributes ──
  brand: { type: DataTypes.STRING(120), allowNull: true },
  material: { type: DataTypes.STRING(80), allowNull: true },
  craft_print_type: { type: DataTypes.STRING(150), allowNull: true },
  style: { type: DataTypes.STRING(150), allowNull: true },
  neckline: { type: DataTypes.STRING(80), allowNull: true },
  // ── Rich-text sections ──
  description: { type: DataTypes.TEXT('long'), allowNull: true },
  short_description: { type: DataTypes.TEXT, allowNull: true },
  specifications: { type: DataTypes.TEXT('long'), allowNull: true },
  wash_care: { type: DataTypes.TEXT('long'), allowNull: true },
  shipping_info: { type: DataTypes.TEXT('long'), allowNull: true },
  ideal_for: { type: DataTypes.TEXT('long'), allowNull: true },
  // ── Sizes JSON array e.g. ["S","M","L","34"] ──
  sizes: { type: DataTypes.JSON, allowNull: true },
  // ── Identifiers / Pricing ──
  sku: { type: DataTypes.STRING(80), allowNull: true, unique: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },              // selling price
  compare_at_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },   // MRP / crossed-out price
  availability_status: {
    type: DataTypes.ENUM('in_stock', 'out_of_stock'),
    defaultValue: 'in_stock',
  },
  stock_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  weight: { type: DataTypes.DECIMAL(8, 2), allowNull: true },
  featured_image: { type: DataTypes.STRING(255), allowNull: true },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'published',
  },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  meta_title: { type: DataTypes.STRING(200), allowNull: true },
  meta_description: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'products',
});

module.exports = Product;
