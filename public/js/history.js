// history.js

// Função para carregar o histórico de transações do usuário
function loadTransactionHistory() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html'; // Redireciona para a página de login se o usuário não estiver autenticado
        return;
    }

    fetch(`/api/history/${user.id}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Erro: ${data.error}`);
            } else {
                const historyList = document.getElementById('historyList');
                historyList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

                data.transactions.forEach(transaction => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${transaction.type}: R$ ${transaction.amount.toFixed(2)} - ${new Date(transaction.createdAt).toLocaleString()}`;
                    historyList.appendChild(listItem); // Adiciona o item à lista
                });
            }
        })
        .catch(error => {
            console.error('Erro ao carregar o histórico de transações:', error);
            alert('Erro ao carregar o histórico de transações.');
        });
}

document.getElementById('backButton')?.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
});
