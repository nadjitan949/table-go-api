const asyncHandler = require('../../utils/asyncHandler');
const { runSeedService } = require('./seed.service');

const runSeedController = asyncHandler(async (req, res) => {
  await runSeedService(req, res);
});

module.exports = { runSeedController };
