# Understanding HTTP Headers Using Node.js `net` Module

This project demonstrates how HTTP responses are built manually using Node.js's low-level `net` module. Instead of relying on the built-in `http` module, we create a raw TCP server and manually send the HTTP status line, headers, and response body.

> This is a great way to understand what happens behind the scenes whenever a browser communicates with a web server.

---

## 📚 What You'll Learn

- Difference between TCP and HTTP
- Structure of an HTTP Response
- HTTP Status Line
- HTTP Headers
- Custom Headers
- CORS Headers
- Why browsers require a blank line between headers and body
- How to stream files over a TCP socket

---

## Project Code

```javascript
import { createReadStream } from "node:fs";
import net from "node:net";

const server = net.createServer((socket) => {
  socket.write("HTTP/1.1 200 OK\r\n");
  socket.write("Content-Type: text/plain\r\n");
  socket.write("Access-Control-Allow-Origin: *\r\n");
  socket.write("Access-Control-Expose-Headers: Hello, name\r\n");
  socket.write("Hello: World\r\n");
  socket.write("name: sharvil\r\n");
  socket.write("\r\n");

  const readStream = createReadStream("numbers.txt");
  readStream.pipe(socket);

  socket.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server started");
});
```

---

# Understanding an HTTP Response

Every HTTP response consists of three parts:

```
Status Line
Headers
Blank Line
Body
```

Example:

```
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 12

Hello World!
```

The blank line tells the client that the headers have ended and the response body begins.

---

# HTTP Status Line

```
HTTP/1.1 200 OK
```

Meaning:

- HTTP Version → HTTP/1.1
- Status Code → 200
- Status Message → OK

This informs the browser that the request completed successfully.

---

# Custom Headers

```
name: sharvil
Hello: World
```

These are custom headers created by the server.

They don't have any predefined meaning in HTTP.

They are useful for sending:

- Application metadata
- Version information
- Custom authentication data
- Request identifiers

Example:

```javascript
const response = await fetch("http://localhost:4000");

console.log(response.headers.get("name"));
console.log(response.headers.get("Hello"));
```

---

# Access-Control-Allow-Origin

```
Access-Control-Allow-Origin: *
```

This is a CORS (Cross-Origin Resource Sharing) header.

It tells browsers that any website is allowed to access this server.

Without this header, browsers block cross-origin requests.

---

# Access-Control-Expose-Headers

```
Access-Control-Expose-Headers: Hello, name
```

Browsers only expose a small set of response headers to JavaScript.

If you want JavaScript to read custom headers like:

```
Hello
name
```

you must explicitly expose them.

Example:

```javascript
const response = await fetch("http://localhost:4000");

console.log(response.headers.get("Hello"));
console.log(response.headers.get("name"));
```

Without `Access-Control-Expose-Headers`, these calls return `null`.

---

# Content-Type

The browser uses this header to determine how to interpret the response body.

Examples:

```
Content-Type: text/plain
Content-Type: text/html
Content-Type: application/json
Content-Type: image/webp
Content-Type: video/mp4
```

---

# Streaming Files

Instead of loading an entire file into memory, Node.js streams it chunk by chunk.

```javascript
const readStream = createReadStream("numbers.txt");
readStream.pipe(socket);
```

Advantages:

- Lower memory usage
- Faster responses
- Ideal for large files
- Better scalability

---

# Request Flow

```
Browser
   │
   │ GET / HTTP/1.1
   ▼
TCP Socket
   │
   ▼
Node.js net.Server
   │
   │ HTTP/1.1 200 OK
   │ Headers
   │ Blank Line
   │ File Stream
   ▼
Browser
```

---

# Why Learn This?

Normally, Node.js's `http` module automatically handles:

- Status Line
- Headers
- Content-Type
- Content-Length
- Response formatting

Using the `net` module helps you understand how HTTP actually works over a raw TCP connection.

Once you understand this, frameworks like Express, Fastify, and even Node's `http` module become much easier to understand.

---

## Key Takeaways

- HTTP is built on top of TCP.
- HTTP responses always contain a status line, headers, a blank line, and a body.
- Custom headers can send additional information to clients.
- CORS headers control which websites can access your server.
- `Access-Control-Expose-Headers` allows JavaScript to read custom headers.
- Streams make transferring files efficient.
- The `http` module is essentially built on top of lower-level TCP sockets.

---

⭐ If this project helped you understand how HTTP works internally, consider giving the repository a star!
