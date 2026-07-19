# Implementing an Internal Buffer in a Custom Stream (Node.js)

This example demonstrates how writable streams improve performance internally by buffering data before writing it to disk.

Instead of calling `fs.writeSync()` for every piece of data, we first store data inside a memory buffer and only write to the file when the buffer becomes full. This significantly reduces the number of system calls, making file writing much faster.

---

## Source Code

```js
import fs from "fs";

// Direct writing on disk

console.time();

time: 240ms
const fd = fs.openSync("numbers.txt", "w");

for (let i = 1; i <= 100000; i++) {
    fs.writeSync(fd, `${i}, `);
}

fs.closeSync(fd);

console.timeEnd();


// With Buffer

// time: 130ms
console.time();

const fd = fs.openSync("numbers.txt", "w");

const buff = Buffer.allocUnsafe(16);

let totalBytesWrittenInBuffer = 0;
let remainingStr = "";

for (let i = 1; i <= 100000; i++) {
    let str = `${i}, `;
    str = remainingStr += str;

    const bytesWritten = buff.write(str, totalBytesWrittenInBuffer);

    remainingStr = "";

    const writtenBytesDiff = str.length - bytesWritten;

    if (writtenBytesDiff !== 0) {
        remainingStr += str.slice(bytesWritten);
    }

    totalBytesWrittenInBuffer += bytesWritten;

    if (totalBytesWrittenInBuffer === buff.byteLength) {
        fs.writeSync(fd, buff);
        totalBytesWrittenInBuffer = 0;
    }
}

fs.writeSync(fd, buff.subarray(0, totalBytesWrittenInBuffer));
fs.writeSync(fd, remainingStr);

fs.closeSync(fd);

console.timeEnd();
```
---

# Why Do We Need an Internal Buffer?

Writing directly to disk is expensive because every write operation requires a system call.

For example:

```js
for (let i = 1; i <= 100000; i++) {
    fs.writeSync(fd, `${i}, `);
}
```

This performs **100,000 disk write operations**.

Every write operation switches execution from your Node.js application to the operating system. Since disk I/O is much slower than memory operations, repeatedly calling `fs.writeSync()` adds significant overhead.

---

# Buffered Approach

Instead of writing each value immediately:

1. Store data in a memory buffer.
2. Continue filling the buffer.
3. When the buffer is full, write the entire buffer to disk.
4. Repeat until all data has been processed.

This is the same principle used internally by Node.js writable streams.

---

# Code Explanation

## 1. Open the File

```js
const fd = fs.openSync("numbers.txt", "w");
```

Creates a file descriptor for writing.

---

## 2. Create a Buffer

```js
const buff = Buffer.allocUnsafe(16);
```

Creates a 16-byte buffer.

A small buffer is used only for demonstration purposes. Node.js writable streams typically use a much larger internal buffer (16 KB by default).

---

## 3. Track Buffer Usage

```js
let totalBytesWrittenInBuffer = 0;
```

Keeps track of how many bytes have already been written into the buffer.

---

## 4. Store Remaining Data

```js
let remainingStr = "";
```

Sometimes a string cannot completely fit into the remaining free space of the buffer.

The leftover portion is stored in `remainingStr` and written during the next iteration.

---

## 5. Write into the Buffer

```js
const bytesWritten = buff.write(
    str,
    totalBytesWrittenInBuffer
);
```

This writes data into memory instead of writing directly to the file.

---

## 6. Handle Partial Writes

```js
const writtenBytesDiff = str.length - bytesWritten;
```

If the string is larger than the available buffer space:

```
writtenBytesDiff > 0
```

then only part of the string was written.

Example:

Remaining buffer space:

```
5 bytes
```

Trying to write:

```
"123456789"
```

Only

```
12345
```

fits.

The remaining

```
6789
```

is stored for the next iteration.

---

## 7. Flush the Buffer

```js
if (totalBytesWrittenInBuffer === buff.byteLength) {
    fs.writeSync(fd, buff);
    totalBytesWrittenInBuffer = 0;
}
```

When the buffer becomes full, all buffered data is written to disk in one system call.

---

## 8. Write Remaining Data

After the loop finishes:

```js
fs.writeSync(fd, buff.subarray(0, totalBytesWrittenInBuffer));
```

Writes only the valid portion of the buffer.

Then:

```js
fs.writeSync(fd, remainingStr);
```

writes any leftover characters that never fit into the buffer.

---

## 9. Close the File

```js
fs.closeSync(fd);
```

Always close the file descriptor after completing all write operations.

---

# Performance Comparison

## Direct Writes

```js
for (...) {
    fs.writeSync(fd, data);
}
```

**Example Time**

```
240 ms
```

---

## Buffered Writes

```
Application
      │
      ▼
 Write to Buffer
      │
(Buffer fills)
      │
      ▼
Single Disk Write
```

**Example Time**

```
130 ms
```

Nearly **2× faster** because the number of expensive system calls is significantly reduced.

---

# Why Is Buffering Faster?

Writing to RAM is extremely fast.

Writing to disk is comparatively slow because each write requires interaction with the operating system.

Buffering improves performance by:

- Reducing the number of system calls
- Reducing disk write operations
- Increasing throughput
- Making better use of CPU resources

---

# Relation to Writable Streams

Node.js `Writable` streams use the same buffering strategy internally.

```
Application
      │
      ▼
Internal Buffer
      │
(Buffer fills)
      │
      ▼
Disk Write
```

Instead of writing every chunk immediately, streams accumulate data in memory and flush larger chunks to the destination.

---

# Concepts Covered

- File Descriptors
- Buffer Allocation
- Writing into a Buffer
- Partial Buffer Writes
- Buffer Overflow Handling
- Flushing Buffers
- File I/O Optimization
- Reducing System Calls
- Internal Buffering
- Writable Stream Internals

---

# Conclusion

This implementation recreates one of the core ideas behind Node.js writable streams.

By buffering data in memory and writing it to disk only when the buffer becomes full, the number of expensive disk operations is greatly reduced. This simple optimization leads to much better performance and explains why writable streams are the preferred choice for efficiently handling large amounts of data.