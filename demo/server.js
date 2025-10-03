const {Server} = require('../server/server');
const blink = new Server(8080);

blink.cnct(ws => {
    blink.log('New client connected!');
    blink.one(ws, { msg: 'Welcome to BlinkSocket 🚀' });
});

blink.rcv((data, ws) => {
    blink.log('Received:', data);
    blink.brdEx(ws, { msg: `Someone said: ${data.msg}` });
});
