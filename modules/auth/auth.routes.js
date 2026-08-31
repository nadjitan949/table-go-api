const express = require('express');
const {
  registerController,
  loginController,
  forgotPasswordController,
} = require('./auth.controller');
const validate = require('../../middleware/validator/validate');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
} = require('./auth.schema');

const authRoute = express.Router();

authRoute.post('/register', validate(registerSchema), registerController);
authRoute.post('/login', validate(loginSchema), loginController);
authRoute.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  forgotPasswordController
);

module.exports = authRoute;
