const express = require('express');
const userRoute = require('./modules/user/user.routes');
const authRoute = require('./modules/auth/auth.routes');

const appRoute = express.Router();

appRoute.use('/users', userRoute);
appRoute.use('/auth', authRoute);

module.exports = appRoute;
