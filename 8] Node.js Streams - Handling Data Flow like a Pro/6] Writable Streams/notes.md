# Node.js Writable Streams

## What is a Writable Stream?

A **Writable Stream** is used to write data to a destination **piece by piece** instead of writing everything at once.

Common destinations include:

- Files
- HTTP Responses
- Network Sockets
- Compression Streams

Node.js provides writable streams through the **fs** module.

```javascript
import fs from "fs";

const writeStream = fs.createWriteStream("file.txt");

writeStream.write("Hello ");
writeStream.write("World!");
writeStream.end();
```

Output:

```
Hello World!
```

---

# createWriteStream()

```javascript
const writeStream = fs.createWriteStream(path, options);
```

Example

```javascript
const writeStream = fs.createWriteStream("file.txt");
```

It creates a writable stream that writes data into the specified file.

If the file does not exist, Node.js creates it automatically.

If the file already exists, its contents are overwritten unless different flags are provided.

---

# Writing Data

Use the `write()` method.

```javascript
writeStream.write("abc");
writeStream.write("123");
writeStream.write("xyz");
```

The stream writes data sequentially.

Unlike `appendFileSync()`, writing is asynchronous and much faster for large amounts of data.

---

# Copying Large Files using Streams

Instead of reading an entire file into memory:

```javascript
const buffer = await fs.readFile("movie.mkv");
await fs.writeFile("copy.mkv", buffer);
```

We can stream it.

```javascript
const readStream = fs.createReadStream("movie.mkv");
const writeStream = fs.createWriteStream("copy.mkv");

readStream.on("data", (chunk) => {
  writeStream.write(chunk);
});
```

This copies the file chunk by chunk.

Benefits:

- Low memory usage
- Faster
- Suitable for GB-sized files

---

# Internal Buffer of Writable Streams

Every writable stream has an **internal buffer**.

When you call

```javascript
writeStream.write(data);
```

the data is **not immediately written to disk**.

Instead, Node.js first stores it inside the internal buffer.

Another thread (libuv) writes that buffered data to disk asynchronously.

---

## Default Buffer Size

```javascript
const writeStream = fs.createWriteStream("file.txt");

console.log(writeStream.writableHighWaterMark);
```

Output

```
16384
```

which is

```
16 KB
```

This is called the **High Water Mark**.

---

# Changing Buffer Size

```javascript
const writeStream = fs.createWriteStream("file.txt", {
  highWaterMark: 4,
});
```

Now the internal buffer size becomes

```
4 bytes
```

---

# writableHighWaterMark

Returns the maximum size of the internal buffer.

```javascript
console.log(writeStream.writableHighWaterMark);
```

Output

```
4
```

or

```
16384
```

depending on the configured buffer.

---

# writableLength

Shows how many bytes are currently waiting inside the internal buffer.

Example

```javascript
console.log(writeStream.writableLength);
```

Initially

```
0
```

After writing

```javascript
writeStream.write("abcd");
```

the length increases until Node.js writes the data to disk.

---

# write() Return Value

Many beginners think `write()` returns nothing.

Actually it returns a **boolean**.

```javascript
const result = writeStream.write("a");

console.log(result);
```

Possible outputs

```
true
```

or

```
false
```

---

## When does it return true?

When there is still space available in the internal buffer.

```
Internal Buffer

[ a ][ a ][ a ][ ]
```

There is room left.

```
write()
↓

true
```

---

## When does it return false?

When the internal buffer becomes full.

```
[ a ][ a ][ a ][ a ]
```

Buffer Full

```
write()
↓

false
```

This does **not** mean writing failed.

It simply means:

> "Please stop writing for a moment. Let me empty my internal buffer first."

This mechanism is called **Backpressure**.

---

# What is Backpressure?

Backpressure happens when data is produced **faster** than it can be written.

Example

```
Read Speed

500 MB/sec

↓

Writable Buffer

↓

Disk Speed

100 MB/sec
```

The disk cannot keep up.

If we continue writing forever, memory usage keeps increasing.

Node.js prevents this using backpressure.

---

# Handling Backpressure

```javascript
const isEmpty = writeStream.write(chunk);

if (!isEmpty) {
  readStream.pause();
}
```

If the buffer becomes full

```
write()

↓

false
```

pause reading.

---

# drain Event

When Node.js finishes emptying the buffer, it emits the `drain` event.

```javascript
writeStream.on("drain", () => {
  readStream.resume();
});
```

Sequence

```
Read

↓

Write

↓

Buffer Full

↓

pause()

↓

Disk Writes Data

↓

Buffer Empty

↓

drain Event

↓

resume()
```

This creates a smooth flow without consuming huge amounts of memory.

---

# Example: Writing 1000 Characters

```javascript
let i = 1;

const write1000A = () => {
  while (i <= 1000) {
    const canWrite = writeStream.write("a");
    i++;

    if (!canWrite) {
      break;
    }
  }
};

write1000A();

writeStream.on("drain", () => {
  write1000A();
});
```

Process

- Keep writing.
- Stop when the buffer is full.
- Wait for `drain`.
- Continue writing.
- Repeat until everything is written.

This is exactly how Node.js streams efficiently handle large amounts of data.

---

# Practical File Copy with Backpressure

```javascript
const writeStream = fs.createWriteStream("copy.mp4");

const readStream = fs.createReadStream("movie.mp4", {
  highWaterMark: 1024 * 1024,
});

readStream.on("data", (chunk) => {
  const canWrite = writeStream.write(chunk);

  if (!canWrite) {
    readStream.pause();
  }
});

writeStream.on("drain", () => {
  readStream.resume();
});

readStream.on("end", () => {
  writeStream.end();
});
```

This is the correct way to manually copy very large files while keeping memory usage under control.

---

# Closing Writable Streams

Unlike a readable stream, a writable stream **does not automatically close** when you finish calling `write()`.

```javascript
writeStream.write("a");
```

The stream remains open and continues holding its file descriptor until it is explicitly ended.

---

# File Descriptor (fd)

When a writable stream is created, the operating system assigns it a **file descriptor (fd)**.

```javascript
writeStream.on("open", (fd) => {
  console.log(fd);
});
```

Example output

```
18
```

A file descriptor is a numeric identifier used by the operating system to keep track of the open file.

If the writable stream is never closed, this file descriptor remains allocated, which can lead to resource leaks in long-running applications.

---

# end()

Use `end()` to signal that no more data will be written.

```javascript
writeStream.end();
```

You can also pass one final chunk.

```javascript
writeStream.end("Last Line");
```

Node.js writes the final data and then closes the stream gracefully.

---

# finish Event

The `finish` event is emitted after **all buffered data has been successfully written**.

```javascript
writeStream.on("finish", () => {
  console.log("Finished");
});
```

Without calling `end()`, this event will never fire because the stream is still waiting for more data.

---

# close Event

After the stream finishes writing and releases its file descriptor, the `close` event is emitted.

```javascript
writeStream.on("close", () => {
  console.log("Closed");
});
```

The order is always:

```
write()

↓

end()

↓

finish

↓

close
```

---

# Writing After end()

Once a writable stream has been ended, no additional writes are allowed.

```javascript
writeStream.end();

writeStream.write("Hello");
```

This throws an error because the stream has already been closed for writing.

---

# Key Takeaways

- Writable streams write data chunk by chunk.
- `createWriteStream()` creates a writable stream.
- `write()` stores data in the internal buffer.
- The default writable buffer size is **16 KB**.
- `writableHighWaterMark` shows the maximum buffer size.
- `writableLength` shows how much data is currently buffered.
- `write()` returns **true** when there is buffer space and **false** when the buffer is full.
- A return value of **false** indicates backpressure, not failure.
- Pause the readable stream when `write()` returns `false`.
- Resume reading when the writable stream emits the `drain` event.
- Always call `end()` after all writes are complete.
- `finish` fires after all data has been written.
- `close` fires after the file descriptor is released.
- Writing after `end()` throws an error.
- Proper backpressure handling keeps memory usage low while copying large files.
