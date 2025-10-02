const WebSocket = require('ws');

class Client {
    constructor(url) {
        this.url = url; // Store server URL 📍
        this.ws = null; // WebSocket instance 🔌
        this.queue = []; // Message queue 📥
        this._onMsg = null; // Message callback function ✉️
        this._onOpen = null; // Open callback function 🔓
        this._connect(); // Initial connection attempt 🔗
    }

    _connect() {
        this.ws = new WebSocket(this.url); // Create WebSocket instance

        this.ws.on('open', () => { // On connection open
            if (this._onOpen) this._onOpen(); // Execute open callback 🗣️
            this.queue.forEach(msg => this.send(msg)); // Send queued messages
            this.queue = []; // Clear message queue 🗑️
        });

        this.ws.on('message', (msg) => { // On message received
            if (this._onMsg) this._onMsg(JSON.parse(msg)); // Parse and execute callback
        });

        this.ws.on('close', () => setTimeout(() => this._connect(), 1000)); // Reconnect on close 🔄
    }

    /* Short Commands */
    cnct(cb) { this._onOpen = cb; }     // connection 🤝
    rcv(cb) { this._onMsg = cb; }       // receive 📨
    send(msg) {                         // send 📤
        const data = JSON.stringify(msg); // Stringify message data
        if (this.ws.readyState === WebSocket.OPEN) this.ws.send(data); // Send if connected 🚀
        else this.queue.push(msg); // Queue if not connected ⏳
    }
    brd(msg) { this.send(msg); }        // alias 🎭
    disc() { this.ws.close(); }         // disconnect 🚪
    isC() { return this.ws.readyState === WebSocket.OPEN; } // is connected? 🤔

    /* Extra Shortcuts */
    log(msg) { console.log(msg); } // Log message 📝
    err(msg) { console.error(msg); } // Log error message 🚨
    retry(msg) { if(this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(msg)); } // Retry sending if open
    qLen() { return this.queue.length; } // Queue length getter 📏
}

module.exports = { Client }; // Export client class ✅