const express = require('express');
const path = require('path');
const sequelize = require('./config/database'); // Importa a configuração do banco de dados
const User = require(path.join(__dirname, 'models', 'User')); // Importa o modelo User

const app = express();

// Middleware para tratar requisições com JSON
app.use(express.json());

// Sincronizar banco de dados e modelo de usuário
sequelize.sync()
    .then(() => {
        console.log('Banco de dados sincronizado');
    })
    .catch((err) => {
        console.error('Erro ao sincronizar banco de dados:', err);
    });

// Rota para criar um novo usuário
app.post('/users', async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            password: req.body.password
        });
        res.status(201).json(user);
    } catch (error) {
        // Captura e retorna detalhes dos erros de validação
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: error.errors.map(e => e.message) });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

// Rota para login de usuário
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Verifica se a senha fornecida é igual à senha armazenada
        if (user.password === req.body.password) {
            return res.status(200).json({ message: 'Login bem-sucedido', user });
        } else {
            return res.status(401).json({ error: 'Senha incorreta' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
