const express = require('express');
const { registerController, loginController } = require('./auth.controller');
const validate = require('../../middleware/validator/validate');
const { registerSchema, loginSchema } = require('./auth.schema');

const authRoute = express.Router();

authRoute.post('/register', validate(registerSchema), registerController);
authRoute.post('/login', validate(loginSchema), loginController);

module.exports = authRoute;
