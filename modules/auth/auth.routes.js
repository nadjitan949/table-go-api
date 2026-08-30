const express = require('express');
const { registerController } = require('./auth.controller');
const validate = require('../../middleware/validator/validate');
const registerSchema = require('./auth.schema');

const authRoute = express.Router();

authRoute.post('/register', validate(registerSchema), registerController);

module.exports = authRoute;
