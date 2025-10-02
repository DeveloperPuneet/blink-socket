const WebSocket = require('ws');

class Server {
    constructor(port) {
        this.wss = new WebSocket.Server({ port });
        this.clients = new Set();
        this.rooms = {};
        this._onConnect = null;
        this._onMsg = null;

        this.wss.on('connection', (ws) => { // New client arrives 🥳
            this.clients.add(ws); // Add client
            ws.room = null; // Initialize room

            if (this._onConnect) this._onConnect(ws); // Call on connect?

            ws.on('message', (msg) => { // Receive message event!
                if (this._onMsg) this._onMsg(JSON.parse(msg), ws); // Parse and trigger!
            });

            ws.on('close', () => { // Client leaves 🚪
                this.clients.delete(ws); // Remove the client
                if (ws.room && this.rooms[ws.room]) { // In a room?
                    this.rooms[ws.room].delete(ws); // Remove from room
                    if (this.rooms[ws.room].size === 0) delete this.rooms[ws.room]; // Room empty?
                }
            });
        });

        console.log(`BlinkSocket server running on port ${port}`); // Server started!
    }

    /* Core Short Commands */
    cnct(cb) { this._onConnect = cb; }      // connection 🙏
    rcv(cb) { this._onMsg = cb; }           // receive message ✉️
    send(msg, ws) {                         // send to one 📤
        const data = JSON.stringify(msg); // Stringify message
        if (ws && ws.readyState === WebSocket.OPEN) ws.send(data); // Send if open
    }
    brd(msg) {                               // broadcast all 📢
        const data = JSON.stringify(msg); // Stringify message
        this.clients.forEach(c => c.readyState === WebSocket.OPEN && c.send(data)); // Send to all
    }
    brdEx(ws, msg) {                         // broadcast except ws 🤫
        const data = JSON.stringify(msg); // Stringify message
        this.clients.forEach(c => { // Iterate through clients
            if (c !== ws && c.readyState === WebSocket.OPEN) c.send(data); // Send except one
        });
    }
    join(ws, room) {                         // join room 🏘️
        if (!this.rooms[room]) this.rooms[room] = new Set(); // Create room if needed
        this.rooms[room].add(ws); // Add client to room
        ws.room = room; // Set client's room
    }
    leave(ws) {                              // leave room 🚪
        if (ws.room && this.rooms[ws.room]) { // Check room exists
            this.rooms[ws.room].delete(ws); // Remove from room
            if (this.rooms[ws.room].size === 0) delete this.rooms[ws.room]; // Delete empty room
            ws.room = null; // Set no room
        }
    }
    brdR(room, msg) {                        // broadcast room 📣
        if (!this.rooms[room]) return; // Check room exists
        const data = JSON.stringify(msg); // Stringify message
        this.rooms[room].forEach(c => c.readyState === WebSocket.OPEN && c.send(data)); // Send to room
    }
    disc(ws) {                               // disconnect client 💀
        if (ws) ws.close(); // Close the socket
    }
    cC() { return this.clients.size; }       // clients count 🔢
    cls() { this.wss.close(); }              // close server 🛑

    /* Extra Utility Shortcuts */
    log(msg) { console.log(msg); }           // simple log 📝
    err(msg) { console.error(msg); }         // error message ❗
    all(msg) { this.brd(msg); }              // broadcast (alias) 📢
    one(ws, msg) { this.send(msg, ws); }     // send to one (alias) 📤
    cb(cb) { this._onMsg = cb; }             // set callback ⚙️
    retry(ws, msg) { if(ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg)); } // retry send if open
    rooms() { return Object.keys(this.rooms); } // Return rooms array
    roomSize(room) { return this.rooms[room] ? this.rooms[room].size : 0; } // Get room size
    hasRoom(room) { return !!this.rooms[room]; } // Check room exists
}

module.exports = { Server };
