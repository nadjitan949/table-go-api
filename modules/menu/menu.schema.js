const { z } = require('zod');

const addMenuItemSchema = z
  .object({
    name: z.string().min(1, 'Veuillez renseigner le nom du plat'),
    description: z.string().optional(),

    // .min(0.01) ou .positive() suffit largement pour s'assurer que c'est supérieur à 0
    price: z.coerce
      .number({
        invalid_type_error: 'Le prix doit être un nombre',
      })
      .positive('Veuillez saisir un prix valide supérieur à 0'),

    category: z.enum(['starter', 'main', 'dessert', 'drink'], {
      message: 'La catégorie doit être starter, main, dessert ou drink',
    }),

    estimatedPrepTime: z.coerce
      .number({
        invalid_type_error: 'Le temps de préparation doit être un nombre',
      })
      .positive('Veuillez saisir un temps de préparation valide'),

    // Utilise z.coerce.boolean() au lieu de z.boolean() pour gérer le "true"/"false" envoyé en texte par form-data dans Postman
    isAvailable: z.coerce.boolean().optional(),

    // Le fichier envoyé dans le champ "image" est consommé par multer (req.file).
    // L'URL Cloudinary est écrite dans req.body.imageUrl par uploadMenuPhoto,
    // c'est donc imageUrl que le schéma doit valider (pas "image").
    imageUrl: z.string().url("L'URL de l'image est invalide").optional(),
  })
  .strict();

// Pour l'update : TOUS les champs sont optionnels, on ne modifie que ce qui est envoyé.
const updateMenuItemSchema = z.object({
  name: z.string().min(1, 'Veuillez renseigner le nom du plat').optional(),
  description: z.string().optional(),
  price: z.coerce
    .number({
      invalid_type_error: 'Le prix doit être un nombre',
    })
    .positive('Veuillez saisir un prix valide supérieur à 0')
    .optional(),
  category: z
    .enum(['starter', 'main', 'dessert', 'drink'], {
      message: 'La catégorie doit être starter, main, dessert ou drink',
    })
    .optional(),
  estimatedPrepTime: z.coerce
    .number({
      invalid_type_error: 'Le temps de préparation doit être un nombre',
    })
    .positive('Veuillez saisir un temps de préparation valide')
    .optional(),
  isAvailable: z.coerce.boolean().optional(),
  imageUrl: z.string().url("L'URL de l'image est invalide").optional(),
});

module.exports = { addMenuItemSchema, updateMenuItemSchema };
