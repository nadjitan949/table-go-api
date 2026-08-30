const asyncHandler = require('../../utils/asyncHandler');
const { registerService, loginService } = require('./auth.service');

const registerController = asyncHandler(async (req, res) => {
  await registerService(req, res);
});
const loginController = asyncHandler(async (req, res) => {
  await loginService(req, res);
});

module.exports = { registerController, loginController };
