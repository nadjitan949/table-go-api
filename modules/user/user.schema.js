const { z } = require('zod');

const addUserSchema = z
  .object({
    fullname: z
      .string()
      .min(1, "Veuillez renseigner le nom complet de l'utilisateur"),

    phone: z
      .string()
      .min(1, 'Veuillez renseigner le numéro de téléphone')
      .regex(/^[0-9+\s]+$/, 'Le numéro de téléphone est invalide'),

    status: z.enum(['server', 'cook', 'admin'], {
      errorMap: () => ({
        message: 'Le statut doit être server, cook ou admin',
      }),
    }),

    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
      .regex(
        /[^a-zA-Z0-9]/,
        'Le mot de passe doit contenir au moins un caractère spécial'
      ),
  })
  .strict();

const updateUserSchema = z.object({
  fullname: z
    .string()
    .min(1, "Veuillez renseigner le nom complet de l'utilisateur")
    .optional(),

  phone: z
    .string()
    .min(1, 'Veuillez renseigner le numéro de téléphone')
    .regex(/^[0-9+\s]+$/, 'Le numéro de téléphone est invalide')
    .optional(),

  status: z.enum(['server', 'cook', 'admin'], {
    errorMap: () => ({
      message: 'Le statut doit être server, cook ou admin',
    }),
  }).optional(),
});

const resetUserPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(
      /[^a-zA-Z0-9]/,
      'Le mot de passe doit contenir au moins un caractère spécial'
    ),
});

module.exports = { addUserSchema, updateUserSchema, resetUserPasswordSchema };
