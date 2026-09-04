const express = require("express");

const {
  getAllAddOnController,
  getOneAddOnController,
  addAddOnController,
  updateAddOnController,
  deleteAddOnController,
} = require("../add_on/addOn.controller");
const { flexibleUpload } = require("../../middleware/multer/upload");
const { uploadAddOnPhoto } = require("./addOn.upload.middleware");
const validate = require("../../middleware/validator/validate");
const { addAddOnSchema, updateAddOnSchema } = require("./addOn.schema");

const addOnRoute = express.Router();

addOnRoute.get("/all", getAllAddOnController);
addOnRoute.get("/details/:id", getOneAddOnController);
addOnRoute.post("/add", flexibleUpload, uploadAddOnPhoto, validate(addAddOnSchema), addAddOnController);
addOnRoute.put("/update/:id", flexibleUpload, uploadAddOnPhoto, validate(updateAddOnSchema), updateAddOnController);
addOnRoute.delete("/delete/:id", deleteAddOnController);

module.exports = addOnRoute;