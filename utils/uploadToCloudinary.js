const cloudinary = require('../configs/cloudinary');
const streamifier = require('streamifier');

/**
 * Upload un fichier vers Cloudinary avec un public_id fixe.
 * Si une image existe déjà à cet emplacement, elle est automatiquement remplacée.
 */
function uploadToCloudinary(fileBuffer, folder, publicId) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite: true,
        invalidate: true, // force le rafraîchissement du cache CDN sur l'ancienne image
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}

/**
 * Supprime TOUTES les images d'un dossier Cloudinary (ex: tout le dossier d'un utilisateur).
 */
async function deleteFolderFromCloudinary(folder) {
  await cloudinary.api.delete_resources_by_prefix(folder);
  await cloudinary.api.delete_folder(folder).catch(() => {
    // le dossier peut déjà être vide/supprimé, on ignore l'erreur dans ce cas
  });
}

/**
 * Extrait le public_id (dossier inclus) depuis une URL Cloudinary.
 * Ex: https://res.cloudinary.com/<cloud>/image/upload/v123/tablego/menu-items/menu-1700000.jpg
 *     -> "tablego/menu-items/menu-1700000"
 */
function extractPublicIdFromUrl(url) {
  const match = url.match(
    /\/image\/upload\/(?:v\d+\/)?([^/]+(?:\/[^/]+)*)\.[a-zA-Z0-9]+$/
  );
  return match ? match[1] : null;
}

/**
 * Supprime une image unique de Cloudinary à partir de son URL.
 */
async function deleteImageFromCloudinary(imageUrl) {
  const publicId = extractPublicIdFromUrl(imageUrl);
  if (!publicId) return;

  return cloudinary.uploader.destroy(publicId, {
    invalidate: true, // force le rafraîchissement du cache CDN
  });
}

module.exports = {
  uploadToCloudinary,
  deleteImageFromCloudinary,
  extractPublicIdFromUrl,
  deleteFolderFromCloudinary,
};
