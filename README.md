
```
██████╗ ██╗     ██╗███╗   ██╗██╗  ██╗    ███████╗ ██████╗  ██████╗██╗  ██╗████████╗███████╗
██╔══██╗██║     ██║████╗  ██║██║ ██╔╝    ██╔════╝██╔═══██╗██╔════╝██║  ██║╚══██╔══╝██╔════╝
██████╔╝██║     ██║██╔██╗ ██║█████╔╝     ███████╗██║   ██║██║     ███████║   ██║   █████╗  
██╔══██╗██║     ██║██║╚██╗██║██╔═██╗     ╚════██║██║   ██║██║     ██╔══██║   ██║   ██╔══╝  
██████╔╝███████╗██║██║ ╚████║██║  ██╗    ███████║╚██████╔╝╚██████╗██║  ██║   ██║   ███████╗
╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝    ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
```

# Blink Socket

![Node.js](https://img.shields.io/badge/node-%3E%3D14-green)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Blink Socket is a lightweight WebSocket-based real-time communication utility built with Node.js. It includes a server, client, and CLI helpers for rapid integration into any real-time application.

## Features

- ⚡ Lightweight WebSocket server
- 🔌 Drop-in client implementation
- 🛠️ CLI utilities for quick commands
- 📁 Modular and extensible structure

## Installation

```bash
npm install
```

## Usage

### Start Server

```bash
node server/server.js
```

### Start Client

```bash
node client/client.js
```

## Folder Structure

```
blink-socket/
├── server/          # WebSocket server
├── client/          # Client script
├── utils/           # CLI utilities
└── index.js         # Entry point
```

## Contributing

PRs are welcome! Please follow the guidelines in `CONTRIBUTING.md`.

## License

MIT License. See `LICENSE` for more details.

---

# 📚 Blink Socket — Full Documentation

Welcome to Blink Socket! This guide will help you understand every part of the project, even if you have no programming background. We explain all modules, functions, and how to use them, step by step.

---

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Server Module](#server-module)
- [Client Module](#client-module)
- [Utils/Commands](#utilscommands)
- [Entry Point (`index.js`)](#entry-point-indexjs)
- [Examples](#examples)

---

## Overview

Blink Socket lets computers talk to each other instantly, like a walkie-talkie for apps. It uses something called WebSockets, which is a way for two computers to keep talking without hanging up the phone.

You get:
- A **Server** (the host, like a radio station)
- A **Client** (the listener, like a radio)
- **Utils/Commands** (shortcuts to make things easier)

---

## How It Works

1. The **Server** waits for clients to connect.
2. The **Client** connects to the server.
3. They send messages back and forth instantly.
4. You can use helper commands to do things quickly (like send to everyone, join a group, etc).

---

## Server Module

File: `server/server.js`

The **Server** is like a host at a party. It manages all the guests (clients), keeps track of rooms (groups), and helps everyone talk.

### How to Use

```js
const { Server } = require('blink-socket');
const server = new Server(3000); // 3000 is the port number
```

### Main Functions (for Everyone)

- **cnct(cb)** — Set what happens when a client connects. `cb` is a function that gets the new client.
	- Example: `server.cnct(ws => { console.log('Someone joined!'); });`
- **rcv(cb)** — Set what happens when a message arrives. `cb` gets the message and the client.
	- Example: `server.rcv((msg, ws) => { console.log('Got:', msg); });`
- **send(msg, ws)** — Send a message to one client.
- **brd(msg)** — Broadcast (send) a message to all clients.
- **brdEx(ws, msg)** — Broadcast to everyone except one client.
- **join(ws, room)** — Put a client in a room (group).
- **leave(ws)** — Remove a client from their room.
- **brdR(room, msg)** — Broadcast to everyone in a room.
- **disc(ws)** — Disconnect a client.
- **cC()** — Get the number of connected clients.
- **cls()** — Close the server.

### Extra Shortcuts

- **log(msg)** — Print a message to the console.
- **err(msg)** — Print an error to the console.
- **all(msg)** — Same as `brd(msg)`.
- **one(ws, msg)** — Same as `send(msg, ws)`.
- **cb(cb)** — Set the message handler (same as `rcv`).
- **retry(ws, msg)** — Try to resend a message if possible.
- **rooms()** — List all room names.
- **roomSize(room)** — How many clients in a room?
- **hasRoom(room)** — Does a room exist?

---

## Client Module

File: `client/client.js`

The **Client** is like a guest at the party. It connects to the server and can send/receive messages.

### How to Use

```js
const { Client } = require('blink-socket');
const client = new Client('ws://localhost:3000');
```

### Main Functions

- **cnct(cb)** — What to do when connected to the server.
- **rcv(cb)** — What to do when a message is received.
- **send(msg)** — Send a message to the server.
- **brd(msg)** — Alias for `send(msg)`.
- **disc()** — Disconnect from the server.
- **isC()** — Are we connected?

### Extra Shortcuts

- **log(msg)** — Print a message.
- **err(msg)** — Print an error.
- **retry(msg)** — Try to resend a message.
- **qLen()** — How many messages are waiting to be sent?

---

## Utils/Commands

File: `utils/cmds.js`

This file gives you **50+ super-short helpers** for both server and client. Most are just shortcuts or aliases. You can use them to make your code shorter and easier to read.

### List of Commands (What They Do)

| Command | What it does |
|---------|--------------|
| cnct    | Connection callback |
| rcv     | Receive callback |
| snd     | Send |
| brd     | Broadcast |
| brdR    | Broadcast to room |
| join    | Join room |
| leave   | Leave room |
| cls     | Close (server/client) |
| cC      | Client count |
| isC     | Is connected? |
| opn     | Alias for open |
| msg     | Alias for message |
| hnd     | Handler |
| add     | Add |
| rmv     | Remove |
| all     | All (broadcast) |
| one     | One (send to one) |
| clr     | Clear |
| log     | Log |
| err     | Error |
| ok      | OK |
| no      | No |
| yes     | Yes |
| up      | Up |
| down    | Down |
| left    | Left |
| right   | Right |
| fst     | First |
| lst     | Last |
| mid     | Middle |
| idx     | Index |
| val     | Value |
| get     | Get |
| set     | Set |
| rm      | Remove |
| mk      | Make |
| dl      | Delete |
| on      | On |
| off     | Off |
| fn      | Function |
| cb      | Callback |
| pipe    | Pipe |
| exec    | Execute |
| run     | Run |
| go      | Go |
| stop    | Stop |
| wait    | Wait |
| done    | Done |
| start   | Start |
| end     | End |
| retry   | Retry |

You can use these as shortcuts in your code. For example, instead of writing `server.broadcast()`, you can use `server.brd()`.

---

## Entry Point (`index.js`)

This file brings everything together. When you import from `index.js`, you get the Server, Client, and all the helpers in one place.

```js
const { Server, Client, brd, join, ... } = require('./index');
```

---

## Examples

**demonstration:** [https://github.com/Puneet-Kumar2010/blink-socket-zone](https://github.com/Puneet-Kumar2010/blink-socket-zone)

### Simple Server Example

```js
const { Server } = require('blink-socket');
const server = new Server(3000);
server.cnct(ws => server.log('Client connected!'));
server.rcv((msg, ws) => server.brd({ youSaid: msg }));
```

### Simple Client Example

```js
const { Client } = require('blink-socket');
const client = new Client('ws://localhost:3000');
client.cnct(() => client.log('Connected!'));
client.rcv(msg => client.log('Got:', msg));
client.send({ hello: 'world' });
```

---

## FAQ (For Everyone)

**Q: Do I need to know programming?**
A: No! Just copy the examples and change the messages. The functions are named to be easy to guess.

**Q: What is a port?**
A: Think of it as a channel number on a TV. Both server and client must use the same one to talk.

**Q: What is a room?**
A: A group where only some clients can talk to each other.

**Q: What is a callback?**
A: A function that runs when something happens (like a message arrives).

---

## Need More Help?

Open an issue or ask for help. We want everyone to be able to use Blink Socket!
