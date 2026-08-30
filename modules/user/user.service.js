const { Op } = require('sequelize');
const { User } = require('../../database/config');
const responses = require('../../messages/responses');
const bcrypt = require('bcrypt');
const asyncHandler = require('../../utils/asyncHandler');

const getAllUserSercice = async (req, res) => {
  const users = await User.findAll();
  const response = {
    success: true,
    message:
      users.length === 0
        ? 'Aucun utilisateur pour le moment'
        : 'Liste des utilisateur',
  };

  return res.status(responses.OK).json(response);
};

const getUserByIdSercice = async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Utilisateur introuvable',
    });
  }

  return res.status(responses.OK).json({
    success: true,
    message: 'Utilisateur trouvé',
    data: user,
  });
};

const addUserSercice = async (req, res) => {
  const { phone, password } = req.body;
  const existingUser = await User.findOne({ where: { phone } });
  if (existingUser) {
    return res.status(responses.BAD_REQUEST).json({
      success: false,
      message: 'Ce numéro de téléphone est déjà utilisé',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ ...req.body, password: hashedPassword });

  return res.status(responses.CREATED).json({
    success: true,
    message: 'Utilisateur créé avec succès',
    data: user,
  });
};

const updateUserSercice = async (req, res) => {
  const id = req.params.id;
  const { phone } = req.body;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Utilisateur introuvable',
    });
  }

  // Si le téléphone change, on vérifie nous-même qu'il n'est pas déjà pris
  if (phone && phone !== user.phone) {
    const existingUser = await User.findOne({
      where: {
        phone,
        id: { [Op.ne]: id }, // exclure l'utilisateur actuel de la recherche
      },
    });

    if (existingUser) {
      return res.status(responses.BAD_REQUEST).json({
        success: false,
        message: 'Ce numéro de téléphone est déjà utilisé',
      });
    }
  }

  await user.update(req.body);

  return res.status(responses.OK).json({
    success: true,
    message: 'Utilisateur mis à jour avec succès',
    data: user,
  });
};

const deleteUserSercice = async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Utilisateur introuvable',
    });
  }

  await user.destroy();

  return res.status(responses.OK).json({
    success: true,
    message: 'Utilisateur supprimé avec succès',
  });
};

const resetUserPasswordService = async (req, res) => {
  const id = req.params.id;
  const { password } = req.body;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Utilisateur introuvable',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await user.update({ password: hashedPassword });

  return res.status(responses.OK).json({
    success: true,
    message: 'Le mot de passe à été mis à jour avec succes',
    data: user,
  });
};

const unActiveUserService = async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Utilisateur introuvable',
    });
  }

  if (user.isActive === false) {
    return res.status(responses.CONFLICT).json({
      success: false,
      message: "L'utilisateur est déjà inactive",
      data: user,
    });
  }

  await user.update({ isActive: false });

  return res.status(responses.OK).json({
    success: true,
    message: "L'utilisateur à été desactivé avec succes",
    data: user,
  });
};

const activeUserService = async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Utilisateur introuvable',
    });
  }

  if (user.isActive === true) {
    return res.status(responses.CONFLICT).json({
      success: false,
      message: "L'utilisateur est déjà active",
      data: user,
    });
  }

  await user.update({ isActive: true });

  return res.status(responses.OK).json({
    success: true,
    message: "L'utilisateur à été activé avec succes",
    data: user,
  });
};

module.exports = {
  getAllUserSercice,
  getUserByIdSercice,
  addUserSercice,
  updateUserSercice,
  deleteUserSercice,
  resetUserPasswordService,
  unActiveUserService,
  activeUserService,
};
