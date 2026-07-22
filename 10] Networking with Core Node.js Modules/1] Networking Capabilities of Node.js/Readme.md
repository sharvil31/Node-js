# Networking Capabilities of Node.js

Node.js is much more than a JavaScript runtime. It provides several built-in networking modules that allow developers to build low-level network applications, web servers, and real-time systems without installing any external libraries.

Thanks to its **event-driven** and **non-blocking I/O** architecture, Node.js can efficiently handle thousands of concurrent network connections, making it an excellent choice for scalable backend applications.

---

# Core Networking Modules

```javascript
import dgram from "node:dgram";
import net from "node:net";
import http from "node:http";
import https from "node:https";
import dns from "node:dns";
```

---

# 1. dgram Module (UDP)

The `dgram` module is used to create **UDP (User Datagram Protocol)** servers and clients.

Unlike TCP, UDP is a **connectionless protocol**, meaning data is sent without establishing a connection between the sender and receiver.

## Features

- Connectionless communication
- Very fast
- Low overhead
- No guarantee of packet delivery
- No guarantee of packet ordering

## Common Use Cases

- Online multiplayer games
- Live audio/video streaming
- Voice over IP (VoIP)
- DNS servers
- IoT devices

## Example

```javascript
import dgram from "node:dgram";

const server = dgram.createSocket("udp4");
```

---

# 2. net Module (TCP)

The `net` module provides APIs for creating **TCP (Transmission Control Protocol)** servers and clients.

TCP is a **connection-oriented** protocol that guarantees reliable and ordered delivery of data.

## Features

- Connection-oriented
- Reliable communication
- Error checking
- Ordered packet delivery
- Automatic retransmission of lost packets

## Common Use Cases

- Chat applications
- Database connections
- FTP
- SSH
- Email servers

## Example

```javascript
import net from "node:net";

const server = net.createServer((socket) => {
    console.log("Client Connected");
});
```

---

# 3. http Module

The `http` module is used to create HTTP servers and clients.

HTTP stands for **HyperText Transfer Protocol** and is the protocol used by browsers to communicate with web servers.

The HTTP module is built on top of the **net** module, which means HTTP communication ultimately uses TCP.

## Common Use Cases

- REST APIs
- Backend servers
- Serving HTML pages
- JSON APIs
- Microservices

## Example

```javascript
import http from "node:http";

const server = http.createServer((req, res) => {
    res.end("Hello World");
});

server.listen(3000);
```

---

# 4. https Module

The `https` module creates secure HTTP servers.

The **"S"** in HTTPS stands for **Secure**.

HTTPS encrypts communication using **TLS (Transport Layer Security)**, ensuring that data cannot be easily intercepted or modified.

## Benefits

- Encryption
- Authentication
- Data integrity
- Secure communication

## Common Use Cases

- Banking websites
- E-commerce applications
- Login systems
- Payment gateways
- Secure APIs

## Example

```javascript
import https from "node:https";

const server = https.createServer(options, (req, res) => {
    res.end("Secure Server");
});
```

---

# 5. dns Module

The `dns` module provides DNS (Domain Name System) utilities.

DNS converts human-readable domain names into IP addresses.

Example:

```
google.com
      ↓
142.250.xxx.xxx
```

## Common Operations

- Lookup IPv4 addresses
- Lookup IPv6 addresses
- Reverse lookup
- Resolve MX records
- Resolve TXT records
- Resolve CNAME records

## Example

```javascript
import dns from "node:dns";

dns.lookup("google.com", (err, address) => {
    console.log(address);
});
```

---

# Module Comparison

| Module | Protocol | Purpose | Common Use Cases |
|---------|----------|---------|------------------|
| `dgram` | UDP | Fast connectionless communication | Gaming, Streaming, VoIP, DNS |
| `net` | TCP | Reliable socket communication | Chat apps, FTP, SSH, Databases |
| `http` | HTTP | Web servers & APIs | Websites, REST APIs |
| `https` | HTTPS | Secure web servers | Banking, Authentication, Payments |
| `dns` | DNS | Domain name resolution | Convert domain names into IP addresses |

---

# TCP vs UDP

| Feature | TCP | UDP |
|---------|-----|-----|
| Connection | Connection-oriented | Connectionless |
| Reliability | Guaranteed delivery | No guarantee |
| Packet Order | Maintained | Not guaranteed |
| Speed | Slower | Faster |
| Error Checking | Yes | Minimal |
| Use Cases | HTTP, HTTPS, FTP, SSH | Gaming, Streaming, DNS, VoIP |

---

# Relationship Between Modules

```text
                    Node.js Networking

                          DNS
                           │
              Resolves Domain → IP Address
                           │
           ┌───────────────┴───────────────┐
           │                               │
      TCP (net)                      UDP (dgram)
           │
     ┌─────┴─────┐
     │           │
   HTTP       HTTPS
```

---

# Why Node.js is Great for Networking

- Event-driven architecture
- Non-blocking I/O
- Efficient memory usage
- Handles thousands of concurrent connections
- Excellent for real-time applications
- Built-in networking modules
- Perfect for APIs, chat applications, streaming servers, and microservices

---

# Key Takeaways

- **`dgram`** is used for UDP communication.
- **`net`** provides low-level TCP networking.
- **`http`** is built on top of the `net` module.
- **`https`** extends HTTP by adding TLS encryption.
- **`dns`** resolves domain names into IP addresses.
- Node.js includes these networking modules out of the box, making it easy to build scalable network applications without additional dependencies.