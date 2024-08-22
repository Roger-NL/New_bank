// Função para registrar um novo usuário
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const birthDate = document.getElementById('birthDate').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, cpf, birthDate })
        });
        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            window.location.href = 'index.html';
        } else {
            alert(`Erro: ${data.error}`);
        }
    } catch (error) {
        console.error('Erro ao registrar:', error);
        alert('Erro ao registrar usuário.');
    }
});

// Função para login de usuário
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'dashboard.html';
        } else {
            alert(`Erro: ${data.error}`);
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login.');
    }
});

// Função para carregar dados do usuário no dashboard
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('username').textContent = user.username;
    document.getElementById('userId').textContent = user.id;
    document.getElementById('cpf').textContent = user.cpf;
    document.getElementById('birthDate').textContent = new Date(user.birthDate).toLocaleDateString('pt-BR');
    document.getElementById('saldo').textContent = `R$ ${user.saldo.toFixed(2)}`;
}

// Função para depósito
document.getElementById('depositForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const user = JSON.parse(localStorage.getItem('user'));

    try {
        const response = await fetch('/api/deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, amount })
        });
        const data = await response.json();

        if (response.ok) {
            user.saldo = data.saldo;
            localStorage.setItem('user', JSON.stringify(user));
            document.getElementById('saldo').textContent = `R$ ${user.saldo.toFixed(2)}`;
            alert(data.message);
        } else {
            alert(`Erro: ${data.error}`);
        }
    } catch (error) {
        console.error('Erro ao realizar depósito:', error);
        alert('Erro ao realizar depósito.');
    }
});

// Função para retirada
document.getElementById('withdrawForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const user = JSON.parse(localStorage.getItem('user'));

    try {
        const response = await fetch('/api/withdraw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, amount })
        });
        const data = await response.json();

        if (response.ok) {
            user.saldo = data.saldo;
            localStorage.setItem('user', JSON.stringify(user));
            document.getElementById('saldo').textContent = `R$ ${user.saldo.toFixed(2)}`;
            alert(data.message);
        } else {
            alert(`Erro: ${data.error}`);
        }
    } catch (error) {
        console.error('Erro ao realizar retirada:', error);
        alert('Erro ao realizar retirada.');
    }
});

// Função para transferência de saldo
document.getElementById('transferForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const transferTo = document.getElementById('transferTo').value;
    const amount = parseFloat(document.getElementById('transferAmount').value);
    const user = JSON.parse(localStorage.getItem('user'));

    try {
        const response = await fetch('/api/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, transferTo, amount })
        });
        const data = await response.json();

        if (response.ok) {
            user.saldo = data.saldo;
            localStorage.setItem('user', JSON.stringify(user));
            document.getElementById('saldo').textContent = `R$ ${user.saldo.toFixed(2)}`;
            alert(data.message);
        } else {
            alert(`Erro: ${data.error}`);
        }
    } catch (error) {
        console.error('Erro ao realizar transferência:', error);
        alert('Erro ao realizar transferência.');
    }
});

// Função para exibir o histórico de transações
document.getElementById('viewHistoryButton')?.addEventListener('click', () => {
    window.location.href = 'history.html';
});

// Função para logout
document.getElementById('logoutButton')?.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});
