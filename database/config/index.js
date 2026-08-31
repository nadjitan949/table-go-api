const sequelize = require('./connect');
const User = require('../model/tables/user.model');
const Otp = require('../model/tables/otp.model');
const MenuItem = require('../model/tables/menu.model');

module.exports = { sequelize, User, Otp, MenuItem };
