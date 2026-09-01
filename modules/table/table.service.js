const Table = require('../../database/model/tables/table.model');
const responses = require('../../messages/responses');
const crypto = require('crypto');

function generateQrToken() {
  return crypto.randomBytes(16).toString('hex');
}

const getAllTablesServices = async (req, res) => {
  const tables = await Table.findAll();

  return res.status(responses.OK).json({
    success: true,
    message:
      tables.length === 0
        ? 'Aucune table de créée pour le moment'
        : 'Liste des tables',
    data: tables,
  });
};

const getOnTableService = async (req, res) => {
  const id = req.params.id;
  const table = await Table.findByPk(id);

  return res.status(!table ? responses.NOT_FOUND : responses.OK).json({
    success: Boolean(table),
    message: !table ? 'Table introuvable' : 'Détail de la table',
    data: table,
  });
};

const creatTableService = async (req, res) => {
  const { number } = req.body;

  const existNumberTable = await Table.findOne({ where: { number } });

  if (existNumberTable) {
    return res.status(responses.CONFLICT).json({
      success: false,
      message: 'Le numéro de table existe déjà',
    });
  }

  const qrToken = generateQrToken();

  const newTable = await Table.create({
    number,
    qrCodeToken: qrToken,
    status: 'free',
  });

  return res.status(responses.CREATED).json({
    success: true,
    message: 'Table créée avec succès',
    data: newTable,
  });
};

const renameTableService = async (req, res) => {
  const id = req.params.id;
  const { number } = req.body;

  const table = await Table.findByPk(id);
  if (!table) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Table introuvable',
    });
  }

  if (number !== table.number) {
    const existNumberTable = await Table.findOne({ where: { number } });
    if (existNumberTable) {
      return res.status(responses.CONFLICT).json({
        success: false,
        message: 'Le numéro de table existe déjà',
      });
    }
  }

  await table.update({ number });

  return res.status(responses.OK).json({
    success: true,
    message: 'Table renommée avec succès',
    data: table,
  });
};

const regenerateQrTokenService = async (req, res) => {
  const id = req.params.id;

  const table = await Table.findByPk(id);
  if (!table) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Table introuvable',
    });
  }

  const newQrToken = generateQrToken();
  await table.update({ qrCodeToken: newQrToken });

  return res.status(responses.OK).json({
    success: true,
    message: 'QR code régénéré avec succès',
    data: table,
  });
};

const changeTableStatusService = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  const table = await Table.findByPk(id);
  if (!table) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Table introuvable',
    });
  }

  await table.update({ status });

  return res.status(responses.OK).json({
    success: true,
    message: 'Statut de la table mis à jour avec succès',
    data: table,
  });
};

const deleteTableService = async (req, res) => {
  const id = req.params.id;
  const table = await Table.findByPk(id);
  if (!table) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Table introuvable',
    });
  }

  await table.destroy();

  return res.status(responses.OK).json({
    success: true,
    message: 'Table supprimé',
  });
};

module.exports = {
  getAllTablesServices,
  getOnTableService,
  creatTableService,
  renameTableService,
  regenerateQrTokenService,
  changeTableStatusService,
  deleteTableService,
};
