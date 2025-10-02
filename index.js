const { Server } = require('./server/server'); // Import server class 💻
const { Client } = require('./client/client'); // Import client class 🧑‍💻
const cmds = require('./utils/cmds'); // Import commands object 📦

module.exports = {
    Server, // Export server class 🚀
    Client, // Export client class 🧑‍🚀
    ...cmds // Export all commands ⌨️
};
