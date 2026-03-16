const WebSocket = require('ws');
const http = require('http');

// --- THE WSS TRACKER LOGIC ---
function startTracker() {
    const SERVER_URL = 'wss://p1.mcraft.fun/socket'; // Double check this URL in F12
    const proton = new WebSocket(SERVER_URL, {
        origin: 'https://mcraft.fun'
    });

    proton.on('open', () => {
        console.log('✅ PROTON CONNECTED');
        // Send join packet
        proton.send(JSON.stringify({ type: "login", name: "Proton_Vercel" }));
    });

    proton.on('message', (data) => {
        try {
            const msg = JSON.parse(data.toString());
            if (msg.x !== undefined) {
                console.log(`📍 [LIVE] X: ${msg.x.toFixed(2)} Y: ${msg.y.toFixed(2)}`);
            }
        } catch (e) {}
    });

    proton.on('close', () => {
        console.log('🔄 Connection lost. Retrying in 5s...');
        setTimeout(startTracker, 5000);
    });
}

// --- THE VERCEL KEEP-ALIVE ---
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Proton Node.js Client is active.');
});

startTracker();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
