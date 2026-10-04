# Express.js v5 — Highlights

This section covers some of the important changes introduced in **Express.js v5**, especially improvements to **asynchronous error handling** and changes to **route path syntax**.

---

## 📚 Topics Covered

- Async Error Handling in Express 5
- Error Handling Middleware
- Express 4 vs Express 5
- Changes to Route Path Syntax
- Removed Inline Regular Expressions
- Optional Route Parameters
- Named Wildcards
- Wildcards Including the Root Path
- Migration Examples

---

# 1. Async Error Handling

One of the important improvements in **Express 5** is built-in support for handling rejected Promises and errors thrown from asynchronous route handlers and middleware.

## Express 4

In Express 4, if an asynchronous route handler throws an error or returns a rejected Promise, Express does not automatically pass that error to the error-handling middleware.

Because of this, developers commonly had to use `try...catch` manually.

### Example

```js
const express = require("express");

const app = express();

app.get("/users", async (req, res, next) => {
  try {
    const users = await getUsers();

    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Something went wrong",
  });
});
```

Here:

1. `getUsers()` is an asynchronous operation.
2. If it rejects or throws an error, the `catch` block runs.
3. `next(error)` passes the error to the error-handling middleware.
4. The error-handling middleware sends the response.

Without handling the rejected Promise properly, the application could encounter an unhandled rejection.

---

# 2. Async Error Handling in Express 5

Express 5 automatically handles rejected Promises returned by route handlers and middleware.

If an `async` function throws an error or its Promise is rejected, Express automatically passes the error to `next()`.

Therefore, in many cases, you no longer need a `try...catch` only for forwarding errors to Express.

### Example

```js
const express = require("express");

const app = express();

app.get("/users", async (req, res) => {
  const users = await getUsers();

  res.json(users);
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Something went wrong",
  });
});
```

If `getUsers()` rejects, Express 5 automatically forwards the error to:

```js
app.use((err, req, res, next) => {
  // Error handling
});
```

---

# 3. How Express 5 Handles Rejected Promises

Consider the following:

```js
app.get("/users", async (req, res) => {
  throw new Error("Database connection failed");
});
```

The `async` function returns a rejected Promise.

Express 5 effectively forwards the error to the next middleware:

```js
next(error);
```

The error-handling middleware can then handle it:

```js
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message,
  });
});
```

Response:

```json
{
  "message": "Database connection failed"
}
```

---

# 4. Important Note About Server Crashes

Express 5's async error handling **does not mean that your Node.js server can never crash**.

The important point is:

> Express 5 automatically forwards rejected Promises and errors thrown from async route handlers or middleware to the Express error-handling system.

You should still properly handle errors and understand the difference between:

- Express request errors
- Unhandled Promise rejections
- Uncaught exceptions
- Fatal application errors

Express 5 simply makes normal asynchronous request error handling much easier.

---

# 5. Error-Handling Middleware

Express error-handling middleware has **four parameters**:

```js
(err, req, res, next);
```

Example:

```js
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal Server Error",
  });
});
```

The first parameter must be the error:

```js
err;
```

So this:

```js
app.use((req, res, next) => {
  // ...
});
```

is a normal middleware.

While this:

```js
app.use((err, req, res, next) => {
  // ...
});
```

is an error-handling middleware.

---

# 6. Express 4 vs Express 5

## Express 4

```js
app.get("/users", async (req, res, next) => {
  try {
    const users = await getUsers();

    res.json(users);
  } catch (error) {
    next(error);
  }
});
```

## Express 5

```js
app.get("/users", async (req, res) => {
  const users = await getUsers();

  res.json(users);
});
```

Express 5 automatically forwards the rejected Promise to the error handler.

---

# 7. Route Path Syntax Changes

Another important Express 5 change is related to **route path syntax**.

Express 5 uses a newer version of `path-to-regexp`.

As a result, some route patterns that were accepted in Express 4 are no longer valid in Express 5.

Some important changes involve:

- Optional parameters
- Wildcards
- Inline regular expressions

---

# 8. Optional Route Parameters

In Express 4, you could write:

```js
app.get("/:id?", (req, res) => {
  res.send(req.params);
});
```

The `?` made the `id` parameter optional.

So the route could match:

```text
/
```

and:

```text
/123
```

However, this syntax is no longer supported in Express 5.

---

## Express 5 Syntax

Express 5 uses braces for optional portions.

Instead of:

```text
/:id?
```

use:

```text
/{:id}
```

Example:

```js
app.get("/{:id}", (req, res) => {
  res.json(req.params);
});
```

This can match:

```text
/
```

and:

```text
/123
```

---

# 9. Wildcard Routes

Express 4 allowed an unnamed wildcard:

```js
app.get("/*", (req, res) => {
  res.send("Wildcard route");
});
```

In Express 5, wildcards must be **named**.

So instead of:

```text
/*
```

use:

```text
/*splat
```

Example:

```js
app.get("/*splat", (req, res) => {
  console.log(req.params.splat);

  res.send("Wildcard route");
});
```

The name `splat` is arbitrary.

You could also use:

```text
/*name
```

or:

```text
/*path
```

For example:

```js
app.get("/*path", (req, res) => {
  console.log(req.params.path);
});
```

---

# 10. Wildcard Parameters Are Now Named

This is an important difference.

### Express 4

```js
app.get("/*", (req, res) => {
  console.log(req.params);
});
```

### Express 5

```js
app.get("/*splat", (req, res) => {
  console.log(req.params.splat);
});
```

The wildcard value is now available through the parameter name.

For example, a request such as:

```text
/files/images/profile.jpg
```

could produce a value similar to:

```js
req.params.splat;
```

containing the wildcard segments.

---

# 11. Wildcard That Also Matches `/`

There is an additional difference to remember.

The following:

```text
/*splat
```

does **not** match the root path:

```text
/
```

If you want the wildcard to also match `/`, use braces:

```text
/{*splat}
```

Example:

```js
app.get("/{*splat}", (req, res) => {
  res.send("Wildcard route");
});
```

This allows the wildcard to match both:

```text
/
```

and paths such as:

```text
/about
/products
/products/123
/products/electronics/mobile
```

---

# 12. Inline Regular Expressions Removed

Express 4 allowed regular expressions directly inside route parameters.

For example:

```js
app.get("/:id(\\d+)", (req, res) => {
  res.send(`ID: ${req.params.id}`);
});
```

The `\\d+` pattern was used to restrict the parameter to digits.

For example:

```text
/users/123
```

could match.

But:

```text
/users/abc
```

would not match the pattern.

This style of inline regex is no longer supported in Express 5 route paths.

---

# 13. Why Was Inline Regex Removed?

Express 5's route matching syntax is based on a newer version of `path-to-regexp`.

Some of the older route patterns and special characters are no longer supported.

Instead of putting regular expressions directly inside the route definition, validation should generally be handled separately.

For example:

```js
app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      message: "ID must contain only numbers",
    });
  }

  res.json({
    id,
  });
});
```

This separates:

1. Route matching
2. Parameter validation

---

# 14. Comparing Route Syntax

| Feature                | Express 4                           | Express 5               |
| ---------------------- | ----------------------------------- | ----------------------- |
| Optional parameter     | `/:id?`                             | `/{:id}`                |
| Unnamed wildcard       | `/*`                                | Not supported           |
| Named wildcard         | Not required                        | `/*splat`               |
| Wildcard including `/` | `/*`                                | `/{*splat}`             |
| Inline regex           | `/:id(\\d+)`                        | Not supported           |
| Async Promise errors   | Manual forwarding commonly required | Automatically forwarded |

---

# 15. Complete Express 5 Example

Here is a small example combining the concepts:

```js
import express from "express";

const app = express();

app.use(express.json());

app.get("/users/{:id}", async (req, res) => {
  const { id } = req.params;

  if (id && !/^\d+$/.test(id)) {
    return res.status(400).json({
      message: "ID must be a number",
    });
  }

  // Simulating an async operation
  const users = await Promise.resolve([
    {
      id: 1,
      name: "John",
    },
    {
      id: 2,
      name: "Jane",
    },
  ]);

  res.json({
    users,
    requestedId: id ?? null,
  });
});

app.get("/*splat", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.params.splat,
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal Server Error",
  });
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
```

---

# 16. Key Takeaways

### Async Error Handling

Express 5 automatically handles rejected Promises from route handlers and middleware.

```js
app.get("/", async (req, res) => {
  throw new Error("Something went wrong");
});
```

The error is automatically passed to the error-handling middleware.

---

### Optional Parameters

Old:

```text
/:id?
```

New:

```text
/{:id}
```

---

### Named Wildcards

Old:

```text
/*
```

New:

```text
/*splat
```

---

### Wildcard Including Root

Use:

```text
/{*splat}
```

when the wildcard should also match:

```text
/
```

---

### Inline Regular Expressions

Old:

```text
/:id(\\d+)
```

Inline regex patterns are no longer supported in Express 5 route paths.

Perform validation separately instead.

---

# 📝 Summary

Express 5 simplifies asynchronous application development by automatically forwarding rejected Promises and thrown errors from async route handlers to Express's error-handling middleware.

At the same time, Express 5 introduced stricter route path syntax because of its updated `path-to-regexp` dependency.

The most important syntax changes to remember are:

```text
/:id?       → /{:id}

/*          → /*splat

/*          → /{*splat}   (when `/` should also match)

/:id(\\d+)  → validate the parameter separately
```

These changes are especially important when **migrating an existing Express 4 application to Express 5**.
