# Writable Stream States in Node.js

Understanding the different states of a **Writable Stream** is essential when working with files, network sockets, HTTP responses, or any destination where data is written in Node.js.

Node.js provides several built-in properties that allow you to inspect the current state of a writable stream, making it easier to debug applications, manage backpressure, and understand exactly what is happening internally.

---

# 1. Writable State

This is the default state immediately after creating a writable stream.

The stream is ready to receive data through the `write()` method.

### Property

```javascript
writeStream.writable
```

Returns:

* `true` → Stream accepts writes
* `false` → Stream no longer accepts writes

Example

```javascript
console.log(writeStream.writable);
```

Output

```text
true
```

After the stream has ended or been destroyed:

```javascript
writeStream.end();

console.log(writeStream.writable);
```

Output

```text
false
```

---

# 2. Corked State

Sometimes writing lots of very small chunks individually is inefficient.

Node.js allows you to temporarily buffer all writes using `cork()`.

Instead of immediately sending every chunk to the operating system, Node stores them internally.

When `uncork()` is called, Node flushes all buffered chunks together.

This reduces the number of write operations.

Example

```javascript
writeStream.cork();

writeStream.write("Hello");
writeStream.write("World");

writeStream.uncork();
```

---

## Checking Corked State

```javascript
writeStream.writableCorked
```

Returns

* `0` → Not corked
* Greater than `0` → Number of active cork calls

Example

```javascript
writeStream.cork();

console.log(writeStream.writableCorked);
```

Output

```text
1
```

After

```javascript
writeStream.uncork();
```

Output

```text
0
```

> Every call to `cork()` should eventually be matched with a corresponding `uncork()`.

---

# 3. Ended State

Calling

```javascript
writeStream.end();
```

tells Node that no more data will be written.

The stream stops accepting new writes immediately.

However, buffered data may still be waiting to be written.

The stream has **not necessarily finished writing everything** yet.

---

## Checking Ended State

```javascript
writeStream.writableEnded
```

Returns

* `true` → `end()` has been called
* `false` → Otherwise

Example

```javascript
writeStream.end();

console.log(writeStream.writableEnded);
```

Output

```text
true
```

---

# 4. Finished State

The stream reaches the **Finished** state only after:

* `end()` has been called
* every buffered chunk has been written
* the `"finish"` event has been emitted

At this point the stream has completely finished writing.

---

## Checking Finished State

```javascript
writeStream.writableFinished
```

Returns

* `true` → Writing is complete
* `false` → Writing is still in progress

Example

```javascript
writeStream.on("finish", () => {
    console.log(writeStream.writableFinished);
});
```

Output

```text
true
```

---

# Why are Ended and Finished Different?

Many beginners assume these are identical.

They are not.

When `end()` is called:

```
end()
```

Node immediately changes

```javascript
writableEnded
```

to

```text
true
```

because no further writes are allowed.

However, there may still be buffered data waiting to be written.

Only after Node flushes all remaining data does

```javascript
writableFinished
```

become

```text
true
```

Think of it like this:

```
end()
↓

No more writes allowed

↓

Flush remaining buffered data

↓

finish event

↓

writableFinished = true
```

---

# Buffered Data

Writable streams maintain an internal buffer.

The amount of buffered data can be checked using:

```javascript
writeStream.writableLength
```

Example

```javascript
console.log(writeStream.writableLength);
```

While data is waiting to be be written:

```text
16
```

After everything has been flushed:

```text
0
```

---

# Backpressure

If data is written faster than the destination can consume it, Node temporarily buffers the data.

When the internal buffer reaches its limit (`highWaterMark`), `write()` returns `false`.

At that point, you should wait for the `"drain"` event before writing again.

Property

```javascript
writeStream.writableNeedDrain
```

Returns

* `true` → Buffer is full
* `false` → Buffer has space available

Example

```javascript
const ok = writeStream.write(bigChunk);

if (!ok) {
    writeStream.once("drain", () => {
        console.log("Buffer is ready again.");
    });
}
```

---

# Destroyed State

Destroying a stream permanently closes it.

```javascript
writeStream.destroy();
```

Check

```javascript
writeStream.destroyed
```

Returns

* `true`
* `false`

Example

```javascript
writeStream.destroy();

console.log(writeStream.destroyed);
```

Output

```text
true
```

---

# Error State

If a writable stream is destroyed because of an error, Node stores the error object.

Property

```javascript
writeStream.errored
```

Example

```javascript
writeStream.destroy(
    new Error("Something went wrong")
);

console.log(writeStream.errored);
```

Output

```text
Error: Something went wrong
```

If no error has occurred:

```text
null
```

---

# Stream Lifecycle

```
Writable

      │

      ▼

 write()

      │

      ▼

Buffer Data

      │

      ▼

Need Drain?

      │

      ▼

drain event

      │

      ▼

 end()

      │

      ▼

writableEnded = true

      │

Flush Remaining Data

      │

      ▼

finish event

      │

      ▼

writableFinished = true
```

---

# Important Observations

### `writableEnded`

Becomes `true` immediately after calling `end()`.

---

### `writableFinished`

Becomes `true` only after every buffered chunk has been written.

---

### `writableLength`

Shows how much data is currently waiting inside the writable stream's internal buffer.

---

### `errored`

Returns `null` unless the stream has failed with an error.

---

### `destroyed`

Returns whether the stream has been permanently destroyed.

---

# Best Practice

Instead of using `setTimeout()` to check whether writing has finished, listen for the `"finish"` event.

```javascript
writeStream.on("finish", () => {
    console.log(writeStream.writableFinished);
    console.log(writeStream.writableLength);
});
```

This is deterministic and guarantees that all buffered data has been successfully written.

---

# Key Takeaways

* `writable` indicates whether the stream can currently accept writes.
* `cork()` buffers multiple writes to improve efficiency.
* `writableCorked` tells how many active cork operations exist.
* `end()` prevents future writes but may still leave buffered data to flush.
* `writableEnded` changes immediately after calling `end()`.
* `writableFinished` becomes `true` only after all buffered data has been written.
* `writableLength` reports how much data is currently buffered.
* `writableNeedDrain` helps detect backpressure.
* `destroyed` indicates whether the stream has been permanently closed.
* `errored` contains the error object if the stream failed.
* Prefer the `"finish"` event over `setTimeout()` when waiting for writes to complete.

Understanding these properties makes it much easier to debug writable streams and build efficient, production-ready Node.js applications.
