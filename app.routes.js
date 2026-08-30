const express = require('express');
const userRoute = require('./modules/user.routes');

const appRoute = express.Router();

appRoute.use('/users', userRoute);

module.exports = appRoute;
