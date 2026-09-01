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
    indexes: [
      {
        name: 'otp_source_idx',
        fields: ['source'],
      },
      {
        name: 'otp_user_idx',
        fields: ['user'],
      },
    ],
  }
);

module.exports = Otp;
