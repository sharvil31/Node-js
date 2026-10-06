# MongoDB: Databases, Collections, and Documents

This section covers the fundamental structure of MongoDB and explains how **databases, collections, documents, fields, BSON, and ObjectId** work together.

---

## 📚 Topics Covered

- What is MongoDB?
- MongoDB database
- MongoDB collections
- MongoDB documents
- Fields
- BSON
- ObjectId
- `_id` field
- Nested documents
- Arrays
- Flexible schema
- Embedded documents
- References
- MongoDB vs SQL
- Basic MongoDB operations
- E-commerce database example

---

# 1. What is MongoDB?

**MongoDB** is a **NoSQL, document-oriented database**.

Unlike relational databases such as MySQL or PostgreSQL, which store data in tables and rows, MongoDB stores data as **documents** organized into **collections**.

MongoDB follows this structure:

```text
MongoDB Server
│
├── Database
│   │
│   ├── Collection
│   │   ├── Document
│   │   ├── Document
│   │   └── Document
│   │
│   └── Collection
│       ├── Document
│       └── Document
│
└── Database
```

The basic hierarchy is:

```text
Database
    ↓
Collection
    ↓
Document
    ↓
Field
```

---

# 2. MongoDB vs SQL

MongoDB concepts can be compared with relational database concepts:

| SQL            | MongoDB                |
| -------------- | ---------------------- |
| Database       | Database               |
| Table          | Collection             |
| Row            | Document               |
| Column         | Field                  |
| Primary Key    | `_id`                  |
| JOIN           | References / `$lookup` |
| JSON-like data | BSON                   |

For example, a SQL table might look like:

```text
users
--------------------------------
id | name   | email
--------------------------------
1  | John   | john@gmail.com
2  | Alex   | alex@gmail.com
```

The equivalent MongoDB collection could contain:

```javascript
{
  _id: 1,
  name: "John",
  email: "john@gmail.com"
}
```

```javascript
{
  _id: 2,
  name: "Alex",
  email: "alex@gmail.com"
}
```

---

# 3. Database

A **database** is a container for collections.

For example, an e-commerce application might have a database called:

```text
ecommerce
```

Inside the database:

```text
ecommerce
│
├── users
├── products
├── orders
├── categories
└── reviews
```

Each item such as `users` or `products` is a collection.

---

# 4. Creating / Selecting a Database

Using MongoDB Shell (`mongosh`):

```javascript
use ecommerce
```

This switches to the `ecommerce` database.

The database is generally persisted once data is stored in it.

For example:

```javascript
db.users.insertOne({
  name: "Sharvil",
  age: 22,
});
```

This creates the `users` collection if it doesn't already exist and inserts a document.

---

# 5. Collection

A **collection** is a group of related MongoDB documents.

It is roughly equivalent to a **table in SQL**.

For example:

```text
users
│
├── Document 1
├── Document 2
├── Document 3
└── Document 4
```

A database can contain multiple collections:

```text
ecommerce
│
├── users
├── products
├── orders
└── reviews
```

---

# 6. Creating a Collection

A collection can be explicitly created using:

```javascript
db.createCollection("users");
```

However, MongoDB can also create a collection automatically when the first document is inserted.

For example:

```javascript
db.users.insertOne({
  name: "Sharvil",
  age: 22,
});
```

If `users` doesn't exist, MongoDB creates it automatically.

---

# 7. Document

A **document is the fundamental unit of data in MongoDB**.

A document contains fields and values.

Example:

```javascript
{
  name: "Sharvil",
  age: 22,
  role: "Frontend Developer",
  skills: ["React", "Next.js", "Node.js"]
}
```

This is one document inside a collection.

For example:

```text
users
│
├── {
│     name: "Sharvil",
│     age: 22
│   }
│
├── {
│     name: "Rahul",
│     age: 25
│   }
│
└── {
      name: "Priya",
      age: 23
    }
```

---

# 8. Fields

A document consists of **fields**.

Example:

```javascript
{
  name: "Sharvil",
  age: 22,
  role: "Frontend Developer"
}
```

The fields are:

```text
name
age
role
```

Each field contains a value.

```text
name → "Sharvil"
age  → 22
role → "Frontend Developer"
```

Fields are roughly equivalent to columns in a relational database.

---

# 9. BSON

MongoDB stores documents using **BSON**.

BSON stands for:

> Binary JSON

MongoDB documents look similar to JSON:

```javascript
{
  name: "Sharvil",
  age: 22
}
```

But internally MongoDB uses BSON.

BSON provides additional data types that normal JSON doesn't natively provide.

Examples include:

- String
- Integer
- Double
- Boolean
- Array
- Object
- Date
- ObjectId
- Decimal128
- Binary data
- Null
- Regular expressions

---

# 10. `_id` Field

Every MongoDB document normally contains an `_id` field.

Example:

```javascript
{
  _id: ObjectId("68e3b6c7a1f4d8e912345678"),
  name: "Sharvil",
  age: 22
}
```

The `_id` uniquely identifies the document within its collection.

If `_id` isn't provided when inserting a document, MongoDB automatically generates one.

---

# 11. ObjectId

MongoDB commonly uses `ObjectId` as the value of `_id`.

Example:

```javascript
ObjectId("68e3b6c7a1f4d8e912345678");
```

An ObjectId is a BSON data type designed to provide unique identifiers efficiently.

Example document:

```javascript
{
  _id: ObjectId("68e3b6c7a1f4d8e912345678"),
  name: "Sharvil"
}
```

The `_id` must be unique within the collection.

---

# 12. Flexible Schema

MongoDB provides a **flexible schema**.

Documents in the same collection don't necessarily need to contain exactly the same fields.

For example:

```javascript
{
  name: "John",
  email: "john@gmail.com"
}
```

Another document can contain additional fields:

```javascript
{
  name: "Alex",
  email: "alex@gmail.com",
  age: 25
}
```

Another document could contain an array:

```javascript
{
  name: "Priya",
  skills: ["React", "Node.js"]
}
```

All three can exist in the same collection.

### Important

Flexible schema does **not** mean that applications should store random or inconsistent data.

Production applications commonly enforce data structures using:

- MongoDB schema validation
- Mongoose
- Application-level validation

---

# 13. Nested Documents

MongoDB allows documents to contain other documents.

Example:

```javascript
{
  name: "Sharvil",
  email: "sharvil@gmail.com",

  address: {
    city: "Kalyan",
    state: "Maharashtra",
    country: "India"
  }
}
```

Here `address` is an embedded document.

Structure:

```text
User
│
├── name
├── email
└── address
    ├── city
    ├── state
    └── country
```

---

# 14. Arrays

MongoDB documents can contain arrays.

Example:

```javascript
{
  name: "Sharvil",
  skills: [
    "React",
    "Next.js",
    "Node.js",
    "MongoDB"
  ]
}
```

MongoDB also supports arrays containing objects:

```javascript
{
  name: "Sharvil",

  projects: [
    {
      name: "Cineworld",
      technology: "React"
    },
    {
      name: "Luna AI",
      technology: "React"
    }
  ]
}
```

This makes MongoDB suitable for storing hierarchical and nested data.

---

# 15. Embedded Documents

An embedded document stores related data inside the parent document.

Example:

```javascript
{
  name: "Rahul",

  address: {
    city: "Mumbai",
    state: "Maharashtra"
  }
}
```

Embedding is useful when the related data:

- Belongs closely to the parent
- Is usually accessed with the parent
- Doesn't need to exist independently
- Is reasonably small

---

# 16. References

Instead of embedding data, MongoDB can also store references.

For example:

```javascript
{
  name: "Rahul",
  addressId: ObjectId("68e3b6c7...")
}
```

The actual address could be stored in another collection.

```text
users
│
└── addressId
        │
        ↓
addresses
```

References can be useful when data:

- Is shared by multiple documents
- Is large
- Changes independently
- Needs to be queried independently

---

# 17. Embedded Documents vs References

### Embedding

```javascript
{
  name: "Rahul",

  address: {
    city: "Mumbai",
    state: "Maharashtra"
  }
}
```

### Referencing

```javascript
{
  name: "Rahul",
  addressId: ObjectId("...")
}
```

A general rule:

> Store data together when it is commonly accessed together, and use references when the related data has an independent lifecycle or is shared.

---

# 18. Basic CRUD Operations

CRUD stands for:

```text
Create
Read
Update
Delete
```

## Create

Insert one document:

```javascript
db.users.insertOne({
  name: "Sharvil",
  age: 22,
});
```

Insert multiple documents:

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

## Read

Find all documents:

```javascript
db.users.find();
```

Find one document:

```javascript
db.users.findOne({
  name: "Sharvil",
});
```

Find documents matching a condition:

```javascript
db.users.find({
  age: 22,
});
```

---

## Update

Update one document:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $set: {
      age: 23,
    },
  },
);
```

---

## Delete

Delete one document:

```javascript
db.users.deleteOne({
  name: "Sharvil",
});
```

Delete multiple documents:

```javascript
db.users.deleteMany({
  age: 22,
});
```

---

# 19. E-Commerce Example

Consider an e-commerce application.

## Database

```text
ecommerce
```

## Collections

```text
users
products
orders
categories
reviews
```

### User document

```javascript
{
  _id: ObjectId("..."),
  name: "Rahul",
  email: "rahul@gmail.com",

  address: {
    city: "Mumbai",
    state: "Maharashtra"
  }
}
```

### Product document

```javascript
{
  _id: ObjectId("..."),
  name: "Wireless Headphones",
  price: 2999,
  category: "Electronics",
  stock: 50,

  specifications: {
    battery: "40 hours",
    bluetooth: "5.3"
  }
}
```

### Order document

```javascript
{
  _id: ObjectId("..."),

  userId: ObjectId("..."),

  items: [
    {
      productId: ObjectId("..."),
      quantity: 2,
      price: 2999
    }
  ],

  totalAmount: 5998,
  status: "confirmed",

  createdAt: ISODate("2026-10-06T00:00:00Z")
}
```

---

# 20. Complete MongoDB Hierarchy

The most important concept to remember:

```text
MongoDB Server
│
└── Database
    │
    ├── Collection
    │   │
    │   ├── Document
    │   │   ├── Field
    │   │   ├── Field
    │   │   └── Field
    │   │
    │   └── Document
    │
    └── Collection
```

In simple terms:

```text
Database
    ↓
Collection
    ↓
Document
    ↓
Field
```

---

# 21. MongoDB vs SQL Summary

| Concept            | SQL                     | MongoDB                |
| ------------------ | ----------------------- | ---------------------- |
| Main type          | Relational              | NoSQL                  |
| Data structure     | Tables                  | Collections            |
| Record             | Row                     | Document               |
| Attribute          | Column                  | Field                  |
| Identifier         | Primary Key             | `_id`                  |
| Data format        | Rows/columns            | BSON documents         |
| Schema             | Usually rigid           | Flexible               |
| Nested data        | Usually separate tables | Can be embedded        |
| Relationships      | Foreign keys / JOIN     | References / `$lookup` |
| Schema flexibility | Lower                   | Higher                 |

---

# 22. Important Interview Questions

### What is MongoDB?

MongoDB is a NoSQL, document-oriented database that stores data as BSON documents inside collections.

### What is a collection?

A collection is a group of MongoDB documents and is roughly equivalent to a table in SQL.

### What is a document?

A document is the fundamental unit of data in MongoDB. It consists of fields and values and can contain nested objects and arrays.

### What is BSON?

BSON stands for Binary JSON. It is the format MongoDB uses to store documents and supports additional data types such as ObjectId and Date.

### What is `_id`?

`_id` is the unique identifier of a document within a collection. MongoDB automatically generates an ObjectId when `_id` isn't supplied.

### Is MongoDB schema-less?

MongoDB is better described as having a **flexible schema**. Documents in the same collection can have different fields, although applications can enforce validation rules.

### Can MongoDB documents contain arrays?

Yes. MongoDB documents can contain arrays of primitive values as well as arrays of embedded documents.

### What is the difference between embedding and referencing?

Embedding stores related data inside the parent document, while referencing stores related data separately and keeps an identifier/reference to it.

---

# 23. Quick Revision

```text
MongoDB
│
├── Database
│     └── Contains collections
│
├── Collection
│     └── Contains documents
│
├── Document
│     └── Contains fields
│
├── Field
│     └── Contains a value
│
├── _id
│     └── Unique document identifier
│
└── BSON
      └── Storage/document representation
```

### SQL Comparison

```text
SQL                         MongoDB

Database             →      Database

Table                →      Collection

Row                  →      Document

Column               →      Field

Primary Key          →      _id

JOIN                 →      References / $lookup
```

---

# 🎯 Key Takeaways

1. MongoDB is a **NoSQL document-oriented database**.
2. A **database contains collections**.
3. A **collection contains documents**.
4. A **document contains fields**.
5. MongoDB stores documents as **BSON**.
6. Every document normally has a unique **`_id`**.
7. MongoDB commonly uses **ObjectId** for `_id`.
8. Documents can contain **nested objects and arrays**.
9. MongoDB provides a **flexible schema**.
10. Related data can be modeled using **embedding or references**.
11. MongoDB collections are roughly equivalent to SQL tables.
12. MongoDB documents are roughly equivalent to SQL rows.

---

## Next Topics

After understanding databases, collections, and documents, the next MongoDB concepts to learn are:

1. MongoDB installation and setup
2. MongoDB Shell (`mongosh`)
3. MongoDB CRUD operations
4. Query operators
5. Comparison operators
6. Logical operators
7. Array operators
8. Projection
9. Sorting
10. Pagination
11. Indexes
12. Aggregation pipeline
13. Relationships and `$lookup`
14. MongoDB Atlas
15. MongoDB with Node.js
16. Mongoose
17. Schema and model design
18. MongoDB transactions
