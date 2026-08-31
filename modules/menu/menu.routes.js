const express = require('express');
const {
  getAllMenusController,
  getOneMenuController,
  addMenuController,
  updateMenuController,
  deleteMenuController,
  disableMenuController,
  enableMenuController,
} = require('./menu.controller');
const validate = require('../../middleware/validator/validate');
const { addMenuItemSchema, updateMenuItemSchema } = require('./menu.schema');
const uploadMenuPhoto = require('../../middleware/multer/upload.middleware');
const { menuPhotoUpload } = require('../../middleware/multer/upload');

const menuRoute = express.Router();

menuRoute.get('/all', getAllMenusController);
menuRoute.get('/details/:id', getOneMenuController);
menuRoute.post(
  '/add',
  menuPhotoUpload,
  uploadMenuPhoto,
  validate(addMenuItemSchema),
  addMenuController
);
menuRoute.put(
  '/update/:id',
  menuPhotoUpload,
  uploadMenuPhoto,
  validate(updateMenuItemSchema),
  updateMenuController
);
menuRoute.delete('/delete/:id', deleteMenuController);
menuRoute.patch('/disable/:id', disableMenuController);
menuRoute.patch('/enable/:id', enableMenuController);

module.exports = menuRoute;
