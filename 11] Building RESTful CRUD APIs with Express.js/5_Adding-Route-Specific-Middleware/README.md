# Adding Global Middleware with `app.use()` in Express

## 📌 Overview

While learning Express.js, I learned how to add **global middleware** using the `app.use()` method.

Middleware functions run during the request-response cycle and can perform tasks such as:

- Logging requests
- Parsing request bodies
- Authentication and authorization
- Modifying the request or response
- Error handling
- Running common logic for multiple routes

---

## 🔹 What is Global Middleware?

A global middleware is middleware that can be executed for **multiple routes** instead of being attached to only one specific route.

For example:

```js
app.use((req, res, next) => {
  console.log(req.url);
  next();
});
```

Because no specific path is provided, this middleware can match requests coming to different routes.

---

## 🔹 Understanding `app.use()`

The basic syntax is:

```js
app.use(middlewareFunction);
```

A middleware function generally receives three parameters:

```js
(req, res, next);
```

- `req` → Request object
- `res` → Response object
- `next` → Function used to continue to the next matching middleware or route

Example:

```js
app.use((req, res, next) => {
  console.log(req.headers);
  console.log(req.url);

  next();
});
```

---

## 🔹 How `next()` Works

Express processes middleware and routes **from top to bottom**, in the order in which they are registered.

For example:

```js
app.use((req, res, next) => {
  console.log("Global Middleware");
  next();
});

app.get("/login", (req, res) => {
  res.end("Logged in");
});
```

When `/login` is requested:

```text
GET /login
     ↓
Global Middleware
     ↓
next()
     ↓
/login route
     ↓
Response
```

Calling `next()` tells Express:

> Continue searching from this point for the next middleware or route that matches the request.

---

## 🔹 Middleware Order Matters

Consider:

```js
app.get("/login", (req, res) => {
  res.end("Logged in");
});

app.use((req, res, next) => {
  console.log("Global Middleware");
  next();
});
```

For a request to `/login`, the `/login` route executes first.

Since:

```js
res.end("Logged in");
```

ends the response, Express does not continue to the middleware below it.

Therefore, the global middleware will not execute for that request.

### Important Rule

> Middleware registered before a route can run before that route. Middleware registered after a route will only run if the request reaches it.

---

## 🔹 Express Built-in Middleware

Express also provides built-in middleware.

One common example is:

```js
app.use(express.json());
```

`express.json()` creates and returns a middleware function that parses incoming JSON request bodies.

For example:

```js
app.use(express.json());

app.post("/user", (req, res) => {
  console.log(req.body);
  res.end("Post Sharvil");
});
```

If the client sends:

```json
{
  "name": "Sharvil"
}
```

Express parses the JSON and makes it available through:

```js
req.body;
```

Conceptually:

```text
JSON Request Body
       ↓
express.json()
       ↓
Parse JSON
       ↓
req.body
       ↓
next()
       ↓
POST /user route
```

---

## 🔹 `express.json()` is a Middleware Factory

An important thing I learned is that:

```js
express.json();
```

returns a middleware function.

Conceptually:

```js
const jsonParser = express.json();

app.use(jsonParser);
```

So:

```js
app.use(express.json());
```

means:

1. Call `express.json()`
2. Get the JSON parsing middleware
3. Register that middleware using `app.use()`

---

## 🔹 Global Middleware vs Route Middleware

### Global Middleware

```js
app.use((req, res, next) => {
  console.log("Global Middleware");
  next();
});
```

Can run for multiple matching requests.

### Route-specific Middleware

```js
app.get(
  "/user",
  (req, res, next) => {
    console.log("User Middleware");
    next();
  },
  (req, res) => {
    res.end("User");
  },
);
```

This middleware is associated specifically with the `/user` route.

---

## 🔹 My Example

My Express application uses `express.json()` as global middleware:

```js
import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.end("Home Route");
});

app.get("/login", (req, res) => {
  res.end("Logged in");
});

app.get("/user", (req, res) => {
  res.end("Sharvil");
});

app.post("/user", (req, res) => {
  console.log(req.body);
  res.end("Post Sharvil");
});

app.listen(4000, () => {
  console.log("Example app listening on port 4000");
});
```

---

## 🧠 Key Takeaways

- `app.use()` is used to register middleware.
- Middleware is processed in the order it is registered.
- A global middleware can apply to multiple routes.
- `next()` tells Express to continue through the middleware/route stack.
- If middleware sends a response, the request-response cycle can end there.
- Middleware placed after a route may not execute if that route ends the response.
- `express.json()` is built-in Express middleware for parsing JSON request bodies.
- `express.json()` returns a middleware function.
- Parsed JSON data becomes available through `req.body`.

---

## 🚀 What I Learned

The most important concept I understood is that Express works like a **middleware/route stack**.

A request moves through that stack from top to bottom, and `next()` allows Express to continue looking for the next matching handler.

This understanding will be useful when learning authentication, authorization, logging, validation, error handling, and other middleware patterns in Express.js.
