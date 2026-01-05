const fetch = require('node-fetch');

setInterval(() => {
    fetch('https://lovely-semi.onrender.com')
        .then(() => console.log('Ping enviado!'))
        .catch(err => console.log('Erro no ping:', err));
}, 5 * 60 * 1000); // a cada 5 minutos

console.log('Bot iniciado e pingando o site a cada 5 minutos!');
