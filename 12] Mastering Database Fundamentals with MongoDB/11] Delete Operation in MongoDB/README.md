# MongoDB Delete Operation

MongoDB provides several methods and operators to remove data.

There is an important distinction:

- **`deleteOne()` / `deleteMany()`** → remove entire documents.
- **`$unset`** → removes a field from an existing document.
- **`drop()`** → removes an entire collection.
- **`dropDatabase()`** → removes an entire database.

---

## Table of Contents

- [1. What is Delete Operation?](#1-what-is-delete-operation)
- [2. Delete One Document](#2-delete-one-document)
- [3. Delete Multiple Documents](#3-delete-multiple-documents)
- [4. Delete Using `_id`](#4-delete-using-_id)
- [5. Delete with Conditions](#5-delete-with-conditions)
- [6. `$unset` - Remove a Field](#6-unset---remove-a-field)
- [7. `$unset` vs `deleteOne()`](#7-unset-vs-deleteone)
- [8. Delete All Documents](#8-delete-all-documents)
- [9. Drop a Collection](#9-drop-a-collection)
- [10. Drop a Database](#10-drop-a-database)
- [11. Delete Operation Results](#11-delete-operation-results)
- [12. Node.js MongoDB Driver](#12-nodejs-mongodb-driver)
- [13. Soft Delete](#13-soft-delete)
- [14. Common Mistakes](#14-common-mistakes)
- [15. Best Practices](#15-best-practices)
- [16. Interview Questions](#16-interview-questions)
- [17. Quick Revision](#17-quick-revision)
- [18. Complete MongoDB CRUD](#18-complete-mongodb-crud)

---

# 1. What is Delete Operation?

The **Delete Operation** in MongoDB is used to remove documents from a collection.

MongoDB provides two primary delete methods:

```js
deleteOne();
deleteMany();
```

### `deleteOne()`

Deletes **one document** that matches the filter.

```js
db.users.deleteOne({
  name: "Sharvil",
});
```

### `deleteMany()`

Deletes **all documents** that match the filter.

```js
db.users.deleteMany({
  age: 25,
});
```

---

# 2. Delete One Document

The `deleteOne()` method removes one matching document.

## Syntax

```js
db.collection.deleteOne(filter);
```

### Example

Suppose we have:

```js
{
  _id: 1,
  name: "Sharvil",
  age: 22
}
```

We can delete it using:

```js
db.users.deleteOne({
  name: "Sharvil",
});
```

Result:

```js
{
  acknowledged: true,
  deletedCount: 1
}
```

### Important

If multiple documents match the filter, `deleteOne()` deletes only one matching document.

You should not rely on which matching document is selected unless your filter uniquely identifies the document.

---

# 3. Delete Multiple Documents

The `deleteMany()` method removes all documents matching the filter.

## Syntax

```js
db.collection.deleteMany(filter);
```

### Example

Suppose we have:

```js
{
  name: "A",
  age: 20
}

{
  name: "B",
  age: 20
}

{
  name: "C",
  age: 30
}
```

Run:

```js
db.users.deleteMany({
  age: 20,
});
```

Both documents with `age: 20` will be deleted.

Result:

```js
{
  acknowledged: true,
  deletedCount: 2
}
```

---

# 4. Delete Using `_id`

The `_id` field uniquely identifies a document.

For example:

```js
{
  _id: ObjectId("68abcd1234567890abcdef12"),
  name: "Sharvil"
}
```

You can delete it using:

```js
db.users.deleteOne({
  _id: ObjectId("68abcd1234567890abcdef12"),
});
```

In the Node.js MongoDB driver:

```js
import { ObjectId } from "mongodb";

await users.deleteOne({
  _id: new ObjectId(id),
});
```

Using `_id` is generally a good way to target one specific document.

---

# 5. Delete with Conditions

Delete methods accept MongoDB query filters.

## Delete by comparison

```js
db.users.deleteMany({
  age: {
    $lt: 18,
  },
});
```

This deletes users younger than 18.

---

### `$gt`

Delete users older than 50:

```js
db.users.deleteMany({
  age: {
    $gt: 50,
  },
});
```

---

### `$gte`

```js
db.users.deleteMany({
  age: {
    $gte: 60,
  },
});
```

---

### `$in`

Delete users whose city is Mumbai or Pune:

```js
db.users.deleteMany({
  city: {
    $in: ["Mumbai", "Pune"],
  },
});
```

---

## Delete using `$or`

```js
db.users.deleteMany({
  $or: [{ age: 18 }, { age: 60 }],
});
```

This deletes users whose age is either 18 or 60.

---

## Delete nested fields

Suppose:

```js
{
  name: "Sharvil",
  address: {
    city: "Mumbai",
    pincode: 421301
  }
}
```

You can delete documents based on a nested field:

```js
db.users.deleteMany({
  "address.city": "Mumbai",
});
```

---

## Delete based on array values

Suppose:

```js
{
  name: "Sharvil",
  skills: ["React", "Node.js", "MongoDB"]
}
```

You can delete documents containing `"MongoDB"`:

```js
db.users.deleteMany({
  skills: "MongoDB",
});
```

---

# 6. `$unset` - Remove a Field

An important point is that **you can also remove data using `$unset`**, but `$unset` does **not delete the entire document**.

It removes a **field from an existing document**.

`$unset` is an **Update Operator**.

## Syntax

```js
db.collection.updateOne(filter, {
  $unset: {
    fieldName: "",
  },
});
```

The value provided to `$unset` is ignored.

For example, these are effectively equivalent:

```js
$unset: {
  phone: "";
}
```

and:

```js
$unset: {
  phone: true;
}
```

The important part is the field name.

---

## Example

Suppose we have:

```js
{
  _id: 1,
  name: "Sharvil",
  age: 22,
  phone: "9876543210"
}
```

Run:

```js
db.users.updateOne(
  { _id: 1 },
  {
    $unset: {
      phone: "",
    },
  },
);
```

The resulting document becomes:

```js
{
  _id: 1,
  name: "Sharvil",
  age: 22
}
```

The document still exists.

Only the `phone` field has been removed.

---

## Remove Multiple Fields

You can remove multiple fields using one `$unset`.

```js
db.users.updateOne(
  { _id: 1 },
  {
    $unset: {
      phone: "",
      age: "",
      address: "",
    },
  },
);
```

Result:

```js
{
  _id: 1,
  name: "Sharvil"
}
```

---

## `$unset` with `updateMany()`

You can remove a field from multiple documents.

```js
db.users.updateMany(
  {},
  {
    $unset: {
      temporaryField: "",
    },
  },
);
```

This removes `temporaryField` from every document in the collection.

---

## `$unset` with Nested Fields

Suppose:

```js
{
  name: "Sharvil",
  address: {
    city: "Mumbai",
    pincode: 421301
  }
}
```

Remove only the `pincode` field:

```js
db.users.updateOne(
  { name: "Sharvil" },
  {
    $unset: {
      "address.pincode": "",
    },
  },
);
```

Result:

```js
{
  name: "Sharvil",
  address: {
    city: "Mumbai"
  }
}
```

---

# 7. `$unset` vs `deleteOne()`

This distinction is very important.

### `$unset`

Removes a **field** from a document.

```js
db.users.updateOne(
  { name: "Sharvil" },
  {
    $unset: {
      age: "",
    },
  },
);
```

Before:

```js
{
  name: "Sharvil",
  age: 22
}
```

After:

```js
{
  name: "Sharvil";
}
```

The document still exists.

---

### `deleteOne()`

Removes the **entire document**.

```js
db.users.deleteOne({
  name: "Sharvil",
});
```

Before:

```js
{
  name: "Sharvil",
  age: 22
}
```

After:

```text
Document no longer exists.
```

---

## Comparison

| Operation        | Removes            | CRUD Category       |
| ---------------- | ------------------ | ------------------- |
| `$unset`         | Field              | Update              |
| `deleteOne()`    | One document       | Delete              |
| `deleteMany()`   | Multiple documents | Delete              |
| `drop()`         | Collection         | Database management |
| `dropDatabase()` | Database           | Database management |

### Easy way to remember

```text
$unset
   ↓
Remove a FIELD

deleteOne()
   ↓
Remove a DOCUMENT

deleteMany()
   ↓
Remove DOCUMENTS

drop()
   ↓
Remove a COLLECTION

dropDatabase()
   ↓
Remove a DATABASE
```

---

# 8. Delete All Documents

You can delete every document in a collection using:

```js
db.users.deleteMany({});
```

The empty filter:

```js
{
}
```

matches every document.

### Example

Before:

```js
{
  name: "A";
}

{
  name: "B";
}

{
  name: "C";
}
```

Run:

```js
db.users.deleteMany({});
```

After:

```js
// No documents
```

However, the `users` collection still exists.

---

# 9. Drop a Collection

If you want to remove the entire collection:

```js
db.users.drop();
```

This removes:

- All documents
- The collection itself
- Collection metadata

For example:

```text
Database
└── users
    ├── document 1
    ├── document 2
    └── document 3
```

After:

```js
db.users.drop();
```

The `users` collection no longer exists.

---

## `deleteMany({})` vs `drop()`

### `deleteMany({})`

```js
db.users.deleteMany({});
```

Removes:

```text
Documents
```

But keeps:

```text
Collection
```

---

### `drop()`

```js
db.users.drop();
```

Removes:

```text
Collection
└── Documents
```

---

# 10. Drop a Database

To remove an entire database:

```js
db.dropDatabase();
```

For example:

```text
myDatabase
├── users
├── products
├── orders
└── payments
```

After:

```js
db.dropDatabase();
```

The database and its collections are removed.

> Be extremely careful with `dropDatabase()` because it is destructive.

---

# 11. Delete Operation Results

MongoDB returns information about the delete operation.

Example:

```js
const result = db.users.deleteOne({
  name: "Sharvil",
});
```

Possible result:

```js
{
  acknowledged: true,
  deletedCount: 1
}
```

## `deletedCount`

This tells you how many documents were deleted.

### Successful deletion

```js
{
  acknowledged: true,
  deletedCount: 1
}
```

### No matching document

```js
{
  acknowledged: true,
  deletedCount: 0
}
```

---

# 12. Node.js MongoDB Driver

You can perform delete operations using the official MongoDB Node.js driver.

## Connection

```js
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();

const db = client.db("myDatabase");
const users = db.collection("users");
```

---

## `deleteOne()`

```js
const result = await users.deleteOne({
  name: "Sharvil",
});

console.log(result);
```

---

## `deleteMany()`

```js
const result = await users.deleteMany({
  age: {
    $lt: 18,
  },
});

console.log(result.deletedCount);
```

---

## Delete using `_id`

```js
const result = await users.deleteOne({
  _id: new ObjectId(id),
});

console.log(result.deletedCount);
```

---

## `$unset` using Node.js

Remember that `$unset` is an update operation.

```js
const result = await users.updateOne(
  { name: "Sharvil" },
  {
    $unset: {
      phone: "",
    },
  },
);

console.log(result.modifiedCount);
```

---

# 13. Soft Delete

Sometimes applications should not permanently delete data.

Instead, they mark the document as deleted.

This is called a **soft delete**.

For example:

```js
{
  _id: 1,
  name: "Sharvil",
  isDeleted: false
}
```

Instead of:

```js
deleteOne({
  _id: 1,
});
```

we can use:

```js
updateOne(
  { _id: 1 },
  {
    $set: {
      isDeleted: true,
    },
  },
);
```

Now:

```js
{
  _id: 1,
  name: "Sharvil",
  isDeleted: true
}
```

The document still exists in the database.

---

## Reading Non-deleted Documents

The application can use:

```js
db.users.find({
  isDeleted: false,
});
```

This allows the application to hide deleted records without permanently removing them.

---

## Why Use Soft Delete?

Soft deletion can be useful when you need:

- Data recovery
- Audit history
- Undo functionality
- Record history
- Compliance/auditing requirements

Soft delete is an **application-level pattern**, not a special MongoDB delete operator.

---

# 14. Common Mistakes

## Mistake 1: Using `deleteOne()` when you only want to remove a field

Incorrect:

```js
db.users.deleteOne({
  phone: "9876543210",
});
```

This removes the entire document.

If you only want to remove the phone field:

```js
db.users.updateOne(
  { phone: "9876543210" },
  {
    $unset: {
      phone: "",
    },
  },
);
```

---

## Mistake 2: Forgetting the filter

Be careful with:

```js
db.users.deleteMany({});
```

This deletes every document in the collection.

---

## Mistake 3: Confusing `deleteMany({})` and `drop()`

```js
deleteMany({});
```

removes documents.

```js
drop();
```

removes the collection itself.

---

## Mistake 4: Using the wrong `_id` type

If `_id` is an `ObjectId`, this may not match:

```js
db.users.deleteOne({
  _id: "68abcd1234567890abcdef12",
});
```

Instead:

```js
db.users.deleteOne({
  _id: ObjectId("68abcd1234567890abcdef12"),
});
```

In Node.js:

```js
new ObjectId(id);
```

---

# 15. Best Practices

### 1. Use a precise filter

Prefer:

```js
db.users.deleteOne({
  _id: ObjectId("..."),
});
```

over unnecessarily broad filters.

---

### 2. Be careful with `deleteMany()`

Always verify your filter before running:

```js
deleteMany();
```

Especially:

```js
deleteMany({});
```

---

### 3. Use `$unset` for field removal

If the document should remain but a field should be removed:

```js
$unset;
```

is the appropriate update operator.

---

### 4. Consider soft delete for important records

For data that may need recovery or auditing, consider:

```js
isDeleted: true;
```

instead of permanently deleting the document.

---

### 5. Check `deletedCount`

After deletion:

```js
const result = await users.deleteOne({
  _id: new ObjectId(id),
});

console.log(result.deletedCount);
```

This helps confirm whether a document was actually deleted.

---

# 16. Interview Questions

### Q1. What methods are used to delete documents in MongoDB?

**Answer:**

MongoDB provides:

```js
deleteOne();
deleteMany();
```

`deleteOne()` deletes one matching document, while `deleteMany()` deletes all matching documents.

---

### Q2. What is the difference between `$unset` and `deleteOne()`?

**Answer:**

`$unset` is an update operator used to remove a field from a document.

`deleteOne()` removes an entire document.

Example:

```js
$unset;
```

removes:

```text
field
```

while:

```js
deleteOne();
```

removes:

```text
document
```

---

### Q3. How do you delete all documents from a collection?

```js
db.users.deleteMany({});
```

This removes all documents but keeps the collection.

---

### Q4. How do you remove an entire collection?

```js
db.users.drop();
```

---

### Q5. How do you remove an entire database?

```js
db.dropDatabase();
```

---

### Q6. What does `deletedCount` represent?

`deletedCount` tells us how many documents were actually deleted.

Example:

```js
{
  acknowledged: true,
  deletedCount: 2
}
```

means two documents were deleted.

---

### Q7. Does `deleteOne()` always delete the first document?

It deletes one document matching the filter, but you should not rely on a particular matching document being selected unless the filter uniquely identifies it.

---

### Q8. Can `$unset` remove multiple fields?

Yes.

```js
db.users.updateOne(
  { _id: 1 },
  {
    $unset: {
      age: "",
      phone: "",
      address: "",
    },
  },
);
```

---

### Q9. Can `$unset` be used with `updateMany()`?

Yes.

```js
db.users.updateMany(
  {},
  {
    $unset: {
      temporaryField: "",
    },
  },
);
```

This removes the field from all matching documents.

---

### Q10. Does `$unset` belong to the Delete operation?

Technically, no.

`$unset` is an **Update Operator**.

It removes a field while keeping the document.

---

# 17. Quick Revision

## Delete a single document

```js
db.users.deleteOne({
  name: "Sharvil",
});
```

---

## Delete multiple documents

```js
db.users.deleteMany({
  age: 20,
});
```

---

## Delete all documents

```js
db.users.deleteMany({});
```

---

## Remove a field

```js
db.users.updateOne(
  { name: "Sharvil" },
  {
    $unset: {
      phone: "",
    },
  },
);
```

---

## Remove multiple fields

```js
db.users.updateOne(
  { name: "Sharvil" },
  {
    $unset: {
      age: "",
      phone: "",
    },
  },
);
```

---

## Remove a collection

```js
db.users.drop();
```

---

## Remove a database

```js
db.dropDatabase();
```

---

## Soft delete

```js
db.users.updateOne(
  { _id: 1 },
  {
    $set: {
      isDeleted: true,
    },
  },
);
```

---

# 18. Complete MongoDB CRUD

MongoDB CRUD stands for:

```text
C → Create
R → Read
U → Update
D → Delete
```

## Create

```js
insertOne();
insertMany();
```

---

## Read

```js
find();
findOne();
```

---

## Update

```js
updateOne();
updateMany();
replaceOne();
```

Common update operators:

```js
$set;
$unset;
$inc;
$mul;
$min;
$max;
$rename;
$push;
$pop;
$pull;
$pullAll;
$addToSet;
```

---

## Delete

```js
deleteOne();
deleteMany();
```

---

## Important distinction

```text
                 MongoDB Data Removal
                         │
        ┌────────────────┼────────────────┐
        │                │                │
      Field           Document        Collection
        │                │                │
     $unset        deleteOne()        drop()
                   deleteMany()
        │
    Update Operation
```

---

## CRUD Cheat Sheet

| Operation       | MongoDB Method/Operator | Purpose                    |
| --------------- | ----------------------- | -------------------------- |
| Create one      | `insertOne()`           | Insert one document        |
| Create many     | `insertMany()`          | Insert multiple documents  |
| Read many       | `find()`                | Find documents             |
| Read one        | `findOne()`             | Find one document          |
| Update one      | `updateOne()`           | Update one document        |
| Update many     | `updateMany()`          | Update multiple documents  |
| Replace         | `replaceOne()`          | Replace entire document    |
| Remove field    | `$unset`                | Remove field from document |
| Delete one      | `deleteOne()`           | Delete one document        |
| Delete many     | `deleteMany()`          | Delete multiple documents  |
| Drop collection | `drop()`                | Delete collection          |
| Drop database   | `dropDatabase()`        | Delete database            |

---

# MongoDB CRUD Progress

```text
MongoDB
│
├── Database
│
├── Collections
│
├── Documents
│
├── CRUD
│   ├── Create       ✅
│   ├── Read         ✅
│   ├── Update       ✅
│   └── Delete       ✅
│
└── Next Topics
    ├── Indexes
    ├── Aggregation
    ├── Schema Design
    ├── Relationships
    ├── Transactions
    └── MongoDB + Express REST API
```

---

## Final Takeaway

The most important distinction from this topic is:

```text
$unset
→ Removes a FIELD
→ Part of UPDATE

deleteOne()
→ Removes ONE DOCUMENT
→ Part of DELETE

deleteMany()
→ Removes MULTIPLE DOCUMENTS
→ Part of DELETE

drop()
→ Removes COLLECTION

dropDatabase()
→ Removes DATABASE
```

So if you want to **delete a property but keep the document**, use:

```js
$unset;
```

If you want to **delete the entire document**, use:

```js
deleteOne();
```

or:

```js
deleteMany();
```
