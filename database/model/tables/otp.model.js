const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connect');

const Otp = sequelize.define(
  'Otp',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    source: {
      type: DataTypes.ENUM('register', 'forgot_password', 'reset_password'),
      allowNull: false,
    },
    user: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: 'otps',
    timestamps: true,
  }
);

module.exports = Otp;
