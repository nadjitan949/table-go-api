const { Otp, User } = require('../../database/config');
const responses = require('../../messages/responses');
const bcrypt = require('bcrypt');

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

module.exports = { verifyOtpService };
