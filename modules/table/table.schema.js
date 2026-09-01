const { z } = require('zod');

const createTableSchema = z
  .object({
    number: z.string().min(1, 'Veuillez nommer la table'),
  })
  .strict();

const renameTableSchema = z
  .object({
    number: z.string().min(1, 'Veuillez saisir le nouveau nom de la table'),
  })
  .strict();

const changeTableStatusController = z
  .object({
    status: z.enum(['free', 'occupied', 'out_of_service'], {
      message: 'Status inconnus',
    }),
  })
  .strict();

module.exports = {
  createTableSchema,
  renameTableSchema,
  changeTableStatusController,
};
