const { User } = require('../../database/config');
const responses = require('../../messages/responses');
const crypto = require('crypto');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

function generateCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

const registerService = async (req, res) => {
  const { phone } = req.body;
  const user = await User.findOne({ where: { phone } });
  if (user) {
    return res.status(responses.CONFLICT).json({
      success: false,
      message: 'Ce numéro de téléphone est déjà associé à un autre compte',
    });
  }

  const code = generateCode();

  return res.status(responses.ACCEPTED).json({
    success: true,
    message: 'Un code de vérification est envoyé à votre numéro de téléphone',
    data: code,
  });
};


module.exports = { registerService };
