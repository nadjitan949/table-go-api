const asyncHandler = require('../../utils/asyncHandler');
const {
  registerService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
} = require('./auth.service');

const registerController = asyncHandler(async (req, res) => {
  await registerService(req, res);
});
const loginController = asyncHandler(async (req, res) => {
  await loginService(req, res);
});
const forgotPasswordController = asyncHandler(async (req, res) => {
  await forgotPasswordService(req, res);
});
const resetPasswordController = asyncHandler(async (req, res) => {
  await resetPasswordService(req, res);
});

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
};
