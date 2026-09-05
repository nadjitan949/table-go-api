const asyncHandler = require('../../utils/asyncHandler');
const {
  getAllAddOnService,
  getOneAddOnService,
  addAddOnService,
  updateAddOnService,
  deleteAddOnService,
} = require('./addOn.service');

const getAllAddOnController = asyncHandler(async (req, res) => {
  return getAllAddOnService(req, res);
});

const getOneAddOnController = asyncHandler(async (req, res) => {
  return getOneAddOnService(req, res);
});

const addAddOnController = asyncHandler(async (req, res) => {
  return addAddOnService(req, res);
});

const updateAddOnController = asyncHandler(async (req, res) => {
  return updateAddOnService(req, res);
});

const deleteAddOnController = asyncHandler(async (req, res) => {
  return deleteAddOnService(req, res);
});

module.exports = {
  getAllAddOnController,
  getOneAddOnController,
  addAddOnController,
  updateAddOnController,
  deleteAddOnController,
};
