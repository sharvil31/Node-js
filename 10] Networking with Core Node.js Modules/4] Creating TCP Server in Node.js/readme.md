# Creating a TCP Server in Node.js

## Overview

TCP (Transmission Control Protocol) is a connection-oriented protocol that provides reliable communication between two devices. Unlike UDP, TCP guarantees that data is delivered in the correct order without loss or duplication.

Node.js provides the built-in `net` module to create TCP servers and clients without installing any external packages.

In this project, we create a simple TCP server and client to understand how TCP communication works.

---

# What is TCP?

TCP establishes a connection before any data is exchanged. Once connected, both the client and server can send and receive data until either side closes the connection.

Key Features:

- Reliable data transfer
- Connection-oriented communication
- Error checking
- Ordered packet delivery
- Automatic retransmission of lost packets
- Full-duplex communication (both sides can send and receive simultaneously)

---

# Project Structure

```
project/
│
├── app.js        # TCP Server
└── client.js     # TCP Client
```

---

# Creating the TCP Server

Import the Node.js `net` module.

```javascript
import net from "node:net";
```

Create the server.

```javascript
const server = net.createServer((socket) => {});
```

Whenever a client connects, Node.js creates a new socket object representing that connection.

Start the server.

```javascript
server.listen(4000, () => {
  console.log("Server started on port 4000");
});
```

The server now waits for incoming TCP connections.

---

# Creating the TCP Client

Create a connection to the server.

```javascript
const socket = net.createConnection({
  host: "SERVER_IP",
  port: 4000,
});
```

After the TCP handshake is complete, the client and server are connected.

---

# Sending Data

The client sends data using

```javascript
socket.write("Hii");
```

The string is converted into bytes and transmitted through the TCP connection.

---

# Receiving Data

The server listens for incoming data.

```javascript
socket.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

The received data is provided as a Buffer.

Convert it into a string using

```javascript
chunk.toString();
```

---

# Sending a Response

The server can respond back.

```javascript
socket.write("Got your message");
```

The client receives the response.

```javascript
socket.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

This demonstrates two-way communication.

---

# Closing the Connection

After communication is complete, either side can close the connection.

```javascript
socket.end();
```

The opposite side receives the `close` event.

```javascript
socket.on("close", () => {
  console.log("Client Disconnected");
});
```

---

# Handling Errors

If the server is unavailable or the connection fails, the client receives an error event.

```javascript
socket.on("error", () => {
  console.log("Server Lost");
});
```

---

# Communication Flow

```
Server Starts
      │
      ▼
Listening on Port 4000
      │
      ▼
Client Creates Connection
      │
      ▼
TCP Three-Way Handshake
      │
      ▼
Connection Established
      │
      ▼
Client Sends Data
      │
      ▼
Server Receives Buffer
      │
      ▼
Server Processes Data
      │
      ▼
Server Sends Response
      │
      ▼
Client Receives Response
      │
      ▼
Connection Closed
```

---

# TCP Three-Way Handshake

```
Client                      Server

SYN ----------------------->

      <---------------- SYN + ACK

ACK ----------------------->
```

After the handshake, a reliable connection is established.

---

# Understanding the Socket

Every connected client gets its own socket.

```
TCP Server
     │
     ├── Socket (Client 1)
     ├── Socket (Client 2)
     ├── Socket (Client 3)
     └── Socket (Client N)
```

Each socket is an independent communication channel.

Using the socket you can:

- Send data
- Receive data
- Close the connection
- Listen for errors

---

# TCP is Just a Stream of Bytes

TCP doesn't understand:

- HTTP
- JSON
- Images
- Videos

It only transports bytes reliably.

For example,

```javascript
socket.write("Hello");
```

and

```javascript
socket.write("HTTP/1.1 200 OK");
```

are both simply streams of bytes from TCP's perspective.

---

# Difference Between TCP and HTTP

| TCP                         | HTTP                                 |
| --------------------------- | ------------------------------------ |
| Transport protocol          | Application protocol                 |
| Transfers bytes             | Transfers web requests and responses |
| Doesn't understand GET/POST | Defines GET, POST, PUT, DELETE       |
| Reliable communication      | Built on top of TCP                  |

HTTP itself runs over TCP.

---

# Important Socket Events

### data

Triggered whenever data arrives.

```javascript
socket.on("data", callback);
```

### close

Triggered when the connection closes.

```javascript
socket.on("close", callback);
```

### error

Triggered when an error occurs.

```javascript
socket.on("error", callback);
```

---

# What I Learned

- How TCP creates reliable connections
- Creating a TCP server using Node.js
- Creating a TCP client
- Understanding sockets
- Sending and receiving data
- Working with Buffers
- TCP three-way handshake
- Handling connection events
- Error handling
- Difference between TCP and HTTP
- How TCP acts as the foundation for higher-level protocols like HTTP
