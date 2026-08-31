const asyncHandler = require('../../utils/asyncHandler');
const { verifyOtpService, resendOtpService } = require('./otp.service');

const verifyOtpController = asyncHandler(async (req, res) => {
  await verifyOtpService(req, res);
});
const resendOtpController = asyncHandler(async (req, res) => {
    await resendOtpService(req, res)
})

module.exports = { verifyOtpController, resendOtpController };
