const { upload } = require("../../middleware/multer/upload")
const { uploadToCloudinary } = require("../../utils/uploadToCloudinary")
const responses = require("../../messages/responses")

// Adapte la configuration multer existante au champ "image" des suppléments.
const addOnPhotoUpload = upload.single("image")

// Récupère le fichier uploadé quel que soit le mode multer utilisé :
// - upload.single("image") -> req.file
// - upload.any()           -> req.files (tableau d'objets, chacun avec .fieldname)
function getUploadedFile(req) {
    if (req.file) return req.file
    if (Array.isArray(req.files) && req.files.length > 0) {
        return req.files.find((f) => f.fieldname === "image") || req.files[0]
    }
    return null
}

// Upload l'image sur Cloudinary puis écrit l'URL dans req.body.image
async function uploadAddOnPhoto(req, res, next) {
    try {
        const file = getUploadedFile(req)

        if (!file) {
            return next() // pas de photo envoyée, on continue sans (image restera null)
        }

        const publicId = `add-on-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        const result = await uploadToCloudinary(
            file.buffer,
            "tablego/menu-items/add-ons",
            publicId
        )
        req.body.image = result.secure_url

        next()
    } catch (error) {
        console.log(`Erreur upload photo supplément: ${error}`)
        return res.status(responses.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Erreur lors de l'envoi de l'image",
            error: error.message
        })
    }
}

module.exports = { addOnPhotoUpload, uploadAddOnPhoto }