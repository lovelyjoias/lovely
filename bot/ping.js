import fetch from "node-fetch";

const URL = "https://lovely-semi.onrender.com"; // seu site

console.log("Bot iniciado, pingando site a cada 5 minutos...");

async function ping() {
    try {
        const res = await fetch(URL);
        console.log(`Ping enviado: ${res.status} - ${new Date().toLocaleTimeString()}`);
    } catch (err) {
        console.error("Erro ao pingar:", err.message);
    }
}

// Ping inicial
ping();

// Ping a cada 5 minutos
setInterval(ping, 5 * 60 * 1000);
