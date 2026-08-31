const multer = require("multer")

const storage = multer.memoryStorage()

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 Mo max
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Format d'image non supporté (jpeg, png, webp uniquement)"))
        }
        cb(null, true)
    }
})

// Un seul champ "image" pour la photo du plat
const menuPhotoUpload = upload.single("imageUrl")

module.exports = { upload, menuPhotoUpload }