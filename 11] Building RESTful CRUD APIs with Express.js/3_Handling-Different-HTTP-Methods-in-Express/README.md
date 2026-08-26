# Handling Different HTTP Methods in Express

In this practice, I learned how to handle different **HTTP methods** in Express.js and how Express uses the combination of an HTTP method and a URL path to determine which route handler should execute.

## What I Learned

HTTP methods represent the type of operation a client wants to perform on a server.

In Express, different HTTP methods can be handled using methods such as:

- `app.get()` — Handle GET requests
- `app.post()` — Handle POST requests
- `app.put()` — Handle PUT requests
- `app.patch()` — Handle PATCH requests
- `app.delete()` — Handle DELETE requests

## Example

```js
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.end("Home Route");
});

app.get("/login", (req, res) => {
  res.end("Logged in");
});

// POST route
app.post("/", (req, res) => {
  res.end("Post Home Route");
});

// PUT route
app.put("/", (req, res) => {
  res.end("Updated");
});

// PATCH route
app.patch("/", (req, res) => {
  res.end("Updated Partially");
});

// DELETE route
app.delete("/", (req, res) => {
  res.end("Deleted");
});

app.listen(4000, () => {
  console.log(`Example app listening on port 4000`);
});
```

## Understanding the Routes

An important thing I learned is that the same URL path can have different route handlers depending on the HTTP method.

For example:

```text
GET    /
POST   /
PUT    /
PATCH  /
DELETE /
```

These are treated as different routes by Express.

### GET

Used when we want to retrieve or read data.

```js
app.get("/", (req, res) => {
  res.end("Home Route");
});
```

### POST

Used when we want to send or create new data.

```js
app.post("/", (req, res) => {
  res.end("Post Home Route");
});
```

### PUT

Generally used to completely update or replace an existing resource.

```js
app.put("/", (req, res) => {
  res.end("Updated");
});
```

### PATCH

Used to partially update an existing resource.

```js
app.patch("/", (req, res) => {
  res.end("Updated Partially");
});
```

### DELETE

Used to delete a resource.

```js
app.delete("/", (req, res) => {
  res.end("Deleted");
});
```

## HTTP Methods Summary

| Method | Common Purpose              |
| ------ | --------------------------- |
| GET    | Retrieve data               |
| POST   | Create/send data            |
| PUT    | Replace/update a resource   |
| PATCH  | Partially update a resource |
| DELETE | Delete a resource           |

## Key Takeaway

The main concept I understood is that Express matches a request using both:

```text
HTTP Method + URL Path
```

For example:

```text
GET  /
POST /
```

Even though both requests use `/`, Express can execute different handlers because their HTTP methods are different.

This concept is an important foundation for building **REST APIs with Express.js**.

## Learning Progress

This practice helped me understand:

- Express route handling
- HTTP methods
- GET, POST, PUT, PATCH and DELETE
- How Express distinguishes routes
- The basics of REST-style API routing

## Next Step

Next, I can practice sending these different HTTP requests using tools such as **Postman**, **Thunder Client**, or JavaScript's `fetch()` API and start working with request data.
