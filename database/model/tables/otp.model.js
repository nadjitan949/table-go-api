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
    souce: {
      type: DataTypes.ENUM('register', 'forgot_password', 'reset_passwor'),
      allowNull: false,
    },
    user: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: 'otps',
    timestamps: true,
  }
);

module.exports = Otp;
