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

module.exports = { registerSchema, loginSchema };
