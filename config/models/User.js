const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define o modelo User
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,     // Define o tipo de dado como string
        allowNull: false,           // O campo não pode ser nulo (obrigatório)
        unique: true                // Garante que cada nome de usuário seja único
    },
    password: {
        type: DataTypes.STRING,     // Define o tipo de dado como string
        allowNull: false            // O campo não pode ser nulo (obrigatório)
    }
});

// Exporta o modelo para que possa ser utilizado em outras partes do projeto
module.exports = User;
