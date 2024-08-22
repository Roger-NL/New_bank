// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
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
        defaultValue: 0.0 // Saldo inicial padrão
    }
}, {
    timestamps: true
});

module.exports = User;
