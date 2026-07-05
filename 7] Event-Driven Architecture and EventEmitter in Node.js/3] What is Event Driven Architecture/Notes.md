# Event-Driven Architecture (EDA)

## What is Event-Driven Architecture?

Event-Driven Architecture (EDA) is a software design pattern in which the execution of an application is driven by **events**.

Instead of executing every task in a fixed sequence, the application waits for specific events to occur. When an event happens, the registered code automatically executes and performs the required action.

This design pattern makes applications more responsive, scalable, loosely coupled, and efficient.

Node.js is built around the Event-Driven Architecture pattern, making it capable of handling thousands of concurrent operations without blocking the main thread.

---

# What is an Event?

An **event** is simply a notification or signal that indicates something has happened inside the application.

Examples include:

- A user clicks a button
- A file finishes reading
- A database query completes
- A network request receives a response
- A timer expires
- A user sends a message

When an event occurs, the application reacts by executing the code associated with that event.

---

# Components of Event-Driven Architecture

Every Event-Driven system consists of three main components.

```
Event Emitter
      │
      ▼
Event Listener
      │
      ▼
Event Handler
```

---

## 1. Event Emitter

The **Event Emitter** is responsible for generating (emitting) an event.

It announces that something has happened.

Examples:

- Button clicked
- File loaded
- HTTP request received
- Database query completed

---

## 2. Event Listener

The **Event Listener** waits for a specific event.

Once the event is emitted, it triggers the corresponding event handler.

Think of it as someone waiting for a notification.

---

## 3. Event Handler

The **Event Handler** is the callback function that executes when the event occurs.

This contains the actual business logic of the application.

Examples:

- Display a message
- Save data
- Send a response
- Update the UI
- Trigger another process

---

# Browser Example

```javascript
const h1 = document.querySelector("h1");

h1.addEventListener("click", () => {
  console.log("h1 clicked");
});
```

### Breakdown

### Event Emitter

```javascript
h1;
```

The `<h1>` element emits the **click** event.

---

### Event Listener

```javascript
addEventListener("click", ...)
```

This listens for the click event.

---

### Event Handler

```javascript
() => {
  console.log("h1 clicked");
};
```

This callback runs whenever the click event occurs.

---

# Flow

```
User clicks <h1>

      │

      ▼

<h1> emits "click"

      │

      ▼

Event Listener detects it

      │

      ▼

Callback executes

      │

      ▼

Console prints:
"h1 clicked"
```

---

# Node.js Example

Node.js provides the `EventEmitter` class to implement Event-Driven Architecture.

```javascript
import EventEmitter from "events";

const emitter = new EventEmitter();

emitter.on("login", () => {
  console.log("User logged in");
});

emitter.emit("login");
```

### Output

```
User logged in
```

### Breakdown

- `emitter` → Event Emitter
- `.on()` → Event Listener
- Callback Function → Event Handler
- `.emit()` → Emits the event

---

# Why Node.js Uses Event-Driven Architecture

Node.js performs many I/O operations such as:

- Reading files
- Writing files
- Database queries
- HTTP requests
- API calls
- Network communication

These operations take time.

Instead of blocking the CPU while waiting, Node.js registers an event and continues executing other tasks.

Once the operation completes, Node.js emits an event, and the corresponding event handler executes.

This is one of the reasons why Node.js can efficiently handle thousands of simultaneous connections.

---

# Real-Life Example

Imagine ordering food at a restaurant.

1. You place an order.
2. The chef starts preparing your food.
3. Instead of waiting in the kitchen, you sit at your table.
4. When the food is ready, your order number is announced.
5. You collect your food.

Mapping this to Event-Driven Architecture:

- Order Number → Event
- Restaurant System → Event Emitter
- You Listening → Event Listener
- Collecting Food → Event Handler

You continue doing other things until the event occurs.

This is exactly how Event-Driven Architecture works.

---

# Advantages of Event-Driven Architecture

## Non-Blocking

Applications don't stop while waiting for slow operations.

---

## High Performance

The CPU can continue executing other tasks while I/O operations are in progress.

---

## Scalable

Thousands of events can be handled efficiently.

---

## Loose Coupling

Different parts of the application don't need to know about each other directly.

---

## Easy to Extend

New listeners can be added without modifying existing code.

---

# Common Examples of Event-Driven Architecture

- Node.js
- Browser DOM Events
- Chat Applications
- Payment Gateways
- Notification Systems
- Automation Services
- Operating Systems
- IoT Devices
- Multiplayer Games
- Real-Time Dashboards

---

# Event Flow

```
            Event Happens
                  │
                  ▼
          Event Emitter
                  │
                  ▼
         Event Listener Waits
                  │
                  ▼
        Event Handler Executes
                  │
                  ▼
         Business Logic Runs
```

---

# Key Takeaways

- Event-Driven Architecture is a design pattern where applications respond to events.
- An event is simply a signal that something has happened.
- The three core components are:
  - Event Emitter
  - Event Listener
  - Event Handler
- Node.js is built around Event-Driven Architecture.
- This architecture enables non-blocking execution and excellent scalability.
- It is widely used in browsers, servers, chat applications, payment systems, IoT, and many real-time applications.
