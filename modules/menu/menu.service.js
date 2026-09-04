const { AddOn } = require('../../database/model/relations/relations');
const MenuItem = require('../../database/model/tables/menu.model');
const responses = require('../../messages/responses');
const { deleteImageFromCloudinary } = require('../../utils/uploadToCloudinary');

const getAllMenusServices = async (req, res) => {
  const menus = await MenuItem.findAll({
    include: {
      model: AddOn
    }
  });

  return res.status(responses.OK).json({
    success: true,
    message:
      menus.length === 0
        ? 'Aucun menu engregistré pour le moment'
        : 'Liste des menus',
    data: menus,
  });
};

const getOneMenuService = async (req, res) => {
  const id = req.params.id;
  const menu = await MenuItem.findByPk(id, {
    include: {
      model: AddOn
    }
  });

  return res.status(!menu ? responses.NOT_FOUND : responses.OK).json({
    success: Boolean(menu),
    message: !menu ? 'Menus introuvable' : 'Details du menus',
    data: menu,
  });
};

const addMenuService = async (req, res) => {
  const newMenu = await MenuItem.create(req.body);

  return res.status(responses.CREATED).json({
    success: true,
    message: 'Nouvelle menus crée avec succès !',
    data: newMenu,
  });
};

const updateMenuService = async (req, res) => {
  const id = req.params.id;
  const menu = await MenuItem.findByPk(id);

  if (!menu) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Menu introuvable',
    });
  }

  const oldImageUrl = menu.imageUrl;

  await menu.update(req.body);

  // Si une nouvelle image a été uploadée, on supprime l'ancienne de Cloudinary
  if (req.body.imageUrl && oldImageUrl && req.body.imageUrl !== oldImageUrl) {
    try {
      await deleteImageFromCloudinary(oldImageUrl);
      console.log(`Ancienne image menu supprimée: ${oldImageUrl}`);
    } catch (error) {
      // On ne bloque pas la mise à jour : l'image orpheline est juste loggée
      console.log(`Erreur suppression ancienne image menu: ${error}`);
    }
  }

  return res.status(responses.OK).json({
    success: true,
    message: 'Menu mis à jour avec succès',
    data: menu,
  });
};

const deleteMenuService = async (req, res) => {
  const id = req.params.id;
  const menu = await MenuItem.findByPk(id);

  if (!menu) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Menu introuvable',
    });
  }

  if (menu.imageUrl) {
    try {
      await deleteImageFromCloudinary(menu.imageUrl);
      console.log(`Image menu supprimée de Cloudinary: ${menu.imageUrl}`);
    } catch (error) {
      console.log(`Erreur suppression image menu Cloudinary: ${error}`);
    }
  }

  await menu.destroy();

  return res.status(responses.OK).json({
    success: true,
    message: 'Menu supprimé avec succès',
  });
};

const disableMenuService = async (req, res) => {
  const id = req.params.id;
  const menu = await MenuItem.findByPk(id);

  if (!menu) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Menu introuvable',
    });
  }

  if (menu.isAvailable === false) {
    return res.status(responses.CONFLICT).json({
      success: false,
      message: 'Le menu est déjà indisponible',
      data: menu,
    });
  }

  await menu.update({ isAvailable: false });

  return res.status(responses.OK).json({
    success: true,
    message: 'Le menu est désormais indisponible',
    data: menu,
  });
};

const enableMenuService = async (req, res) => {
  const id = req.params.id;
  const menu = await MenuItem.findByPk(id);

  if (!menu) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Menu introuvable',
    });
  }

  if (menu.isAvailable === true) {
    return res.status(responses.CONFLICT).json({
      success: false,
      message: 'Le menu est déjà disponible',
      data: menu,
    });
  }

  await menu.update({ isAvailable: true });

  return res.status(responses.OK).json({
    success: true,
    message: 'Le menu est désormais disponible',
    data: menu,
  });
};

module.exports = {
  getAllMenusServices,
  getOneMenuService,
  addMenuService,
  updateMenuService,
  deleteMenuService,
  disableMenuService,
  enableMenuService,
};
