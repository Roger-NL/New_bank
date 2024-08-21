// Lidar com o envio do formulário de registro
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    // Captura os valores dos campos de entrada
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
        // Feedback para o usuário
        alert('Usuário registrado com sucesso!');
    })
    .catch(error => {
        console.error('Erro:', error); // Log do erro
        alert('Erro ao registrar o usuário.');
    });
});

// Lidar com o envio do formulário de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    // Captura os valores dos campos de entrada
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
        } else {
            alert('Erro ao fazer login: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Erro:', error); // Log do erro
        alert('Erro ao fazer login.');
    });
});
