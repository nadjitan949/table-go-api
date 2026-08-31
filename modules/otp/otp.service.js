const responses = require('../../messages/responses');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const Otp = require('../../database/model/tables/otp.model');
const User = require('../../database/model/tables/user.model');

function generateCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

const verifyOtpService = async (req, res) => {
  const { phone, code } = req.body;
  const otp = await Otp.findOne({ where: { user: phone } });
  if (!otp) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Aucune demande pour ce profil',
    });
  }

  const isMatch = await bcrypt.compare(code, otp.code);
  if (!isMatch) {
    return res.status(responses.UNAUTHORIZED).json({
      success: false,
      message: 'Code de vérification incorrect !',
    });
  }

  const now = new Date(Date.now());
  if (otp.expiresAt < now) {
    return res.status(responses.UNAUTHORIZED).json({
      success: false,
      message: 'Votre code de vérification a expiré, veuillez redemander',
    });
  }

  if (otp.source === 'register') {
    const { fullname, password } = req.body;
    if (!fullname) {
      return res.status(responses.BAD_REQUEST).json({
        success: false,
        message: 'Veuillez saisir votre nom complet',
      });
    }
    if (!password) {
      return res.status(responses.BAD_REQUEST).json({
        success: false,
        message: 'Veuillez saisir votre mot de passe',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullname,
      phone,
      password: hashedPassword,
    });

    await otp.destroy();

    return res.status(responses.CREATED).json({
      success: true,
      message: 'Votre compte a été crée avec success',
      data: newUser,
    });
  } else if (
    otp.source === 'forgot_password' ||
    otp.source === 'reset_password'
  ) {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(responses.BAD_REQUEST).json({
        success: false,
        message: 'Veuillez fournir votre nouveau mot de passe',
      });
    }

    const user = await User.findOne({ where: { phone: otp.user } });
    if (!user) {
      return res.status(responses.NOT_FOUND).json({
        success: false,
        message: 'Utilisateur introuvable',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });
    await otp.destroy();

    return res.status(responses.OK).json({
      success: true,
      message:
        otp.source === 'forgot_password'
          ? 'Votre mot de passe a été récupéré avec succès !'
          : 'Votre mot de passe a été mis à jour !',
      data: user,
    });
  }
};

const resendOtpService = async (req, res) => {
  const { phone, source } = req.body;

  const whereClause = { user: phone };
  if (source) {
    whereClause.source = source;
  }

  const existingOtp = await Otp.findOne({ where: whereClause });
  if (!existingOtp) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Aucune demande en attente pour ce profil',
    });
  }
  const rawCode = generateCode()
  const hashedCode = await bcrypt.hash(rawCode.toString(), 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await existingOtp.update({
    code: hashedCode,
    expiresAt,
  });

  return res.status(responses.OK).json({
    success: true,
    message: 'Un nouveau code de vérification a été envoyé avec succès',
    data: rawCode, 
  });
};

module.exports = { verifyOtpService, resendOtpService };
