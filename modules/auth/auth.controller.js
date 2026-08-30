const asyncHandler = require('../../utils/asyncHandler');
const { registerService } = require('./auth.service');

const registerController = asyncHandler(async (req, res) => {
  await registerService(req, res);
});

module.exports = { registerController };
