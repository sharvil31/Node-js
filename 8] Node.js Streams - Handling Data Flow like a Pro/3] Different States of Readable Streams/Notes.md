# Readable Stream States in Node.js

Understanding the state of a readable stream is important because it helps explain how Node.js manages the flow of data internally.

A readable stream can be in one of four states:

1. Initial State
2. Flowing State
3. Paused State
4. Ended State

---

# Demo Code

```javascript
import fs from "fs";

const readStream = fs.createReadStream("chars.txt", {
  highWaterMark: 4,
});

readStream.on("data", (chunk) => {
  fs.appendFileSync("abc.txt", chunk);

  // readStream.pause();

  // setTimeout(() => {
  //   readStream.resume();
  // }, 500);
});

readStream.on("resume", () => {
  console.log("Stream Resumed");
});

readStream.on("pause", () => {
  console.log("Stream Paused");
});

readStream.on("end", () => {
  console.log(readStream.readableFlowing);
  console.log(readStream.readableEnded);
  console.log(readStream.isPaused());
});
```

---

# 1. Initial State

When a readable stream is created, it starts in the **Initial State**.

At this point:

- The stream has not started reading data.
- No consumer is attached.
- No `'data'` events are emitted.
- The stream is waiting for someone to consume it.

### Properties

```javascript
readStream.readableFlowing; // null
readStream.readableEnded; // false
readStream.isPaused(); // false
```

| Property        | Value   |
| --------------- | ------- |
| readableFlowing | `null`  |
| readableEnded   | `false` |
| isPaused()      | `false` |

---

# 2. Flowing State

A stream enters the **Flowing State** when Node.js starts automatically reading data.

This happens when:

- A `'data'` event listener is attached.
- `stream.resume()` is called.
- `stream.pipe()` is used.

Node.js continuously reads chunks from the source and emits `'data'` events until the stream is paused or reaches the end.

### Properties

```javascript
readStream.readableFlowing; // true
readStream.readableEnded; // false
readStream.isPaused(); // false
```

| Property        | Value   |
| --------------- | ------- |
| readableFlowing | `true`  |
| readableEnded   | `false` |
| isPaused()      | `false` |

---

# 3. Paused State

The stream enters the **Paused State** when `pause()` is called.

```javascript
readStream.pause();
```

While paused:

- No `'data'` events are emitted.
- Node.js temporarily stops pushing new chunks.
- The stream can continue later using `resume()`.

```javascript
readStream.resume();
```

### Properties

```javascript
readStream.readableFlowing; // false
readStream.readableEnded; // false
readStream.isPaused(); // true
```

| Property        | Value   |
| --------------- | ------- |
| readableFlowing | `false` |
| readableEnded   | `false` |
| isPaused()      | `true`  |

---

# 4. Ended State

The stream reaches the **Ended State** after all data has been read.

The `'end'` event is emitted exactly once.

At this point:

- Every chunk has already been consumed.
- No more `'data'` events will occur.
- The stream cannot be resumed because there is nothing left to read.

### Properties

```javascript
readStream.readableFlowing; // false
readStream.readableEnded; // true
readStream.isPaused(); // false
```

| Property        | Value   |
| --------------- | ------- |
| readableFlowing | `false` |
| readableEnded   | `true`  |
| isPaused()      | `false` |

---

# Stream State Comparison

| Stream State | readableFlowing | readableEnded | isPaused() |
| ------------ | --------------- | ------------- | ---------- |
| Initial      | `null`          | `false`       | `false`    |
| Flowing      | `true`          | `false`       | `false`    |
| Paused       | `false`         | `false`       | `true`     |
| Ended        | `false`         | `true`        | `false`    |

---

# Understanding the Three Properties

## readableFlowing

Indicates whether Node.js is automatically pushing data to your application.

Possible values:

- `null` → Reading hasn't started yet.
- `true` → Data is flowing automatically.
- `false` → Data is not flowing.

---

## readableEnded

Indicates whether the stream has finished reading all available data.

Possible values:

- `false` → More data is available.
- `true` → The stream has reached the end.

---

## isPaused()

Returns whether the stream has been explicitly paused.

Possible values:

- `true` → Stream is paused.
- `false` → Stream is not paused.

---

# Important Observation

A stream **can stop flowing without being paused**.

For example, after the stream reaches the end:

```javascript
readStream.readableFlowing; // false
readStream.isPaused(); // false
```

This surprises many developers.

The stream isn't paused—it has simply finished reading all of its data.

---

# Event Order

A typical readable stream follows this lifecycle:

```
Initial State
       │
       ▼
Flowing State
       │
       ▼
Paused State (optional)
       │
       ▼
Flowing State
       │
       ▼
Ended State
```

---

# Key Takeaways

- Every readable stream starts in the Initial State.
- Attaching a `'data'` listener automatically switches the stream into Flowing Mode.
- Calling `pause()` stops automatic data delivery.
- Calling `resume()` continues reading.
- After the `'end'` event, the stream is finished forever.
- `readableFlowing` tells whether data is currently flowing.
- `readableEnded` tells whether all data has been consumed.
- `isPaused()` only indicates whether the stream was explicitly paused.
- A stream can have `readableFlowing === false` and `isPaused() === false` after it has ended.
