# 📂 Transferring Files Using TCP in Node.js

A simple demonstration of how to transfer files between a TCP client and server using Node.js Streams. This project showcases both **file upload (Client → Server)** and **file download (Server → Client)** by leveraging TCP sockets and the Node.js Stream API.

---

## 📖 Overview

TCP is a reliable, connection-oriented protocol that guarantees:

- Reliable delivery
- Ordered packets
- Error checking
- Automatic retransmission of lost packets
- Flow control
- Congestion control

Since a TCP socket is a **Duplex Stream**, it can both read and write data simultaneously. This makes it ideal for transferring large files efficiently without loading the entire file into memory.

---

# 📌 Project Structure

```

.
├── app.js          # TCP Server
├── client.js       # TCP Client
├── video.mp4       # Sample file
└── README.md

```

---

# 🚀 Technologies Used

- Node.js
- TCP (net module)
- File System Streams (fs)
- Readable Streams
- Writable Streams

---

# 📤 Upload Flow (Client → Server)

The client reads the file from disk using a Readable Stream.

```js
const readStream = createReadStream("video.mp4");
```

A TCP connection is established.

```js
const socket = net.createConnection({
  host: "SERVER_IP",
  port: 4000,
});
```

The file is streamed directly into the socket.

```js
readStream.pipe(socket);
```

On the server, incoming bytes are written to a file.

```js
const writeStream = createWriteStream("video.mp4");

socket.pipe(writeStream);
```

### Data Flow

```

Client Disk
│
▼
Read Stream
│
▼
TCP Socket
══════════════════════
TCP Network
══════════════════════
▼
TCP Socket
▼
Write Stream
▼
Server Disk

```

---

# 📥 Download Flow (Server → Client)

The same logic works in reverse.

Server:

```js
const readStream = createReadStream("video.mp4");

readStream.pipe(socket);
```

Client:

```js
const writeStream = createWriteStream("video.mp4");

socket.pipe(writeStream);
```

### Data Flow

```

Server Disk
│
▼
Read Stream
│
▼
TCP Socket
══════════════════════
TCP Network
══════════════════════
▼
TCP Socket
▼
Write Stream
▼
Client Disk

```

---

# 📦 Why Streams?

Instead of loading an entire file into memory,

❌ Bad

```

1 GB File
↓

Memory
↓

Send

```

Node.js sends the file in small chunks.

✅ Good

```

64 KB
↓

Send

↓

64 KB
↓

Send

↓

64 KB
↓

Send

```

This allows even multi-gigabyte files to be transferred efficiently.

---

# 🔄 What does pipe() do?

Instead of manually handling every chunk:

```js
socket.on("data", (chunk) => {
  writeStream.write(chunk);
});
```

Node.js provides a cleaner solution.

```js
socket.pipe(writeStream);
```

`pipe()` automatically:

- Reads incoming data
- Writes data
- Handles backpressure
- Pauses when necessary
- Resumes automatically
- Ends the destination stream

---

# 📊 Upload Pipeline

```

video.mp4
│
▼
createReadStream()
│
▼
Socket
══════════════════════
TCP
══════════════════════
▼
Socket
▼
createWriteStream()
▼
video.mp4

```

---

# 📊 Download Pipeline

```

video.mp4
│
▼
createReadStream()
│
▼
Socket
══════════════════════
TCP
══════════════════════
▼
Socket
▼
createWriteStream()
▼
video.mp4

```

---

# ⚠️ ECONNRESET

```

Error: ECONNRESET

```

This means the TCP connection was unexpectedly closed while data was still being read.

Common reasons:

- Server stopped unexpectedly
- Socket destroyed manually
- Network interruption
- Connection closed before transfer completed

---

# 📚 Key Concepts Learned

- TCP Communication
- Client-Server Architecture
- Duplex Streams
- Readable Streams
- Writable Streams
- File Upload
- File Download
- Stream Piping
- Backpressure Handling
- Chunk-based Data Transfer
- Reliable File Transfer
- Node.js net Module
- Node.js fs Streams

---

# 🎯 Conclusion

A TCP socket is simply a stream of bytes. File transfer is achieved by connecting file streams to TCP sockets using `pipe()`. Node.js automatically manages buffering, chunking, backpressure, and stream completion, making it possible to transfer files of any size efficiently with minimal memory usage.
