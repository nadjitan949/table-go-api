const express = require('express');
const {
  getAllTablesController,
  getOnTableController,
  createTableController,
  renameTableController,
  regenerateQrTokenController,
  deleteTableController,
} = require('./table.controller');
const validate = require('../../middleware/validator/validate');
const { createTableSchema, renameTableSchema } = require('./table.schema');

const tableRoute = express.Router();

tableRoute.get('/all', getAllTablesController);
tableRoute.get('/details/:id', getOnTableController);
tableRoute.post('/create', validate(createTableSchema), createTableController);
tableRoute.patch(
  '/rename/:id',
  validate(renameTableSchema),
  renameTableController
);
tableRoute.patch('/regenerate-qr-token/:id', regenerateQrTokenController);
tableRoute.delete('/delete/:id', deleteTableController);

module.exports = tableRoute;
