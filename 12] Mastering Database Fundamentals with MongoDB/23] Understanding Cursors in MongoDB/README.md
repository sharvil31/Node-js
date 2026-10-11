# MongoDB Cursors in Node.js

A small, hands-on project that explores how **cursors** work in the official MongoDB Node.js driver. It connects to a local `todoApp` database, reads from the `todos` collection, and demonstrates every common way to consume a cursor, along with the single most important rule: **a cursor is single-pass**.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project Setup](#project-setup)
4. [Running the Example](#running-the-example)
5. [What Is a Cursor?](#what-is-a-cursor)
6. [How Batching Works](#how-batching-works)
7. [Ways to Consume a Cursor](#ways-to-consume-a-cursor)
8. [Code Walkthrough](#code-walkthrough)
9. [Expected Output](#expected-output)
10. [Cursors Are Single-Pass](#cursors-are-single-pass)
11. [Reading the Same Data Twice](#reading-the-same-data-twice)
12. [Cursor Modifiers](#cursor-modifiers)
13. [Best Practices](#best-practices)
14. [Common Pitfalls](#common-pitfalls)
15. [Cheat Sheet](#cheat-sheet)
16. [Further Reading](#further-reading)

---

## Overview

When you call `collection.find()`, MongoDB does **not** hand you an array of documents. It gives you a **cursor**, an object that represents a query result and lets you pull documents out of it a piece at a time.

This project demonstrates:

- Creating a cursor with `find()`
- Counting documents with `countDocuments()` (which does _not_ use the cursor)
- Iterating manually with `hasNext()` / `next()`
- Draining a cursor with `toArray()`
- Iterating idiomatically with `for await...of`
- Why a second `toArray()` call returns an empty array

---

## Prerequisites

| Requirement           | Version / Notes                                  |
| --------------------- | ------------------------------------------------ |
| Node.js               | 18+ (needed for top-level `await` in ES modules) |
| MongoDB               | Running locally on `127.0.0.1:27017`             |
| `mongodb` npm package | Official driver, v5 or newer recommended         |

Verify MongoDB is running:

```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

---

## Project Setup

```bash
# 1. Create the project folder
mkdir mongo-cursors && cd mongo-cursors

# 2. Initialise npm
npm init -y

# 3. Install the MongoDB driver
npm install mongodb
```

Because the script uses `import` syntax and top-level `await`, enable ES modules by adding this to `package.json`:

```json
{
  "type": "module"
}
```

Or save the file with a `.mjs` extension instead.

### Seed some sample data

If your `todos` collection is empty, insert a few documents via `mongosh`:

```javascript
use todoApp

db.todos.insertMany([
  { title: "Learn cursors",      completed: false, createdAt: new Date() },
  { title: "Write a README",     completed: false, createdAt: new Date() },
  { title: "Understand batching", completed: true,  createdAt: new Date() },
  { title: "Try for await",      completed: false, createdAt: new Date() },
  { title: "Close the client",   completed: true,  createdAt: new Date() },
  { title: "Rewind a cursor",    completed: false, createdAt: new Date() }
])
```

---

## Running the Example

```bash
node index.js
```

(Replace `index.js` with whatever you named your file.)

---

## What Is a Cursor?

A cursor is a **lazy pointer** to the results of a query.

- **Lazy**: no query is sent to the server until you start consuming the cursor (`next()`, `hasNext()`, `toArray()`, `for await`, and so on).
- **Stateful**: it remembers its position in the result set, like a bookmark moving through a book.
- **Batched**: documents are fetched from the server in groups, not all at once and not one by one.
- **An async iterator**: it implements `Symbol.asyncIterator`, so it works with `for await...of`.

```text
 find()  ──►  Cursor object (no network call yet)
                  │
                  ▼  first consumption (next / hasNext / toArray / for await)
          ┌───────────────┐
          │  Server query │ ──► first batch of documents
          └───────────────┘
                  │
                  ▼  local buffer drained?
          ┌───────────────┐
          │    getMore    │ ──► next batch
          └───────────────┘
```

---

## How Batching Works

Behind the scenes, the cursor talks to MongoDB like this:

1. The first `find` command returns an initial batch (by default up to **101 documents**).
2. Documents are served to you from the driver's local buffer as you call `next()`.
3. When the buffer is empty and the server still has more results, the driver sends a **`getMore`** command to fetch the next batch (up to about **16 MB** per batch).
4. When the server has no more results, the cursor is exhausted and closed.

You can tune this with `batchSize()`:

```javascript
const cursor = collection.find().batchSize(10);
```

Smaller batches mean more round trips but less memory per batch. Larger batches mean fewer round trips.

---

## Ways to Consume a Cursor

### 1. `for await...of` (recommended)

```javascript
for await (const doc of cursor) {
  console.log(doc);
}
```

Clean, memory-efficient, and **automatically closes the cursor** when the loop finishes or exits early via `break`.

### 2. `hasNext()` + `next()` (manual control)

```javascript
while (await cursor.hasNext()) {
  const doc = await cursor.next();
  console.log(doc);
}
```

- `hasNext()` checks whether another document exists (it may fetch a new batch). It does **not** advance the cursor.
- `next()` returns the next document and advances. It returns `null` when exhausted.

### 3. `toArray()` (small results only)

```javascript
const docs = await cursor.toArray();
```

Loads **all remaining** documents into memory at once. Convenient, but dangerous for large collections.

### 4. `forEach()`

```javascript
await cursor.forEach((doc) => console.log(doc));
```

Callback-style iteration over the remaining documents.

---

## Code Walkthrough

```javascript
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/");
await client.connect();

const db = client.db("todoApp");
const collection = db.collection("todos");
```

Connects to the local MongoDB server and selects the `todos` collection.

```javascript
const cursor = collection.find();
```

Creates the cursor. **No database call happens yet.**

```javascript
console.log(await collection.countDocuments());
```

Runs its own separate count query. It is unrelated to the cursor and does not consume it.

```javascript
for (; await cursor.hasNext(); ) {
  console.log(await cursor.next());
}
```

A manual loop that reads every document, equivalent to `while (await cursor.hasNext())`. After this loop, the cursor is **exhausted**.

```javascript
const data = await cursor.toArray();
const data2 = await cursor.toArray();
console.log(data);
console.log(data2);
```

Both calls return `[]`, because the loop above already consumed everything.

```javascript
client.close();
```

Closes the connection. This returns a promise, so prefer `await client.close()`.

---

## Expected Output

Assuming six documents in the collection:

```text
6
{ _id: ..., title: 'Learn cursors', ... }
{ _id: ..., title: 'Write a README', ... }
{ _id: ..., title: 'Understand batching', ... }
{ _id: ..., title: 'Try for await', ... }
{ _id: ..., title: 'Close the client', ... }
{ _id: ..., title: 'Rewind a cursor', ... }
[]
[]
```

The count prints first, then each document from the manual loop, and finally two empty arrays.

---

## Cursors Are Single-Pass

This is the key lesson of the experiment.

| Step | Action                   | Cursor state             |
| ---- | ------------------------ | ------------------------ |
| 1    | `find()`                 | Created, nothing fetched |
| 2    | `for` loop with `next()` | Fully consumed           |
| 3    | `toArray()`              | Returns `[]`             |
| 4    | `toArray()` again        | Returns `[]`             |

If you remove the `for` loop, the results change:

| Call               | Result                 |
| ------------------ | ---------------------- |
| First `toArray()`  | All documents          |
| Second `toArray()` | `[]` (already drained) |

A cursor behaves like a stream: once you have read to the end, those items are gone from that cursor.

---

## Reading the Same Data Twice

**Option 1: Reuse the array** (simplest)

```javascript
const data = await cursor.toArray();
console.log(data);
console.log(data);
```

**Option 2: Rewind the cursor** (re-runs the query)

```javascript
const data = await cursor.toArray();
cursor.rewind();
const data2 = await cursor.toArray();
```

**Option 3: Create a fresh cursor**

```javascript
const data = await collection.find().toArray();
const data2 = await collection.find().toArray();
```

---

## Cursor Modifiers

Because cursors are lazy, you can chain modifiers **before** consuming them:

```javascript
const cursor = collection
  .find({ completed: false }) // filter
  .sort({ createdAt: -1 }) // newest first
  .skip(10) // pagination offset
  .limit(5) // max documents
  .project({ title: 1, _id: 0 }); // only return the title field
```

| Modifier                      | Purpose                             |
| ----------------------------- | ----------------------------------- |
| `filter` (argument to `find`) | Select matching documents           |
| `sort()`                      | Order the results                   |
| `skip()`                      | Skip the first N documents          |
| `limit()`                     | Cap the number of documents         |
| `project()`                   | Choose which fields to return       |
| `batchSize()`                 | Control documents per network batch |

Once you start iterating, modifiers can no longer be changed.

---

## Best Practices

- **Prefer `for await...of`** for large result sets. It streams documents without loading everything into memory.
- **Use `toArray()` only for small, bounded results**, ideally combined with `limit()`.
- **Always close the client**, ideally in a `finally` block:

  ```javascript
  try {
    for await (const doc of cursor) {
      console.log(doc);
    }
  } finally {
    await client.close();
  }
  ```

- **Use `project()`** to fetch only the fields you need.
- **Add indexes** for fields you filter or sort on, so the server does less work per batch.
- **Do not mix consumption styles** on the same cursor unless you understand they all share one position.

---

## Common Pitfalls

| Pitfall                                           | Explanation                                  | Fix                                        |
| ------------------------------------------------- | -------------------------------------------- | ------------------------------------------ |
| Second `toArray()` returns `[]`                   | The cursor is already exhausted              | Store the first result, or call `rewind()` |
| Treating `find()` as an array                     | `find()` returns a cursor, not documents     | Call `toArray()` or iterate                |
| Forgetting `await` on `close()`                   | The process may exit before cleanup finishes | `await client.close()`                     |
| `toArray()` on huge collections                   | Can exhaust memory                           | Use `for await...of`                       |
| Modifying a cursor mid-iteration                  | Not allowed once iteration has started       | Apply modifiers before consuming           |
| Expecting `countDocuments()` to affect the cursor | It runs a separate query                     | Treat them as independent                  |

---

## Cheat Sheet

```javascript
const cursor = collection.find(filter);

await cursor.hasNext(); // true / false, does not advance
await cursor.next(); // next document or null
await cursor.toArray(); // all remaining documents
await cursor.forEach(fn); // run fn on each remaining document
cursor.rewind(); // reset to the start (re-runs the query)
await cursor.close(); // release server-side resources

for await (const doc of cursor) {
  /* ... */
}
```

---

## Further Reading

- [MongoDB Node.js Driver: Access Data From a Cursor](https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/read-operations/cursor/)
- [MongoDB Manual: Iterate a Cursor in mongosh](https://www.mongodb.com/docs/manual/tutorial/iterate-a-cursor/)
- [MongoDB Manual: `cursor.batchSize()`](https://www.mongodb.com/docs/manual/reference/method/cursor.batchSize/)

---

## Next Steps

Ideas for extending this experiment:

- Call `.batchSize(2)` and enable driver command monitoring to watch the `getMore` calls happen.
- Compare memory usage of `toArray()` versus `for await...of` on a collection with 100,000+ documents.
- Implement pagination with `skip()` / `limit()`, then compare it to range-based pagination on `_id`.
- Try `collection.find().stream()` to pipe results into a Node.js stream.
