const WebSocket = require('ws');

class Server {
    constructor(port) {
        this.wss = new WebSocket.Server({ port });
        this.clients = new Set();
        this.rooms = {};
        this._onConnect = null;
        this._onMsg = null;

        this.wss.on('connection', (ws) => {
            this.clients.add(ws);
            ws.room = null;

            try {
                if (this._onConnect) this._onConnect(ws);
            } catch (err) {
                console.error('Error in onConnect callback:', err);
            }

            ws.on('message', (msg) => {
                try {
                    const data = JSON.parse(msg);
                    if (this._onMsg) this._onMsg(data, ws);
                } catch (err) {
                    console.error('Error parsing message:', err);
                }
            });

            ws.on('close', () => {
                this.clients.delete(ws);
                if (ws.room && this.rooms[ws.room]) {
                    this.rooms[ws.room].delete(ws);
                    if (this.rooms[ws.room].size === 0) delete this.rooms[ws.room];
                }
            });

            ws.on('error', (err) => {
                console.error('Socket error:', err);
            });
        });

        this.wss.on('error', (err) => {
            console.error('Server error:', err);
        });

        console.log(`BlinkSocket server running on port ${port}`);
    }

    cnct(cb) { this._onConnect = cb; }
    rcv(cb) { this._onMsg = cb; }

    send(msg, ws) {
        try {
            const data = JSON.stringify(msg);
            if (ws && ws.readyState === WebSocket.OPEN) ws.send(data);
        } catch (err) {
            console.error('Error sending message to client:', err);
        }
    }

    brd(msg) {
        const data = JSON.stringify(msg);
        this.clients.forEach(c => {
            try {
                if (c.readyState === WebSocket.OPEN) c.send(data);
            } catch (err) {
                console.error('Error broadcasting to client:', err);
            }
        });
    }

    brdEx(ws, msg) {
        const data = JSON.stringify(msg);
        this.clients.forEach(c => {
            try {
                if (c !== ws && c.readyState === WebSocket.OPEN) c.send(data);
            } catch (err) {
                console.error('Error broadcasting to client (except one):', err);
            }
        });
    }

    join(ws, room) {
        if (!this.rooms[room]) this.rooms[room] = new Set();
        this.rooms[room].add(ws);
        ws.room = room;
    }

    leave(ws) {
        if (ws.room && this.rooms[ws.room]) {
            this.rooms[ws.room].delete(ws);
            if (this.rooms[ws.room].size === 0) delete this.rooms[ws.room];
            ws.room = null;
        }
    }

    brdR(room, msg) {
        if (!this.rooms[room]) return;
        const data = JSON.stringify(msg);
        this.rooms[room].forEach(c => {
            try {
                if (c.readyState === WebSocket.OPEN) c.send(data);
            } catch (err) {
                console.error(`Error broadcasting to room ${room}:`, err);
            }
        });
    }

    disc(ws) { if (ws) ws.close(); }
    cC() { return this.clients.size; }
    cls() { this.wss.close(); }

    log(msg) { console.log(msg); }
    err(msg) { console.error(msg); }
    all(msg) { this.brd(msg); }
    one(ws, msg) { this.send(msg, ws); }
    cb(cb) { this._onMsg = cb; }
    retry(ws, msg) { 
        try { 
            if(ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg)); 
        } catch (err) { 
            console.error('Retry send failed:', err);
        }
    }
    rooms() { return Object.keys(this.rooms); }
    roomSize(room) { return this.rooms[room] ? this.rooms[room].size : 0; }
    hasRoom(room) { return !!this.rooms[room]; }
}

module.exports = { Server };
