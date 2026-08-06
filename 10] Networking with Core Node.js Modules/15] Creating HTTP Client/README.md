# Creating an HTTP Client in Node.js

## Overview
This project demonstrates how to build a basic HTTP client and server using Node.js's built-in `http` module.

## What You'll Learn
- Create an HTTP server with `http.createServer()`
- Create an HTTP client with `http.request()`
- Send a POST request
- Read request body using `request.on("data")`
- Send a response with `response.end()`
- Receive the response using `response.on("data")`

## Server
```js
import http from "node:http";

const server = http.createServer((request, response) => {
  console.log(request.method);
  console.log(request.url);

  request.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  response.end("Hello from http server.");
});

server.listen(4000);
```

## Client
```js
import http from "node:http";

const req = http.request({
  host: "192.168.0.113",
  port: 4000,
  method: "POST",
});

req.end("Hii I am client");

req.on("response", (res) => {
  res.on("data", (chunk) => {
    console.log(chunk.toString());
  });
});
```

## Flow
1. Client sends a POST request.
2. Server receives the request body.
3. Server processes the request.
4. Server sends a response.
5. Client reads the response.

## Output
Server:
```
Server started
Got the request
POST
/
Hii I am client
```

Client:
```
Hello from http server.
```

## Key Takeaways
- `http.request()` creates an HTTP client request.
- `request.end()` sends the request and closes it.
- `request.on("data")` reads incoming request data.
- `response.end()` sends the response.
- `response.on("data")` receives response chunks.
