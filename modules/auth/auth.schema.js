const { z } = require('zod');

const registerSchema = z
  .object({
    phone: z
      .string()
      .min(1, 'Veuillez renseigner le numéro de téléphone')
      .regex(/^[0-9+\s]+$/, 'Le numéro de téléphone est invalide'),
  })
  .strict();

const loginSchema = z
  .object({
    phone: z.string().min(1, 'Veuillez renseigner vitre numéro de téléphone'),
    password: z.string().min(1, 'Veullez renseigner votre mot depasse'),
  })
  .strict();

const forgotPasswordSchema = z
  .object({
    phone: z.string().min(1, 'Veuillez indiquer votre numéro de téléphone'),
  })
  .strict();

const resetPasswordSchema = z.object({
    userId: z.number({invalid_type_error: "L'identifiant de l'utilisateur doit être un nombre",}).min(1, "Veuillez renseigner l'identifiant de l'utilisateur"),
    oldPassword: z.string().min(1, 'Veuillez renseigner votre ancien mot de passe'),
}).strict()

module.exports = { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema };
