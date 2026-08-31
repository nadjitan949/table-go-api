const { z } = require('zod');

const verifyOtpSchema = z
    .object({
        fullname: z.string().min(1, 'Veuillez saisir votre nom complet').optional(),
        newPassword: z
            .string()
            .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
            .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
            .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
            .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
            .regex(
                /[^a-zA-Z0-9]/,
                'Le mot de passe doit contenir au moins un caractère spécial'
            )
            .optional(),
        password: z
            .string()
            .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
            .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
            .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
            .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
            .regex(
                /[^a-zA-Z0-9]/,
                'Le mot de passe doit contenir au moins un caractère spécial'
            )
            .optional(),
        phone: z
            .string()
            .min(1, 'Veuillez renseigner votre numéro de téléphone')
            .regex(/^[0-9+\s]+$/, 'Le numéro de téléphone est invalide'),
        code: z.string().min(1, 'veuillez saisir le code à 6 chiffres'),
    })
    .strict();

const resendOtpSchema = z.object({
    phone: z
        .string()
        .min(1, 'Veuillez fournir votre numéro de téléphone')
        .regex(/^[0-9+\s]+$/, 'Le numéro de téléphone est invalide'),

    source: z.enum(["register", "forgot_password", "reset_password"], { message: "Source invalide" })
}).strict()

module.exports = { verifyOtpSchema, resendOtpSchema };
