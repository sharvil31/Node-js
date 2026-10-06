# MongoDB Read Operation

## 📌 Overview

The **Read operation** is one of the four fundamental CRUD operations in MongoDB:

- **C** → Create
- **R** → Read
- **U** → Update
- **D** → Delete

The Read operation is used to **retrieve documents from a MongoDB collection** based on specific conditions.

MongoDB provides several methods for reading data, with the most commonly used being:

```javascript
find();
findOne();
```

We can also use:

- Query operators
- Logical operators
- Projection
- Sorting
- Limiting
- Skipping
- Pagination
- Counting
- Nested document queries
- Array queries
- ObjectId queries
- Date queries

---

# 📚 Table of Contents

1. [What is the Read Operation?](#-what-is-the-read-operation)
2. [MongoDB Collection](#-mongodb-collection)
3. [`find()`](#-find)
4. [`findOne()`](#-findone)
5. [`find()` vs `findOne()`](#-find-vs-findone)
6. [Query Filter](#-query-filter)
7. [Equality Queries](#-equality-queries)
8. [Comparison Operators](#-comparison-operators)
9. [Logical Operators](#-logical-operators)
10. [Querying Nested Documents](#-querying-nested-documents)
11. [Querying Arrays](#-querying-arrays)
12. [Querying Arrays of Objects](#-querying-arrays-of-objects)
13. [Projection](#-projection)
14. [Sorting](#-sorting)
15. [Limit](#-limit)
16. [Skip](#-skip)
17. [Pagination](#-pagination)
18. [Counting Documents](#-counting-documents)
19. [Querying by `_id`](#-querying-by-id)
20. [Querying Dates](#-querying-dates)
21. [MongoDB Cursor](#-mongodb-cursor)
22. [Node.js MongoDB Driver](#-nodejs-mongodb-driver)
23. [SQL vs MongoDB](#-sql-vs-mongodb)
24. [Common Mistakes](#-common-mistakes)
25. [Interview Questions](#-interview-questions)
26. [Quick Revision](#-quick-revision)

---

# 🔹 What is the Read Operation?

The Read operation retrieves documents from a MongoDB collection.

For example, suppose we have a `users` collection:

```javascript
{
  _id: ObjectId("..."),
  name: "Sharvil",
  age: 22,
  city: "Mumbai",
  role: "developer"
}
```

We can retrieve this document using:

```javascript
db.users.find();
```

MongoDB searches the collection and returns documents that match the query.

---

# 🔹 MongoDB Collection

Before reading documents, we need a collection containing data.

Example:

```javascript
db.users.insertMany([
  {
    name: "Sharvil",
    age: 22,
    city: "Mumbai",
    role: "developer",
  },
  {
    name: "Rahul",
    age: 25,
    city: "Pune",
    role: "designer",
  },
  {
    name: "Amit",
    age: 30,
    city: "Mumbai",
    role: "manager",
  },
]);
```

Now the `users` collection contains three documents.

---

# 🔹 `find()`

The `find()` method is used to retrieve **multiple documents**.

## Syntax

```javascript
db.collection.find();
```

Example:

```javascript
db.users.find();
```

This retrieves all documents from the `users` collection.

---

## Find documents with a condition

```javascript
db.users.find({
  city: "Mumbai",
});
```

This returns users whose `city` is `"Mumbai"`.

Example result:

```javascript
[
  {
    name: "Sharvil",
    age: 22,
    city: "Mumbai",
  },
  {
    name: "Amit",
    age: 30,
    city: "Mumbai",
  },
];
```

---

# 🔹 `findOne()`

`findOne()` is used when we want to retrieve **a single document**.

## Syntax

```javascript
db.collection.findOne();
```

Example:

```javascript
db.users.findOne();
```

MongoDB returns one matching document.

---

## Find one document using a condition

```javascript
db.users.findOne({
  city: "Mumbai",
});
```

If multiple documents match the condition, `findOne()` returns only one matching document.

If no document matches, it returns:

```javascript
null;
```

---

# 🔹 `find()` vs `findOne()`

| Feature          | `find()`                       | `findOne()`   |
| ---------------- | ------------------------------ | ------------- |
| Returns          | Multiple documents             | One document  |
| Result           | Cursor                         | Document      |
| Multiple matches | Returns all matching documents | Returns one   |
| No match         | Empty cursor/result            | `null`        |
| Common use       | Lists                          | Single record |

Example:

```javascript
db.users.find({
  city: "Mumbai",
});
```

versus:

```javascript
db.users.findOne({
  city: "Mumbai",
});
```

---

# 🔹 Query Filter

A **query filter** tells MongoDB which documents we want.

Example:

```javascript
db.users.find({
  age: 22,
});
```

MongoDB searches for documents where:

```text
age === 22
```

Multiple conditions can be specified.

```javascript
db.users.find({
  age: 22,
  city: "Mumbai",
});
```

This means:

```text
age = 22 AND city = Mumbai
```

MongoDB applies an implicit **AND** when multiple fields are specified in the same query object.

---

# 🔹 Equality Queries

The simplest query is an equality query.

```javascript
db.users.find({
  role: "developer",
});
```

This finds users whose role is exactly `"developer"`.

MongoDB also provides `$eq` explicitly:

```javascript
db.users.find({
  age: {
    $eq: 22,
  },
});
```

The following are equivalent:

```javascript
db.users.find({
  age: 22,
});
```

```javascript
db.users.find({
  age: {
    $eq: 22,
  },
});
```

---

# 🔹 Comparison Operators

MongoDB provides comparison operators for querying values.

| Operator | Meaning                           |
| -------- | --------------------------------- |
| `$eq`    | Equal                             |
| `$ne`    | Not equal                         |
| `$gt`    | Greater than                      |
| `$gte`   | Greater than or equal             |
| `$lt`    | Less than                         |
| `$lte`   | Less than or equal                |
| `$in`    | Matches any value in an array     |
| `$nin`   | Does not match values in an array |

---

## `$eq`

Equal to.

```javascript
db.users.find({
  age: {
    $eq: 22,
  },
});
```

---

## `$ne`

Not equal to.

```javascript
db.users.find({
  age: {
    $ne: 22,
  },
});
```

Returns users whose age is not `22`.

---

## `$gt`

Greater than.

```javascript
db.users.find({
  age: {
    $gt: 25,
  },
});
```

Returns users whose age is greater than `25`.

---

## `$gte`

Greater than or equal to.

```javascript
db.users.find({
  age: {
    $gte: 25,
  },
});
```

Matches:

```text
25
26
27
...
```

---

## `$lt`

Less than.

```javascript
db.users.find({
  age: {
    $lt: 25,
  },
});
```

---

## `$lte`

Less than or equal to.

```javascript
db.users.find({
  age: {
    $lte: 25,
  },
});
```

---

## Combining comparison operators

We can specify a range.

```javascript
db.users.find({
  age: {
    $gte: 20,
    $lte: 30,
  },
});
```

This finds users whose age is between `20` and `30`, inclusive.

---

# 🔹 `$in`

`$in` matches documents where a field contains **any one of the specified values**.

Example:

```javascript
db.users.find({
  city: {
    $in: ["Mumbai", "Pune", "Nashik"],
  },
});
```

This means:

```text
city = Mumbai
OR
city = Pune
OR
city = Nashik
```

---

# 🔹 `$nin`

`$nin` matches values that are **not present in the specified list**.

```javascript
db.users.find({
  city: {
    $nin: ["Mumbai", "Pune"],
  },
});
```

---

# 🔹 Logical Operators

MongoDB provides logical operators for combining conditions.

Important logical operators:

```text
$and
$or
$nor
$not
```

---

# 🔹 `$and`

`$and` requires all conditions to be true.

```javascript
db.users.find({
  $and: [
    {
      age: {
        $gte: 20,
      },
    },
    {
      city: "Mumbai",
    },
  ],
});
```

This means:

```text
age >= 20 AND city = Mumbai
```

### Implicit AND

Usually we don't need to explicitly use `$and`.

Instead:

```javascript
db.users.find({
  age: {
    $gte: 20,
  },
  city: "Mumbai",
});
```

is enough.

---

# 🔹 `$or`

`$or` matches documents where **at least one condition is true**.

```javascript
db.users.find({
  $or: [
    {
      city: "Mumbai",
    },
    {
      city: "Pune",
    },
  ],
});
```

Meaning:

```text
city = Mumbai OR city = Pune
```

---

# 🔹 `$nor`

`$nor` matches documents where **none of the specified conditions are true**.

```javascript
db.users.find({
  $nor: [
    {
      city: "Mumbai",
    },
    {
      city: "Pune",
    },
  ],
});
```

This excludes users from Mumbai and Pune.

---

# 🔹 `$not`

`$not` negates a condition.

Example:

```javascript
db.users.find({
  age: {
    $not: {
      $gt: 25,
    },
  },
});
```

This matches documents where the age is not greater than `25`.

---

# 🔹 Querying Nested Documents

MongoDB documents can contain nested objects.

Example:

```javascript
{
  name: "Sharvil",
  address: {
    city: "Mumbai",
    state: "Maharashtra",
    pincode: 421301
  }
}
```

We can query nested fields using **dot notation**.

```javascript
db.users.find({
  "address.city": "Mumbai",
});
```

---

## Nested field with comparison operator

```javascript
db.users.find({
  "address.pincode": {
    $gte: 400000,
  },
});
```

---

# 🔹 Querying Arrays

MongoDB supports arrays as field values.

Example:

```javascript
{
  name: "Sharvil",
  skills: [
    "JavaScript",
    "React",
    "Node.js"
  ]
}
```

We can search for a specific array element:

```javascript
db.users.find({
  skills: "React",
});
```

MongoDB matches documents where the array contains `"React"`.

---

# 🔹 `$all`

`$all` matches arrays that contain **all specified values**.

Example:

```javascript
db.users.find({
  skills: {
    $all: ["React", "Node.js"],
  },
});
```

The document must contain both:

```text
React
Node.js
```

---

# 🔹 Querying Arrays of Objects

Consider:

```javascript
{
  name: "Sharvil",
  projects: [
    {
      name: "Movie App",
      technology: "React"
    },
    {
      name: "File Storage",
      technology: "Node.js"
    }
  ]
}
```

We can query:

```javascript
db.users.find({
  "projects.technology": "React",
});
```

This finds users who have at least one project using React.

---

# 🔹 Projection

Sometimes we don't want the entire document.

For example, instead of:

```javascript
{
  _id: "...",
  name: "Sharvil",
  age: 22,
  city: "Mumbai",
  role: "developer"
}
```

we may only want:

```javascript
{
  name: "Sharvil",
  role: "developer"
}
```

This is called **projection**.

## Syntax

```javascript
db.collection.find(
  <filter>,
  <projection>
)
```

Example:

```javascript
db.users.find(
  {},
  {
    name: 1,
    role: 1,
  },
);
```

`1` means include the field.

---

## Excluding fields

```javascript
db.users.find(
  {},
  {
    age: 0,
    city: 0,
  },
);
```

`0` means exclude the field.

---

# 🔹 `_id` and Projection

MongoDB includes `_id` by default.

For example:

```javascript
db.users.find(
  {},
  {
    name: 1,
  },
);
```

The result can still contain:

```javascript
{
  "_id": ObjectId("..."),
  "name": "Sharvil"
}
```

To exclude `_id`:

```javascript
db.users.find(
  {},
  {
    _id: 0,
    name: 1,
  },
);
```

Result:

```javascript
{
  "name": "Sharvil"
}
```

### Important Rule

You generally cannot mix inclusion and exclusion projection for normal fields.

Valid:

```javascript
{
  name: 1,
  age: 1
}
```

Valid:

```javascript
{
  name: 0,
  age: 0
}
```

Also valid:

```javascript
{
  name: 1,
  _id: 0
}
```

---

# 🔹 Sorting

MongoDB allows us to sort query results.

Syntax:

```javascript
.sort({
  field: 1
})
```

Where:

```text
1  → Ascending
-1 → Descending
```

---

## Ascending

```javascript
db.users.find().sort({
  age: 1,
});
```

Result:

```text
20
22
25
30
35
```

---

## Descending

```javascript
db.users.find().sort({
  age: -1,
});
```

Result:

```text
35
30
25
22
20
```

---

## Sort by multiple fields

```javascript
db.users.find().sort({
  city: 1,
  age: -1,
});
```

MongoDB first sorts by `city`, then uses `age` to order documents within the same city.

---

# 🔹 Limit

`limit()` restricts the number of documents returned.

```javascript
db.users.find().limit(5);
```

Only five documents are returned.

---

## Example

```javascript
db.users
  .find()
  .sort({
    age: -1,
  })
  .limit(3);
```

This retrieves the three oldest users.

---

# 🔹 Skip

`skip()` skips a specified number of documents.

```javascript
db.users.find().skip(5);
```

MongoDB skips the first five matching documents.

---

# 🔹 Pagination

Pagination is commonly used in APIs.

Suppose:

```text
Page size = 10
```

### Page 1

```javascript
db.users.find().skip(0).limit(10);
```

### Page 2

```javascript
db.users.find().skip(10).limit(10);
```

### Page 3

```javascript
db.users.find().skip(20).limit(10);
```

General formula:

```javascript
skip = (page - 1) * limit;
```

Example:

```javascript
const page = 3;
const limit = 10;

const skip = (page - 1) * limit;
```

Therefore:

```text
skip = (3 - 1) × 10
skip = 20
```

---

# 🔹 Counting Documents

MongoDB provides:

```javascript
countDocuments();
```

Example:

```javascript
db.users.countDocuments();
```

Returns the total number of documents.

---

## Count with a condition

```javascript
db.users.countDocuments({
  city: "Mumbai",
});
```

This counts users from Mumbai.

---

# 🔹 Querying by `_id`

Every MongoDB document normally has a unique `_id`.

Example:

```javascript
{
  _id: ObjectId("68c123456789abcdef123456"),
  name: "Sharvil"
}
```

To search using `_id`:

```javascript
db.users.findOne({
  _id: ObjectId("68c123456789abcdef123456"),
});
```

---

## ObjectId

`ObjectId` is a BSON type commonly used for MongoDB document IDs.

Example:

```javascript
ObjectId("68c123456789abcdef123456");
```

Do not treat an ObjectId as the same thing as a normal string.

This:

```javascript
{
  _id: "68c123456789abcdef123456";
}
```

is different from:

```javascript
{
  _id: ObjectId("68c123456789abcdef123456");
}
```

---

# 🔹 Querying Dates

MongoDB supports BSON Date values.

Example document:

```javascript
{
  name: "Sharvil",
  createdAt: ISODate("2026-10-01T10:00:00Z")
}
```

We can query dates using comparison operators.

```javascript
db.users.find({
  createdAt: {
    $gte: ISODate("2026-10-01T00:00:00Z"),
  },
});
```

---

## Date range

```javascript
db.users.find({
  createdAt: {
    $gte: ISODate("2026-10-01T00:00:00Z"),
    $lt: ISODate("2026-11-01T00:00:00Z"),
  },
});
```

This retrieves documents created during October 2026.

---

# 🔹 MongoDB Cursor

When using:

```javascript
db.users.find();
```

MongoDB returns a **cursor** representing the query result.

A cursor allows MongoDB to retrieve matching documents efficiently instead of necessarily loading every result into memory at once.

You can perform operations such as:

```javascript
find();
sort();
limit();
skip();
```

Example:

```javascript
db.users
  .find({
    age: {
      $gte: 20,
    },
  })
  .sort({
    age: -1,
  })
  .limit(10);
```

---

# 🔹 Node.js MongoDB Driver

MongoDB can be used from Node.js using the official MongoDB driver.

Install it:

```bash
npm install mongodb
```

---

## Connect to MongoDB

```javascript
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();

const db = client.db("company");

const users = db.collection("users");
```

---

# 🔹 Read All Documents in Node.js

```javascript
const result = await users.find({}).toArray();

console.log(result);
```

`find()` returns a cursor, so `.toArray()` is commonly used when we want the matching documents as a JavaScript array.

---

# 🔹 Read One Document in Node.js

```javascript
const user = await users.findOne({
  name: "Sharvil",
});

console.log(user);
```

---

# 🔹 Read with Conditions

```javascript
const usersData = await users
  .find({
    age: {
      $gte: 20,
    },
  })
  .toArray();

console.log(usersData);
```

---

# 🔹 Projection in Node.js

```javascript
const usersData = await users
  .find(
    {},
    {
      projection: {
        name: 1,
        role: 1,
        _id: 0,
      },
    },
  )
  .toArray();
```

---

# 🔹 Sorting and Limiting in Node.js

```javascript
const usersData = await users
  .find({})
  .sort({
    age: -1,
  })
  .limit(5)
  .toArray();
```

This retrieves the five oldest users.

---

# 🔹 Pagination in Node.js

```javascript
const page = 2;
const limit = 10;

const skip = (page - 1) * limit;

const usersData = await users.find({}).skip(skip).limit(limit).toArray();
```

---

# 🔹 Complete Node.js Example

```javascript
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

try {
  await client.connect();

  const db = client.db("company");
  const users = db.collection("users");

  const result = await users
    .find({
      age: {
        $gte: 20,
      },
    })
    .sort({
      age: -1,
    })
    .limit(10)
    .toArray();

  console.log(result);
} catch (error) {
  console.error(error);
} finally {
  await client.close();
}
```

---

# 🔹 SQL vs MongoDB

| SQL                  | MongoDB            |
| -------------------- | ------------------ |
| Database             | Database           |
| Table                | Collection         |
| Row                  | Document           |
| Column               | Field              |
| `SELECT *`           | `find()`           |
| `SELECT ... LIMIT 1` | `findOne()`        |
| `WHERE`              | Query filter       |
| `ORDER BY`           | `sort()`           |
| `LIMIT`              | `limit()`          |
| `OFFSET`             | `skip()`           |
| `COUNT(*)`           | `countDocuments()` |

### SQL

```sql
SELECT *
FROM users
WHERE age >= 20
ORDER BY age DESC
LIMIT 5;
```

### MongoDB

```javascript
db.users
  .find({
    age: {
      $gte: 20,
    },
  })
  .sort({
    age: -1,
  })
  .limit(5);
```

---

# 🔹 Complete Read Operation Flow

```text
Application
     ↓
MongoDB Driver
     ↓
Collection
     ↓
Query Filter
     ↓
MongoDB
     ↓
Matching Documents
     ↓
Projection
     ↓
Sorting
     ↓
Limit / Skip
     ↓
Application
```

---

# 🔹 Common Read Queries Cheat Sheet

### Get all documents

```javascript
db.users.find();
```

### Get one document

```javascript
db.users.findOne();
```

### Find by field

```javascript
db.users.find({
  city: "Mumbai",
});
```

### Greater than

```javascript
db.users.find({
  age: {
    $gt: 25,
  },
});
```

### Greater than or equal

```javascript
db.users.find({
  age: {
    $gte: 25,
  },
});
```

### Less than

```javascript
db.users.find({
  age: {
    $lt: 25,
  },
});
```

### Range

```javascript
db.users.find({
  age: {
    $gte: 20,
    $lte: 30,
  },
});
```

### Multiple values

```javascript
db.users.find({
  city: {
    $in: ["Mumbai", "Pune"],
  },
});
```

### OR

```javascript
db.users.find({
  $or: [
    {
      city: "Mumbai",
    },
    {
      city: "Pune",
    },
  ],
});
```

### Nested field

```javascript
db.users.find({
  "address.city": "Mumbai",
});
```

### Array

```javascript
db.users.find({
  skills: "React",
});
```

### Array containing all values

```javascript
db.users.find({
  skills: {
    $all: ["React", "Node.js"],
  },
});
```

### Projection

```javascript
db.users.find(
  {},
  {
    name: 1,
    role: 1,
    _id: 0,
  },
);
```

### Sort ascending

```javascript
db.users.find().sort({
  age: 1,
});
```

### Sort descending

```javascript
db.users.find().sort({
  age: -1,
});
```

### Limit

```javascript
db.users.find().limit(10);
```

### Skip

```javascript
db.users.find().skip(10);
```

### Count

```javascript
db.users.countDocuments();
```

---

# ⚠️ Common Mistakes

## 1. Forgetting that `find()` returns multiple results

```javascript
db.users.findOne({
  city: "Mumbai",
});
```

Use `findOne()` when you only need one document.

---

## 2. Treating `ObjectId` as a string

Incorrect when `_id` is stored as an ObjectId:

```javascript
db.users.findOne({
  _id: "68c123456789abcdef123456",
});
```

Correct:

```javascript
db.users.findOne({
  _id: ObjectId("68c123456789abcdef123456"),
});
```

---

## 3. Forgetting projection syntax

Correct:

```javascript
db.users.find(
  {},
  {
    name: 1,
    _id: 0,
  },
);
```

---

## 4. Confusing `$gt` and `$gte`

```text
$gt  → greater than
$gte → greater than or equal
```

For example:

```javascript
{
  age: {
    $gt: 20;
  }
}
```

does not include `20`.

Whereas:

```javascript
{
  age: {
    $gte: 20;
  }
}
```

includes `20`.

---

## 5. Forgetting `.toArray()` in Node.js

In the MongoDB Node.js driver:

```javascript
const cursor = users.find({});
```

This is a cursor.

To get an array:

```javascript
const usersData = await users.find({}).toArray();
```

---

# 🎯 Interview Questions

## 1. What is the Read operation in MongoDB?

The Read operation retrieves documents from a MongoDB collection based on specified query conditions.

---

## 2. What is the difference between `find()` and `findOne()`?

`find()` is used to retrieve multiple matching documents and returns a cursor, while `findOne()` returns a single matching document or `null`.

---

## 3. What is a MongoDB query filter?

A query filter specifies the conditions that documents must satisfy to be returned.

Example:

```javascript
{
  age: {
    $gte: 18;
  }
}
```

---

## 4. What is projection?

Projection controls which fields are returned from the matching documents.

Example:

```javascript
{
  name: 1,
  age: 1,
  _id: 0
}
```

---

## 5. What does `$gt` mean?

`$gt` means **greater than**.

```javascript
{
  age: {
    $gt: 18;
  }
}
```

---

## 6. What does `$gte` mean?

`$gte` means **greater than or equal to**.

---

## 7. What is `$in`?

`$in` matches documents where a field contains any one of the specified values.

```javascript
{
  city: {
    $in: ["Mumbai", "Pune"];
  }
}
```

---

## 8. What is `$or`?

`$or` returns documents where at least one of the specified conditions is true.

---

## 9. How do you query a nested field?

Using dot notation.

```javascript
db.users.find({
  "address.city": "Mumbai",
});
```

---

## 10. How do you sort MongoDB results?

Using `.sort()`.

Ascending:

```javascript
.sort({
  age: 1
})
```

Descending:

```javascript
.sort({
  age: -1
})
```

---

## 11. How do you limit MongoDB results?

Using:

```javascript
.limit(10)
```

---

## 12. How do you implement pagination?

Using `skip()` and `limit()`.

```javascript
const skip = (page - 1) * limit;

db.users.find().skip(skip).limit(limit);
```

---

## 13. What is a cursor?

A cursor represents the result set of a MongoDB query and allows the application to iterate through matching documents.

---

## 14. How do you count documents?

```javascript
db.users.countDocuments();
```

Or with a condition:

```javascript
db.users.countDocuments({
  city: "Mumbai",
});
```

---

## 15. What is dot notation in MongoDB?

Dot notation is used to access nested fields.

Example:

```javascript
{
  address: {
    city: "Mumbai";
  }
}
```

Query:

```javascript
{
  "address.city": "Mumbai"
}
```

---

# 🧠 Quick Revision

```text
READ OPERATION
│
├── find()
│   └── Multiple documents
│
├── findOne()
│   └── Single document
│
├── Query Filters
│   ├── Equality
│   ├── Comparison
│   └── Logical
│
├── Comparison Operators
│   ├── $eq
│   ├── $ne
│   ├── $gt
│   ├── $gte
│   ├── $lt
│   ├── $lte
│   ├── $in
│   └── $nin
│
├── Logical Operators
│   ├── $and
│   ├── $or
│   ├── $nor
│   └── $not
│
├── Nested Documents
│   └── Dot notation
│
├── Arrays
│   └── $all
│
├── Projection
│   ├── Include → 1
│   └── Exclude → 0
│
├── Sorting
│   ├── 1 → ASC
│   └── -1 → DESC
│
├── Pagination
│   ├── skip()
│   └── limit()
│
└── Counting
    └── countDocuments()
```

---

# 🚀 CRUD Progress

| Operation | MongoDB Method                                  | Status |
| --------- | ----------------------------------------------- | ------ |
| Create    | `insertOne()` / `insertMany()`                  | ✅     |
| Read      | `find()` / `findOne()`                          | ✅     |
| Update    | `updateOne()` / `updateMany()` / `replaceOne()` | ⏳     |
| Delete    | `deleteOne()` / `deleteMany()`                  | ⏳     |

---

# 📌 Important Methods to Remember

```javascript
// Read
find();
findOne();

// Filtering
$eq;
$ne;
$gt;
$gte;
$lt;
$lte;
$in;
$nin;

// Logical
$and;
$or;
$nor;
$not;

// Query modifiers
sort();
limit();
skip();

// Counting
countDocuments();

// Node.js driver
toArray();
```

---

# 🎯 Key Takeaways

1. `find()` is used to retrieve multiple documents.
2. `findOne()` retrieves a single document.
3. Query filters determine which documents MongoDB returns.
4. Comparison operators allow range-based queries.
5. Logical operators combine multiple conditions.
6. Dot notation is used to query nested fields.
7. MongoDB can query values inside arrays.
8. Projection controls which fields are returned.
9. `sort()` controls result ordering.
10. `limit()` restricts the number of results.
11. `skip()` is commonly used for pagination.
12. `countDocuments()` counts matching documents.
13. `find()` returns a cursor in the MongoDB Node.js driver.
14. `.toArray()` converts the cursor results into an array.
15. `_id` is commonly an `ObjectId`, so its BSON type matters when querying.

---

## 📖 Next Topic

The next CRUD operation is **Update in MongoDB**, including:

```text
updateOne()
updateMany()
replaceOne()

$set
$unset
$inc
$mul
$rename
$min
$max

$push
$pop
$pull
$pullAll
$addToSet

upsert
```

These operators are important for both **MongoDB development and backend/Node.js interviews**.
