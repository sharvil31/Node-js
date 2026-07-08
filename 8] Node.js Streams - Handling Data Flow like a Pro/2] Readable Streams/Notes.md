# Node.js Read Streams

Read Streams are one of the core features of Node.js that allow us to read data **piece by piece (chunks)** instead of loading the entire file into memory. They are designed to efficiently process large files while keeping memory usage low.

---

# Why Read Streams?

Suppose you want to read a **2 GB video file**.

Using `fs.readFile()`:

```javascript
import fs from "fs/promises";

const buffer = await fs.readFile("movie.mkv");
```

Node.js loads the **entire file into RAM** before your program can use it.

```
Hard Disk
     │
     ▼
Entire File
     │
     ▼
RAM
     │
     ▼
Application
```

### Problems

- High memory consumption.
- Large files may crash the application.
- Other applications get less available memory.
- Processing doesn't begin until the whole file is loaded.

---

# The Solution: Read Streams

Instead of loading everything at once, Node.js reads the file in **small chunks**.

```
Hard Disk

Chunk 1
   │
   ▼

Chunk 2
   │
   ▼

Chunk 3
   │
   ▼

Chunk 4
   │
   ▼

Application
```

Only a small portion of the file stays in memory at any given time.

This makes Read Streams ideal for:

- Large video files
- Audio files
- Large text files
- Log files
- Database exports
- CSV processing

---

# Creating a Read Stream

```javascript
import fs from "fs";

const readStream = fs.createReadStream("movie.mkv");
```

Creating the stream **does not immediately read the file**.

It creates a stream object that begins reading when the stream starts flowing.

---

# Syntax

```javascript
fs.createReadStream(path, options);
```

Example:

```javascript
const readStream = fs.createReadStream("movie.mkv", {
  highWaterMark: 1024 * 1024,
});
```

---

# highWaterMark

`highWaterMark` specifies the maximum number of bytes to read in one chunk.

```javascript
highWaterMark: 1024 * 1024;
```

means

```
1 MB
```

Node.js will approximately emit one **1 MB Buffer** at a time.

Example

For a **100 MB** file

```
Chunk 1 → 1 MB

Chunk 2 → 1 MB

Chunk 3 → 1 MB

...

Chunk 100 → 1 MB
```

---

# Default Chunk Size

For file streams, the default value is

```
64 KiB

=

65536 bytes
```

If a file is 64 MB

Default:

```
64 MB / 64 KB

=

1024 chunks
```

With

```javascript
highWaterMark: 1024 * 1024;
```

```
64 chunks
```

---

# The data Event

The most commonly used event is **data**.

```javascript
readStream.on("data", (chunk) => {});
```

Every time Node.js reads a chunk, it emits the `data` event.

```
Read Chunk

↓

Emit "data"

↓

Read Next Chunk

↓

Emit "data"
```

---

# What is chunk?

Each chunk is a **Buffer**.

```javascript
readStream.on("data", (chunk) => {
  console.log(chunk);
});
```

Output

```
<Buffer ff d8 ff e0 ...>
```

You can:

- Save it
- Modify it
- Compress it
- Encrypt it
- Send it over a network
- Write it into another file

---

# Counting Chunks

```javascript
let count = 0;

readStream.on("data", () => {
  count++;
});
```

If

```
File Size

=

2 GB

Chunk Size

=

1 MB
```

Approximately

```
2048 chunks
```

will be emitted.

---

# The end Event

When there is no more data to read, Node.js emits the `end` event.

```javascript
readStream.on("end", () => {
  console.log("Reading Complete");
});
```

Lifecycle

```
Open File

↓

Read Chunk

↓

Emit data

↓

Read Chunk

↓

Emit data

↓

...

↓

No More Data

↓

Emit end
```

---

# Copying a File Using Read Streams

```javascript
import fs from "fs";

const readStream = fs.createReadStream("video.mp4");

readStream.on("data", (chunk) => {
  fs.appendFileSync("copy.mp4", chunk);
});
```

Each chunk is appended to the destination file until the copy is complete.

Although this works, it is **not the recommended approach**.

---

# Better Way: Pipe

Node.js streams are designed to work together.

```javascript
import fs from "fs";

const readStream = fs.createReadStream("video.mp4");
const writeStream = fs.createWriteStream("copy.mp4");

readStream.pipe(writeStream);
```

Advantages:

- Faster
- Less code
- Built-in backpressure handling
- Optimized memory usage

---

# Performance Comparison

## fs.readFile()

```javascript
const buffer = await fs.promises.readFile("movie.mkv");
```

### Characteristics

- Loads the complete file into memory.
- Very high RAM usage.
- Good for small files.
- Starts processing only after reading finishes.

---

## Read Stream

```javascript
const readStream = fs.createReadStream("movie.mkv");
```

### Characteristics

- Reads small chunks.
- Low memory usage.
- Starts processing immediately.
- Best for large files.

---

# When Should You Use Read Streams?

Use Read Streams when:

- Reading large files
- Uploading files
- Downloading files
- Streaming videos
- Processing CSV files
- Reading huge log files
- Transferring files over a network

---

# When is fs.readFile() Better?

Use `fs.readFile()` when:

- The file is small.
- You need the complete content at once.
- Simplicity is more important than memory optimization.

Examples:

- Reading a JSON configuration file
- Reading a small text file
- Loading HTML templates

---

# Key Takeaways

- Read Streams read files chunk by chunk.
- They significantly reduce memory usage.
- Each chunk is received as a Buffer.
- `highWaterMark` controls chunk size.
- `data` is emitted for every chunk.
- `end` is emitted after the entire file is read.
- Streams are ideal for processing large files.
- `pipe()` is the preferred way to transfer data from a Read Stream to a Write Stream.
