// Função para lidar com o envio do formulário de registro
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Envia os dados para a rota /users usando o método POST
    fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }) // Converte os dados em formato JSON
    })
    .then(response => response.json()) // Converte a resposta para JSON
    .then(data => {
        if (data.error) {
            alert('Erro ao registrar o usuário: ' + data.error);
        } else {
            alert('Usuário registrado com sucesso!');
            window.location.href = 'index.html'; // Redireciona para a página de login após o registro
        }
    })
    .catch(error => {
        console.error('Erro:', error); // Log do erro
        alert('Erro ao registrar o usuário.');
    });
});

// Função para lidar com o envio do formulário de login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Envia os dados para a rota /login usando o método POST
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }) // Converte os dados em formato JSON
    })
    .then(response => response.json()) // Converte a resposta para JSON
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

// Função para carregar os dados do usuário na página de dashboard
function carregarDados() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('username').innerText = user.username;
        document.getElementById('saldo').innerText = `Saldo: R$ ${user.saldo}`;
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
