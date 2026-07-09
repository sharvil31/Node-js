# Readable Streams - Encoding, Events and destroy()

In the previous notes, we learned how Readable Streams read files chunk by chunk and how they internally manage data using a buffer.

Now let's explore some additional Readable Stream features:

- Reading strings instead of Buffers
- Stream lifecycle events
- Destroying a stream
- Stream event order

---

# Example

```javascript
import fs from "fs";

const readStream = fs.createReadStream("chars.txt", {
  highWaterMark: 4,
  encoding: "utf-8",
});

readStream.on("data", (chunk) => {
  console.log(chunk);
});
```

---

# Encoding

Normally, Readable Streams emit **Buffer** objects.

Example:

```javascript
<Buffer 61 62 63 64>
```

If you provide an encoding while creating the stream,

```javascript
encoding: "utf-8";
```

or

```javascript
readStream.setEncoding("utf-8");
```

then every chunk becomes a JavaScript string.

Example:

```javascript
abcd;
efgh;
ijkl;
```

instead of

```javascript
<Buffer 61 62 63 64>
```

So,

Without encoding

```
Buffer
```

With encoding

```
String
```

Both methods below do the same thing.

Method 1

```javascript
const readStream = fs.createReadStream("chars.txt", {
  encoding: "utf-8",
});
```

Method 2

```javascript
const readStream = fs.createReadStream("chars.txt");

readStream.setEncoding("utf-8");
```

---

# open Event

The **open** event fires when the operating system successfully opens the file.

```javascript
readStream.on("open", (fd) => {
  console.log(fd);
});
```

`fd` is the file descriptor.

This event occurs before any data is read.

Example output

```
18
```

---

# ready Event

The **ready** event means the stream is ready to start reading.

```javascript
readStream.on("ready", () => {
  console.log("Ready");
});
```

The file has been opened and the stream can now emit data.

---

# data Event

The **data** event is emitted every time a new chunk becomes available.

```javascript
readStream.on("data", (chunk) => {
  console.log(chunk);
});
```

If encoding is not set,

```
Buffer
```

is received.

If encoding is set,

```
String
```

is received.

---

# end Event

The **end** event fires when there is no more data left to read.

```javascript
readStream.on("end", () => {
  console.log("Finished reading");
});
```

Important:

- No more `data` events will occur after `end`.
- This only means reading is complete.

---

# close Event

The **close** event is emitted when the stream and its underlying resources are closed.

```javascript
readStream.on("close", () => {
  console.log("Closed");
});
```

The file descriptor has now been released.

Usually,

```
end
```

occurs before

```
close
```

Typical order

```
open
↓

ready
↓

data
↓

data
↓

data
↓

end
↓

close
```

---

# error Event

If something goes wrong, the stream emits an **error** event.

```javascript
readStream.on("error", (err) => {
  console.log(err);
});
```

Examples

- File doesn't exist
- Permission denied
- Calling destroy() with an Error

Always attach an error listener.

---

# destroy()

A stream can be destroyed manually.

```javascript
readStream.destroy();
```

Once destroyed,

- Reading stops immediately.
- Remaining chunks are discarded.
- The stream closes.

---

# destroy() with an Error

You can also pass an Error object.

```javascript
readStream.destroy(new Error("Something went wrong"));
```

Now,

- `error` event is emitted
- then `close` event is emitted

Example

```javascript
readStream.on("error", (err) => {
  console.log(err.message);
});

readStream.on("close", () => {
  console.log("Closed");
});
```

Output

```
Something went wrong
Closed
```

Notice that `end` does **not** occur because the stream didn't finish reading normally.

---

# Event Order

### Successful Read

```
open
↓

ready
↓

data
↓

data
↓

...
↓

end
↓

close
```

---

### destroy()

```
open
↓

ready
↓

data (optional)
↓

close
```

---

### destroy(new Error())

```
open
↓

ready
↓

data (optional)
↓

error
↓

close
```

---

# Summary

| Feature        | Description                           |
| -------------- | ------------------------------------- |
| encoding       | Converts emitted Buffers into strings |
| setEncoding()  | Changes chunk output to strings       |
| open           | File successfully opened              |
| ready          | Stream is ready for reading           |
| data           | New chunk received                    |
| end            | Reading completed successfully        |
| close          | Stream resources released             |
| error          | Something went wrong                  |
| destroy()      | Immediately stops reading             |
| destroy(Error) | Emits `error` then `close`            |

---

# Key Takeaways

- Streams emit Buffers by default.
- Setting an encoding makes chunks strings.
- `open` occurs when the file is opened.
- `ready` indicates the stream can begin reading.
- `data` fires for every chunk.
- `end` means all data has been read.
- `close` means the stream has released its resources.
- `destroy()` stops the stream immediately.
- `destroy(new Error())` emits `error` followed by `close`.
- `end` only occurs after a successful read.
