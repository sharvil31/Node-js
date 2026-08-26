# Express.js Middleware

## 📌 Overview

While learning **Express.js**, I explored how middleware works and how Express controls the flow of requests, responses, and errors.

Middleware functions are functions that have access to the following objects:

```js
(req, res, next)
```

They can:

* Execute code
* Modify the request or response
* Send a response
* Call `next()` to continue to the next middleware
* Call `next(error)` to pass control to error-handling middleware

---

## 🔹 Basic Middleware Structure

A normal request-handling middleware generally has three parameters:

```js
(req, res, next) => {
    // middleware logic
}
```

### Parameters

* `req` → Contains information about the incoming request.
* `res` → Used to send a response to the client.
* `next` → Function used to pass control to the next middleware.

Example:

```js
app.get("/", (req, res, next) => {
    console.log("Running Middleware 1");

    next();
});
```

---

## 🔹 Middleware Flow

Middleware executes in the order in which it is registered.

For example:

```js
app.get(
    "/",

    (req, res, next) => {
        console.log("Middleware 1");
        next();
    },

    (req, res) => {
        console.log("Middleware 2");
        res.end("Hello World!");
    }
);
```

The execution flow is:

```text
Request
   ↓
Middleware 1
   ↓
next()
   ↓
Middleware 2
   ↓
Response
```

If `next()` is not called and a response is not sent, the request can remain pending.

---

## 🔹 Error-Handling Middleware

Express error-handling middleware has **four parameters**:

```js
(err, req, res, next) => {
    // handle error
}
```

The first parameter must be the error:

```js
(err, req, res, next)
```

Example:

```js
app.get("/", (req, res, next) => {
    try {
        console.log(object);
    } catch (error) {
        next(error);
    }
});
```

The error can then be handled by:

```js
app.use((err, req, res, next) => {
    console.log(err.message);
    res.end(err.message);
});
```

---

## 🔹 `next()` vs `next(error)`

One of the important things I learned is that the argument passed to `next()` determines the middleware flow.

### `next()`

```js
next();
```

This tells Express:

> Continue to the next normal middleware.

### `next(error)`

```js
next(error);
```

This tells Express:

> An error occurred. Skip normal middleware and move to error-handling middleware.

Example:

```text
next()
  ↓
Normal Middleware
  ↓
Next Middleware
```

Whereas:

```text
next(error)
  ↓
Skip Normal Middleware
  ↓
Error-Handling Middleware
```

---

## 🔹 Truthy and Falsy Values with `next()`

I also experimented with values passed to `next()`.

```js
next("");
next(0);
next(undefined);
```

These values are falsy, so they do not indicate an error.

Whereas:

```js
next(error);
```

where `error` is a truthy error value, triggers the error-handling flow.

The important distinction is:

```js
next();          // normal flow
next(undefined); // normal flow
next("");        // normal flow
next(0);         // normal flow

next(error);     // error flow
```

---

## 🔹 Example

Here is the middleware flow I experimented with:

```js
import express from "express";

const app = express();

app.get(
    "/",

    // Request Handler Middleware
    (req, res, next) => {
        try {
            console.log("Running Middleware 1");

            console.log(object);

            res.end("Hii");
        } catch (error) {
            next(error);
        }
    },

    // Error Handler Middleware
    (err, req, res, next) => {
        console.log({ err: err.message });
        console.log("Running Error Middleware");

        res.end(err.message);
    },

    // Request Handler Middleware
    (req, res) => {
        console.log("Running Middleware 2");

        res.write("Hello World! 2");
    },

    // Error Handler Middleware
    (err, req, res, next) => {
        console.log("Running Error Middleware");

        res.end("Error Found");
    }
);

app.listen(4000, () => {
    console.log("Example app listening on port 4000");
});
```

Since `object` is not defined, an error occurs.

The error is caught by `try...catch` and passed using:

```js
next(error);
```

Express then moves to the error-handling middleware.

Therefore, the normal middleware after it is skipped.

---

## 🔹 Middleware Execution Concept

The overall concept I learned is:

```text
                    HTTP Request
                         │
                         ▼
               Request Middleware
                         │
                 ┌───────┴───────┐
                 │               │
             next()          next(error)
                 │               │
                 ▼               ▼
        Normal Middleware   Error Middleware
                 │               │
                 └───────┬───────┘
                         ▼
                      Response
```

---

## 🧠 Key Takeaways

* Middleware executes in registration order.
* Normal middleware commonly uses `(req, res, next)`.
* Error-handling middleware uses `(err, req, res, next)`.
* `next()` passes control to the next normal middleware.
* `next(error)` switches Express to error-handling middleware.
* Error-handling middleware can send the final error response.
* Once a response is sent, later middleware should not attempt to send another response.
* If middleware neither sends a response nor calls `next()`, the request can remain pending.
* Middleware is one of the core concepts for understanding how Express.js handles requests and errors.

## 🚀 Learning Progress

This was my next step in learning **Express.js**, after working with the Node.js HTTP module.

I'm continuing to explore how Express simplifies server-side development through routing, middleware, request handling, and error handling.
