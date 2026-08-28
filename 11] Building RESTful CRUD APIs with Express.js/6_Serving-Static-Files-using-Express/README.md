# Serving Static Files and Sending Responses in Express.js

In this practice, I learned how Express.js can serve static files, send files as responses, and simplify sending JSON responses.

I also learned how middleware order affects routing and why a browser may receive a `304 Not Modified` response.

---

## 1. Serving Static Files with `express.static()`

Express provides the `express.static()` middleware for serving static files such as:

- HTML
- CSS
- JavaScript
- Images
- Videos
- Other assets

```js
app.use(express.static("public"));
```

If my project contains:

```text
project/
├── app.js
└── public/
    ├── index.html
    ├── style.css
    └── image.png
```

Express can serve these files directly.

For example:

```text
http://localhost:4000/index.html
http://localhost:4000/style.css
http://localhost:4000/image.png
```

---

## 2. Middleware Order Matters

Express processes middleware and routes in the order in which they are registered.

For example:

```js
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.end("Home Route");
});
```

If `public/index.html` exists, the static middleware can handle the `/` request before `app.get("/")` gets a chance to execute.

The flow can be:

```text
GET /
  ↓
express.static("public")
  ↓
public/index.html exists
  ↓
Serve index.html
```

Therefore, if I want my custom `/` route to execute first, I can define it before the static middleware:

```js
app.get("/", (req, res) => {
  res.end("Home Route");
});

app.use(express.static("public"));
```

This helped me understand that **middleware order is important in Express.js**.

---

## 3. Sending a File with `res.sendFile()`

Express provides `res.sendFile()` to send a file as an HTTP response.

```js
app.get("/test", (req, res) => {
  res.sendFile(`${import.meta.dirname}/download.mp4`);
});
```

Previously, I could manually create a readable stream:

```js
const fileHandle = await open("download.mp4");

const readStream = fileHandle.createReadStream();

const stats = await fileHandle.stat();

res.setHeader("Content-Length", stats.size);
res.setHeader("Content-Type", "video/mp4");
res.setHeader("Accept-Ranges", "bytes");

readStream.pipe(res);
```

`res.sendFile()` provides a much simpler way to send a file when I don't need to manually control the stream.

---

## 4. Sending JSON with `res.json()`

Without Express, I could send JSON like this:

```js
res.setHeader("Content-Type", "application/json");

res.end(
  JSON.stringify({
    message: "Hello World!!",
  }),
);
```

Express provides a simpler method:

```js
res.json({
  message: "Hello World!!",
});
```

`res.json()` converts the JavaScript value into JSON and sends it as the response.

This is especially useful when building APIs.

---

## 5. HTTP Status Codes

Express also provides:

```js
res.status(200).json({
  message: "Success",
});
```

The status code should match the operation.

For example:

```text
200 → Successful request
201 → Resource successfully created
404 → Resource not found
500 → Internal server error
```

For a normal `GET` request, `200` is generally appropriate.

`201 Created` is normally used when a new resource has been created.

---

## 6. Why Did I See `304 Not Modified`?

While testing static files, I noticed that the browser was showing:

```text
304 Not Modified
```

At first, it looked like an error, but it isn't.

A `304` response means that the browser already has a cached version of the resource and the resource has not changed.

The browser can therefore use its cached copy instead of downloading the file again.

Simplified flow:

```text
Browser
   ↓
Requests resource
   ↓
Browser sends cache information
   ↓
Express checks the resource
   ↓
Resource hasn't changed
   ↓
304 Not Modified
   ↓
Browser uses cached version
```

So:

```text
304 Not Modified ≠ Error
```

It is related to HTTP caching.

---

## 7. Important Lesson: One Request → One Response

I also learned that I should not send multiple responses for the same request.

For example, this is incorrect:

```js
res.json({
  message: "Hello World!!",
});

res.status(201).json({
  message: "Hello World!!",
});
```

The first `res.json()` already sends the response.

Instead, I should send only one response:

```js
res.json({
  message: "Hello World!!",
});
```

Or:

```js
res.status(201).json({
  message: "Created successfully",
});
```

depending on what the request is doing.

---

## Complete Example

```js
import express from "express";

const app = express();

// Home route
app.get("/", (req, res) => {
  res.end("Home Route");
});

// Serve static files
app.use(express.static("public"));

// Send a file
app.get("/test", (req, res) => {
  res.sendFile(`${import.meta.dirname}/download.mp4`);
});

// Send JSON
app.get("/api", (req, res) => {
  res.json({
    message: "Hello World!!",
  });
});

app.listen(4000, () => {
  console.log("Example app listening on port 4000");
});
```

---

## What I Learned

Through this practice, I learned:

- How to serve static files using `express.static()`
- How Express middleware order affects request handling
- How to send files using `res.sendFile()`
- How to send JSON using `res.json()`
- How to set HTTP status codes using `res.status()`
- Why `304 Not Modified` appears in the browser
- How browser caching works at a basic level
- Why a request should normally have only one response

### Key Takeaway

Express provides convenient methods that simplify common HTTP response operations:

```text
express.static() → Serve static files
res.sendFile()   → Send a file
res.json()       → Send JSON
res.status()     → Set HTTP status code
```

I'm continuing to build my understanding of Express.js by learning each concept through small practical examples.
