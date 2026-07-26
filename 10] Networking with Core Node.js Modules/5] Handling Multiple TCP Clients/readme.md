# Handling Multiple TCP Clients with Node.js

A simple terminal-based chat application built using Node.js and the `net` module. This project demonstrates how a TCP server can handle multiple client connections simultaneously, send private messages to specific clients, and broadcast messages to all connected clients.

---

## 📌 Overview

This project is built to understand how TCP servers manage multiple clients using sockets.

Each connected client has its own socket connection, and the server stores all connected sockets in an array. The server operator can:

- Send a message to a specific client
- Broadcast a message to all connected clients
- Detect client connections
- Detect client disconnections
- Handle server/client errors

This project is similar to the core architecture of real-time chat applications like WhatsApp, Telegram, or Discord, except it runs entirely in the terminal.

---

## 📂 Project Structure

```
.
├── app.js        # TCP Server
├── client.js     # TCP Client
└── package.json
```

---

## 🚀 Technologies Used

- Node.js
- TCP Networking
- net Module
- Event Driven Programming

---

## 🖥️ Server Workflow

```
               TCP Server
            Listening on Port 4000
                     │
     ┌───────────────┼───────────────┐
     │               │               │
     ▼               ▼               ▼
 Client 1         Client 2       Client 3
```

Each client gets its own socket connection.

The server stores every connected socket inside an array.

```js
const clientlists = [];
```

---

## 🔌 Client Connection

Each client connects using

```js
const socket = net.createConnection({
    host: "SERVER_IP",
    port: 4000
});
```

The client can:

- Send messages
- Receive messages
- Detect server shutdown

---

## 📥 Receiving Client Messages

Whenever any client sends data

```
Client
   │
socket.write()
   │
TCP Packet
   │
Server
```

The server receives

```js
socket.on("data", (chunk) => {
    console.log(chunk.toString());
});
```

---

## 💬 Private Messaging

The server operator can send a message to a specific client.

Example

```
0 Hello Client 1
```

The server extracts

```
Client Index = 0
Message = Hello Client 1
```

Then

```js
clientlists[0].write(message);
```

Only Client 1 receives the message.

---

## 📢 Broadcast Messaging

If the server types

```
Hello Everyone
```

The server broadcasts the message.

```js
clientlists.forEach(socket => {
    socket.write(message);
});
```

Every connected client receives it.

---

## 🔄 Connection Events

### Client Connected

```
Client Connected: 10.159.110.23
```

### Client Disconnected

```
10.159.110.23 Client Disconnected
```

### Server Lost

If the server stops unexpectedly

```
Server Lost
```

is displayed on every connected client.

---

## 📊 Project Flow

```
               Client 1
                  │
                  │
                  ▼
             TCP Server
                  │
      ┌───────────┴───────────┐
      ▼                       ▼
 Client 2                 Client 3
```

The server acts as the central message router.

---

## ✨ Features

- Multiple TCP client connections
- Persistent socket communication
- Private messaging
- Broadcast messaging
- Real-time communication
- Connection management
- Error handling
- Terminal-based chat application

---

## 📚 Concepts Learned

- TCP Networking
- Socket Programming
- Node.js net Module
- Event Emitters
- Client-Server Architecture
- Persistent Connections
- Real-time Communication
- Message Routing
- Broadcast Messaging

---

## 🚀 Future Improvements

- Usernames instead of client indexes
- Authentication
- Private chat using usernames
- Chat rooms
- Online users list
- Message timestamps
- Database storage
- Message history
- File sharing
- WebSocket implementation
- React frontend
- End-to-end encryption

---

## 🎯 Conclusion

This project demonstrates the fundamentals of TCP socket programming by implementing a terminal-based chat application. It shows how multiple clients can maintain persistent connections with a server, exchange real-time messages, and communicate through private or broadcast messaging. Understanding these concepts provides a strong foundation for building scalable real-time applications using technologies like WebSockets and Socket.IO.