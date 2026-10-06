# MongoDB: Create Operation

The **Create operation** is the first operation in CRUD.

CRUD stands for:

```text
C → Create
R → Read
U → Update
D → Delete
```

In MongoDB, the Create operation is used to **insert new documents into a collection**.

MongoDB provides two primary methods for inserting documents:

```javascript
insertOne();
insertMany();
```

---

# 1. What is the Create Operation?

The Create operation means adding new data to MongoDB.

For example, if we have a `users` collection:

```text
users
│
├── Document 1
├── Document 2
└── Document 3
```

When we create a new user:

```javascript
{
  name: "Sharvil",
  age: 22
}
```

MongoDB adds this document to the collection:

```text
users
│
├── Document 1
├── Document 2
├── Document 3
└── New Document
```

---

# 2. Methods Used for Create

MongoDB provides two commonly used insertion methods:

| Method         | Purpose                   |
| -------------- | ------------------------- |
| `insertOne()`  | Insert a single document  |
| `insertMany()` | Insert multiple documents |

---

# 3. `insertOne()`

The `insertOne()` method is used to insert **one document** into a collection.

## Syntax

```javascript
db.collectionName.insertOne(document);
```

### Example

```javascript
db.users.insertOne({
  name: "Sharvil",
  age: 22,
  role: "Frontend Developer",
});
```

Here:

```text
db
 ↓
users
 ↓
insertOne()
 ↓
document
```

MongoDB inserts the document into the `users` collection.

---

# 4. Result of `insertOne()`

After inserting a document, MongoDB returns an object similar to:

```javascript
{
  acknowledged: true,
  insertedId: ObjectId("68e3b6c7a1f4d8e912345678")
}
```

## `acknowledged`

```javascript
acknowledged: true;
```

This indicates that MongoDB acknowledged the write operation.

## `insertedId`

```javascript
insertedId: ObjectId("...");
```

This is the `_id` assigned to the newly inserted document.

---

# 5. Automatic `_id` Generation

MongoDB requires every document to have a unique `_id`.

If you don't provide one, MongoDB automatically generates it.

Example:

```javascript
db.users.insertOne({
  name: "Sharvil",
  age: 22,
});
```

MongoDB stores something similar to:

```javascript
{
  _id: ObjectId("68e3b6c7a1f4d8e912345678"),
  name: "Sharvil",
  age: 22
}
```

You don't normally need to manually create `_id`.

---

# 6. Providing Your Own `_id`

You can provide your own `_id` value.

Example:

```javascript
db.users.insertOne({
  _id: "user-001",
  name: "Sharvil",
  age: 22,
});
```

The stored document becomes:

```javascript
{
  _id: "user-001",
  name: "Sharvil",
  age: 22
}
```

The `_id` must be unique within that collection.

---

# 7. Duplicate `_id`

MongoDB does not allow two documents in the same collection to have the same `_id`.

Suppose this document already exists:

```javascript
{
  _id: "user-001",
  name: "Sharvil"
}
```

Trying to insert:

```javascript
db.users.insertOne({
  _id: "user-001",
  name: "Rahul",
});
```

will result in a duplicate key error.

Conceptually:

```text
users

_id       name
----------------
user-001  Sharvil
user-002  Rahul
```

You cannot insert another:

```text
user-001
```

---

# 8. Inserting Nested Documents

MongoDB documents can contain nested documents.

Example:

```javascript
db.users.insertOne({
  name: "Sharvil",
  age: 22,

  address: {
    city: "Kalyan",
    state: "Maharashtra",
    country: "India",
  },
});
```

The resulting document looks like:

```javascript
{
  _id: ObjectId("..."),

  name: "Sharvil",
  age: 22,

  address: {
    city: "Kalyan",
    state: "Maharashtra",
    country: "India"
  }
}
```

Here `address` is an embedded document.

---

# 9. Inserting Arrays

MongoDB documents can contain arrays.

Example:

```javascript
db.users.insertOne({
  name: "Sharvil",

  skills: ["React", "Next.js", "Node.js", "MongoDB"],
});
```

The document contains an array field:

```javascript
skills: ["React", "Next.js", "Node.js", "MongoDB"];
```

---

# 10. Arrays of Documents

Arrays can also contain objects.

Example:

```javascript
db.users.insertOne({
  name: "Sharvil",

  projects: [
    {
      name: "Cineworld",
      technology: "React",
    },
    {
      name: "Luna AI",
      technology: "React",
    },
  ],
});
```

The structure becomes:

```text
User Document
│
├── name
│
└── projects
    │
    ├── Project
    │   ├── name
    │   └── technology
    │
    └── Project
        ├── name
        └── technology
```

---

# 11. `insertMany()`

The `insertMany()` method is used to insert **multiple documents** at once.

## Syntax

```javascript
db.collectionName.insertMany([document1, document2, document3]);
```

Example:

```javascript
db.users.insertMany([
  {
    name: "Sharvil",
    age: 22,
  },

  {
    name: "Rahul",
    age: 25,
  },

  {
    name: "Priya",
    age: 23,
  },
]);
```

Notice that `insertMany()` receives an **array of documents**.

---

# 12. Result of `insertMany()`

MongoDB returns something similar to:

```javascript
{
  acknowledged: true,

  insertedIds: {
    "0": ObjectId("..."),
    "1": ObjectId("..."),
    "2": ObjectId("...")
  }
}
```

`insertedIds` contains the IDs generated for the inserted documents.

The keys:

```text
0
1
2
```

correspond to the indexes of the documents passed to `insertMany()`.

---

# 13. `insertOne()` vs `insertMany()`

| Feature   | `insertOne()`        | `insertMany()` |
| --------- | -------------------- | -------------- |
| Documents | One                  | Multiple       |
| Input     | Object               | Array          |
| Result ID | `insertedId`         | `insertedIds`  |
| Use case  | Individual insertion | Bulk insertion |

### `insertOne()`

```javascript
db.users.insertOne({
  name: "Sharvil",
});
```

### `insertMany()`

```javascript
db.users.insertMany([
  {
    name: "Sharvil",
  },
  {
    name: "Rahul",
  },
]);
```

---

# 14. Ordered Inserts

`insertMany()` supports an `ordered` option.

By default, MongoDB uses:

```javascript
{
  ordered: true;
}
```

Example:

```javascript
db.users.insertMany([{ name: "John" }, { name: "Alex" }, { name: "Priya" }], {
  ordered: true,
});
```

MongoDB processes the documents in the order they appear.

If an error occurs, MongoDB stops processing subsequent documents.

---

# 15. Unordered Inserts

You can use:

```javascript
{
  ordered: false;
}
```

Example:

```javascript
db.users.insertMany([{ name: "John" }, { name: "Alex" }, { name: "Priya" }], {
  ordered: false,
});
```

With unordered insertion, MongoDB attempts to continue inserting the remaining documents even if one document encounters an error.

This can be useful when performing bulk insert operations where you don't want one failure to prevent attempts on the remaining documents.

---

# 16. Flexible Schema During Create

MongoDB allows documents in the same collection to have different fields.

For example:

```javascript
db.users.insertMany([
  {
    name: "John",
    email: "john@gmail.com",
  },

  {
    name: "Alex",
    email: "alex@gmail.com",
    age: 25,
  },

  {
    name: "Priya",
    skills: ["React", "Node.js"],
  },
]);
```

These documents can coexist in the same collection.

However, flexible schema does **not** mean data should be unstructured in a production application.

Applications should still maintain sensible data models and validation.

---

# 17. Creating a Product

Consider an e-commerce application.

We can insert a product:

```javascript
db.products.insertOne({
  name: "Wireless Headphones",
  price: 2999,
  category: "Electronics",
  stock: 50,
});
```

MongoDB automatically generates `_id`.

Result:

```javascript
{
  _id: ObjectId("..."),
  name: "Wireless Headphones",
  price: 2999,
  category: "Electronics",
  stock: 50
}
```

---

# 18. Creating a More Complex Product

MongoDB allows nested structures:

```javascript
db.products.insertOne({
  name: "Wireless Headphones",

  price: 2999,

  category: "Electronics",

  stock: 50,

  specifications: {
    battery: "40 hours",
    bluetooth: "5.3",
    noiseCancellation: true,
  },

  tags: ["wireless", "bluetooth", "headphones"],
});
```

The resulting document can contain:

```text
Product
│
├── name
├── price
├── category
├── stock
│
├── specifications
│   ├── battery
│   ├── bluetooth
│   └── noiseCancellation
│
└── tags
    ├── wireless
    ├── bluetooth
    └── headphones
```

---

# 19. Creating Multiple Products

Using `insertMany()`:

```javascript
db.products.insertMany([
  {
    name: "Wireless Headphones",
    price: 2999,
    stock: 50,
  },

  {
    name: "Mechanical Keyboard",
    price: 4999,
    stock: 30,
  },

  {
    name: "Wireless Mouse",
    price: 1499,
    stock: 100,
  },
]);
```

This is more convenient than making three separate `insertOne()` calls.

---

# 20. Create Operation with Dates

MongoDB supports the Date BSON type.

Example:

```javascript
db.users.insertOne({
  name: "Sharvil",
  createdAt: new Date(),
});
```

The document contains a date value:

```javascript
{
  _id: ObjectId("..."),
  name: "Sharvil",
  createdAt: ISODate("...")
}
```

Dates are commonly used for fields such as:

```text
createdAt
updatedAt
deletedAt
publishedAt
```

---

# 21. Create Operation Flow

When you execute:

```javascript
db.users.insertOne({
  name: "Sharvil",
  age: 22,
});
```

the general flow is:

```text
MongoDB Shell / Application
          │
          ↓
MongoDB Driver
          │
          ↓
MongoDB Server
          │
          ↓
users Collection
          │
          ↓
Document Creation
          │
          ↓
_id Generation
          │
          ↓
Document Stored
          │
          ↓
Insert Result Returned
```

---

# 22. Create Operation in Node.js

When using MongoDB with Node.js, the MongoDB driver provides the same operations.

Example:

```javascript
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();

const db = client.db("ecommerce");

const result = await db.collection("users").insertOne({
  name: "Sharvil",
  age: 22,
});

console.log(result);
```

The important part is:

```javascript
db.collection("users").insertOne({
  name: "Sharvil",
  age: 22,
});
```

---

# 23. Node.js `insertMany()`

Multiple documents can be inserted using:

```javascript
const result = await db.collection("users").insertMany([
  {
    name: "Sharvil",
    age: 22,
  },

  {
    name: "Rahul",
    age: 25,
  },

  {
    name: "Priya",
    age: 23,
  },
]);

console.log(result);
```

---

# 24. Important Create Operation Concepts

## 1. Collection can be created automatically

If you execute:

```javascript
db.users.insertOne({
  name: "Sharvil",
});
```

and `users` doesn't exist, MongoDB can create it.

---

## 2. `_id` is automatically generated

If you don't specify:

```javascript
_id;
```

MongoDB generates it.

---

## 3. `_id` must be unique

Duplicate `_id` values are rejected within the same collection.

---

## 4. `insertOne()` accepts one document

```javascript
db.users.insertOne({
  name: "Sharvil",
});
```

---

## 5. `insertMany()` accepts an array

```javascript
db.users.insertMany([{ name: "Sharvil" }, { name: "Rahul" }]);
```

---

## 6. Documents can contain complex data

Documents can contain:

- Strings
- Numbers
- Booleans
- Arrays
- Objects
- Dates
- ObjectIds
- Nested documents

---

# 25. Common Mistakes

### Mistake 1: Passing an array to `insertOne()`

Incorrect:

```javascript
db.users.insertOne([{ name: "Sharvil" }, { name: "Rahul" }]);
```

Use:

```javascript
db.users.insertMany([{ name: "Sharvil" }, { name: "Rahul" }]);
```

---

### Mistake 2: Forgetting that `_id` must be unique

Incorrect:

```javascript
db.users.insertMany([
  {
    _id: 1,
    name: "Sharvil",
  },

  {
    _id: 1,
    name: "Rahul",
  },
]);
```

Both documents have the same `_id`.

---

### Mistake 3: Treating flexible schema as completely unstructured data

Although MongoDB allows:

```javascript
{
  name: "Sharvil";
}
```

and:

```javascript
{
  username: "Rahul",
  randomField: true
}
```

in the same collection, production applications should still maintain a consistent and meaningful data model.

---

# 26. `insertOne()` vs `insertMany()` Example

### One document

```javascript
db.users.insertOne({
  name: "Sharvil",
  age: 22,
});
```

### Multiple documents

```javascript
db.users.insertMany([
  {
    name: "Sharvil",
    age: 22,
  },

  {
    name: "Rahul",
    age: 25,
  },

  {
    name: "Priya",
    age: 23,
  },
]);
```

---

# 27. SQL Equivalent

In SQL, you might write:

```sql
INSERT INTO users (name, age)
VALUES ('Sharvil', 22);
```

MongoDB:

```javascript
db.users.insertOne({
  name: "Sharvil",
  age: 22,
});
```

For multiple records:

### SQL

```sql
INSERT INTO users (name, age)
VALUES
  ('Sharvil', 22),
  ('Rahul', 25),
  ('Priya', 23);
```

### MongoDB

```javascript
db.users.insertMany([
  {
    name: "Sharvil",
    age: 22,
  },

  {
    name: "Rahul",
    age: 25,
  },

  {
    name: "Priya",
    age: 23,
  },
]);
```

---

# 28. Create Operation Summary

```text
CREATE
  │
  ├── insertOne()
  │     │
  │     └── Inserts one document
  │
  └── insertMany()
        │
        └── Inserts multiple documents
```

### `insertOne()`

```javascript
db.users.insertOne({
  name: "Sharvil",
  age: 22,
});
```

### `insertMany()`

```javascript
db.users.insertMany([
  {
    name: "Sharvil",
    age: 22,
  },
  {
    name: "Rahul",
    age: 25,
  },
]);
```

---

# 🎯 Interview Questions

## 1. How do you insert a document in MongoDB?

Use `insertOne()`:

```javascript
db.users.insertOne({
  name: "Sharvil",
  age: 22,
});
```

---

## 2. How do you insert multiple documents?

Use `insertMany()`:

```javascript
db.users.insertMany([{ name: "Sharvil" }, { name: "Rahul" }]);
```

---

## 3. What happens if `_id` isn't provided?

MongoDB automatically generates a unique `_id`, commonly using the `ObjectId` type.

---

## 4. Can you manually provide `_id`?

Yes.

```javascript
db.users.insertOne({
  _id: "user-001",
  name: "Sharvil",
});
```

The value must be unique within the collection.

---

## 5. What happens if duplicate `_id` is inserted?

MongoDB rejects the operation with a duplicate key error because `_id` must be unique within a collection.

---

## 6. What is the difference between `insertOne()` and `insertMany()`?

`insertOne()` inserts a single document, while `insertMany()` inserts multiple documents provided as an array.

---

## 7. What does `acknowledged: true` mean?

It means MongoDB acknowledged the write operation.

---

## 8. What does `ordered: false` do?

It allows MongoDB to attempt the remaining inserts even if one document in an `insertMany()` operation encounters an error.

---

# 🧠 Quick Revision

Remember these points:

```text
Create Operation
       │
       ├── insertOne()
       │      └── One document
       │
       └── insertMany()
              └── Multiple documents
```

### Example

```javascript
// One document
db.users.insertOne({
  name: "Sharvil",
  age: 22,
});

// Multiple documents
db.users.insertMany([
  {
    name: "Sharvil",
    age: 22,
  },
  {
    name: "Rahul",
    age: 25,
  },
]);
```

### Important concepts

```text
insertOne()
insertMany()
_id
ObjectId
insertedId
insertedIds
acknowledged
ordered
nested documents
arrays
flexible schema
```

---

# 🚀 What's Next?

After learning the Create operation, the next CRUD operation is **Read**.

Recommended learning order:

```text
MongoDB CRUD
│
├── ✅ Create
│     ├── insertOne()
│     └── insertMany()
│
├── ⬜ Read
│     ├── find()
│     ├── findOne()
│     ├── Query Filters
│     ├── Comparison Operators
│     ├── Logical Operators
│     ├── Projection
│     ├── Sorting
│     └── Limit / Skip
│
├── ⬜ Update
│
└── ⬜ Delete
```

The **Read operation** is especially important because it introduces MongoDB's query syntax and operators, which you'll use extensively when building APIs with Node.js and Express.
