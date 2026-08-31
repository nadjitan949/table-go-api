const { User, Otp } = require('../../database/config');
const responses = require('../../messages/responses');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

const registerService = async (req, res) => {
  const { phone } = req.body;
  const existingUser = await User.findOne({ where: { phone } });
  if (existingUser) {
    return res.status(responses.CONFLICT).json({
      success: false,
      message: 'Ce numéro de téléphone est déjà associé à un autre compte',
    });
  }

  const code = generateCode();
  await Otp.destroy({ where: { user: phone } });
  const hashedCode = await bcrypt.hash(code.toString(), 10);

  await Otp.create({
    source: 'register',
    user: phone,
    code: hashedCode,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  return res.status(responses.ACCEPTED).json({
    success: true,
    message: 'Un code de vérification est envoyé à votre numéro de téléphone',
    data: code,
  });
};

const loginService = async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ where: { phone } });
  if (!user) {
    return res.status(responses.UNAUTHORIZED).json({
      success: false,
      message: 'Numéro de téléphone ou mot de passe incorrect',
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(responses.UNAUTHORIZED).json({
      success: false,
      message: 'Numéro de téléphone ou mot de passe incorrect',
    });
  }

  const accessToken = jwt.sign(
    { id: user.id, role: user.status },
    process.env.SECRET_ACCESS_TOKEN,
    { expiresIn: process.env.EXPIRE_IN_ACCESS_TOKEN }
  );
  const refreshToken = jwt.sign(
    { id: user.id, role: user.status },
    process.env.SECRET_REFRESH_TOKEN,
    { expiresIn: process.env.EXPIRE_IN_REFRESH_TOKEN }
  );

  return res.status(responses.ACCEPTED).json({
    success: true,
    message: 'Bienvenu sur votre compte',
    data: user,
    accessToken,
    refreshToken,
  });
};

const forgotPasswordService = async (req, res) => {
  const { phone } = req.body;
  const user = await User.findOne({ where: { phone } });
  if (!user) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: "Cet numéro de téléphone n'est associé à aucun utilisateur",
    });
  }

  const code = generateCode();
  await Otp.destroy({ where: { user: user.phone } });
  const hashedCode = await bcrypt.hash(code.toString(), 10);

  await Otp.create({
    source: 'forgot_password',
    user: user.phone,
    code: hashedCode,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  return res.status(responses.OK).json({
    success: true,
    message: `Confirmer avec le code envoyé au ${phone}`,
    data: code,
  });
};

const resetPasswordService = async (req, res) => {
  const { userId, oldPassword } = req.body;
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(responses.NOT_FOUND).json({
      success: false,
      message: 'Utilisateur introuvable',
    });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(responses.UNAUTHORIZED).json({
      success: false,
      message: 'Ancien mot de passe incorrect',
    });
  }

  const code = generateCode();
  await Otp.destroy({ where: { user: user.phone } });
  const hashedCode = await bcrypt.hash(code.toString(), 10);

  await Otp.create({
    source: 'reset_password',
    user: user.phone,
    code: hashedCode,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  return res.status(responses.OK).json({
    success: true,
    message:
      'Entrer le code de vérification a été envoyé à votre noméro de téléphone',
    data: code,
  });
};

module.exports = {
  registerService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
};
