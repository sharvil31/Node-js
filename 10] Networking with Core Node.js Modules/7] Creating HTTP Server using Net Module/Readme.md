# Creating an HTTP Server Using the Node.js `net` Module

This project demonstrates how HTTP works under the hood by creating a simple HTTP server using Node.js's low-level **`net` module** instead of the built-in `http` module.

Unlike `http.createServer()`, the `net` module only provides raw TCP sockets. This means we manually write the HTTP response and stream files directly to the client, helping us understand how the HTTP protocol is built on top of TCP.

---

## Technologies Used

- Node.js
- net Module
- fs Module
- Streams
- TCP
- HTTP Protocol

---

## Code

```javascript
import { createReadStream } from "node:fs";
import net from "node:net";

const server = net.createServer((socket) => {
  socket.write("HTTP/1.1\n\n");

  const readStream = createReadStream("river.webp");

  readStream.pipe(socket);

  readStream.on("end", () => {
    console.log("File ended");
  });

  socket.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  socket.on("close", () => {
    console.log(socket.remoteAddress, ": Client disconnected");
  });

  socket.on("error", () => {
    console.log("Client Lost");
  });

  console.log("Client Connected", socket.remoteAddress);
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on port 4000");
});
```

---

# How It Works

## 1. Creating a TCP Server

```javascript
const server = net.createServer((socket) => {});
```

Every time a client connects, Node.js creates a new TCP socket representing that connection.

```
Browser
    │
 TCP Connection
    │
Socket
```

---

## 2. Browser Sends an HTTP Request

When visiting

```
http://localhost:4000
```

the browser sends something similar to:

```
GET / HTTP/1.1
Host: localhost:4000
User-Agent: Chrome
Accept: */*
```

The request is plain text sent over a TCP connection.

You can view it using:

```javascript
socket.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

---

## 3. Sending an HTTP Response

```javascript
socket.write("HTTP/1.1\n\n");
```

Instead of using the `http` module, we manually send the HTTP response.

A proper HTTP response should be:

```javascript
socket.write("HTTP/1.1 200 OK\r\n" + "Content-Type: image/webp\r\n" + "\r\n");
```

The browser reads these headers before displaying the file.

---

## 4. Streaming the Image

```javascript
const readStream = createReadStream("river.webp");
```

A readable stream loads the file in small chunks rather than loading the entire file into memory.

```
Disk
 │
 ▼
Readable Stream
```

---

## 5. Piping Data to the Client

```javascript
readStream.pipe(socket);
```

The stream automatically transfers every chunk to the TCP socket.

```
river.webp
      │
      ▼
Readable Stream
      │
      ▼
TCP Socket
      │
      ▼
Browser
```

This is memory-efficient and ideal for large files.

---

## 6. Stream Completion

```javascript
readStream.on("end", () => {
  console.log("File ended");
});
```

Executed when the last chunk has been sent.

---

## 7. Connection Events

### Client Connected

```javascript
console.log("Client Connected", socket.remoteAddress);
```

Displays the client's IP address.

### Client Disconnected

```javascript
socket.on("close", () => {});
```

Runs after the TCP connection closes.

### Connection Error

```javascript
socket.on("error", () => {});
```

Handles unexpected connection failures.

---

## 8. Listening on All Network Interfaces

```javascript
server.listen(4000, "0.0.0.0");
```

The server accepts connections from:

- localhost
- Devices on the same Wi-Fi
- Local network IP addresses

Example:

```
http://192.168.x.x:4000
```

---

# Complete Flow

```
Browser

     GET / HTTP/1.1
             │
             ▼
      TCP Connection
             │
             ▼
      net.createServer()
             │
             ▼
          Socket
             │
             ▼
HTTP Response Headers
             │
             ▼
createReadStream()
             │
             ▼
      river.webp
             │
             ▼
      pipe(socket)
             │
             ▼
         Browser
             │
             ▼
      Image Displayed
```

---

# Key Concepts Learned

- TCP is the transport layer used by HTTP.
- HTTP is simply a protocol built on top of TCP.
- The `net` module provides raw TCP sockets.
- HTTP responses can be written manually.
- Streams efficiently transfer large files.
- `pipe()` automatically moves data from readable streams to writable streams.
- Browsers send HTTP requests as plain text over TCP.

---

# What I Learned

Building an HTTP server using the `net` module helped me understand how browsers communicate with servers at a lower level. Instead of relying on Node.js's `http` module, manually writing HTTP responses and streaming files reveals what actually happens behind the scenes when a browser loads a webpage or downloads an asset.

This exercise strengthened my understanding of TCP sockets, HTTP message formatting, streams, and file transfer in Node.js.
