const sequelize = require('./connect');
const User = require('../model/tables/user.model');
const Otp = require('../model/tables/otp.model');

module.exports = { sequelize, User, Otp };
