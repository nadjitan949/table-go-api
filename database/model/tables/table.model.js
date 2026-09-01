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
    number: { type: DataTypes.STRING, allowNull: false },
    qrCodeToken: { type: DataTypes.STRING, allowNull: false },
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
      {
        unique: true,
        name: 'table_number_idx',
        fields: ['number'],
      },
      {
        unique: true,
        name: 'tables_qr_code_qrCodeToken_idx',
        fields: ['qrCodeToken'],
      },
    ],
  }
);

module.exports = Table;
