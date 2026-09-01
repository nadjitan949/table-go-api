const asyncHandler = require('../../utils/asyncHandler');
const {
  getAllTablesServices,
  creatTableService,
  renameTableService,
  regenerateQrTokenService,
  changeTableStatusService,
  getOnTableService,
  deleteTableService,
} = require('./table.service');

const getAllTablesController = asyncHandler(async (req, res) => {
  await getAllTablesServices(req, res);
});
const getOnTableController = asyncHandler(async (req, res) => {
  await getOnTableService(req, res);
});
const createTableController = asyncHandler(async (req, res) => {
  creatTableService(req, res);
});
const renameTableController = asyncHandler(async (req, res) => {
  await renameTableService(req, res);
});
const regenerateQrTokenController = asyncHandler(async (req, res) => {
  await regenerateQrTokenService(req, res);
});
const changeTableStatusController = asyncHandler(async (req, res) => {
  await changeTableStatusService(req, res);
});
const deleteTableController = asyncHandler(async (req, res) => {
  await deleteTableService(req, res);
});

module.exports = {
  getAllTablesController,
  getOnTableController,
  createTableController,
  renameTableController,
  regenerateQrTokenController,
  changeTableStatusController,
  deleteTableController,
};
