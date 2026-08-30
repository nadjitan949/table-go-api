const express = require('express');
const {
  getAllUserController,
  getUserByIdController,
  addUserController,
  updateUserController,
  deleteUserController,
  resetUserPasswordController,
  unActiveUserController,
  activeUserController,
} = require('./user/user.controller');
const validate = require('../middleware/validator/validate');
const {
  addUserSchema,
  updateUserSchema,
  resetUserPasswordSchema,
} = require('./user/user.schema');

const userRoute = express.Router();

userRoute.get('/all', getAllUserController);
userRoute.get('/details/:id', getUserByIdController);
userRoute.post('/add', validate(addUserSchema), addUserController);
userRoute.put('/update/:id', validate(updateUserSchema), updateUserController);
userRoute.patch(
  '/reset-password/:id',
  validate(resetUserPasswordSchema),
  resetUserPasswordController
);
userRoute.patch('/unactive/:id', unActiveUserController);
userRoute.patch('/active/:id', activeUserController);
userRoute.delete('/delete/:id', deleteUserController);

module.exports = userRoute;
