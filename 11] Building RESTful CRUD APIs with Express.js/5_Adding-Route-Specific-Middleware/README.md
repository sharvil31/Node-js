# Route-Specific Middleware in Express.js

While learning Express.js, I learned how **route-specific middleware** can be used to run some logic only for requests that match a particular route path.

## What is Route-Specific Middleware?

Route-specific middleware is middleware that is attached to a specific route path using `app.use()`.

Unlike global middleware, which can run for many or all incoming requests, route-specific middleware is used when we want middleware logic to apply only to a particular path.

### Basic Syntax

```js
app.use("/admin", (req, res, next) => {
  // middleware logic

  next();
});
```

Here, the middleware is mounted on `/admin`.

For example, a request such as:

```text
POST /admin
```

can pass through this middleware before reaching the actual route handler.

---

## Example

```js
import express from "express";

const app = express();

app.use(express.json());

app.use("/admin", (req, res, next) => {
  console.log(req.url);
  console.log(req.originalUrl);

  if (req.body.password === "secret") {
    next();
  } else {
    res.end("Invalid Credentials");
  }
});

app.post("/admin", (req, res) => {
  res.end("Hello Admin");
});

app.listen(4000, () => {
  console.log("Example app listening on port 4000");
});
```

## How This Works

Suppose the client sends:

```http
POST /admin
Content-Type: application/json
```

with:

```json
{
  "name": "Sharvil Amburle",
  "password": "secret"
}
```

The request flow is:

```text
POST /admin
     |
     v
app.use("/admin", middleware)
     |
     v
Check password
     |
   +---+---+
   |       |
 valid   invalid
   |       |
 next()   response
   |       |
   v       v
app.post   "Invalid Credentials"
("/admin")
   |
   v
"Hello Admin"
```

If the password is correct, `next()` passes control to the next matching middleware or route handler.

If the password is incorrect, the middleware sends a response and does not call `next()`, so the request does not continue to the next handler.

---

## Understanding `req.url` and `req.originalUrl`

When middleware is mounted using `app.use("/admin", ...)`, Express treats `/admin` as the middleware's mount path.

For:

```text
POST /admin
```

inside the middleware, you can see approximately:

```js
req.url          // "/"
req.originalUrl  // "/admin"
```

For:

```text
POST /admin/users
```

you can see approximately:

```js
req.url          // "/users"
req.originalUrl  // "/admin/users"
```

So:

- `req.url` represents the URL relative to the mounted middleware.
- `req.originalUrl` represents the original URL requested by the client.

---

## Route Matching with `app.use()`

One important thing I learned is that `app.use()` performs **path-prefix matching**.

For example:

```js
app.use("/users", (req, res, next) => {
  console.log("Users middleware");
  next();
});
```

This middleware can match paths such as:

```text
/users
/users/1
/users/profile
/users/1/orders
```

It should be thought of as matching a path prefix rather than simply using JavaScript's `startsWith()` method.

---

## Middleware Execution Order

Express checks middleware and routes in the order in which they are registered.

For example:

```js
app.use("/users", (req, res, next) => {
  console.log("First");
  next();
});

app.use("/users/1", (req, res) => {
  res.end("Second");
});
```

For:

```text
GET /users/1
```

the output will be:

```text
First
Second
```

because `/users` middleware is registered first and calls `next()`.

If the first middleware sends a response instead:

```js
app.use("/users", (req, res) => {
  res.end("First");
});
```

then the request ends there, and the `/users/1` middleware will not execute.

This helped me understand why **middleware order matters in Express.js**.

---

## `next()` is Important

`next()` tells Express:

> "This middleware has finished its work. Continue processing the request."

Example:

```js
app.use("/admin", (req, res, next) => {
  if (req.body.password === "secret") {
    next();
  } else {
    res.end("Invalid Credentials");
  }
});
```

There are two possible paths:

### Valid credentials

```text
Middleware
    |
    v
next()
    |
    v
Route Handler
```

### Invalid credentials

```text
Middleware
    |
    v
Invalid Credentials
    |
    v
Request ends
```

---

## Route-Specific vs Global Middleware

### Global Middleware

```js
app.use((req, res, next) => {
  console.log("Runs for matching requests");
  next();
});
```

It is commonly used for logic that should apply broadly, such as logging or common request processing.

### Route-Specific Middleware

```js
app.use("/admin", (req, res, next) => {
  // Admin-specific logic
  next();
});
```

It is useful when middleware logic should apply specifically to a particular section of the application.

Examples include:

- Authentication checks
- Authorization checks
- Admin access checks
- Request validation
- Route-specific logging
- Permission checks

---

## What I Learned

My understanding of route-specific middleware in Express.js:

1. `app.use("/path", middleware)` attaches middleware to a specific path.
2. `app.use()` uses path-prefix matching.
3. Express checks middleware and routes in registration order.
4. `next()` passes control to the next matching middleware or route.
5. Sending a response without calling `next()` ends the request.
6. `req.url` can change relative to the middleware's mount path.
7. `req.originalUrl` keeps the original requested URL.
8. Route-specific middleware is useful for things like authentication, authorization, and validation.

## Conclusion

Route-specific middleware gives us a way to control **where middleware logic should run** instead of applying the same logic to every route.

The main concept I took away is:

> **A request moves through the middleware stack in order, and `next()` decides whether processing should continue.**
