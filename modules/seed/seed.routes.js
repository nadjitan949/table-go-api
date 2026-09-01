const express = require('express');
const { runSeedController } = require('./seed.controller');

const seedRoute = express.Router();

seedRoute.post('/run', runSeedController);

module.exports = seedRoute;
