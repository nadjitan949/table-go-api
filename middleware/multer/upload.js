const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Mo max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Format d'image non supporté (jpeg, png, webp uniquement)")
      );
    }
    cb(null, true);
  },
});

// ✅ Accepte n'importe quel champ de fichier (image, file, photo, imageUrl, etc.)
const anyFileUpload = (req, res, next) => {
  const uploadMiddleware = upload.single('image');
  uploadMiddleware(req, res, (err) => {
    if (err) {
      // Si 'image' ne fonctionne pas, on essaie avec upload.any()
      const anyUpload = upload.any();
      anyUpload(req, res, (err2) => {
        if (err2) return next(err2);
        // On prend le premier fichier trouvé
        if (req.files && req.files.length > 0) {
          req.file = req.files[0];
        }
        next();
      });
    } else {
      next();
    }
  });
};

// ✅ Version simple : accepte tous les champs
const flexibleUpload = upload.any();

// ✅ Ancien export (si tu veux garder la compatibilité)
const menuPhotoUpload = upload.single('imageUrl');

module.exports = { upload, menuPhotoUpload, anyFileUpload, flexibleUpload };
