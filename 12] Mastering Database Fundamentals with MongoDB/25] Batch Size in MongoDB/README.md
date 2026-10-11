# Batch Size in MongoDB (Node.js)

A hands-on project that explores **`batchSize()`** in the official MongoDB Node.js driver: how cursors fetch documents from the server in batches, how to observe the `find` and `getMore` commands, and how to choose a sensible batch size.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project Setup](#project-setup)
4. [Sample Data](#sample-data)
5. [What Is a Batch?](#what-is-a-batch)
6. [Default Batch Behaviour](#default-batch-behaviour)
7. [Using `batchSize()`](#using-batchsize)
8. [Observing Batches with Command Monitoring](#observing-batches-with-command-monitoring)
9. [Expected Output](#expected-output)
10. [How `batchSize()` Interacts with Other Methods](#how-batchsize-interacts-with-other-methods)
11. [Choosing a Batch Size](#choosing-a-batch-size)
12. [Things to Watch Out For](#things-to-watch-out-for)
13. [Common Pitfalls](#common-pitfalls)
14. [Cheat Sheet](#cheat-sheet)
15. [Further Reading](#further-reading)

---

## Overview

When you call `collection.find()`, the server doesn't send the whole result set in one go. It sends documents in **batches**. `batchSize()` lets you control how many documents arrive per network round trip.

It changes **how** documents are delivered, never **which** documents or in **what order**.

This project demonstrates:

- How a cursor fetches data with `find` and `getMore`
- How to set the batch size
- How to watch the commands being sent
- How `limit()`, `toArray()`, and `for await...of` interact with batching
- How to choose a value in practice

---

## Prerequisites

| Requirement           | Notes                                         |
| --------------------- | --------------------------------------------- |
| Node.js               | 18 or newer (top-level `await` in ES modules) |
| MongoDB               | Running locally on `127.0.0.1:27017`          |
| `mongodb` npm package | Official driver, v5 or newer recommended      |

Check that MongoDB is reachable:

```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

---

## Project Setup

```bash
mkdir mongo-batch-size && cd mongo-batch-size
npm init -y
npm install mongodb
```

Enable ES modules in `package.json`:

```json
{
  "type": "module"
}
```

Or save the script with a `.mjs` extension.

---

## Sample Data

The demo is clearest with more documents than the batch size. Seed 25 documents from `mongosh`:

```javascript
use expenseApp

db.expenses.deleteMany({})

db.expenses.insertMany(
  Array.from({ length: 25 }, (_, i) => ({
    title: `Expense ${i + 1}`,
    amount: (i + 1) * 100,
  }))
)
```

---

## What Is a Batch?

A cursor is a lazy pointer to query results. Documents reach your app like this:

1. The first `find` command returns an **initial batch** plus a cursor id.
2. You read documents one at a time from the driver's **local buffer**.
3. When the buffer is empty and the server has more results, the driver sends a **`getMore`** command for the next batch.
4. When the server has nothing left, the cursor is exhausted and closed.

Example: 250 matching documents with `batchSize(100)`:

```text
find      → 100 documents   (round trip 1)
getMore   → 100 documents   (round trip 2)
getMore   →  50 documents   (round trip 3, cursor exhausted)
```

The number of round trips is roughly `ceil(totalDocs / batchSize)`.

---

## Default Batch Behaviour

| Batch                          | Default                  |
| ------------------------------ | ------------------------ |
| First batch (from `find`)      | Up to **101 documents**  |
| Later batches (from `getMore`) | Up to **16 MiB** of data |

Whichever limit is reached first applies. Even with a very large `batchSize`, a single batch cannot exceed 16 MiB, so with large documents you will receive fewer documents per batch than requested.

---

## Using `batchSize()`

As a chained method:

```javascript
const cursor = collection.find().batchSize(10);

for await (const doc of cursor) {
  console.log(doc);
}
```

As an option:

```javascript
const cursor = collection.find({}, { batchSize: 10 });
```

Like other cursor modifiers, it must be set **before** you start iterating.

---

## Observing Batches with Command Monitoring

Turn on `monitorCommands` and listen for `commandStarted` events to watch the `find` and `getMore` calls.

Create `index.js`:

```javascript
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/", {
  monitorCommands: true,
});

client.on("commandStarted", (event) => {
  if (event.commandName === "find" || event.commandName === "getMore") {
    console.log(`--> ${event.commandName}`);
  }
});

try {
  await client.connect();

  const collection = client.db("expenseApp").collection("expenses");

  const cursor = collection.find().batchSize(10);

  for await (const doc of cursor) {
    console.log(doc.title);
  }
} finally {
  await client.close();
}
```

Run it:

```bash
node index.js
```

### Experiments to try

| Change                  | What to expect                                                                |
| ----------------------- | ----------------------------------------------------------------------------- |
| Remove `.batchSize(10)` | One `find` returns all 25 documents; no `getMore`                             |
| `.batchSize(10)`        | `find`, then two `getMore` calls (10 + 10 + 5)                                |
| `.batchSize(5)`         | `find`, then four `getMore` calls                                             |
| `.batchSize(1)`         | `find`, then many `getMore` calls, a good way to see the cost of tiny batches |

---

## Expected Output

With 25 documents and `batchSize(10)`:

```text
--> find
Expense 1
Expense 2
...
Expense 10
--> getMore
Expense 11
...
Expense 20
--> getMore
Expense 21
...
Expense 25
```

The exact interleaving can vary slightly between driver versions, but the pattern holds: a `getMore` appears each time the local buffer runs dry.

---

## How `batchSize()` Interacts with Other Methods

| Method           | Interaction                                                                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `limit(n)`       | If `limit` is smaller than `batchSize`, you only get `limit` documents. The limit always wins.                                           |
| `toArray()`      | Still fetches in batches internally, but loads everything into memory. `batchSize` changes round trips, not the size of the final array. |
| `for await...of` | Where `batchSize` matters most: memory holds roughly one batch at a time.                                                                |
| `sort()`         | Sorting happens on the server before batching. Batch size never affects order.                                                           |
| `skip()`         | Applied on the server before batching. Unaffected.                                                                                       |
| `project()`      | Smaller documents mean more of them fit in a batch before hitting the 16 MiB cap.                                                        |
| `batchSize(0)`   | The first reply contains no documents, only the cursor; data arrives on the next `getMore`. Rarely useful.                               |

---

## Choosing a Batch Size

| Smaller batches                      | Larger batches             |
| ------------------------------------ | -------------------------- |
| Less memory per batch                | More memory per batch      |
| More round trips (`getMore` calls)   | Fewer round trips          |
| Lower latency to the first documents | Higher latency per batch   |
| Suits slow consumers                 | Suits fast bulk processing |

For most applications the defaults are fine. Consider tuning when you:

- Process very large result sets and want predictable memory use
- Do slow work per document (for example an HTTP call each), so a huge batch would sit idle in memory
- Run over a high-latency network and want fewer round trips

Measure before and after. Command monitoring plus simple timing (`console.time`) is enough to compare settings.

---

## Things to Watch Out For

1. **Cursor timeout.** The server closes idle cursors after about 10 minutes of inactivity. If you process each batch very slowly, the next `getMore` can fail with a cursor-not-found error. Keep iterating steadily, or restructure the work.
2. **It is a hint, not a guarantee.** The server may return fewer documents than `batchSize`, for example because of the 16 MiB cap.
3. **It doesn't speed up the query.** The server does the same filter and sort work. Use indexes and projections for that.
4. **It is not `limit()`.** `limit` caps the total number of documents returned; `batchSize` only splits them into chunks.

---

## Common Pitfalls

| Pitfall                                 | Explanation                                       | Fix                                |
| --------------------------------------- | ------------------------------------------------- | ---------------------------------- |
| Expecting `batchSize` to limit results  | It only splits delivery into chunks               | Use `limit()`                      |
| Expecting lower memory with `toArray()` | The full array is still built in memory           | Use `for await...of`               |
| Setting it after iteration starts       | Modifiers can't change on a cursor already in use | Configure before consuming         |
| Using `batchSize(1)` in production      | One round trip per document is very slow          | Use a moderate value               |
| Assuming exact batch sizes              | The server may return fewer documents             | Treat it as an upper bound         |
| Forgetting `monitorCommands: true`      | No `commandStarted` events are emitted            | Enable it in client options        |
| Slow per-document work with long gaps   | Cursor can time out between batches               | Process faster or in smaller units |

---

## Cheat Sheet

```javascript
// Set the batch size (chained)
collection.find().batchSize(100);

// Set the batch size (option)
collection.find({}, { batchSize: 100 });

// Observe find / getMore
const client = new MongoClient(uri, { monitorCommands: true });
client.on("commandStarted", (e) => console.log(e.commandName));

// Memory-friendly iteration
for await (const doc of collection.find().batchSize(100)) {
  /* ... */
}
```

| Setting             | Value                           |
| ------------------- | ------------------------------- |
| First batch default | 101 documents                   |
| Later batch default | Up to 16 MiB                    |
| Round trips         | ~ `ceil(totalDocs / batchSize)` |

---

## Further Reading

- [MongoDB Manual: `cursor.batchSize()`](https://www.mongodb.com/docs/manual/reference/method/cursor.batchSize/)
- [MongoDB Manual: Iterate a Cursor](https://www.mongodb.com/docs/manual/tutorial/iterate-a-cursor/)
- [MongoDB Node.js Driver: Monitor Commands](https://www.mongodb.com/docs/drivers/node/current/monitoring-and-logging/monitoring/)
- [MongoDB Node.js Driver: Access Data From a Cursor](https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/read-operations/cursor/)

---

## Next Steps

- Time `for await...of` over a large collection with batch sizes of 1, 10, 100, and 1000 and compare.
- Combine `.project()` with `.batchSize()` and watch how many documents fit per batch.
- Pair this with `.limit()` to confirm that the limit always wins.
- Read about `maxTimeMS` and cursor timeouts for long-running processing jobs.
