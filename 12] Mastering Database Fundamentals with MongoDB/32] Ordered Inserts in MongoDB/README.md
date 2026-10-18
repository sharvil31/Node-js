from pathlib import Path

content = r'''# Ordered and Unordered Inserts in MongoDB

This README explains how `insertMany()` works in MongoDB using the MongoDB Node.js driver, with a focus on the `ordered` option, duplicate `_id` errors, partial success, and error handling.

## Table of Contents

- [1. Introduction](#1-introduction)
- [2. Requirements](#2-requirements)
- [3. Connecting to MongoDB](#3-connecting-to-mongodb)
- [4. Understanding `insertMany()`](#4-understanding-insertmany)
- [5. Ordered Inserts](#5-ordered-inserts)
- [6. Unordered Inserts](#6-unordered-inserts)
- [7. Duplicate `_id` Example](#7-duplicate-_id-example)
- [8. Handling Errors in Node.js](#8-handling-errors-in-nodejs)
- [9. Checking Inserted Documents](#9-checking-inserted-documents)
- [10. Ordered vs. Unordered Inserts](#10-ordered-vs-unordered-inserts)
- [11. Important Concepts](#11-important-concepts)
- [12. Common Mistakes](#12-common-mistakes)
- [13. Interview Questions and Answers](#13-interview-questions-and-answers)
- [14. Quick Revision](#14-quick-revision)

## 1. Introduction

MongoDB provides `insertMany()` to insert multiple documents into a collection in one operation.

The `ordered` option controls what MongoDB does when one of the documents cannot be inserted.

- **Ordered insert (`ordered: true`)**: MongoDB processes documents in the specified sequence and stops attempting later documents after the first write error.
- **Unordered insert (`ordered: false`)**: MongoDB attempts to insert the remaining documents even if one or more documents fail.

The default value of `ordered` is `true`.

> **Important:** An `insertMany()` operation is not automatically atomic as a whole. If some documents are inserted before an error occurs, those successful inserts are not automatically rolled back.

## 2. Requirements

You need:

- MongoDB Server running locally or at a reachable address.
- Node.js installed.
- A Node.js project with the MongoDB driver installed.

Install the driver if necessary:

```bash
npm install mongodb
```

If your project uses ECMAScript modules, configure `"type": "module"` in `package.json`, or use a supported `.mjs` file.

Example `package.json`:

```json
{
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "mongodb": "^6.0.0"
  }
}
```

The version shown is an example range. Use the version installed in your project and check its documentation for version-specific error properties.

## 3. Connecting to MongoDB

Create a MongoDB client and connect to the server:

```javascript
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

try {
  await client.connect();

  const db = client.db("college");
  const collection = db.collection("users");

  console.log("Connected to MongoDB");
} catch (error) {
  console.error("MongoDB connection failed:", error);
} finally {
  await client.close();
}
```

- `MongoClient` manages the connection to MongoDB.
- `client.db("college")` selects the `college` database.
- `db.collection("users")` selects the `users` collection.
- If the database or collection does not exist yet, MongoDB generally creates it when data is first written.
- `finally` ensures the client is closed after this standalone example finishes.

In an application that runs continuously, you would normally reuse a shared client instead of connecting and disconnecting for every request.

## 4. Understanding `insertMany()`

Syntax:

```javascript
collection.insertMany(
  [document1, document2, document3],
  { ordered: true }
);
```

The first argument is an array of documents. The second argument contains options.

Example:

```javascript
const result = await collection.insertMany([
  { name: "Sharvil", age: 22 },
  { name: "Akash", age: 23 },
  { name: "Amit", age: 21 }
]);

console.log(result.insertedCount);
console.log(result.insertedIds);
```

If all three inserts succeed:

- `insertedCount` is `3`.
- `insertedIds` contains the `_id` values associated with the inserted documents.

MongoDB generates an `_id` for a document when one is not supplied. The `_id` field is unique within a collection.

## 5. Ordered Inserts

Ordered inserts are the default behavior of `insertMany()`.

```javascript
const result = await collection.insertMany(
  [
    { name: "Sahil" },
    { name: "Rishi" },
    { name: "Prabhulal" }
  ],
  { ordered: true }
);

console.log(result.insertedCount);
```

When all documents are valid, they are inserted successfully.

### What happens if an insert fails?

Suppose the second document violates a unique index:

```javascript
await collection.createIndex(
  { email: 1 },
  { unique: true }
);

await collection.insertMany(
  [
    { name: "Amit", email: "amit@example.com" },
    { name: "Priya", email: "priya@example.com" },
    { name: "Rahul", email: "amit@example.com" },
    { name: "Sneha", email: "sneha@example.com" }
  ],
  { ordered: true }
);
```

The email value for Rahul duplicates Amit's email. Because the index is unique, Rahul's document cannot be inserted.

Assuming the collection did not already contain conflicting data:

| Document | Outcome |
|---|---|
| Amit | Inserted |
| Priya | Inserted |
| Rahul | Fails with a duplicate-key error |
| Sneha | Not attempted |

MongoDB stops attempting the remaining documents after the first write error. The successfully inserted documents remain in the collection.

## 6. Unordered Inserts

Set `ordered` to `false` to let MongoDB continue attempting the other documents after an insertion error.

```javascript
const result = await collection.insertMany(
  [
    { name: "Amit", email: "amit@example.com" },
    { name: "Priya", email: "priya@example.com" },
    { name: "Rahul", email: "amit@example.com" },
    { name: "Sneha", email: "sneha@example.com" }
  ],
  { ordered: false }
);
```

With the same unique index and an initially empty collection:

| Document | Outcome |
|---|---|
| Amit | Inserted |
| Priya | Inserted |
| Rahul | Fails with a duplicate-key error |
| Sneha | Still attempted and can be inserted |

Unordered inserts do not guarantee the execution order of writes. Avoid relying on the array order to determine which write executes first in unordered mode.

**Note:** If one or more documents fail, the Node.js driver's `insertMany()` normally rejects with a bulk-write error even if other documents succeeded. The successful inserts are not automatically rolled back.

## 7. Duplicate `_id` Example

MongoDB automatically creates a unique index on `_id`. Two documents in the same collection cannot have the same `_id`.

In the following example, assume the ID `6ad490081cad99d1479084c4` already belongs to a document named Akash in the `users` collection.

```javascript
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

try {
  await client.connect();

  const db = client.db();
  const collection = db.collection("users");

  const result = await collection.insertMany(
    [
      { name: "Nihal" },
      {
        _id: new ObjectId("6ad490081cad99d1479084c4"),
        name: "Ganesh"
      },
      { name: "Rishi" },
      { name: "Prabhulal" }
    ],
    { ordered: false }
  );

  console.log(result);
} catch (error) {
  console.error("Insertion error:", error.message);
} finally {
  await client.close();
}
```

### Expected behavior

| Document | Outcome | Reason |
|---|---|---|
| Nihal | Can be inserted | MongoDB generates a new `_id` |
| Ganesh | Fails if the `_id` already exists | Duplicate `_id` |
| Rishi | Can be inserted | MongoDB continues attempting later documents |
| Prabhulal | Can be inserted | MongoDB continues attempting later documents |

This assumes the other documents do not violate any other collection constraints.

The exact ObjectId must already exist for this example to produce a duplicate-key error. An ObjectId is not a label that identifies a person's name; MongoDB only checks whether the value is already present in the collection.

### Verify the existing document

```javascript
const existingUser = await collection.findOne({
  _id: new ObjectId("6ad490081cad99d1479084c4")
});

console.log(existingUser);
```

If the query returns a document named Akash, the duplicate-ID assumption is confirmed.

### Why might `console.log(result)` not execute?

In the Node.js driver, a write error normally causes `insertMany()` to throw. Execution jumps to `catch`, so the `console.log(result)` immediately after the call does not run.

This does **not** mean every insert failed. Some documents may already have been inserted successfully. Inspect the error's write-error information and bulk-write result to understand partial success.

## 8. Handling Errors in Node.js

Use `try...catch` when an insertion might fail.

```javascript
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

try {
  await client.connect();

  const db = client.db();
  const collection = db.collection("users");

  const result = await collection.insertMany(
    [
      { name: "Nihal" },
      {
        _id: new ObjectId("6ad490081cad99d1479084c4"),
        name: "Ganesh"
      },
      { name: "Rishi" },
      { name: "Prabhulal" }
    ],
    { ordered: false }
  );

  console.log("Inserted count:", result.insertedCount);
  console.log("Inserted IDs:", result.insertedIds);
} catch (error) {
  console.error("Insertion failed:", error.message);

  // The exact properties depend on the installed driver version.
  if (error.writeErrors) {
    console.error("Write errors:", error.writeErrors);
  }

  if (error.result) {
    console.log("Successful insertion count:", error.result.insertedCount);
    console.log("Successful insertion IDs:", error.result.insertedIds);
  }
} finally {
  await client.close();
}
```

### Understanding the error

- `error.message` provides a human-readable error message.
- `error.writeErrors`, when available, contains information about individual failed writes.
- `error.result`, when available, exposes the bulk-write result, which can help identify successful operations.
- Error properties and result APIs can vary by driver version. Check the installed MongoDB Node.js driver's documentation instead of assuming every property exists.

Do not rely on `error.insertedDocs` as a universal property; it is not available on every version or error type.

## 9. Checking Inserted Documents

After an insert operation, query the collection to verify what was saved:

```javascript
const users = await collection.find({}).toArray();

console.log(users);
```

To find one document:

```javascript
const user = await collection.findOne({ name: "Nihal" });

console.log(user);
```

To count documents matching a condition:

```javascript
const count = await collection.countDocuments({
  name: "Nihal"
});

console.log(count);
```

When testing, remember that a previous run may have already inserted some documents. Re-running the same code can therefore produce additional duplicate-key errors or more records than expected.

## 10. Ordered vs. Unordered Inserts

| Feature | Ordered (`true`) | Unordered (`false`) |
|---|---|---|
| Default for `insertMany()` | Yes | No |
| Stops attempting later writes after a write error | Yes | No |
| Attempts later documents after an error | No | Yes |
| Preserves the requested write sequence | Yes | No execution-order guarantee |
| Successful earlier inserts rolled back automatically | No | No |
| Useful for | When write order matters | Bulk imports where continuing after errors is desirable |

### Which option should you use?

Choose **ordered inserts** when later writes should not be attempted after an earlier write fails.

Choose **unordered inserts** when the goal is to attempt as many independent valid documents as possible, even if some documents fail.

Neither option alone guarantees that all documents will be inserted successfully.

## 11. Important Concepts

### 11.1 `_id` uniqueness

Every MongoDB document in a collection has an `_id` field. MongoDB generates an ObjectId by default when you do not provide an `_id`, and the default `_id` index enforces uniqueness.

### 11.2 Partial success

A bulk operation can insert some documents and fail on others. Handle the error and inspect the result instead of assuming that an error means nothing was written.

### 11.3 Ordered inserts are not transactions

Ordered mode controls how MongoDB responds to write errors. It does not make the whole `insertMany()` call an all-or-nothing transaction.

If multiple writes must succeed or fail together, consider a transaction where supported and appropriate.

### 11.4 Unordered does not mean errors are ignored

MongoDB continues attempting remaining documents, but it still reports write errors. Your application should inspect and handle those errors.

### 11.5 A duplicate key is a write error

The duplicate `_id` example fails because the `_id` index is unique. The same general principle applies to another field that has a unique index, such as `email`.

## 12. Common Mistakes

1. **Assuming `ordered: false` suppresses errors.** It does not; it continues attempting later writes and reports failures.
2. **Assuming all documents fail when `insertMany()` throws.** Some documents may already have been inserted.
3. **Assuming ordered inserts are atomic.** Earlier successful inserts remain after a later write error.
4. **Assuming a hard-coded ObjectId is always a duplicate.** It is a duplicate only if the same value already exists in the collection.
5. **Assuming unordered inserts run in array order.** Their execution order is not guaranteed.
6. **Assuming every error has the same properties.** Inspect the error object and consult the documentation for your driver version.
7. **Ignoring existing test data.** Old documents can affect the outcome of repeated tests.

## 13. Interview Questions and Answers

### Q1. What is `insertMany()` in MongoDB?

`insertMany()` inserts multiple documents into a collection in one operation.

### Q2. What is the default value of `ordered`?

The default is `true`.

### Q3. What happens if the third document fails in an ordered insert of five documents?

MongoDB stops attempting subsequent documents after the third document fails. Earlier successful inserts remain, and the fourth and fifth documents are not attempted.

### Q4. What happens if the third document fails in an unordered insert?

MongoDB continues attempting the remaining documents. The operation still reports the write error.

### Q5. Does `ordered: false` guarantee that all documents will be inserted?

No. Invalid documents, duplicate keys, and other write errors can still prevent individual documents from being inserted.

### Q6. Are bulk inserts atomic?

Not as a whole by default. Some documents may be inserted even if others fail. Use a transaction when the application requires all-or-nothing behavior across supported operations.

### Q7. Why does MongoDB reject a duplicate `_id`?

The `_id` index enforces uniqueness within a collection, so a second document with the same `_id` cannot be inserted.

### Q8. Why doesn't `console.log(result)` run after a failed `insertMany()` call?

The awaited promise rejects with a write error, so normal execution skips the next statement and moves to the `catch` block.

### Q9. When is unordered insertion useful?

It is useful for bulk imports or independent records where continuing to attempt valid documents is more important than stopping at the first error.

### Q10. How can you determine which documents were inserted?

Inspect the bulk-write error and its result details using the APIs supported by your installed MongoDB Node.js driver, then query the collection to verify persisted data.

## 14. Quick Revision

```javascript
// Ordered: stop attempting later writes after a write error
await collection.insertMany(documents, {
  ordered: true
});

// Unordered: continue attempting later writes after errors
await collection.insertMany(documents, {
  ordered: false
});
```

Remember:

- `ordered: true` → stop after a write error.
- `ordered: false` → continue attempting remaining documents.
- Both modes can report errors.
- Successful inserts are not automatically rolled back.
- Duplicate `_id` values violate the collection's unique `_id` index.
- Use `try...catch` and inspect the bulk-write error to handle partial success.

---