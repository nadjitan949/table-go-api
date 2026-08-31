const { uploadToCloudinary } = require('../../utils/uploadToCloudinary');
const responses = require('../../messages/responses');

async function uploadMenuPhoto(req, res, next) {
  try {
    if (!req.file) {
      return next(); // pas de photo envoyée, on continue sans (imageUrl restera null/inchangé)
    }

    // Public_id unique par upload (jamais le même) : permet de supprimer
    // proprement l'ancienne image depuis le service sans l'écraser
    const publicId = `menu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const result = await uploadToCloudinary(
      req.file.buffer,
      'tablego/menu-items',
      publicId
    );

    req.body.imageUrl = result.secure_url;

    next();
  } catch (error) {
    console.log(`Erreur upload photo menu: ${error}`);
    return res.status(responses.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Erreur lors de l'envoi de l'image",
      error: error.message,
    });
  }
}

module.exports = uploadMenuPhoto;
