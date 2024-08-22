const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const User = require('./models/User');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Sincronizar o banco de dados
sequelize.sync()
    .then(() => console.log('Banco de dados sincronizado'))
    .catch((err) => console.error('Erro ao sincronizar banco de dados:', err));

// Rota para criar um novo usuário
app.post('/users', async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
            saldo: req.body.saldo || 0.0 // Define o saldo inicial como 0.0
        });
        res.status(201).json(user);
    } catch (error) {
        console.error('Erro ao tentar criar o usuário:', error);
        res.status(400).json({ error: error.message });
    }
});

// Rota para login de usuário
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.status(200).json({
            message: 'Login bem-sucedido',
            user: {
                username: user.username,
                saldo: user.saldo
            }
        });
    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Rota para visualizar o saldo
app.get('/saldo/:username', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.params.username } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json({ saldo: user.saldo });
    } catch (error) {
        console.error('Erro ao tentar buscar o saldo:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para depósito de saldo
app.post('/depositar', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        user.saldo += parseFloat(req.body.valor);
        await user.save(); // Salva o novo saldo no banco de dados
        res.status(200).json({ message: 'Depósito realizado com sucesso', saldo: user.saldo });
    } catch (error) {
        console.error('Erro ao tentar depositar:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para retirada de saldo
app.post('/retirar', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const valorRetirar = parseFloat(req.body.valor);
        if (user.saldo < valorRetirar) {
            return res.status(400).json({ error: 'Saldo insuficiente' });
        }
        user.saldo -= valorRetirar;
        await user.save(); // Atualiza o saldo no banco de dados
        res.status(200).json({ message: 'Retirada realizada com sucesso', saldo: user.saldo });
    } catch (error) {
        console.error('Erro ao tentar retirar saldo:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para transferir saldo entre contas
app.post('/transferir', async (req, res) => {
    const { fromUsername, toUsername, valor } = req.body;

    try {
        const fromUser = await User.findOne({ where: { username: fromUsername } });
        if (!fromUser) {
            return res.status(404).json({ error: 'Usuário remetente não encontrado' });
        }

        const toUser = await User.findOne({ where: { username: toUsername } });
        if (!toUser) {
            return res.status(404).json({ error: 'Usuário destinatário não encontrado' });
        }

        const valorTransferir = parseFloat(valor);
        if (fromUser.saldo < valorTransferir) {
            return res.status(400).json({ error: 'Saldo insuficiente para a transferência' });
        }

        fromUser.saldo -= valorTransferir;
        toUser.saldo += valorTransferir;

        await fromUser.save();
        await toUser.save();

        res.status(200).json({ message: 'Transferência realizada com sucesso', saldoRemetente: fromUser.saldo });
    } catch (error) {
        console.error('Erro ao tentar transferir saldo:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Servidor rodando na porta 3000');
});
