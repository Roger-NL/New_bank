const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

sequelize.sync()
    .then(() => console.log('Banco de dados sincronizado'))
    .catch(err => console.error('Erro ao sincronizar banco de dados:', err));

// Rota para registrar um novo usuário
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: 'Nome de usuário já está em uso' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPassword
        });

        return res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        return res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
});

// Rota para login de usuário
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: 'Nome de usuário ou senha incorretos' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Nome de usuário ou senha incorretos' });
        }

        return res.status(200).json({
            message: 'Login bem-sucedido',
            user: {
                id: user.id,
                username: user.username,
                saldo: user.saldo
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para depósito
app.post('/api/deposit', async (req, res) => {
    const { userId, amount } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        user.saldo += parseFloat(amount);
        await user.save();

        await Transaction.create({ userId, type: 'Depósito', amount });

        return res.status(200).json({ message: 'Depósito realizado com sucesso', saldo: user.saldo });
    } catch (error) {
        console.error('Erro ao realizar depósito:', error);
        return res.status(500).json({ error: 'Erro ao realizar depósito.' });
    }
});

// Rota para retirada
app.post('/api/withdraw', async (req, res) => {
    const { userId, amount } = req.body;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (user.saldo < amount) {
            return res.status(400).json({ error: 'Saldo insuficiente' });
        }

        user.saldo -= parseFloat(amount);
        await user.save();

        await Transaction.create({ userId, type: 'Retirada', amount });

        return res.status(200).json({ message: 'Retirada realizada com sucesso', saldo: user.saldo });
    } catch (error) {
        console.error('Erro ao realizar retirada:', error);
        return res.status(500).json({ error: 'Erro ao realizar retirada.' });
    }
});

// Rota para transferência
app.post('/api/transfer', async (req, res) => {
    const { userId, transferTo, amount } = req.body;
    try {
        const sender = await User.findByPk(userId);
        const receiver = await User.findOne({ where: { id: transferTo } });

        if (!sender || !receiver) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (sender.saldo < amount) {
            return res.status(400).json({ error: 'Saldo insuficiente' });
        }

        sender.saldo -= parseFloat(amount);
        receiver.saldo += parseFloat(amount);

        await sender.save();
        await receiver.save();

        await Transaction.create({ userId, type: `Transferência para ${receiver.username}`, amount });
        await Transaction.create({ userId: receiver.id, type: `Transferência de ${sender.username}`, amount });

        return res.status(200).json({ message: 'Transferência realizada com sucesso', saldo: sender.saldo });
    } catch (error) {
        console.error('Erro ao realizar transferência:', error);
        return res.status(500).json({ error: 'Erro ao realizar transferência.' });
    }
});

// Rota para obter histórico de transações
app.get('/api/history/:userId', async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { userId: req.params.userId },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ transactions });
    } catch (error) {
        console.error('Erro ao buscar o histórico de transações:', error);
        res.status(500).json({ error: 'Erro ao buscar o histórico de transações.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
