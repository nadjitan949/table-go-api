const sequelize = require('./connect');
const User = require('../model/tables/user.model');

module.exports = { sequelize, User };
