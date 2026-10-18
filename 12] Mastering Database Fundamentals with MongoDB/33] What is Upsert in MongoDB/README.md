# Upsert in MongoDB

Upsert means Update + Insert. When `upsert: true` is specified, MongoDB updates a matching document or inserts a new document if no document matches the filter.

## Table of Contents

1. Introduction
2. Basic Example
3. Upsert Enabled vs Disabled
4. Upsert with MongoDB Methods
5. `$set` vs `$setOnInsert`
6. Upsert in Node.js
7. Understanding Update Results
8. Important Concepts
9. Common Mistakes
10. Interview Questions

## 1. Introduction

MongoDB supports the `upsert` option for update and replacement operations. The default is `false`.

- `upsert: false`: update matching documents; insert nothing if there is no match.
- `upsert: true`: update matching documents; otherwise insert a new document.

## 2. Basic Example

Assume `users` contains:

```javascript
db.users.insertMany([
  { _id: 1, name: "Sharvil", age: 22 },
  { _id: 2, name: "Akash", age: 23 }
]);
```

Update a matching document:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  { $set: { age: 23 } },
  { upsert: true }
);
```

Sharvil exists, so MongoDB updates the age without inserting another document.

Now try a user who does not exist:

```javascript
db.users.updateOne(
  { name: "Rahul" },
  { $set: { age: 25 } },
  { upsert: true }
);
```

MongoDB inserts a new document containing the applicable equality filter fields and update values. It generates an `_id` if one is not supplied.

## 3. Upsert Enabled vs Disabled

| Option | Matching document | No matching document |
|---|---|---|
| `upsert: false` | Update | No insert |
| `upsert: true` | Update | Insert |

## 4. Upsert with MongoDB Methods

### `updateOne()`

Updates one matching document or inserts one when no match exists.

```javascript
db.users.updateOne(
  { email: "rahul@example.com" },
  { $set: { age: 24 } },
  { upsert: true }
);
```

### `updateMany()`

Updates all matching documents. If none match and upsert is enabled, it inserts at most one document.

```javascript
db.users.updateMany(
  { department: "IT" },
  { $set: { active: true } },
  { upsert: true }
);
```

### `replaceOne()`

Replaces a matching document or inserts a replacement when no match exists.

```javascript
db.users.replaceOne(
  { email: "rahul@example.com" },
  { name: "Rahul", email: "rahul@example.com", age: 24 },
  { upsert: true }
);
```

Replacement removes the previous fields not present in the replacement document, subject to MongoDB's immutable `_id` rules.

### `findOneAndUpdate()`

```javascript
db.users.findOneAndUpdate(
  { email: "rahul@example.com" },
  { $set: { age: 25 } },
  { upsert: true, returnDocument: "after" }
);
```

This requests the document after the update or upsert. Return shapes can vary by API and driver version.

## 5. `$set` vs `$setOnInsert`

`$set` updates the specified fields when a match exists and also applies to a newly inserted upsert document.

`$setOnInsert` applies only when the upsert inserts a new document.

```javascript
db.users.updateOne(
  { email: "rahul@example.com" },
  {
    $set: { age: 25 },
    $setOnInsert: { name: "Rahul" }
  },
  { upsert: true }
);
```

If the email already exists, MongoDB updates the age and leaves the existing name unchanged. If it does not exist, MongoDB inserts a document with the email, age, and name.

## 6. Upsert in Node.js

Install the driver:

```bash
npm install mongodb
```

Example `index.js` (using ES modules):

```javascript
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

try {
  await client.connect();

  const db = client.db("college");
  const users = db.collection("users");

  const result = await users.updateOne(
    { email: "rahul@example.com" },
    {
      $set: { age: 25 },
      $setOnInsert: { name: "Rahul" }
    },
    { upsert: true }
  );

  console.log("Matched:", result.matchedCount);
  console.log("Modified:", result.modifiedCount);
  console.log("Upserted:", result.upsertedCount);
  console.log("Upserted ID:", result.upsertedId);
} catch (error) {
  console.error("Operation failed:", error);
} finally {
  await client.close();
}
```

For a long-running server, reuse a shared `MongoClient` rather than connecting and closing it for each request.

## 7. Understanding Update Results

| Property | Meaning |
|---|---|
| `acknowledged` | Whether MongoDB acknowledged the write |
| `matchedCount` | Number of documents matching the filter |
| `modifiedCount` | Number of existing documents modified |
| `upsertedCount` | Number inserted by the upsert |
| `upsertedId` | ID of the upserted document, when applicable |

Typical `updateOne()` outcomes:

- Existing document matched and changed: `matchedCount: 1`, `upsertedCount: 0`.
- Existing document matched but values were already the same: `matchedCount: 1`, `modifiedCount: 0`.
- No match and a document was inserted: `matchedCount: 0`, `upsertedCount: 1`.

## 8. Important Concepts

1. `upsert` defaults to `false`.
2. Upsert does not mean insert every time; it inserts only when no document matches.
3. The new document is constructed from applicable equality conditions in the filter and the update operations, not by copying every filter expression.
4. MongoDB generates `_id` if the inserted document does not provide one.
5. Upsert does not by itself guarantee uniqueness for a logical key. Use a suitable unique index to enforce uniqueness, and handle duplicate-key errors where concurrent operations are possible.
6. Upsert is not a substitute for a transaction when multiple operations must succeed or fail together.

## 9. Common Mistakes

- Forgetting `{ upsert: true }` and expecting an insert when no document matches.
- Assuming `updateMany()` inserts one document per possible match when none exist; it inserts at most one upserted document.
- Using `$set` when the intention is to replace the entire document. Use `replaceOne()` for replacement behavior.
- Assuming `$setOnInsert` updates existing documents. It only applies during insertion.
- Assuming an upsert prevents duplicate logical records under concurrent requests without a unique index.

## 10. Interview Questions

**Q1. What is upsert?**

Upsert updates a matching document or inserts a new one if no document matches the filter.

**Q2. What is the default value of `upsert`?**

`false`.

**Q3. What does `$setOnInsert` do?**

It sets specified fields only when an upsert inserts a new document.

**Q4. Does `updateMany()` insert multiple documents if there is no match?**

No. It inserts at most one document through upsert.

**Q5. Can upsert create duplicates?**

Yes, concurrent upserts can create duplicate logical records if no unique constraint prevents them. A unique index is the usual way to enforce uniqueness.

**Q6. How is `updateOne()` with upsert different from a normal update?**

A normal update does not insert when nothing matches. With `upsert: true`, MongoDB inserts a document when the filter matches nothing.

## Quick Revision

```javascript
db.users.updateOne(
  { name: "Rahul" },
  { $set: { age: 25 } },
  { upsert: true }
);
```

**Remember:** `upsert: true` means update if found; insert if not found.