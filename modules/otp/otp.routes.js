const express = require('express');
const validate = require('../../middleware/validator/validate');
const { verifyOtpController, resendOtpController } = require('./otp.controller');
const { verifyOtpSchema, resendOtpSchema } = require('./otp.schema');

const otpRoute = express.Router();

otpRoute.post('/verify', validate(verifyOtpSchema), verifyOtpController);
otpRoute.post('/resend', validate(resendOtpSchema), resendOtpController)

module.exports = otpRoute;
