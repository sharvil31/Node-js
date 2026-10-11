# MongoDB Cursor Methods in Node.js

A hands-on project that explores the **chainable cursor methods** in the official MongoDB Node.js driver (`filter`, `sort`, `skip`, `limit`, `project`, `map`, and more). It queries an `expenses` collection in an `expenseApp` database and shows which methods run on the **server** and which run on the **client**.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project Setup](#project-setup)
4. [Sample Data](#sample-data)
5. [Running the Example](#running-the-example)
6. [The Code](#the-code)
7. [Server-Side vs Client-Side Methods](#server-side-vs-client-side-methods)
8. [Order of Execution](#order-of-execution)
9. [Method Reference](#method-reference)
10. [Pagination](#pagination)
11. [Improving the Example Query](#improving-the-example-query)
12. [Other Useful Cursor Methods](#other-useful-cursor-methods)
13. [Best Practices](#best-practices)
14. [Common Pitfalls](#common-pitfalls)
15. [Cheat Sheet](#cheat-sheet)
16. [Further Reading](#further-reading)

---

## Overview

A cursor returned by `collection.find()` is **lazy**: it doesn't contact the database until you consume it. Until then you can configure it by chaining methods. This project demonstrates:

- Filtering with `find(filter)` and `.filter()`
- Sorting with `.sort()`
- Paginating with `.skip()` and `.limit()`
- Transforming documents on the client with `.map()`
- Why chaining order doesn't change how the server runs the query
- Why `.map()` is **not** a substitute for a projection

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
mkdir mongo-cursor-methods && cd mongo-cursor-methods
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

Seed the `expenses` collection from `mongosh`:

```javascript
use expenseApp

db.expenses.insertMany([
  { title: "Books",     amount: 450,  category: "education" },
  { title: "Groceries", amount: 1800, category: "food" },
  { title: "Books",     amount: 320,  category: "education" },
  { title: "Fuel",      amount: 2200, category: "transport" },
  { title: "Books",     amount: 799,  category: "education" },
  { title: "Books",     amount: 150,  category: "education" },
  { title: "Rent",      amount: 15000, category: "housing" }
])
```

With this data there are four `Books` documents, so `skip(2)` leaves two.

---

## Running the Example

```bash
node index.js
```

---

## The Code

```javascript
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/");
await client.connect();

const db = client.db("expenseApp");
const collection = db.collection("expenses");

const cursor = collection
  .find()
  .skip(2)
  .limit(0)
  .sort({ title: 1 })
  .filter({ title: "Books" })
  .map(({ title, amount }) => ({ title, amount })); // runs on client

const data = await cursor.toArray();
console.log(data);

client.close();
```

### What each line does

| Method                        | Effect                                                                                    |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| `find()`                      | Creates a cursor with an empty filter `{}`                                                |
| `.skip(2)`                    | Skip the first 2 matching documents                                                       |
| `.limit(0)`                   | `0` means **no limit** (return everything)                                                |
| `.sort({ title: 1 })`         | Sort ascending by `title`                                                                 |
| `.filter({ title: "Books" })` | Set the query filter to `{ title: "Books" }`, **replacing** the filter passed to `find()` |
| `.map(fn)`                    | Transform each document on the client after it arrives                                    |
| `.toArray()`                  | Consume the cursor: this is when the query actually runs                                  |

### Expected output

Roughly (the exact documents depend on natural order, since sorting by `title` alone doesn't order documents that share a title):

```text
[ { title: 'Books', amount: 799 }, { title: 'Books', amount: 150 } ]
```

---

## Server-Side vs Client-Side Methods

This is the most important distinction in the whole project.

| Method                       | Runs on    | Notes                                      |
| ---------------------------- | ---------- | ------------------------------------------ |
| `find(filter)` / `.filter()` | Server     | Selects matching documents                 |
| `.sort()`                    | Server     | Uses an index if one matches               |
| `.skip()`                    | Server     | Server still walks past skipped documents  |
| `.limit()`                   | Server     | Reduces documents sent over the network    |
| `.project()`                 | Server     | Reduces fields sent over the network       |
| `.batchSize()`               | Server     | Documents per network round trip           |
| `.map()`                     | **Client** | Full documents are still transferred first |

> **Key point:** `.map()` reshapes data _after_ it has crossed the network. If your goal is to send less data, use `.project()` instead.

---

## Order of Execution

Chaining order in your code does **not** control execution order. Modifiers simply configure the cursor; the server always applies them in a fixed order:

```text
filter  →  sort  →  skip  →  limit
```

So these are equivalent:

```javascript
collection.find().skip(2).sort({ title: 1 });
collection.find().sort({ title: 1 }).skip(2);
```

On the client, `.map()` runs last, on each document as it is read from the cursor.

---

## Method Reference

### `find(filter)` and `.filter(filter)`

Both set the query filter. Calling `.filter()` **overwrites** any filter already set.

```javascript
collection.find({ title: "Books" });
collection.find().filter({ title: "Books" }); // equivalent
```

### `.sort(spec)`

`1` is ascending, `-1` is descending. Multiple fields are allowed:

```javascript
.sort({ title: 1, amount: -1 })
```

If the sort fields aren't unique, the order of ties is not guaranteed. Add a unique tiebreaker such as `_id`.

### `.skip(n)`

Skips the first `n` documents of the sorted result.

### `.limit(n)`

Returns at most `n` documents. `limit(0)` is the same as no limit.

### `.project(spec)`

Chooses which fields the server returns:

```javascript
.project({ title: 1, amount: 1, _id: 0 })
```

Use `1` to include fields or `0` to exclude them. Apart from `_id`, don't mix inclusion and exclusion in the same projection.

### `.map(fn)`

Applies a function to every document on the client. Useful for renaming fields, formatting values, or deriving new ones:

```javascript
.map((doc) => ({ label: doc.title, rupees: doc.amount / 100 }))
```

Because it runs in your Node process, it can't reduce network traffic.

---

## Pagination

`skip()` and `limit()` together give you simple page-based pagination:

```javascript
const page = 3;
const pageSize = 5;

const cursor = collection
  .find()
  .sort({ _id: 1 })
  .skip((page - 1) * pageSize)
  .limit(pageSize);
```

### Limitation of `skip()`

The server still has to walk past every skipped document, so deep pages get slower as the offset grows.

### Range-based alternative (scales better)

Remember the last `_id` you returned and ask for what comes after it:

```javascript
const cursor = collection
  .find({ _id: { $gt: lastSeenId } })
  .sort({ _id: 1 })
  .limit(pageSize);
```

This uses the `_id` index directly and stays fast regardless of how deep you page.

---

## Improving the Example Query

Two small problems in the original query:

**1. Sorting by `title` is pointless here.** Every matching document has `title: "Books"`, so their relative order is undefined, which makes `skip(2)` unpredictable. Sort by a unique field instead.

**2. `map()` is used to trim fields.** A projection does the same job on the server and sends less data.

### Cleaner version

```javascript
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/");

try {
  await client.connect();

  const collection = client.db("expenseApp").collection("expenses");

  const cursor = collection
    .find({ title: "Books" })
    .sort({ _id: 1 })
    .skip(2)
    .project({ title: 1, amount: 1, _id: 0 });

  const data = await cursor.toArray();
  console.log(data);
} finally {
  await client.close();
}
```

---

## Other Useful Cursor Methods

| Method            | Purpose                                                       |
| ----------------- | ------------------------------------------------------------- |
| `batchSize(n)`    | Control documents per network batch                           |
| `hint(index)`     | Force the use of a specific index                             |
| `maxTimeMS(ms)`   | Abort the query if it runs longer than `ms`                   |
| `collation(opts)` | Locale-aware comparison and sorting (e.g. case-insensitive)   |
| `explain()`       | Show the query plan, ideal for debugging performance          |
| `clone()`         | Copy a cursor's configuration into a fresh, unconsumed cursor |
| `rewind()`        | Reset a cursor to the start (re-runs the query)               |
| `tryNext()`       | Like `next()`, but doesn't block on tailable cursors          |
| `stream()`        | Convert the cursor to a Node.js readable stream               |
| `close()`         | Release server-side resources                                 |

### Example: inspect the query plan

```javascript
const plan = await collection
  .find({ title: "Books" })
  .sort({ _id: 1 })
  .explain();

console.log(JSON.stringify(plan, null, 2));
```

### Example: reuse a configured query

Cursors are single-pass, so clone one when you need the same query twice:

```javascript
const base = collection.find({ title: "Books" }).sort({ _id: 1 });

const first = await base.clone().toArray();
const second = await base.clone().toArray();
```

---

## Best Practices

- **Prefer `.project()` over `.map()`** when the goal is to return fewer fields.
- **Always include a unique tiebreaker** (like `_id`) in sorts used with `skip()`.
- **Pass the filter to `find()`** for readability; reserve `.filter()` for cases where you build a cursor in steps.
- **Create indexes** on fields you filter and sort by, then confirm with `explain()`.
- **Use range-based pagination** for large collections instead of big `skip()` values.
- **Close the client in a `finally` block** and `await` it.
- **Keep `.map()` for genuine client-side transforms** such as formatting or computing derived values.

---

## Common Pitfalls

| Pitfall                                     | Explanation                                                               | Fix                                               |
| ------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------- |
| Assuming chain order controls execution     | The server always runs filter, sort, skip, limit in that order            | Treat chain order as configuration only           |
| `limit(0)` expecting zero results           | `0` means no limit                                                        | Use a positive number, or skip the query          |
| `.filter()` after `find(filter)`            | It replaces the earlier filter instead of combining                       | Use one filter, or combine conditions with `$and` |
| Using `.map()` to reduce payload            | Full documents are still sent over the network                            | Use `.project()`                                  |
| Sorting by a non-unique field with `skip()` | Ties come back in unpredictable order, so pages can overlap or miss items | Add `_id` as a tiebreaker                         |
| Very large `skip()` values                  | Server still scans past skipped documents                                 | Switch to range-based pagination                  |
| Reusing a consumed cursor                   | Cursors are single-pass                                                   | Use `clone()`, `rewind()`, or a new `find()`      |
| `client.close()` without `await`            | Process may exit before cleanup finishes                                  | `await client.close()`                            |

---

## Cheat Sheet

```javascript
const cursor = collection
  .find({ title: "Books" }) // filter (server)
  .sort({ amount: -1, _id: 1 }) // sort (server)
  .skip(10) // offset (server)
  .limit(5) // cap (server)
  .project({ title: 1, amount: 1 }) // fields (server)
  .batchSize(100) // network batching (server)
  .map((doc) => ({ ...doc })); // transform (client)

const docs = await cursor.toArray();
```

---

## Further Reading

- [MongoDB Node.js Driver: Specify Documents to Return](https://www.mongodb.com/docs/drivers/node/current/crud/query/specify-documents-to-return/)
- [MongoDB Node.js Driver: Retrieve Data](https://www.mongodb.com/docs/drivers/node/current/crud/query/retrieve/)
- [MongoDB Manual: Cursor Methods](https://www.mongodb.com/docs/manual/reference/method/js-cursor/)
- [MongoDB Manual: Projection](https://www.mongodb.com/docs/manual/tutorial/project-fields-from-query-results/)

---

## Next Steps

- Run `explain()` on the query with and without an index on `title` and compare.
- Implement range-based pagination and compare its speed to `skip()` on a large collection.
- Try `collation({ locale: "en", strength: 2 })` for case-insensitive title matching.
- Pipe a cursor into a Node.js stream with `.stream()`.
