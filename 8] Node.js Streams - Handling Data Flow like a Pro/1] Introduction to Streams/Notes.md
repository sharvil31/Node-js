# Introduction to Streams in Node.js

## What are Streams?

Streams are one of the most important features of Node.js. They allow you to process data **piece by piece (chunks)** instead of loading the entire data into memory at once.

Streams make Node.js extremely efficient for handling large files, network communication, file uploads/downloads, video streaming, and many other real-world applications.

---

# Why Do We Need Streams?

Before understanding streams, let's understand the limitation of using Buffers.

Buffers store data in **RAM (Memory)**.

Suppose your system has:

- Hard Disk: **500 GB**
- RAM: **8 GB**
- Available RAM after the operating system: **5 GB**

Now imagine reading a **50 GB** file.

If you use a Buffer to read the entire file, Node.js tries to load all 50 GB into memory.

Since only around 5 GB is available, your application may run out of memory and crash.

This is why reading huge files using Buffers alone is not practical.

---

# How Streams Solve This Problem

Instead of loading the complete file into memory, streams process data in **small chunks**.

The process looks like this:

```
Source
   │
   ▼
Read Small Chunk (Buffer)
   │
   ▼
Transfer / Process
   │
   ▼
Write Chunk
   │
   ▼
Repeat until completed
```

A stream:

1. Reads a small chunk of data.
2. Processes or transfers that chunk.
3. Removes it from memory.
4. Reads the next chunk.
5. Continues until the entire file is processed.

Because only a small portion of data stays in memory, RAM usage remains low.

---

# Example

Imagine copying a **100 GB** movie.

## Without Streams

```
Read entire 100 GB
        │
        ▼
Store in RAM
        │
        ▼
Not enough memory
        │
        ▼
Application crashes
```

---

## With Streams

```
Read 64 KB
Write 64 KB

Read next 64 KB
Write next 64 KB

Read next 64 KB
Write next 64 KB

...

Continue until 100 GB is copied.
```

Only a tiny amount of memory is used during the entire process.

---

# Streams Internally Use Buffers

A common misconception is that Streams replace Buffers.

They don't.

Streams actually **use Buffers internally**.

The difference is:

- **Buffer** stores the complete data (or as much as you allocate).
- **Stream** repeatedly creates small Buffers (chunks) and processes them one after another.

You can think of Streams as an intelligent way of managing Buffers.

---

# Where are Streams Used?

Streams are everywhere in Node.js.

Examples include:

- Reading files
- Writing files
- File uploads
- File downloads
- HTTP Requests
- HTTP Responses
- Video Streaming
- Audio Streaming
- Database Export
- Database Import
- Network Communication
- TCP Sockets

Whenever data moves continuously, Streams are usually involved.

---

# Streams vs Buffers

| Buffer                          | Stream                        |
| ------------------------------- | ----------------------------- |
| Loads complete data into memory | Processes data chunk by chunk |
| High memory usage               | Low memory usage              |
| Not suitable for huge files     | Perfect for huge files        |
| Can cause memory issues         | Memory efficient              |
| Entire data must be available   | Data is processed immediately |

---

# Types of Streams

Node.js provides four types of Streams.

---

# 1. Readable Stream

Readable Streams are used to **read data** from a source.

Examples:

- Reading files
- HTTP Requests
- Reading from sockets
- Reading user input

Examples:

```javascript
import fs from "fs";

const readable = fs.createReadStream("movie.mp4");
```

---

# 2. Writable Stream

Writable Streams are used to **write data** to a destination.

Examples:

- Writing files
- HTTP Responses
- Writing to sockets
- Console output

Example:

```javascript
import fs from "fs";

const writable = fs.createWriteStream("copy.mp4");
```

---

# 3. Duplex Stream

Duplex Streams can both **read and write**.

Think of a phone call.

You can:

- Speak
- Listen

at the same time.

Examples:

- TCP Socket
- Network Connections

---

# 4. Transform Stream

Transform Streams are special Duplex Streams.

They:

- Read data
- Modify it
- Write the transformed data

Examples:

- Compression
- Decompression
- Encryption
- Decryption
- Converting text to uppercase
- Image Processing

---

# Real-Life Analogy

Imagine moving **10,000 books** to another house.

Without Streams:

You try carrying every book at once.

Impossible.

With Streams:

Carry 20 books.

Come back.

Carry another 20.

Repeat.

Eventually all books are moved without exhausting yourself.

Streams work exactly the same way.

---

# Advantages of Streams

- Very memory efficient
- Handles huge files
- Faster for continuous data processing
- Reduces RAM consumption
- Suitable for real-time applications
- Used extensively in networking
- Improves application scalability

---

# Key Takeaways

- Streams process data incrementally instead of loading everything into memory.
- Streams internally use Buffers to store small chunks of data.
- Streams make it possible to process files much larger than the available RAM.
- Streams are ideal for handling large files, networking, uploads, downloads, and media streaming.
- Node.js provides four types of streams:
  - Readable
  - Writable
  - Duplex
  - Transform

Mastering Streams is essential for writing scalable and memory-efficient Node.js applications.
