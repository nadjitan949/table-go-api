const express = require('express');
const validate = require('../../middleware/validator/validate');
const { verifyOtpController } = require('./otp.controller');
const { verifyOtpSchema } = require('./otp.schema');

const otpRoute = express.Router();

otpRoute.post('/verify', validate(verifyOtpSchema), verifyOtpController);

module.exports = otpRoute;
