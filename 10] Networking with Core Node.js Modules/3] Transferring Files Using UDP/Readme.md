# Transferring Files Using UDP in Node.js

This project demonstrates how to transfer files using the UDP protocol in Node.js with the `dgram` module. Unlike TCP, UDP is a connectionless protocol, meaning it simply sends packets without guaranteeing that they reach the destination or arrive in the correct order.

The purpose of this project is to understand how UDP works internally and why reliable protocols such as TCP are preferred for file transfers.

---

## Technologies Used

- Node.js
- dgram (UDP Socket)
- fs (File Streams)

---

## How It Works

### Client

The client reads a file using a readable stream.

```javascript
const readStream = createReadStream("video.mp4", {
  highWaterMark: 1000,
});
```

The file is divided into chunks of 1000 bytes.

Whenever a chunk is read, it is immediately sent to the UDP server.

```javascript
readStream.on("data", (chunk) => {
  socket.send(chunk, 4000, "SERVER_IP");
});
```

After the entire file has been read, the client sends a special message called `EOF` (End Of File).

```javascript
readStream.on("end", () => {
  socket.send("EOF", 4000, "SERVER_IP");
});
```

---

### Server

The server creates a UDP socket and waits for incoming packets.

```javascript
const socket = dgram.createSocket("udp4");
```

A writable stream is created for the output file.

```javascript
const writeStream = createWriteStream("received-video.mp4");
```

Every UDP packet received is written directly into the file.

```javascript
socket.on("message", (message) => {
  writeStream.write(message);
});
```

When the server receives the `EOF` message, it knows the client has finished sending data.

---

## Why This Doesn't Always Work

Although the program may print:

```
File uploaded successfully
```

this does **not** guarantee that the received file is complete.

UDP provides **no reliability**.

It does **not**

- Guarantee packet delivery
- Guarantee packet order
- Retransmit lost packets
- Detect duplicate packets
- Perform flow control

For example, the client may send:

```
Packet 1
Packet 2
Packet 3
Packet 4
Packet 5
```

The server may receive:

```
Packet 1
Packet 3
Packet 5
Packet 2
```

or

```
Packet 2
Packet 4
Packet 5
```

This behavior is completely normal for UDP.

---

## Another Problem

The client sends packets as quickly as the operating system can read the file.

For a 263 MB file with a chunk size of 1000 bytes:

```
263 MB
≈ 263,000 UDP packets
```

These packets are transmitted almost instantly.

The receiver or the operating system cannot process them fast enough, causing packet loss.

---

## UDP Packet Size

Although the maximum UDP payload is:

```
65,507 bytes
```

Most Ethernet networks have an MTU of about:

```
1500 bytes
```

After subtracting IP and UDP headers, a payload between:

- 512 bytes
- 1024 bytes
- 1200 bytes
- 1400 bytes

is generally considered safe.

---

## Making UDP Reliable

To reliably transfer files over UDP, additional mechanisms must be implemented.

Each packet should contain:

- Sequence Number
- Data
- Checksum

The server should:

- Verify packet order
- Detect missing packets
- Send acknowledgements (ACKs)
- Request retransmission of lost packets

This approach is commonly known as **Reliable UDP (RUDP)**.

---

## Why TCP Is Better for File Transfers

TCP already provides:

- Reliable delivery
- Packet ordering
- Retransmission of lost packets
- Error detection
- Flow control
- Congestion control

This is why protocols such as HTTP, HTTPS, FTP, SSH, and database connections all use TCP instead of UDP.

---

## What I Learned

- Creating UDP servers using the `dgram` module
- Sending and receiving UDP packets
- Streaming files with Node.js
- Understanding why UDP is considered unreliable
- Why acknowledgements and sequence numbers are necessary
- The difference between UDP and TCP for file transfer

---

## Future Improvements

- Add sequence numbers
- Add acknowledgements (ACK)
- Retransmit lost packets
- Verify packet integrity using checksums
- Implement a simple Reliable UDP protocol
