// Função para lidar com o envio do formulário de login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }) // Converte os dados em formato JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Login bem-sucedido!');
            // Armazena os dados do usuário no localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'dashboard.html'; // Redireciona para o dashboard
        } else {
            alert('Erro ao fazer login: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error); // Log do erro
        alert('Erro ao fazer login.');
    });
});

// Função para lidar com o envio do formulário de registro
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }) // Envia os dados para o servidor
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Erro ao registrar: ' + data.error);
        } else {
            alert('Usuário registrado com sucesso!');
            window.location.href = 'index.html'; // Redireciona para a página de login
        }
    })
    .catch(error => {
        console.error('Erro ao registrar usuário:', error);
        alert('Erro ao registrar usuário.');
    });
});

// Função para lidar com o envio do formulário de depósito
document.getElementById('depositForm')?.addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    const valorDeposito = parseFloat(document.getElementById('valorDeposito').value);
    const user = JSON.parse(localStorage.getItem('user'));

    // Verificação básica
    if (isNaN(valorDeposito) || valorDeposito <= 0) {
        alert('Por favor, insira um valor válido para depósito.');
        return;
    }

    fetch('/depositar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: user.username, valor: valorDeposito })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Erro ao realizar o depósito: ' + data.error);
        } else {
            alert('Depósito realizado com sucesso!');
            // Atualiza o saldo no localStorage e na tela
            user.saldo = data.saldo;
            localStorage.setItem('user', JSON.stringify(user));
            document.getElementById('saldo').innerText = `Saldo: R$ ${user.saldo.toFixed(2)}`;
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao realizar o depósito.');
    });
});

// Função para carregar os dados do usuário na página de dashboard
function carregarDados() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('username').innerText = user.username;
        document.getElementById('saldo').innerText = `Saldo: R$ ${user.saldo.toFixed(2)}`;
    } else {
        window.location.href = 'index.html'; // Redireciona para login se não estiver autenticado
    }
}

// Função para realizar logout e limpar o localStorage
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html'; // Redireciona para a página de login
}

// Verificação de Logout (caso o botão esteja presente)
document.getElementById('logoutButton')?.addEventListener('click', logout);

// Carregar os dados na página de dashboard, se estiver nessa página
if (document.body.contains(document.getElementById('dashboardPage'))) {
    carregarDados();
}
