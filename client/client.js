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
            try {
                if (this._onOpen) this._onOpen();
            } catch (err) {
                console.error('Error in onOpen callback:', err);
            }

            this.queue.forEach(msg => this.send(msg));
            this.queue = [];
        });

        this.ws.on('message', (msg) => {
            try {
                const data = JSON.parse(msg);
                if (this._onMsg) this._onMsg(data);
            } catch (err) {
                console.error('Error parsing message:', err);
            }
        });

        this.ws.on('close', () => setTimeout(() => this._connect(), 1000));

        this.ws.on('error', (err) => console.error('WebSocket error:', err));
    }

    cnct(cb) { this._onOpen = cb; }
    rcv(cb) { this._onMsg = cb; }

    send(msg) {
        try {
            const data = JSON.stringify(msg);
            if (this.ws.readyState === WebSocket.OPEN) this.ws.send(data);
            else this.queue.push(msg);
        } catch (err) {
            console.error('Error sending message:', err);
        }
    }

    brd(msg) { this.send(msg); }
    disc() { 
        try { 
            if(this.ws) this.ws.close(); 
        } catch (err) { 
            console.error('Error disconnecting:', err);
        }
    }

    isC() { return this.ws.readyState === WebSocket.OPEN; }
    log(msg) { console.log(msg); }
    err(msg) { console.error(msg); }

    retry(msg) { 
        try { 
            if(this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(msg)); 
        } catch (err) { 
            console.error('Retry send failed:', err);
        }
    }

    qLen() { return this.queue.length; }
}

module.exports = { Client };
