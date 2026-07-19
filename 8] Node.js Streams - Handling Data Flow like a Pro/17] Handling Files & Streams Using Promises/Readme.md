# Handling Files & Streams Using `fs/promises` in Node.js

This example demonstrates how to use the Promise-based File System API (`fs/promises`) to work with both **files** and **streams**. It combines the simplicity of `async/await` with the performance benefits of Node.js Streams.

## Code

```javascript
import fs from "fs/promises";

// Open source and destination files
const readFileHandle = await fs.open(
  "E:\\[AO] Heaven s Feel I - Presage Flower [1080p] [Dual].mkv",
);

const writeFileHandle = await fs.open("streams.mp4", "w");

// Create streams from FileHandles
const readStream = readFileHandle.createReadStream();
const writeStream = writeFileHandle.createWriteStream();

// Copy file using streams
readStream.pipe(writeStream);
```

---

# Why use `fs/promises`?

The `fs/promises` module provides Promise-based versions of the File System APIs, allowing us to write asynchronous code using `async/await` instead of callbacks.

```javascript
import fs from "fs/promises";
```

---

# Opening Files

```javascript
const fileHandle = await fs.open("text.txt", "r+");
```

`fs.open()` returns a **FileHandle**, not the file's contents.

A `FileHandle` acts like a reference to an opened file and lets us perform operations such as:

- Reading
- Writing
- Creating Read Streams
- Creating Write Streams
- Closing the file

---

# Reading a File

```javascript
const result = await fileHandle.read({
  buffer: Buffer.alloc(10),
});
```

Returns an object containing:

```javascript
{
  (bytesRead, buffer);
}
```

---

# Writing to a File

```javascript
await fileHandle.write(Buffer.from("Hello"));
```

Returns:

```javascript
{
  (buffer, bytesWritten);
}
```

---

# Closing the File

```javascript
await fileHandle.close();
```

Always close a file after you're finished using it to release operating system resources.

---

# Creating Streams from FileHandle

Unlike `read()` and `write()`, stream creation **does not return a Promise**.

## Read Stream

```javascript
const readStream = fileHandle.createReadStream();
```

Returns a Readable Stream immediately.

Example:

```javascript
readStream.on("data", (chunk) => {
  console.log(chunk);
});
```

---

## Write Stream

```javascript
const writeStream = fileHandle.createWriteStream();
```

Returns a Writable Stream immediately.

Example:

```javascript
writeStream.write("Hello");
```

---

# Copying Files Using Streams

```javascript
const readFileHandle = await fs.open("video.mp4");

const writeFileHandle = await fs.open("copy.mp4", "w");

const readStream = readFileHandle.createReadStream();

const writeStream = writeFileHandle.createWriteStream();

readStream.pipe(writeStream);
```

The `pipe()` method transfers data directly from the readable stream to the writable stream.

### Benefits

- Efficient for large files
- Doesn't load the entire file into memory
- Automatically handles backpressure
- Faster and memory-efficient

---

# Difference Between File Operations and Stream Creation

| Operation             | Returns Promise? |
| --------------------- | ---------------- |
| `fs.open()`           | ✅ Yes           |
| `fileHandle.read()`   | ✅ Yes           |
| `fileHandle.write()`  | ✅ Yes           |
| `fileHandle.close()`  | ✅ Yes           |
| `createReadStream()`  | ❌ No            |
| `createWriteStream()` | ❌ No            |

---

# Key Takeaways

- `fs/promises` enables Promise-based file operations.
- `fs.open()` returns a `FileHandle`.
- A `FileHandle` can read, write, and create streams.
- `createReadStream()` and `createWriteStream()` return stream objects immediately.
- `pipe()` efficiently copies data between streams while automatically managing backpressure.
- Streams are the preferred approach when working with large files.
