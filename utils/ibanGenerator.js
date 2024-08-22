// utils/ibanGenerator.js
function generateIban() {
    const countryCode = 'BR'; // Código do país (Brasil)
    const bankCode = Math.floor(1000 + Math.random() * 9000); // Código fictício do banco
    const accountNumber = Math.floor(100000000000 + Math.random() * 900000000000); // Número fictício da conta
    return `${countryCode}${bankCode}${accountNumber}`;
}

module.exports = generateIban;
