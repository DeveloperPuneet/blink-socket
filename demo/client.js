const { Client } = require('../client/client'); 
const blink = new Client('ws://localhost:8080');

blink.cnct(() => {
    blink.log('Connected to server 😎');
    blink.send({ msg: 'Hello Server!' });
});

blink.rcv(data => {
    blink.log('Server says:', data);
});
