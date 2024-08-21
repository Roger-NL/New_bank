const { Sequelize } = require('sequelize');

// Cria uma nova instância do Sequelize, configurada para usar SQLite como o banco de dados
const sequelize = new Sequelize({
    dialect: 'sqlite',           // Especifica que o SQLite será utilizado como banco de dados
    storage: './database.sqlite'  // Define o caminho onde o arquivo do banco de dados SQLite será armazenado
});

// Teste a conexão para garantir que o banco de dados está configurado corretamente
sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
    })
    .catch(err => {
        console.error('Não foi possível conectar ao banco de dados:', err);
    });

module.exports = sequelize;
