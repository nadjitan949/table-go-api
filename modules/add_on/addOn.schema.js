const { z } = require("zod")

// Le fichier envoyé dans le champ "image" est consommé par multer (req.file).
// L'URL Cloudinary est écrite dans req.body.image par uploadAddOnPhoto,
// c'est donc "image" que le schéma doit valider (pas le fichier brut).
const addAddOnSchema = z
    .object({
        name: z.string().min(1, "Veuillez renseigner le nom du supplément"),
        price: z.coerce
            .number({
                invalid_type_error: "Le prix doit être un nombre"
            })
            .positive("Veuillez saisir un prix valide supérieur à 0")
            .optional(),
        description: z.string().optional(),
        menuId: z.coerce
            .number({
                invalid_type_error: "L'identifiant du menu doit être un nombre"
            })
            .int("L'identifiant du menu doit être un entier"),
        image: z.string().url("L'URL de l'image est invalide").optional()
    })
    .strict()

// Pour l'update : TOUS les champs sont optionnels, on ne modifie que ce qui est envoyé.
const updateAddOnSchema = z.object({
    name: z
        .string()
        .min(1, "Veuillez renseigner le nom du supplément")
        .optional(),
    price: z.coerce
        .number({
            invalid_type_error: "Le prix doit être un nombre"
        })
        .positive("Veuillez saisir un prix valide supérieur à 0")
        .optional(),
    description: z.string().optional(),
    menuId: z.coerce
        .number({
            invalid_type_error: "L'identifiant du menu doit être un nombre"
        })
        .int("L'identifiant du menu doit être un entier")
        .optional(),
    image: z.string().url("L'URL de l'image est invalide").optional()
}).strict()

module.exports = { addAddOnSchema, updateAddOnSchema }
