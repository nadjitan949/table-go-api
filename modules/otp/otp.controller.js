const asyncHandler = require('../../utils/asyncHandler');
const { verifyOtpService } = require('./otp.service');

const verifyOtpController = asyncHandler(async (req, res) => {
  await verifyOtpService(req, res);
});

module.exports = { verifyOtpController };
