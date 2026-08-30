const responses = require('../../messages/responses');
const asyncHandler = require('../../utils/asyncHandler');
const {
  getAllUserSercice,
  getUserByIdSercice,
  addUserSercice,
  updateUserSercice,
  deleteUserSercice,
  resetUserPasswordService,
  activeUserService,
  unActiveUserService,
} = require('./user.service');

const getAllUserController = asyncHandler(async (req, res) => {
  await getAllUserSercice(req, res);
});
const getUserByIdController = asyncHandler(async (req, res) => {
  await getUserByIdSercice(req, res);
});
const addUserController = asyncHandler(async (req, res) => {
  await addUserSercice(req, res);
});
const updateUserController = asyncHandler(async (req, res) => {
  await updateUserSercice(req, res);
});
const deleteUserController = asyncHandler(async (req, res) => {
  await deleteUserSercice(req, res);
});
const resetUserPasswordController = asyncHandler(async (req, res) => {
  await resetUserPasswordService(req, res);
});
const unActiveUserController = asyncHandler(async (req, res) => {
  await unActiveUserService(req, res);
});
const activeUserController = asyncHandler(async (req, res) => {
  await activeUserService(req, res);
});

module.exports = {
  getAllUserController,
  getUserByIdController,
  addUserController,
  updateUserController,
  deleteUserController,
  resetUserPasswordController,
  unActiveUserController,
  activeUserController,
};
