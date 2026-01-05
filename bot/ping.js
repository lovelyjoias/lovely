const fetch = require('node-fetch'); // importa o fetch no Node.js

const URL = 'https://lovely-semi.onrender.com'; // coloque o link do seu site

async function ping() {
    try {
        const res = await fetch(URL);
        console.log(`Ping realizado com sucesso: ${res.status}`);
    } catch (err) {
        console.error('Erro ao pingar o site:', err);
    }
}

// Executa o ping a cada 5 minutos (300000 ms)
setInterval(ping, 300000);

// Executa ping inicial
ping();
