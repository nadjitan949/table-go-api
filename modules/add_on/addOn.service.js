const { AddOn } = require("../../database/model/relations/relations")
const MenuItem = require("../../database/model/tables/menu.model")
const responses = require("../../messages/responses")
const { deleteImageFromCloudinary } = require("../../utils/uploadToCloudinary")

const getAllAddOnService = async (req, res) => {
    const addOns = await AddOn.findAll({
        include: { model: MenuItem }
    });

    return res.status(responses.OK).json({
        success: true,
        message: addOns.length === 0 ? "Aucun supplément menu ajouté pour le moment" : "Liste des suppléments avec les menus",
        data: addOns
    });
};

const getOneAddOnService = async (req, res) => {
    const id = req.params.id;
    const addOn = await AddOn.findByPk(id, {
        include: { model: MenuItem }
    });

    return res.status(!addOn ? responses.NOT_FOUND : responses.OK).json({
        success: Boolean(addOn),
        message: !addOn ? "Supplément introuvable" : "Détails du supplément avec le menu associé",
        data: addOn
    });
};

const addAddOnService = async (req, res) => {
    const newAddOn = await AddOn.create(req.body, {
        include: { model: MenuItem }
    });

    return res.status(responses.CREATED).json({
        success: true,
        message: "Nouveau supplément créé avec succès",
        data: newAddOn
    });
};

const updateAddOnService = async (req, res) => {
  const id = req.params.id;
  const addOn = await AddOn.findByPk(id);

  if (!addOn) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: "Supplément introuvable",
    });
  }

  const oldImageUrl = addOn.imageUrl;
  await addOn.update(req.body);

  if (req.body.imageUrl && oldImageUrl && req.body.imageUrl !== oldImageUrl) {
    try {
      await deleteImageFromCloudinary(oldImageUrl);
      console.log(`Ancienne image supplément supprimée: ${oldImageUrl}`);
    } catch (error) {
      console.log(`Erreur suppression ancienne image supplément: ${error}`);
    }
  }

  return res.status(responses.OK).json({
    success: true,
    message: "Supplément mis à jour avec succès",
    data: addOn,
  });
};

const deleteAddOnService = async (req, res) => {
  const id = req.params.id;
  const addOn = await AddOn.findByPk(id);

  if (!addOn) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: "Supplément introuvable",
    });
  }

  if (addOn.imageUrl) {
    try {
      await deleteImageFromCloudinary(addOn.imageUrl);
      console.log(`Image supplément supprimée de Cloudinary: ${addOn.imageUrl}`);
    } catch (error) {
      console.log(`Erreur suppression image supplément Cloudinary: ${error}`);
    }
  }

  await addOn.destroy();

  return res.status(responses.OK).json({
    success: true,
    message: "Supplément supprimé avec succès",
  });
};

module.exports = {
    getAllAddOnService,
    getOneAddOnService,
    addAddOnService,
    updateAddOnService,
    deleteAddOnService
}