# Piping Streams in Node.js (`pipe()` vs `pipeline()`)

## Introduction

When working with large amounts of data in Node.js, manually reading chunks from a `Readable` stream and writing them to a `Writable` stream quickly becomes repetitive. You also have to manage **backpressure**, **pause/resume logic**, and **error handling**.

Node.js provides two built-in solutions:

- **`readable.pipe()`** – Automatically transfers data and handles backpressure.
- **`stream.pipeline()`** – Does everything `pipe()` does while also providing robust error handling and automatic cleanup.

Understanding the difference between these APIs is essential when building production-ready Node.js applications.

---

# Manual Stream Copy

Before using `pipe()`, data can be transferred manually.

```js
readStream.on("data", (chunk) => {
  const canWrite = writeStream.write(chunk);

  if (!canWrite) {
    readStream.pause();
  }
});

writeStream.on("drain", () => {
  readStream.resume();
});
```

### What happens here?

1. The readable stream emits a chunk.
2. The chunk is written to the writable stream.
3. If the writable stream's internal buffer becomes full, `write()` returns `false`.
4. Reading is paused to prevent memory overflow.
5. Once the writable stream empties its buffer, it emits the `drain` event.
6. Reading resumes.

This process is called **backpressure handling**.

Although this works, it's a lot of code for a very common task.

---

# Using `pipe()`

Node.js simplifies this with the `pipe()` method.

```js
readStream.pipe(writeStream);
```

That's all you need.

Internally, `pipe()` automatically:

- Reads data from the readable stream.
- Writes data into the writable stream.
- Detects backpressure.
- Pauses the readable stream when the writable buffer is full.
- Resumes reading after the writable stream emits the `drain` event.

In other words, it performs the same work as the manual implementation but with a single line of code.

---

# Advantages of `pipe()`

- Much less code.
- Automatically manages backpressure.
- Automatically pauses and resumes reading.
- Easy to connect streams together.
- Great for copying files or transferring data between streams.

---

# Unpiping Streams

A pipe connection can be removed at any time.

```js
readStream.unpipe(writeStream);
```

After calling `unpipe()`:

- The readable stream continues to exist.
- The writable stream continues to exist.
- Data is no longer transferred automatically.

You can listen for the `unpipe` event.

```js
writeStream.on("unpipe", () => {
  console.log("Unpiped");
});
```

This event is emitted after a readable stream is detached.

---

# Limitation of `pipe()`

While `pipe()` automatically handles data flow and backpressure, it **does not automatically handle every stream error**.

For example:

```js
readStream.pipe(writeStream);
```

If the writable stream encounters an error and no error listener exists, Node.js will emit an unhandled `error` event, which can terminate the application.

With `pipe()`, developers typically attach error listeners manually.

```js
readStream.on("error", console.error);
writeStream.on("error", console.error);
```

Managing errors becomes increasingly difficult as more streams are chained together.

---

# The `pipeline()` Function

Node.js introduced the `pipeline()` function to solve these problems.

```js
import { pipeline } from "stream";

pipeline(readStream, writeStream, (err) => {
  if (err) {
    console.error("Pipeline failed:", err);
  } else {
    console.log("Pipeline completed successfully.");
  }
});
```

---

# What `pipeline()` Does

`pipeline()` automatically:

- Connects all streams together.
- Handles backpressure.
- Propagates errors.
- Destroys every stream if one fails.
- Cleans up resources.
- Invokes the callback when the operation succeeds or fails.

Because of this, `pipeline()` is the recommended approach for production applications.

---

# Multiple Streams with `pipeline()`

One of the biggest strengths of `pipeline()` is connecting multiple streams safely.

```js
pipeline(readStream, gzipStream, encryptStream, writeStream, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Done");
  }
});
```

If **any** stream fails:

- All remaining streams are destroyed.
- Resources are released.
- The callback receives the error.

Without `pipeline()`, handling these situations manually becomes much more complicated.

---

# `pipe()` vs `pipeline()`

| Feature                      | `pipe()`              | `pipeline()`   |
| ---------------------------- | --------------------- | -------------- |
| Transfers data               | ✅                    | ✅             |
| Handles backpressure         | ✅                    | ✅             |
| Automatically pauses/resumes | ✅                    | ✅             |
| Supports `unpipe()`          | ✅                    | ❌             |
| Automatic error propagation  | ❌                    | ✅             |
| Cleans up streams on failure | ❌                    | ✅             |
| Best for production          | ⚠️ Small/simple tasks | ✅ Recommended |

---

# Complete Example

```js
import fs from "fs";
import { pipeline } from "stream";

console.time();

const readStream = fs.createReadStream("movie.mkv", {
  highWaterMark: 1024 * 1024,
});

const writeStream = fs.createWriteStream("copy.mp4", {
  highWaterMark: 1024 * 1024,
});

pipeline(readStream, writeStream, (err) => {
  if (err) {
    console.error("Pipeline failed:", err);
  } else {
    console.log("Pipeline completed successfully.");
  }

  console.timeEnd();
});
```

---

# Key Takeaways

- `pipe()` automatically transfers data between streams.
- `pipe()` also handles backpressure for you.
- `unpipe()` removes an existing pipe connection.
- `pipe()` does **not** automatically provide complete error propagation and cleanup.
- `pipeline()` safely connects one or more streams.
- `pipeline()` automatically handles errors and destroys streams on failure.
- `pipeline()` is the recommended API for production applications.
- Prefer `pipeline()` whenever reliability and proper resource cleanup are important.
