const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Função para gerar um IBAN simples como ID
function generateIban() {
    const countryCode = 'BR'; // Código do país (Brasil)
    const bankCode = Math.floor(1000 + Math.random() * 9000); // Código fictício do banco
    const accountNumber = Math.floor(100000000000 + Math.random() * 900000000000); // Número fictício da conta
    return `${countryCode}${bankCode}${accountNumber}`;
}

const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
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
    timestamps: true,
    hooks: {
        beforeCreate: (user) => {
            user.id = generateIban(); // Gerar o IBAN antes de salvar
        }
    }
});

module.exports = User;
