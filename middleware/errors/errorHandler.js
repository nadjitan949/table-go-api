const responses = require('../../messages/responses');

function errorHandler(error, req, res, next) {
  console.log(`Erreur serveur: ${error}`);
  return res.status(responses.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Erreur serveur survenus',
    error: error.message,
  });
}

module.exports = errorHandler;
