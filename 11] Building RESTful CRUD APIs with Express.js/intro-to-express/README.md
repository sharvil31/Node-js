# Express.js Basics

A beginner Express.js project created while learning the fundamentals of **Express.js** and how it works with Node.js HTTP servers.

## What I Learned

- Creating an Express application with `express()`
- Creating GET routes with `app.get()`
- Sending responses with `res.send()`
- Using `res.end()` with Express
- Disabling the `X-Powered-By` header
- Starting an Express server with `app.listen()`
- Understanding how Express can be passed to Node's `http.createServer()`
- Understanding the relationship between Node.js HTTP and Express.js

## Example

```js
import express from "express";
import http from "node:http";

const app = express();

app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", (req, res) => {
  res.send("Hello Test!");
});

app.listen(4000, () => {
  console.log("Example app listening on port 4000");
});
```

## Express vs Node.js HTTP

With Node.js HTTP, responses are commonly handled using:

```js
res.setHeader("Content-Type", "text/html; charset=utf8");
res.end("Hello World!");
```

Express provides a simpler API:

```js
res.send("Hello World!");
```

Express also provides routing methods such as:

```js
app.get()
app.post()
app.put()
app.delete()
```

## Important Note

An Express application can also be passed to Node's HTTP server:

```js
const server = http.createServer(app);

server.listen(3000);
```

However, `server.listen()` and `app.listen()` should not both be used unless there is a specific reason to run two servers.

## Learning Goal

This project is part of my Node.js and backend development learning journey. The goal is to understand how Express builds on top of Node.js HTTP functionality and makes server-side application development easier.

## Tech Stack

- Node.js
- Express.js
- JavaScript
- ES Modules
