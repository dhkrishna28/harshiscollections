const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contact = sequelize.define('Contact', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false },
  phone: { type: DataTypes.STRING(20), allowNull: true },
  subject: { type: DataTypes.STRING(200), allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: {
    type: DataTypes.ENUM('new', 'read', 'replied', 'closed'),
    defaultValue: 'new',
  },
  replied_at: { type: DataTypes.DATE, allowNull: true },
  admin_notes: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'contacts',
});

module.exports = Contact;
