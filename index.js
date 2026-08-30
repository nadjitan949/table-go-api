const express = require('express');
const app = express();
require('dotenv').config();
const { sequelize } = require('./database/config/index');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function connection() {
  try {
    await sequelize.authenticate();
    console.log('Connexion réussie');

    await sequelize.sync({ alter: true });
    console.log('Base de donnée synchronisé');
  } catch (error) {
    console.log(`Une erreur s'est produite: ${error}`);
  }
}
connection();

app.listen(port, () => {
  console.log(`Serveur en ligne sur http://localhost:${port}`);
});
