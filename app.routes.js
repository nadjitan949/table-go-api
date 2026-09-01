const express = require('express');
const userRoute = require('./modules/user/user.routes');
const authRoute = require('./modules/auth/auth.routes');
const otpRoute = require('./modules/otp/otp.routes');
const menuRoute = require('./modules/menu/menu.routes');
const tableRoute = require('./modules/table/table.routes');

const appRoute = express.Router();

appRoute.use('/users', userRoute);
appRoute.use('/auth', authRoute);
appRoute.use('/otp', otpRoute);
appRoute.use('/menu', menuRoute);
appRoute.use('/table', tableRoute);

module.exports = appRoute;
