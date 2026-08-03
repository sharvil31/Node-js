# Creating HTTP Server Using Node.js HTTP Module

This project demonstrates how to create an HTTP server using Node.js's built-in `http` module. Unlike the `net` module where we manually handle raw TCP connections and HTTP messages, the `http` module automatically parses incoming HTTP requests and provides easy-to-use `request` and `response` objects.

---

## 📚 What I Learned

- Creating an HTTP server using the `http` module
- Difference between the `net` module and the `http` module
- Understanding the HTTP request-response lifecycle
- Reading request information
  - HTTP Method
  - URL
  - Headers
- Reading the request body using streams
- Sending custom HTTP responses
- Setting response headers
- Understanding why the `data` event only fires when a request contains a body

---

## Project Structure

```
.
├── app.js
└── package.json
```

---

## Creating the HTTP Server

```javascript
import http from "node:http";

const server = http.createServer((request, response) => {});
```

Here,

- `request` → Readable Stream
- `response` → Writable Stream

Unlike TCP sockets, Node.js automatically parses the HTTP request.

---

## Reading Request Information

```javascript
console.log(request.method);
console.log(request.url);
console.log(request.headers);
```

Example Output

```
GET
/

{
  accept: "*/*",
  host: "localhost:4000",
  user-agent: "Thunder Client"
}
```

---

## Reading Request Body

```javascript
request.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

If the client sends

```
POST /

Hello Node.js
```

Output

```
Hello Node.js
```

The request body is received in chunks because the request object is a Readable Stream.

---

## Sending Response

```javascript
response.setHeader("Content-Length", "23");
response.setHeader("Access-Control-Allow-Origin", "*");

response.write("Hello from HTTP Server");
response.end();
```

`response.end()` tells Node.js that the response has finished.

Without it, the browser continues waiting.

---

## Testing with Fetch API

```javascript
const response = await fetch("http://localhost:4000", {
  method: "POST",
  body: "Hello HTTP Module",
});

const data = await response.text();
console.log(data);
```

---

## Understanding the Request Lifecycle

```
Client
   │
   │ HTTP Request
   ▼
HTTP Module
   │
   ├── request (Readable Stream)
   │
   └── response (Writable Stream)
   │
Server Logic
   │
   ▼
HTTP Response
```

---

## HTTP Module vs Net Module

| Net Module                   | HTTP Module                            |
| ---------------------------- | -------------------------------------- |
| Works with raw TCP sockets   | Works with HTTP requests and responses |
| Manually write HTTP response | Automatically handles HTTP protocol    |
| Parse headers manually       | Headers are already parsed             |
| Parse method manually        | `request.method`                       |
| Parse URL manually           | `request.url`                          |
| Raw socket                   | Readable/Writable Streams              |

---

## Key Takeaways

- The `http` module is built on top of TCP.
- Every HTTP request contains a method, URL, headers, and optionally a body.
- `request` is a Readable Stream.
- `response` is a Writable Stream.
- The `data` event is triggered only when the request contains a body.
- Always call `response.end()` to complete the response.
- The `http` module removes the complexity of manually implementing the HTTP protocol over TCP.

---

## Technologies Used

- Node.js
- HTTP Module
- Streams
- Thunder Client
- Fetch API

---

## Conclusion

This project helped me understand how Node.js internally handles HTTP communication. It also clarified how the `http` module simplifies working with HTTP by abstracting away raw TCP details while still exposing powerful stream-based request and response objects.
