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

            if (this._onConnect) this._onConnect(ws);

            ws.on('message', (msg) => {
                if (this._onMsg) this._onMsg(JSON.parse(msg), ws);
            });

            ws.on('close', () => {
                this.clients.delete(ws);
                if (ws.room && this.rooms[ws.room]) {
                    this.rooms[ws.room].delete(ws);
                    if (this.rooms[ws.room].size === 0) delete this.rooms[ws.room];
                }
            });
        });

        console.log(`BlinkSocket server running on port ${port}`);
    }

    /* Core Short Commands */
    cnct(cb) { this._onConnect = cb; }      // connection
    rcv(cb) { this._onMsg = cb; }           // receive message
    send(msg, ws) {                         // send to one
        const data = JSON.stringify(msg);
        if (ws && ws.readyState === WebSocket.OPEN) ws.send(data);
    }
    brd(msg) {                               // broadcast all
        const data = JSON.stringify(msg);
        this.clients.forEach(c => c.readyState === WebSocket.OPEN && c.send(data));
    }
    brdEx(ws, msg) {                         // broadcast except ws
        const data = JSON.stringify(msg);
        this.clients.forEach(c => {
            if (c !== ws && c.readyState === WebSocket.OPEN) c.send(data);
        });
    }
    join(ws, room) {                         // join room
        if (!this.rooms[room]) this.rooms[room] = new Set();
        this.rooms[room].add(ws);
        ws.room = room;
    }
    leave(ws) {                              // leave room
        if (ws.room && this.rooms[ws.room]) {
            this.rooms[ws.room].delete(ws);
            if (this.rooms[ws.room].size === 0) delete this.rooms[ws.room];
            ws.room = null;
        }
    }
    brdR(room, msg) {                        // broadcast room
        if (!this.rooms[room]) return;
        const data = JSON.stringify(msg);
        this.rooms[room].forEach(c => c.readyState === WebSocket.OPEN && c.send(data));
    }
    disc(ws) {                               // disconnect client
        if (ws) ws.close();
    }
    cC() { return this.clients.size; }       // clients count
    cls() { this.wss.close(); }              // close server

    /* Extra Utility Shortcuts */
    log(msg) { console.log(msg); }
    err(msg) { console.error(msg); }
    all(msg) { this.brd(msg); }
    one(ws, msg) { this.send(msg, ws); }
    cb(cb) { this._onMsg = cb; }
    retry(ws, msg) { if(ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg)); }
    rooms() { return Object.keys(this.rooms); }
    roomSize(room) { return this.rooms[room] ? this.rooms[room].size : 0; }
    hasRoom(room) { return !!this.rooms[room]; }
}

module.exports = { Server };
