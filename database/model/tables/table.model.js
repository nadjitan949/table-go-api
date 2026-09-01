const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connect');

const Table = sequelize.define(
  'Table',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    number: { type: DataTypes.STRING, allowNull: false, unique: true },
    qrCodeToken: { type: DataTypes.STRING, allowNull: false, unique: true },
    qrCodeImageUrl: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM('free', 'occupied', 'out_of_service'),
      allowNull: false,
      defaultValue: 'free',
    },
  },
  {
    tableName: 'tables',
    timestamps: true,
    indexes: [
      {
        name: 'table_status_idx',
        fields: ['status'],
      },
    ],
  }
);

module.exports = Table;
