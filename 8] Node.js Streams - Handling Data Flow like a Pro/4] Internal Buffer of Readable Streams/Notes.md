# Internal Buffer of Readable Streams in Node.js

When we use a Readable Stream in Node.js, the data is **not directly sent to our application**. Instead, Node.js first stores the data inside an **internal buffer**. Our application then reads data from this buffer whenever it needs it.

Understanding how this internal buffer works is important because it explains why streams are memory efficient and how methods like `read()`, `readableLength`, and the `readable` event behave.

---

# What is the Internal Buffer?

Every **Readable Stream** has an internal memory area called the **internal buffer**.

When data is read from a file, network, or any other source, it is first placed inside this buffer.

Your application then consumes data from this buffer instead of reading directly from the source.

```
File
 │
 ▼
┌──────────────────────┐
│ Internal Buffer      │
└──────────────────────┘
 │
 ▼
Your Application
```

This buffering mechanism allows Node.js to efficiently handle large files without loading everything into memory.

---

# Example

```javascript
import fs from "fs";

const readStream = fs.createReadStream("chars.txt", {
  highWaterMark: 4,
});

readStream.on("readable", () => {
  console.log(readStream.readableLength);

  console.log(readStream.read(3));

  console.log(readStream.readableLength);
});
```

Suppose `chars.txt` contains:

```
ABCDEFGHIJKL
```

---

# Understanding `highWaterMark`

```javascript
highWaterMark: 4;
```

This tells Node.js to **attempt to read 4 bytes at a time** from the file.

It does **not** mean the internal buffer can never exceed 4 bytes.

Many beginners misunderstand this.

`highWaterMark` is simply a **threshold** that tells Node.js when it should try reading more data.

---

# Initial Read

Node.js reads the first four bytes.

```
ABCD
```

Internal buffer:

```
┌───────────────┐
│ A B C D       │
└───────────────┘
```

The `readable` event fires.

```javascript
console.log(readStream.readableLength);
```

Output:

```
4
```

because the buffer currently contains four bytes.

---

# Reading Three Bytes

```javascript
readStream.read(3);
```

Node removes three bytes from the beginning of the internal buffer.

Returned value:

```
ABC
```

Remaining buffer:

```
┌───────────────┐
│ D             │
└───────────────┘
```

Now

```javascript
console.log(readStream.readableLength);
```

prints

```
1
```

Output:

```
4
<Buffer 41 42 43>
1
```

---

# Buffer Refill

After most of the buffered data has been consumed, Node.js automatically reads another chunk from the file.

Next four bytes:

```
EFGH
```

Instead of replacing the remaining byte, Node appends the new data.

Old buffer:

```
D
```

New chunk:

```
EFGH
```

Combined buffer:

```
DEFGH
```

Current buffer:

```
┌─────────────────┐
│ D E F G H       │
└─────────────────┘
```

Buffer length:

```
5 bytes
```

Notice that the buffer now contains **5 bytes**, even though `highWaterMark` is only **4**.

This surprises many developers.

---

# Why is the Buffer Larger than `highWaterMark`?

Because `highWaterMark` is **not a maximum buffer size**.

It is only a recommendation that tells Node.js:

> "When buffered data becomes low, try reading another chunk."

Node.js never discards unread bytes.

Instead, it keeps the remaining bytes and appends newly read data.

That is why the internal buffer can temporarily become larger than `highWaterMark`.

---

# Second Readable Event

Current buffer:

```
DEFGH
```

Length:

```
5
```

Calling

```javascript
readStream.read(3);
```

returns

```
DEF
```

Remaining buffer:

```
GH
```

Output:

```
5
<Buffer 44 45 46>
2
```

---

# Third Refill

Current buffer:

```
GH
```

Node reads another chunk:

```
IJKL
```

Combined buffer:

```
GHIJKL
```

Length:

```
6
```

Again, the internal buffer becomes larger than `highWaterMark`.

This behavior is completely normal.

---

# `readableLength`

`readableLength` tells us how many bytes are currently stored inside the internal buffer.

Example:

```javascript
console.log(readStream.readableLength);
```

Possible output:

```
4
```

Later:

```
1
```

Later:

```
5
```

Later:

```
2
```

The value changes whenever data is added to or removed from the internal buffer.

---

## Does Node.js Read the Next Chunk When `readableLength` Reaches `highWaterMark`?

A common misconception is that when the internal buffer reaches the `highWaterMark` size, Node.js immediately reads the next chunk from the source.

**This is not how it works.**

Suppose we create a readable stream like this:

```javascript
const readStream = fs.createReadStream("chars.txt", {
  highWaterMark: 4,
});
```

and the file contains:

```text
ABCDEFGH
```

Initially, Node.js reads the first 4 bytes into the internal buffer.

```text
Internal Buffer
---------------
ABCD
```

At this point:

```javascript
console.log(readStream.readableLength);
```

prints:

```text
4
```

Even though the buffer contains exactly `highWaterMark` bytes, **Node.js does not read the next chunk**.

Why?

Because the buffer already has enough unread data. Reading more would only increase memory usage unnecessarily.

Now suppose we consume three bytes:

```javascript
readStream.read(3);
```

The internal buffer becomes:

```text
D
```

Now only one byte remains in the buffer.

Since the buffered data has dropped below the desired level, Node.js schedules another read from the file.

The next chunk:

```text
EFGH
```

is appended to the remaining byte.

```text
Before reading:
D

After reading:
DEFGH
```

The buffer now contains **5 bytes**, even though `highWaterMark` is **4**.

This demonstrates two important facts:

- `highWaterMark` is **not** the maximum size of the internal buffer.
- Node.js **does not** read another chunk simply because `readableLength` equals `highWaterMark`. It reads more data only after some buffered data has been consumed and the stream decides more data is needed.

---

# `read(size)`

The `read(size)` method removes exactly `size` bytes from the internal buffer (if enough data is available).

Example:

```javascript
readStream.read(3);
```

Buffer before:

```
ABCDE
```

Returns:

```
ABC
```

Remaining buffer:

```
DE
```

---

# `data` Event vs `readable` Event

## `data`

```javascript
readStream.on("data", (chunk) => {
  console.log(chunk);
});
```

Characteristics:

- Automatically switches the stream into Flowing Mode.
- Node.js pushes chunks automatically.
- You cannot control exactly when data is delivered.
- Easier for simple file reading.

---

## `readable`

```javascript
readStream.on("readable", () => {
  console.log(readStream.read(3));
});
```

Characteristics:

- Stream remains in Paused Mode.
- Data stays inside the internal buffer.
- You choose when to read.
- You decide how many bytes to consume.
- Useful for implementing parsers or reading binary protocols.

---

# Flow Diagram

```
chars.txt
    │
    ▼
Reads 4 bytes
    │
    ▼
┌─────────────────────┐
│ Internal Buffer      │
│ A B C D             │
└─────────────────────┘
    │
read(3)
    ▼
Returns ABC

Remaining

┌───────────────┐
│ D             │
└───────────────┘

Node reads again

EFGH

Buffer becomes

┌─────────────────────┐
│ D E F G H           │
└─────────────────────┘
```

---

# Key Takeaways

- Every Readable Stream has an internal buffer.
- Data is first stored inside the internal buffer before your application receives it.
- `highWaterMark` specifies how much data Node.js tries to read at once.
- `highWaterMark` is **not** a hard limit on buffer size.
- `readableLength` shows the amount of buffered data currently available.
- `read(size)` removes data from the internal buffer.
- Remaining bytes stay in the buffer and are combined with future reads.
- This is why the internal buffer may temporarily exceed `highWaterMark`.
- The `readable` event gives manual control over reading buffered data.
- The `data` event automatically delivers chunks as they become available.

---

## Conclusion

The internal buffer is one of the core concepts behind Node.js Streams. Instead of loading an entire file into memory, Node.js continuously fills this buffer with small chunks of data. Your application consumes these chunks at its own pace, making streams extremely memory-efficient and ideal for processing large files, network requests, and real-time data.
