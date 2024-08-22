// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // O banco de dados será armazenado neste arquivo
});

module.exports = sequelize;
