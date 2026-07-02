# Buffer in Node.js

## Introduction

`Buffer` is one of the most fundamental classes in Node.js. It allows JavaScript to work directly with **raw binary data**.

Unlike browsers, Node.js frequently interacts with operating system resources such as:

- Files
- Images
- Videos
- Audio
- Network sockets
- HTTP requests & responses
- Databases
- Cryptography
- Streams

All of these deal with **bytes**, not JavaScript strings.

To efficiently manipulate binary data, Node.js provides the **Buffer** class.

---

# Why was Buffer introduced?

JavaScript was originally designed for browsers where most operations involve:

- Strings
- Numbers
- Objects
- Arrays

However, server-side applications constantly exchange binary data.

Examples:

- Reading a PNG image
- Receiving an uploaded PDF
- Sending an MP4 video
- Encrypting passwords
- Compressing files

Node.js needed a fast and memory-efficient way to represent raw bytes.

That's where **Buffer** comes in.

---

# What is a Buffer?

A Buffer is simply a sequence of bytes stored in memory.

```
Index

0    1    2    3
+----+----+----+----+
|97  |98  |99  |100 |
+----+----+----+----+

ASCII

97 -> a
98 -> b
99 -> c
100 -> d
```

Every element occupies exactly **1 byte (8 bits).**

---

# Buffer is a subclass of Uint8Array

Internally, Buffer extends JavaScript's Uint8Array.

```javascript
Buffer.prototype.__proto__ === Uint8Array.prototype;
```

Therefore every Buffer is also a Uint8Array.

```
ArrayBuffer
      ▲
      │
Uint8Array
      ▲
      │
   Buffer
```

The difference is that Buffer provides many additional methods specifically for Node.js.

Examples include:

- toString()
- write()
- copy()
- slice()
- subarray()
- concat()
- equals()
- compare()
- readUInt32LE()
- writeUInt32BE()

and many more.

---

# Creating Buffers

## 1. Buffer.alloc()

Creates a new buffer and initializes every byte to zero.

```javascript
const buffer = Buffer.alloc(4);

console.log(buffer);
```

Output

```
<Buffer 00 00 00 00>
```

Memory

```
00 00 00 00
```

### Characteristics

✅ Safe

✅ Memory is cleared

❌ Slightly slower

---

## 2. Buffer.allocUnsafe()

```javascript
const buffer = Buffer.allocUnsafe(4);

console.log(buffer);
```

Possible output

```
<Buffer c2 81 af 55>
```

or

```
<Buffer 41 00 21 8f>
```

The values are unpredictable.

### Why?

Node simply reserves memory without clearing it.

The memory may still contain bytes from previous allocations.

Think of it like receiving a reused notebook without erasing the old writing.

### Characteristics

✅ Very fast

❌ Memory contains garbage values

⚠ Never read from it before writing your own data.

Example

```javascript
const buffer = Buffer.allocUnsafe(4);

buffer.fill(0);
```

Now it becomes safe.

---

# Why is allocUnsafe faster?

Suppose we allocate

```
100 MB
```

Using Buffer.alloc()

```
Allocate memory

↓

Write 0

↓

Write 0

↓

Write 0

↓

Repeat for every byte
```

Using Buffer.allocUnsafe()

```
Allocate memory

↓

Done
```

No clearing happens.

This saves significant CPU time.

---

# Buffer.from()

Buffer.from() creates a buffer from existing data.

---

## From an Array

```javascript
const buffer = Buffer.from([97, 98, 99, 100]);
```

Memory

```
61 62 63 64
```

ASCII

```
abcd
```

---

## From a String

```javascript
const buffer = Buffer.from("Hello");
```

Memory

```
48 65 6c 6c 6f
```

These are UTF-8 encoded bytes.

---

## From an ArrayBuffer

```javascript
const arrayBuffer = new ArrayBuffer(4);

const uint8 = new Uint8Array(arrayBuffer);

uint8[0] = 97;
uint8[1] = 98;
uint8[2] = 99;
uint8[3] = 100;

const buffer = Buffer.from(arrayBuffer);

console.log(buffer.toString());
```

Output

```
abcd
```

---

# Shared Memory

This is one of the most important concepts.

When using

```javascript
Buffer.from(arrayBuffer);
```

Node **does not copy the data.**

Instead, Buffer and ArrayBuffer share the same memory.

```
           Raw Memory

+---------------------------+
|97|98|99|100|
+---------------------------+
        ▲
        │
 ArrayBuffer
        ▲
        │
 Uint8Array
        ▲
        │
    Buffer
```

Changing one changes the others.

Example

```javascript
uint8[0] = 65;

console.log(buffer[0]);
```

Output

```
65
```

Similarly

```javascript
buffer[1] = 66;

console.log(uint8[1]);
```

Output

```
66
```

---

# Understanding byteLength

Consider

```javascript
const buffer = Buffer.alloc(4);

console.log(buffer.byteLength);
```

Output

```
4
```

This tells us

> This Buffer exposes exactly four bytes.

---

# Understanding buffer.buffer

Every Buffer internally stores data inside an ArrayBuffer.

```
Buffer

↓

ArrayBuffer

↓

RAM
```

So

```javascript
console.log(buffer.buffer);
```

returns the underlying ArrayBuffer.

---

# Why do these outputs differ?

```javascript
const buffer1 = Buffer.from(arrayBuffer);

const buffer2 = Buffer.from([97, 98, 99, 100]);

const buffer3 = Buffer.allocUnsafe(4);

console.log(buffer1.byteLength);
console.log(buffer2.byteLength);
console.log(buffer3.byteLength);

console.log(buffer1.buffer.byteLength);
console.log(buffer2.buffer.byteLength);
console.log(buffer3.buffer.byteLength);
```

Typical output

```
4
4
4

4
8192
8192
```

Many beginners find this confusing.

---

## byteLength

```
buffer.byteLength
```

means

> How many bytes this Buffer exposes.

---

## buffer.buffer.byteLength

means

> Size of the underlying ArrayBuffer.

For

```javascript
Buffer.from(arrayBuffer);
```

the ArrayBuffer already existed.

Size = 4 bytes.

For

```javascript
Buffer.from([97, 98, 99, 100]);
```

Node usually allocates memory from an internal memory pool.

The pool is typically

```
8192 bytes
```

Your Buffer occupies only a small slice.

```
8192-byte Pool

+-----------------------------------------------------------+
| ... |97|98|99|100| ... remaining bytes ...                |
+-----------------------------------------------------------+
      ^
      |
  Your Buffer
```

The same often happens with

```javascript
Buffer.allocUnsafe();
```

---

# Buffer Pool

Creating thousands of tiny buffers individually is expensive.

Instead of

```
Allocate 4 bytes

Allocate 4 bytes

Allocate 4 bytes

Allocate 4 bytes
```

Node allocates one larger block.

```
8192 bytes
```

and distributes slices.

This improves

- Speed
- Memory management
- Performance

---

# Benchmark

```javascript
console.time("alloc");

for (let i = 0; i < 1000000; i++) Buffer.alloc(1024);

console.timeEnd("alloc");

console.time("unsafe");

for (let i = 0; i < 1000000; i++) Buffer.allocUnsafe(1024);

console.timeEnd("unsafe");
```

Typical result

```
alloc

650ms

unsafe

120ms
```

Exact timings depend on your machine.

---

# Converting Buffer to String

```javascript
const buffer = Buffer.from([72, 101, 108, 108, 111]);

console.log(buffer.toString());
```

Output

```
Hello
```

Unlike Uint8Array, Buffer already knows how to decode bytes.

---

# Common Methods

## Read

```javascript
buffer[0];
```

---

## Write

```javascript
buffer[0] = 65;
```

---

## Convert to String

```javascript
buffer.toString();
```

---

## Copy

```javascript
Buffer.from(buffer);
```

---

## Slice

```javascript
buffer.slice(0, 5);
```

---

## Concatenate

```javascript
Buffer.concat([Buffer.from("Hello "), Buffer.from("World")]);
```

---

## Fill

```javascript
buffer.fill(0);
```

---

# Buffer vs ArrayBuffer vs Uint8Array

| Feature           | ArrayBuffer | Uint8Array | Buffer |
| ----------------- | ----------- | ---------- | ------ |
| Owns memory       | ✅          | ❌         | ❌     |
| Reads bytes       | ❌          | ✅         | ✅     |
| Writes bytes      | ❌          | ✅         | ✅     |
| String conversion | ❌          | ❌         | ✅     |
| File System       | ❌          | Limited    | ✅     |
| Streams           | ❌          | Limited    | ✅     |
| Networking        | ❌          | Limited    | ✅     |
| Encoding helpers  | ❌          | ❌         | ✅     |
| Base64 & Hex      | ❌          | ❌         | ✅     |

---

# When should you use Buffer?

Use Buffer whenever working with:

- Files
- Streams
- Networking
- Binary protocols
- Cryptography
- Compression
- Images
- Videos
- Audio
- TCP sockets
- HTTP requests and responses

Whenever Node.js interacts with raw bytes, Buffer is the standard choice.

---

# Key Takeaways

- Buffer is Node.js's binary data type.
- Buffer extends Uint8Array.
- Every element occupies one byte.
- Buffer provides many helper methods for binary manipulation.
- Buffer.alloc() creates zero-filled memory.
- Buffer.allocUnsafe() skips initialization for better performance.
- Buffer.from(ArrayBuffer) shares memory instead of copying it.
- byteLength is the visible size of the Buffer.
- buffer.buffer.byteLength is the size of the underlying ArrayBuffer.
- Small Buffers are usually allocated from Node's internal 8 KB memory pool.
- Buffer is heavily used by Node's File System, Streams, Networking, HTTP, Crypto, and Compression modules.
