const WebSocket = require('ws'); // You may need to run 'npm install ws'

// Use the actual game server URL you found in your logs
const SERVER_URL = 'wss://p1.mcraft.fun/socket'; 

const proton = new WebSocket(SERVER_URL, {
    origin: 'https://mcraft.fun', // Servers check this to make sure you're 'playing' on their site
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PROTON-CLIENT/1.0'
    }
});

proton.on('open', () => {
    console.log('--- PROTON CONNECTED ---');
    
    // Most games need a 'join' or 'login' packet first
    const loginPacket = JSON.stringify({
        type: "login",
        name: "ProtonUser",
        skin: 0
    });
    
    proton.send(loginPacket);
});

proton.on('message', (data) => {
    try {
        const msg = JSON.parse(data.toString());
        
        // This is the "Coord Checker" logic
        if (msg.x !== undefined && msg.y !== undefined) {
            console.log(`[COORD] X: ${msg.x.toFixed(2)} | Y: ${msg.y.toFixed(2)}`);
        }
        
    } catch (e) {
        // Handle non-JSON or binary data here
    }
});

proton.on('close', () => {
    console.log('--- PROTON DISCONNECTED ---');
});

proton.on('error', (err) => {
    console.error('--- PROTON ERROR ---', err.message);
});
