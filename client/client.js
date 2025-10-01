const WebSocket = require('ws');

class Client {
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.queue = [];
        this._onMsg = null;
        this._onOpen = null;
        this._connect();
    }

    _connect() {
        this.ws = new WebSocket(this.url);

        this.ws.on('open', () => {
            if (this._onOpen) this._onOpen();
            this.queue.forEach(msg => this.send(msg));
            this.queue = [];
        });

        this.ws.on('message', (msg) => {
            if (this._onMsg) this._onMsg(JSON.parse(msg));
        });

        this.ws.on('close', () => setTimeout(() => this._connect(), 1000));
    }

    /* Short Commands */
    cnct(cb) { this._onOpen = cb; }     // connection
    rcv(cb) { this._onMsg = cb; }       // receive
    send(msg) {                         // send
        const data = JSON.stringify(msg);
        if (this.ws.readyState === WebSocket.OPEN) this.ws.send(data);
        else this.queue.push(msg);
    }
    brd(msg) { this.send(msg); }        // alias
    disc() { this.ws.close(); }         // disconnect
    isC() { return this.ws.readyState === WebSocket.OPEN; } // is connected

    /* Extra Shortcuts */
    log(msg) { console.log(msg); }
    err(msg) { console.error(msg); }
    retry(msg) { if(this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(msg)); }
    qLen() { return this.queue.length; }
}

module.exports = { Client };
