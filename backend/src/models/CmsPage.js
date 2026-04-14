const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CmsPage = sequelize.define('CmsPage', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  page_key: {
    type: DataTypes.ENUM('about_us', 'faq', 'privacy_policy', 'terms_conditions'),
    allowNull: false,
    unique: true,
  },
  title: { type: DataTypes.STRING(200), allowNull: false },
  content: { type: DataTypes.TEXT('long'), allowNull: true },
  meta_title: { type: DataTypes.STRING(200), allowNull: true },
  meta_description: { type: DataTypes.TEXT, allowNull: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'cms_pages',
});

module.exports = CmsPage;
