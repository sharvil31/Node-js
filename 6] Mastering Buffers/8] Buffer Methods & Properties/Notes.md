# Buffer Methods & Properties in Node.js

> A comprehensive guide to understanding Node.js `Buffer` methods and properties with practical examples.

---

# Table of Contents

- Introduction
- What is a Buffer?
- Why Buffers Exist
- Creating Buffers
- Buffer Methods
  - toString()
  - write()
  - toJSON()
  - slice()
  - subarray()
  - copy()
  - includes()
  - fill()
  - at()
  - swap16()
  - swap32()
  - swap64()
  - Reading Integer Methods
  - Writing Integer Methods

- Buffer Properties
  - buffer
  - byteLength
  - byteOffset
  - length

- Important Notes
- Conclusion

---

# Introduction

A **Buffer** is one of the most important classes in Node.js for working with binary data.

Whenever Node.js reads data from:

- Files
- TCP sockets
- HTTP requests
- HTTP responses
- Streams
- Images
- Audio
- Videos

it works with **Buffer** objects.

Unlike JavaScript strings, Buffers store **raw bytes**, making them ideal for handling binary data efficiently.

```javascript
import { Buffer } from "buffer";
```

---

# What is a Buffer?

A Buffer is a fixed-size sequence of bytes.

Internally:

```
Buffer
      │
      ▼
Uint8Array
      │
      ▼
ArrayBuffer
```

A Buffer is actually a subclass of `Uint8Array`, meaning every element occupies exactly **1 byte (8 bits)**.

Example:

```javascript
const buffer = Buffer.from("Hello");
```

Memory:

```
Index : 0   1   2   3   4

Bytes : 48  65  6C  6C  6F
```

---

# Why Buffers Exist

JavaScript strings are designed for text.

Computers, however, communicate using **bytes**.

Examples include:

- Reading files
- Sending data over the network
- Compressing files
- Encryption
- Audio processing
- Image processing
- Video streaming

Buffers allow Node.js to work directly with those bytes without converting them into JavaScript strings.

---

# Creating Buffers

## From a String

```javascript
const buffer = Buffer.from("Hello World");
```

---

## From an Array

```javascript
const buffer = Buffer.from([65, 66, 67]);
```

Output

```
ABC
```

---

## From an ArrayBuffer

```javascript
const arrayBuffer = new ArrayBuffer(8);

const buffer = Buffer.from(arrayBuffer);
```

The Buffer and ArrayBuffer share the same memory.

---

## Empty Buffer

```javascript
const buffer = Buffer.alloc(16);
```

Creates a zero-filled buffer.

---

## Unsafe Buffer

```javascript
const buffer = Buffer.allocUnsafe(16);
```

Faster because Node.js skips clearing the memory.

---

# Buffer Methods

---

# toString()

Converts binary data into a string.

```javascript
const buffer = Buffer.from("Hello");

console.log(buffer.toString());
```

Output

```
Hello
```

Supports multiple encodings.

```javascript
buffer.toString("hex");

buffer.toString("base64");

buffer.toString("utf8");
```

---

# write()

Writes data into an existing buffer.

```javascript
const buffer = Buffer.alloc(10);

buffer.write("Node");

console.log(buffer.toString());
```

Output

```
Node
```

Returns the number of bytes written.

---

# toJSON()

Converts a buffer into JSON.

```javascript
const buffer = Buffer.from("ABC");

console.log(buffer.toJSON());
```

Output

```json
{
  "type": "Buffer",
  "data": [65, 66, 67]
}
```

Useful when sending buffers through APIs.

---

# slice()

Returns a portion of the buffer.

```javascript
const buffer = Buffer.from("Hello World");

console.log(buffer.slice(6).toString());
```

Output

```
World
```

### Important

`slice()` **does not copy memory**.

It creates another view of the same memory.

Modifying one affects the other.

Because this behavior can be confusing, Node.js recommends using `subarray()` instead.

---

# subarray()

Modern alternative to `slice()`.

```javascript
const buffer = Buffer.from("Hello World");

const sub = buffer.subarray(6);

console.log(sub.toString());
```

Output

```
World
```

Advantages

- Faster
- No memory copy
- Consistent with Typed Arrays

---

# copy()

Copies bytes into another buffer.

```javascript
const source = Buffer.from("Hello");

const destination = Buffer.alloc(5);

source.copy(destination);

console.log(destination.toString());
```

Output

```
Hello
```

Syntax

```javascript
source.copy(target, targetStart, sourceStart, sourceEnd);
```

---

# includes()

Checks whether data exists inside the buffer.

```javascript
const buffer = Buffer.from("Hello");

console.log(buffer.includes("He"));
```

Output

```
true
```

Can search for

- Strings
- Numbers
- Buffers

---

# fill()

Fills every byte with a value.

```javascript
const buffer = Buffer.alloc(5);

buffer.fill("A");

console.log(buffer.toString());
```

Output

```
AAAAA
```

Can also use numbers.

```javascript
buffer.fill(65);
```

---

# at()

Returns the byte at a given index.

```javascript
const buffer = Buffer.from("Hello");

console.log(buffer.at(1));
```

Output

```
101
```

Supports negative indexing.

```javascript
buffer.at(-1);
```

Returns the last byte.

---

# swap16()

Swaps every 2-byte pair.

Original

```
12 34 56 78
```

After

```
34 12 78 56
```

Example

```javascript
const buffer = Buffer.from([0x12, 0x34, 0x56, 0x78]);

buffer.swap16();

console.log(buffer);
```

### Rule

Buffer length must be divisible by **2**.

Otherwise Node.js throws a `RangeError`.

---

# swap32()

Swaps every 4-byte group.

Example

Before

```
11 22 33 44
```

After

```
44 33 22 11
```

Buffer length must be divisible by **4**.

---

# swap64()

Swaps every 8-byte group.

Buffer length must be divisible by **8**.

Useful when converting data between different byte orders.

---

# Reading Integer Methods

Node.js provides methods for reading numbers directly from raw bytes.

Examples

```javascript
readInt8();

readUInt8();

readInt16LE();

readInt16BE();

readUInt16LE();

readUInt16BE();

readInt32LE();

readInt32BE();

readUInt32LE();

readUInt32BE();

readFloatLE();

readFloatBE();

readDoubleLE();

readDoubleBE();
```

Example

```javascript
const buffer = Buffer.from([0x01, 0x00]);

console.log(buffer.readInt16LE(0));
```

Output

```
1
```

---

# Writing Integer Methods

These methods store numbers inside a buffer.

Examples

```javascript
writeInt8();

writeUInt8();

writeInt16LE();

writeInt16BE();

writeUInt16LE();

writeUInt16BE();

writeInt32LE();

writeInt32BE();

writeFloatLE();

writeFloatBE();

writeDoubleLE();

writeDoubleBE();
```

Example

```javascript
const buffer = Buffer.alloc(2);

buffer.writeInt8(65);

console.log(buffer);
```

Output

```
<Buffer 41 00>
```

---

# Buffer Properties

---

# buffer

Returns the underlying `ArrayBuffer`.

```javascript
console.log(buffer.buffer);
```

Since Buffer extends `Uint8Array`, it stores data inside an `ArrayBuffer`.

---

# byteLength

Returns the number of bytes occupied.

```javascript
console.log(buffer.byteLength);
```

Example

```
11
```

For Buffers, this equals the number of bytes stored.

---

# byteOffset

Returns the starting offset of the Buffer within its underlying `ArrayBuffer`.

```javascript
console.log(buffer.byteOffset);
```

This value may not be zero because multiple Buffers can share the same memory pool.

---

# length

Returns the length of the Buffer in bytes.

```javascript
console.log(buffer.length);
```

Example

```
11
```

For Buffers:

```javascript
buffer.length === buffer.byteLength;
```

Both represent the total number of bytes.

---

# Important Notes

- Buffer is a subclass of `Uint8Array`.
- Buffers store raw binary data.
- `Buffer.alloc()` initializes memory with zeros.
- `Buffer.allocUnsafe()` is faster but may contain old memory.
- Prefer `subarray()` over `slice()`.
- `swap16()`, `swap32()`, and `swap64()` require the buffer length to be a multiple of 2, 4, and 8 respectively.
- Reading methods interpret bytes as numbers.
- Writing methods encode numbers into bytes.
- `buffer.buffer` exposes the underlying `ArrayBuffer`.
- `byteOffset` indicates where the Buffer starts inside the shared memory.
- `length` and `byteLength` are identical for Buffers because each element is exactly one byte.

---

# Conclusion

Understanding Buffer methods and properties is essential for working with binary data in Node.js. Whether you're reading files, handling streams, processing network packets, or building high-performance applications, Buffers provide the foundation for efficient byte-level operations.

Mastering these APIs will help you understand how Node.js interacts with data beneath JavaScript's string abstractions and prepare you for advanced topics such as Streams, file systems, networking, cryptography, and protocol design.
