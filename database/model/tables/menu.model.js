const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connect');

const MenuItem = sequelize.define(
  'MenuItem',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    category: {
      type: DataTypes.ENUM('starter', 'main', 'dessert', 'drink'),
      allowNull: false,
    },
    estimatedPrepTime: { type: DataTypes.INTEGER, allowNull: false },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: 'menu_items',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: 'items_category_idx',
        fields: ['category'],
      },
    ],
  }
);

module.exports = MenuItem;
