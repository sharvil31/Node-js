# MongoDB ObjectId DataType

`ObjectId` is one of the most commonly used BSON data types in MongoDB.

MongoDB automatically generates an `ObjectId` for the `_id` field when a document is inserted without specifying its own `_id`.

Example:

```js
{
  _id: ObjectId("68e4c7a9f1a2b3c4d5e6f789"),
  name: "Sharvil",
  age: 22
}
```

The `_id` value above is an **ObjectId**.

---

# Table of Contents

- [1. What is ObjectId?](#1-what-is-objectid)
- [2. Why Does MongoDB Use ObjectId?](#2-why-does-mongodb-use-objectid)
- [3. ObjectId Structure](#3-objectid-structure)
- [4. ObjectId Size](#4-objectid-size)
- [5. ObjectId Example](#5-objectid-example)
- [6. Automatic ObjectId Generation](#6-automatic-objectid-generation)
- [7. Creating ObjectId Manually](#7-creating-objectid-manually)
- [8. ObjectId in Node.js](#8-objectid-in-nodejs)
- [9. ObjectId vs String](#9-objectid-vs-string)
- [10. Querying Documents Using ObjectId](#10-querying-documents-using-objectid)
- [11. Comparing ObjectIds](#11-comparing-objectids)
- [12. Checking Whether a String is a Valid ObjectId](#12-checking-whether-a-string-is-a-valid-objectid)
- [13. ObjectId Timestamp](#13-objectid-timestamp)
- [14. Generating ObjectId Without Inserting a Document](#14-generating-objectid-without-inserting-a-document)
- [15. ObjectId and URL Parameters](#15-objectid-and-url-parameters)
- [16. Common Mistakes](#16-common-mistakes)
- [17. ObjectId vs UUID](#17-objectid-vs-uuid)
- [18. Interview Questions](#18-interview-questions)
- [19. Quick Revision](#19-quick-revision)

---

# 1. What is ObjectId?

`ObjectId` is a BSON data type used by MongoDB to represent unique identifiers.

MongoDB commonly uses it as the value of the `_id` field.

Example:

```js
{
  _id: ObjectId("68e4c7a9f1a2b3c4d5e6f789"),
  name: "John",
  email: "john@example.com"
}
```

Here:

```text
_id
 ↓
ObjectId
 ↓
68e4c7a9f1a2b3c4d5e6f789
```

`ObjectId` is **not simply a string**.

It is a BSON type.

---

# 2. Why Does MongoDB Use ObjectId?

Every document in a MongoDB collection must have a unique `_id`.

For example:

```js
{
  _id: ObjectId("68e4c7a9f1a2b3c4d5e6f789"),
  name: "Sharvil"
}
```

MongoDB uses `_id` to uniquely identify the document.

If you don't provide `_id` yourself, MongoDB automatically generates one.

For example:

```js
db.users.insertOne({
  name: "Sharvil",
  age: 22,
});
```

MongoDB creates something similar to:

```js
{
  _id: ObjectId("68e4c7a9f1a2b3c4d5e6f789"),
  name: "Sharvil",
  age: 22
}
```

---

# 3. ObjectId Structure

An ObjectId is a **12-byte BSON value**.

Its hexadecimal representation contains **24 hexadecimal characters**.

For example:

```text
68e4c7a9f1a2b3c4d5e6f789
```

It contains:

```text
24 hexadecimal characters
```

Each hexadecimal character represents 4 bits.

Therefore:

```text
24 × 4 = 96 bits
```

And:

```text
96 bits ÷ 8 = 12 bytes
```

So:

```text
ObjectId
    ↓
12 bytes
    ↓
96 bits
    ↓
24 hexadecimal characters
```

---

# 4. ObjectId Size

An ObjectId consists of 12 bytes.

Conceptually, it is composed of:

```text
4 bytes → Timestamp
5 bytes → Random value
3 bytes → Incrementing counter
```

So:

```text
┌────────────┬───────────────┬──────────────┐
│ 4 bytes    │ 5 bytes       │ 3 bytes      │
│ Timestamp  │ Random value  │ Counter      │
└────────────┴───────────────┴──────────────┘
```

Total:

```text
4 + 5 + 3 = 12 bytes
```

### Important

The ObjectId specification has evolved over time, so avoid assuming that the 5-byte portion is literally a machine/process identifier. Modern ObjectId implementations use a 5-byte random value.

---

# 5. ObjectId Example

Consider:

```js
ObjectId("68e4c7a9f1a2b3c4d5e6f789");
```

The complete value is:

```text
68e4c7a9f1a2b3c4d5e6f789
```

It is represented as hexadecimal.

Valid hexadecimal characters are:

```text
0-9
a-f
A-F
```

For example:

```text
68e4c7a9f1a2b3c4d5e6f789
```

contains only hexadecimal characters.

---

# 6. Automatic ObjectId Generation

If you insert a document without an `_id`:

```js
db.users.insertOne({
  name: "Sharvil",
  age: 22,
});
```

MongoDB automatically generates `_id`.

The resulting document looks like:

```js
{
  _id: ObjectId("68e4c7a9f1a2b3c4d5e6f789"),
  name: "Sharvil",
  age: 22
}
```

This is one of the reasons ObjectId is convenient.

You don't have to manually create an ID for every document.

---

# 7. Creating ObjectId Manually

You can create an ObjectId yourself.

In `mongosh`:

```js
ObjectId();
```

Example:

```js
ObjectId("68e4c7a9f1a2b3c4d5e6f789");
```

You can also generate a new ObjectId:

```js
ObjectId();
```

MongoDB will generate a new unique identifier.

Example:

```text
ObjectId('68e4c7a9f1a2b3c4d5e6f789')
```

---

# 8. ObjectId in Node.js

The MongoDB Node.js driver provides the `ObjectId` class.

Import it:

```js
import { ObjectId } from "mongodb";
```

Create an ObjectId:

```js
const id = new ObjectId();

console.log(id);
```

Example output:

```text
68e4c7a9f1a2b3c4d5e6f789
```

---

## Create ObjectId from a String

Suppose you receive:

```js
const id = "68e4c7a9f1a2b3c4d5e6f789";
```

Convert it into an ObjectId:

```js
const objectId = new ObjectId(id);
```

Now:

```text
id
 ↓
String

new ObjectId(id)
 ↓
ObjectId
```

This is especially important when working with Express route parameters.

---

# 9. ObjectId vs String

These are different BSON types:

```js
ObjectId("68e4c7a9f1a2b3c4d5e6f789");
```

and:

```js
"68e4c7a9f1a2b3c4d5e6f789";
```

The first is:

```text
ObjectId
```

The second is:

```text
String
```

Even though they contain the same characters, MongoDB treats them as different values.

---

## Example

Suppose the document contains:

```js
{
  _id: ObjectId("68e4c7a9f1a2b3c4d5e6f789"),
  name: "Sharvil"
}
```

This query uses a string:

```js
db.users.findOne({
  _id: "68e4c7a9f1a2b3c4d5e6f789",
});
```

It will not match the ObjectId `_id`.

You need:

```js
db.users.findOne({
  _id: ObjectId("68e4c7a9f1a2b3c4d5e6f789"),
});
```

---

# 10. Querying Documents Using ObjectId

Suppose:

```js
{
  _id: ObjectId("68e4c7a9f1a2b3c4d5e6f789"),
  name: "Sharvil",
  age: 22
}
```

You can query it using:

```js
db.users.findOne({
  _id: ObjectId("68e4c7a9f1a2b3c4d5e6f789"),
});
```

---

## Update Using ObjectId

```js
db.users.updateOne(
  {
    _id: ObjectId("68e4c7a9f1a2b3c4d5e6f789"),
  },
  {
    $set: {
      age: 23,
    },
  },
);
```

---

## Delete Using ObjectId

```js
db.users.deleteOne({
  _id: ObjectId("68e4c7a9f1a2b3c4d5e6f789"),
});
```

---

# 11. Comparing ObjectIds

ObjectIds are objects in the Node.js driver.

Therefore, comparing them with `===` can give an unexpected result.

Example:

```js
const id1 = new ObjectId("68e4c7a9f1a2b3c4d5e6f789");
const id2 = new ObjectId("68e4c7a9f1a2b3c4d5e6f789");

console.log(id1 === id2);
```

Result:

```text
false
```

Why?

Because these are two different JavaScript object instances.

---

## Use `.equals()`

Use:

```js
console.log(id1.equals(id2));
```

Result:

```text
true
```

This compares the actual ObjectId values.

---

## Convert to String

Another option is:

```js
console.log(id1.toString() === id2.toString());
```

Result:

```text
true
```

---

# 12. Checking Whether a String is a Valid ObjectId

When receiving an ID from a client, validate it before creating an ObjectId.

Using the Node.js driver:

```js
import { ObjectId } from "mongodb";

const id = "68e4c7a9f1a2b3c4d5e6f789";

if (ObjectId.isValid(id)) {
  console.log("Valid ObjectId");
}
```

This is useful for Express APIs.

For example:

```js
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  const user = await users.findOne({
    _id: new ObjectId(id),
  });

  res.json(user);
});
```

---

# 13. ObjectId Timestamp

One useful property of ObjectId is that it contains a timestamp component.

In Node.js:

```js
const id = new ObjectId();

console.log(id.getTimestamp());
```

Example:

```text
2026-10-07T16:00:00.000Z
```

The timestamp represents the ObjectId's generation time with **second-level precision**.

---

## Example

```js
const id = new ObjectId();

console.log(id);
console.log(id.getTimestamp());
```

This allows you to extract the timestamp encoded in the ObjectId.

### Important

The timestamp is useful for information about when the ObjectId was generated, but you should **not use ObjectId as a replacement for a dedicated `createdAt` field** when your application needs reliable application-level creation timestamps.

A better document design is:

```js
{
  _id: ObjectId("..."),
  name: "Sharvil",
  createdAt: new Date()
}
```

---

# 14. Generating ObjectId Without Inserting a Document

You can generate an ObjectId without inserting anything into MongoDB.

```js
const id = new ObjectId();
```

This is useful when you need an ID before performing another operation.

For example:

```js
const userId = new ObjectId();

const user = {
  _id: userId,
  name: "Sharvil",
};
```

Then:

```js
await users.insertOne(user);
```

---

# 15. ObjectId and URL Parameters

This is extremely common when building Express + MongoDB APIs.

Suppose your API is:

```text
GET /users/68e4c7a9f1a2b3c4d5e6f789
```

Express gives you:

```js
req.params.id;
```

The value is a string:

```js
"68e4c7a9f1a2b3c4d5e6f789";
```

But MongoDB expects an ObjectId if `_id` is stored as an ObjectId.

Therefore:

```js
const { id } = req.params;

const user = await users.findOne({
  _id: new ObjectId(id),
});
```

---

## Complete Example

```js
import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();

const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();

const db = client.db("myDatabase");
const users = db.collection("users");

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid ObjectId",
    });
  }

  const user = await users.findOne({
    _id: new ObjectId(id),
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json(user);
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
```

The flow is:

```text
Client
  │
  │ GET /users/:id
  ↓
Express
  │
  │ req.params.id
  ↓
String
  │
  │ new ObjectId(id)
  ↓
ObjectId
  │
  ↓
MongoDB Query
```

---

# 16. Common Mistakes

## Mistake 1: Treating ObjectId as a string

Incorrect:

```js
db.users.findOne({
  _id: "68e4c7a9f1a2b3c4d5e6f789",
});
```

If `_id` is an ObjectId, use:

```js
db.users.findOne({
  _id: ObjectId("68e4c7a9f1a2b3c4d5e6f789"),
});
```

---

## Mistake 2: Forgetting conversion in Express

This is a common mistake:

```js
const { id } = req.params;

const user = await users.findOne({
  _id: id,
});
```

`id` is a string.

Use:

```js
const user = await users.findOne({
  _id: new ObjectId(id),
});
```

After validating it:

```js
if (!ObjectId.isValid(id)) {
  return res.status(400).json({
    message: "Invalid ObjectId",
  });
}
```

---

## Mistake 3: Comparing ObjectIds using `===`

Avoid:

```js
id1 === id2;
```

Use:

```js
id1.equals(id2);
```

---

## Mistake 4: Assuming every 24-character hexadecimal string is automatically the correct database ID

A string may have the right format but still not correspond to an existing document.

For example:

```js
ObjectId.isValid(id);
```

only checks whether the value can be interpreted as a valid ObjectId. It does **not** tell you whether a document with that `_id` exists.

You still need to query MongoDB.

---

# 17. ObjectId vs UUID

MongoDB does not require you to use ObjectId.

You can use other `_id` types, including strings and UUIDs.

### ObjectId

```js
{
  _id: ObjectId("68e4c7a9f1a2b3c4d5e6f789");
}
```

### String

```js
{
  _id: "user-12345";
}
```

### UUID

```js
{
  _id: UUID("...");
}
```

ObjectId is convenient because it:

- Is compact
- Is automatically generated
- Is designed for uniqueness
- Contains a timestamp component
- Is commonly used as MongoDB's default `_id`

But the best `_id` type depends on the application's requirements.

---

# 18. Interview Questions

## Q1. What is ObjectId?

`ObjectId` is a BSON data type commonly used by MongoDB for the `_id` field.

It is a 12-byte value represented as 24 hexadecimal characters.

---

## Q2. How many bytes is an ObjectId?

An ObjectId is:

```text
12 bytes
```

or:

```text
96 bits
```

and is represented using:

```text
24 hexadecimal characters
```

---

## Q3. What is the structure of ObjectId?

Conceptually:

```text
4 bytes → Timestamp
5 bytes → Random value
3 bytes → Counter
```

Total:

```text
12 bytes
```

---

## Q4. Is ObjectId a string?

No.

ObjectId and string are different BSON/JavaScript types.

```js
ObjectId("...");
```

is an ObjectId, while:

```js
"...";
```

is a string.

---

## Q5. Why does MongoDB use ObjectId?

MongoDB needs a unique `_id` for every document.

ObjectId provides a compact identifier that can be generated automatically and is designed to be unique.

---

## Q6. What happens if `_id` is not provided?

MongoDB automatically generates an `_id` value, normally an ObjectId when using the standard driver behavior.

---

## Q7. How do you create an ObjectId in Node.js?

```js
import { ObjectId } from "mongodb";

const id = new ObjectId();
```

---

## Q8. How do you convert a string to ObjectId?

```js
const objectId = new ObjectId(id);
```

It is good practice to validate first:

```js
if (ObjectId.isValid(id)) {
  const objectId = new ObjectId(id);
}
```

---

## Q9. How do you compare two ObjectIds?

Use:

```js
id1.equals(id2);
```

instead of:

```js
id1 === id2;
```

---

## Q10. Can ObjectId provide the exact creation time of a document?

ObjectId contains a timestamp component representing when the ObjectId was generated, with second-level precision.

However, for application-level creation time, it is better to store:

```js
createdAt: new Date();
```

---

## Q11. What is `ObjectId.isValid()` used for?

It checks whether a value can be interpreted as a valid ObjectId.

Example:

```js
ObjectId.isValid(id);
```

It does **not** check whether a document with that ID exists.

---

## Q12. Can we use a custom `_id` instead of ObjectId?

Yes.

MongoDB allows `_id` values of different BSON types, provided they satisfy the `_id` requirements.

For example:

```js
{
  _id: "user-123",
  name: "Sharvil"
}
```

---

# 19. Quick Revision

### ObjectId

```text
MongoDB BSON Data Type
```

### Size

```text
12 bytes
96 bits
24 hexadecimal characters
```

### Structure

```text
4 bytes → Timestamp
5 bytes → Random value
3 bytes → Counter
```

### Generate

```js
new ObjectId();
```

### Convert string to ObjectId

```js
new ObjectId(id);
```

### Validate

```js
ObjectId.isValid(id);
```

### Compare

```js
id1.equals(id2);
```

### Get timestamp

```js
id.getTimestamp();
```

### Query

```js
db.users.findOne({
  _id: ObjectId("..."),
});
```

### Node.js query

```js
await users.findOne({
  _id: new ObjectId(id),
});
```

---

# Important Concept to Remember

When working with MongoDB and Express, remember this conversion:

```text
URL
  ↓
/users/68e4c7a9f1a2b3c4d5e6f789
  ↓
req.params.id
  ↓
String
  ↓
new ObjectId(id)
  ↓
ObjectId
  ↓
MongoDB
```

This is one of the most common things you'll encounter when building MongoDB REST APIs.

---

# MongoDB Learning Progress

```text
MongoDB
│
├── Database
│
├── Collections
│
├── Documents
│
├── BSON
│
├── ObjectId          ✅
│
└── CRUD
    ├── Create        ✅
    ├── Read          ✅
    ├── Update        ✅
    └── Delete        ✅
```

### Recommended Next Topics

```text
Indexes
   ↓
Aggregation Pipeline
   ↓
Schema Design
   ↓
Relationships
   ↓
MongoDB + Express REST API
   ↓
Transactions
```

---

# Final Takeaway

The most important things to remember about `ObjectId` are:

```text
ObjectId
│
├── BSON data type
├── Commonly used for _id
├── 12 bytes
├── 24 hexadecimal characters
├── Contains a timestamp component
├── Automatically generated when _id isn't supplied
├── Different from a string
├── Convert API string IDs using new ObjectId(id)
├── Validate with ObjectId.isValid()
└── Compare with .equals()
```

The most common real-world pattern is:

```js
const { id } = req.params;

if (!ObjectId.isValid(id)) {
  return res.status(400).json({
    message: "Invalid ID",
  });
}

const user = await users.findOne({
  _id: new ObjectId(id),
});
```

Understanding this pattern is essential when connecting **Express APIs with MongoDB**.
