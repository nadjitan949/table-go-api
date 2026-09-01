const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connect');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    fullname: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('server', 'cook', 'admin') },
    password: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        name: 'user_phone_idx',
        fields: ['phone'],
      },
      {
        name: 'user_status_idx',
        fields: ['status'],
      },
    ],
  }
);

module.exports = User;
