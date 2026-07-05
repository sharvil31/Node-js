# EventEmitter Class in Node.js

The **EventEmitter** class is one of the most fundamental building blocks of Node.js. It powers Node.js' **Event-Driven Architecture**, allowing different parts of an application to communicate through events without being tightly coupled.

Many core Node.js modules—including **Streams, HTTP, File System (fs), Process, Net, and Readline**—are built on top of the `EventEmitter` class.

---

# What is EventEmitter?

An **EventEmitter** is a class that allows objects to:

- Emit custom events
- Listen for events
- Execute callbacks when events occur
- Remove listeners when no longer needed

Instead of continuously checking whether something has happened (polling), an object simply **emits an event**, and every registered listener responds automatically.

```
Event Occurs
      │
      ▼
 EventEmitter
      │
      ▼
 Notify Listeners
      │
      ▼
 Execute Callbacks
```

---

# Importing EventEmitter

```javascript
import EventEmitter from "events";

const emitter = new EventEmitter();
```

Now `emitter` can create and manage custom events.

---

# Registering Events

Use the `on()` method to register a listener.

```javascript
emitter.on("login", () => {
  console.log("User logged in.");
});
```

Nothing happens until the event is emitted.

---

# Emitting Events

```javascript
emitter.emit("login");
```

Output

```
User logged in.
```

The `emit()` method triggers an event and executes every listener attached to that event.

---

# Multiple Listeners

You can register multiple listeners for the same event.

```javascript
emitter.on("message", () => {
  console.log("First listener");
});

emitter.on("message", () => {
  console.log("Second listener");
});

emitter.emit("message");
```

Output

```
First listener
Second listener
```

Listeners execute **in the order they were registered**.

---

# once()

Sometimes an event should execute only once.

```javascript
emitter.once("start", () => {
  console.log("Application Started");
});
```

```javascript
emitter.emit("start");
emitter.emit("start");
```

Output

```
Application Started
```

The listener automatically removes itself after its first execution.

---

# Passing Data

Events can pass arguments to listeners.

```javascript
emitter.on("user", (name, age) => {
  console.log(name, age);
});

emitter.emit("user", "Sharvil", 22);
```

Output

```
Sharvil 22
```

---

# setMaxListeners()

By default, an EventEmitter allows **10 listeners** per event.

```javascript
emitter.setMaxListeners(2);
```

If more than two listeners are added:

```javascript
emitter.on("y", () => {});
emitter.on("y", () => {});
emitter.on("y", () => {});
```

Node.js prints a warning:

```
MaxListenersExceededWarning
```

This **does not prevent** adding more listeners.

It only warns about a possible memory leak.

---

# Internal \_events Object

Internally, EventEmitter stores registered listeners inside an object called `_events`.

```javascript
console.log(emitter._events);
```

Example output

```javascript
{
    y: [
        [Function],
        [Function]
    ],

    x: [Function],

    abc: [Function: bound onceWrapper]
}
```

The `_events` object maps event names to their listeners.

> `_events` is an internal implementation detail and should not be used in production code.

---

# Why does once() show a Wrapper?

When using:

```javascript
emitter.once("abc", callback);
```

Node internally creates something similar to:

```javascript
function wrapper() {
  callback();
  removeListener();
}
```

This wrapper executes the callback and immediately removes the listener.

That's why `_events` shows:

```
onceWrapper
```

instead of your original callback.

---

# Emitting an Unknown Event

```javascript
emitter.emit("unknown");
```

Nothing happens because there are no listeners.

The method simply returns:

```javascript
false;
```

If listeners exist, it returns:

```javascript
true;
```

---

# Common EventEmitter Methods

| Method                 | Description                    |
| ---------------------- | ------------------------------ |
| `on()`                 | Register an event listener     |
| `once()`               | Register a one-time listener   |
| `emit()`               | Trigger an event               |
| `off()`                | Remove a listener              |
| `removeListener()`     | Remove a specific listener     |
| `removeAllListeners()` | Remove all listeners           |
| `listeners()`          | Get listeners for an event     |
| `listenerCount()`      | Count listeners                |
| `eventNames()`         | Get all registered event names |
| `setMaxListeners()`    | Set warning threshold          |
| `getMaxListeners()`    | Get current limit              |

---

# Example

```javascript
import EventEmitter from "events";

const emitter = new EventEmitter();

emitter.setMaxListeners(2);

emitter.on("y", () => {
  console.log("First y event fired.");
});

emitter.on("y", () => {
  console.log("Second y event fired.");
});

emitter.once("abc", () => {
  console.log("ABC event fired.");
});

console.log(emitter._events);

emitter.emit("abc");
emitter.emit("abc");

console.log(emitter._events);

emitter.emit("y");
```

Output

```
{
  y: [Function, Function],
  abc: [Function: bound onceWrapper]
}

ABC event fired.

{
  y: [Function, Function]
}

First y event fired.
Second y event fired.
```

---

# Key Takeaways

- EventEmitter is the foundation of Node.js' event-driven architecture.
- `on()` executes every time the event is emitted.
- `once()` executes only once and automatically removes itself.
- `emit()` triggers an event and can pass data to listeners.
- Multiple listeners execute in registration order.
- `setMaxListeners()` only changes the warning threshold.
- `_events` is an internal object and shouldn't be relied upon in production.
- Many core Node.js modules extend EventEmitter.
