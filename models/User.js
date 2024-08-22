const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const generateIban = require('../utils/ibanGenerator'); // Importa a função IBAN

const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => generateIban() // Usa a função para gerar o IBAN
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    saldo: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = User;
