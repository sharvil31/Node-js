# MongoDB with Node.js — Detailed Guide

A practical, beginner-friendly guide to connecting a Node.js application to MongoDB and performing CRUD operations with the official MongoDB Node.js driver.

## Table of Contents

- [1. Introduction](#1-introduction)
- [2. How Node.js and MongoDB Work Together](#2-how-nodejs-and-mongodb-work-together)
- [3. MongoDB Driver vs. Mongoose](#3-mongodb-driver-vs-mongoose)
- [4. Prerequisites](#4-prerequisites)
- [5. Project Setup](#5-project-setup)
- [6. Connect to MongoDB](#6-connect-to-mongodb)
- [7. Understand the Connection Code](#7-understand-the-connection-code)
- [8. Databases, Collections, and Documents](#8-databases-collections-and-documents)
- [9. CRUD Operations](#9-crud-operations)
- [10. Complete CRUD Example](#10-complete-crud-example)
- [11. Important Concepts](#11-important-concepts)
- [12. Error Handling and Best Practices](#12-error-handling-and-best-practices)
- [13. Common Errors](#13-common-errors)
- [14. Suggested Project Structure](#14-suggested-project-structure)
- [15. Next Steps](#15-next-steps)
- [16. Official Resources](#16-official-resources)

---

## 1. Introduction

**MongoDB with Node.js** means using a Node.js application to communicate with a MongoDB database. Node.js runs JavaScript on the server, while MongoDB stores data as flexible, JSON-like documents.

For example, a web application may use MongoDB to store:

- User accounts
- Products and categories
- Orders and invoices
- Blog posts and comments
- Application settings

Node.js can receive a request, validate its data, perform database operations, and send a response to the client.

### What is the MongoDB Node.js driver?

The official MongoDB Node.js driver is a package that allows Node.js applications to connect to MongoDB and run database commands.

It provides classes and methods such as:

- `MongoClient` — creates and manages a MongoDB client and its connections.
- `client.db()` — selects a database.
- `db.collection()` — selects a collection.
- `insertOne()` and `insertMany()` — insert documents.
- `find()` and `findOne()` — retrieve documents.
- `updateOne()` and `updateMany()` — update documents.
- `deleteOne()` and `deleteMany()` — delete documents.

Install the driver using npm:

```bash
npm install mongodb
```

## 2. How Node.js and MongoDB Work Together

A common web application architecture looks like this:

```text
Frontend (React / Next.js)
          |
          | HTTP request
          v
Backend (Node.js + Express)
          |
          | MongoDB Node.js driver
          v
MongoDB Server
          |
          | Query result
          v
Backend sends an HTTP response
          |
          v
Frontend displays the result
```

### Example: Registering a user

1. A user submits a registration form in the frontend.
2. The frontend sends the user's information to an Express API.
3. The backend validates the input.
4. Node.js uses the MongoDB driver to insert a user document.
5. MongoDB returns the result of the operation.
6. The backend sends an appropriate HTTP response to the frontend.

**Important:** A frontend application should normally communicate with the backend API rather than connect directly to a database using privileged credentials. Keep database credentials on the server.

## 3. MongoDB Driver vs. Mongoose

There are two common ways to work with MongoDB from Node.js.

| Feature | MongoDB Native Driver | Mongoose |
| --- | --- | --- |
| Type | Official MongoDB driver | Object Data Modeling (ODM) library |
| Database operations | Direct driver methods | Model-based methods built on the driver |
| Schema | MongoDB documents are flexible; validation can be configured separately | Supports schemas, model validation, and middleware |
| Abstraction | Lower-level, direct control | Higher-level model abstraction |
| Useful for | Learning MongoDB fundamentals and direct queries | Applications that benefit from structured models |

The native driver is a good starting point because it shows how MongoDB operations work. Mongoose is useful when you want to define models and schema-based validation.

This guide uses the **official MongoDB Node.js driver**.

## 4. Prerequisites

Before starting, make sure you have:

- [Node.js](https://nodejs.org/) installed
- npm, which is installed with Node.js
- [MongoDB Server](https://www.mongodb.com/try/download/community) running locally or a MongoDB Atlas cluster
- A code editor, such as [Visual Studio Code](https://code.visualstudio.com/)
- Basic JavaScript knowledge, including functions, objects, promises, and `async/await`

Check Node.js and npm versions:

```bash
node --version
npm --version
```

### Connection string

If MongoDB Server is running locally on its default port, a common connection string is:

```text
mongodb://127.0.0.1:27017
```

For a MongoDB Atlas cluster, use the connection string supplied by Atlas. Keep passwords and other secrets out of source code and version control.

## 5. Project Setup

Create a project directory and initialize npm:

```bash
mkdir mongodb-node-practice
cd mongodb-node-practice
npm init -y
npm install mongodb
```

### Enable ES modules

This guide uses ES module syntax (`import` and `export`). Add `"type": "module"` to the `package.json` generated by npm.

For example, your `package.json` will contain a field like this (keep the other fields generated by npm):

```json
{
  "name": "mongodb-node-practice",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "mongodb": "^6.0.0"
  }
}
```

The dependency version shown is illustrative. Let npm choose and record the version it actually installs; do not replace your generated dependency version with the example version unless you intend to.

Create an `index.js` file. Your project will look similar to:

```text
mongodb-node-practice/
├── node_modules/
├── index.js
├── package.json
└── package-lock.json
```

Do not commit `node_modules/` to Git. Keep `package-lock.json` in the repository so the installed dependency tree can be reproduced.

## 6. Connect to MongoDB

The `MongoClient` class is the primary entry point for connecting to MongoDB using the native driver.

Create `index.js`:

```javascript
import { MongoClient } from "mongodb";

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();

    console.log("Connected to MongoDB successfully!");

    const db = client.db("college");

    console.log("Database selected:", db.databaseName);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  } finally {
    await client.close();
  }
}

main();
```

Run the file:

```bash
npm start
```

If the server is running and the connection string is correct, you should see output similar to:

```text
Connected to MongoDB successfully!
Database selected: college
```

Selecting a database with `client.db("college")` does not necessarily create it immediately. MongoDB generally creates the database and collection when data is first written.

## 7. Understand the Connection Code

### Import `MongoClient`

```javascript
import { MongoClient } from "mongodb";
```

This imports the `MongoClient` class from the installed `mongodb` package.

### Define the connection string

```javascript
const uri = "mongodb://127.0.0.1:27017";
```

- `mongodb://` specifies the MongoDB connection scheme.
- `127.0.0.1` points to the local computer.
- `27017` is MongoDB's default port.

Use the URI appropriate for your environment. If the application runs in a different machine or container, `127.0.0.1` refers to that machine or container—not necessarily your Windows host.

### Create a client

```javascript
const client = new MongoClient(uri);
```

This configures the client. The actual connection is established when you call `client.connect()` or perform an operation that triggers connection establishment.

### Connect asynchronously

```javascript
await client.connect();
```

Connecting involves network I/O, so it is asynchronous. `await` waits for the promise to settle before continuing the function.

### Select a database

```javascript
const db = client.db("college");
```

This gives you a database handle for `college`. It does not, by itself, guarantee that the database already exists on the server.

### Handle errors

```javascript
try {
  // Database operations
} catch (error) {
  console.error(error);
}
```

A `try/catch` block lets the application handle rejected promises and other errors instead of leaving them unhandled.

### Close the client

```javascript
finally {
  await client.close();
}
```

In this short, one-off script, closing the client after the operations is appropriate. In a long-running Express server, do not close the client after every request. Create and reuse a shared client for the lifetime of the application, then close it during application shutdown.

## 8. Databases, Collections, and Documents

MongoDB organizes data using databases, collections, and documents.

```text
MongoDB Server
└── college (database)
    └── students (collection)
        ├── Document 1
        ├── Document 2
        └── Document 3
```

### Database

A database groups related collections. For example, `college` can contain `students`, `courses`, and `teachers`.

### Collection

A collection groups documents, similar in broad purpose to a table in a relational database. Unlike a traditional SQL table, documents in one MongoDB collection do not all have to contain exactly the same fields.

### Document

A document is a record represented in BSON, MongoDB's binary document format. Its structure looks similar to a JavaScript object:

```javascript
{
  name: "Rahul",
  age: 21,
  course: "BCA"
}
```

MongoDB automatically assigns an `_id` field when an inserted document does not already have one. The `_id` is commonly an `ObjectId`, but it can use other supported BSON types.

### Get a collection

```javascript
const db = client.db("college");
const students = db.collection("students");
```

`students` is a collection handle that you can use for CRUD operations.

## 9. CRUD Operations

CRUD stands for:

- **Create:** Insert data.
- **Read:** Retrieve data.
- **Update:** Modify existing data.
- **Delete:** Remove data.

The following snippets assume that `client` has connected and these variables have been defined:

```javascript
const db = client.db("college");
const students = db.collection("students");
```

### 9.1 Create — Insert documents

Insert one document:

```javascript
const result = await students.insertOne({
  name: "Rahul",
  age: 21,
  course: "BCA"
});

console.log("Inserted ID:", result.insertedId);
```

`insertOne()` inserts one document and returns an insert result containing the inserted document's ID.

Insert multiple documents:

```javascript
const result = await students.insertMany([
  { name: "Priya", age: 22, course: "BBA" },
  { name: "Amit", age: 20, course: "BCA" }
]);

console.log("Inserted count:", result.insertedCount);
console.log("Inserted IDs:", result.insertedIds);
```

Use `insertMany()` when you want to insert an array of documents.

### 9.2 Read — Find documents

Find one document:

```javascript
const student = await students.findOne({
  name: "Rahul"
});

console.log(student);
```

`findOne()` returns the first matching document or `null` if no document matches.

Find multiple documents:

```javascript
const bcaStudents = await students
  .find({ course: "BCA" })
  .toArray();

console.log(bcaStudents);
```

`find()` returns a cursor. Calling `toArray()` collects the matching results into an array, which is convenient for small practice datasets. For large result sets, consider cursor iteration or pagination to avoid loading everything into memory.

Find all documents:

```javascript
const allStudents = await students.find({}).toArray();
console.log(allStudents);
```

An empty filter `{}` matches all documents in the collection.

### 9.3 Update — Modify documents

Update one matching document:

```javascript
const result = await students.updateOne(
  { name: "Rahul" },
  { $set: { age: 22 } }
);

console.log("Matched:", result.matchedCount);
console.log("Modified:", result.modifiedCount);
```

The first argument is the filter. The second argument describes the update.

- `matchedCount` indicates how many documents matched the filter.
- `modifiedCount` indicates how many documents were actually changed.
- `$set` changes only the specified fields, leaving other fields intact.

Update multiple matching documents:

```javascript
const result = await students.updateMany(
  { course: "BCA" },
  { $set: { department: "Computer Applications" } }
);

console.log("Matched:", result.matchedCount);
console.log("Modified:", result.modifiedCount);
```

Be careful with broad filters, especially when updating many documents.

### 9.4 Delete — Remove documents

Delete one matching document:

```javascript
const result = await students.deleteOne({
  name: "Rahul"
});

console.log("Deleted:", result.deletedCount);
```

Delete multiple matching documents:

```javascript
const result = await students.deleteMany({
  course: "BBA"
});

console.log("Deleted:", result.deletedCount);
```

**Warning:** An overly broad filter can affect more data than intended. `deleteMany({})` removes every document in the selected collection. Verify the database, collection, and filter before executing destructive operations.

## 10. Complete CRUD Example

The following script demonstrates the full workflow. It creates one document, reads it, updates it, lists documents, and deletes only the document inserted by that run.

```javascript
import { MongoClient } from "mongodb";

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();

    const db = client.db("college");
    const students = db.collection("students");

    // CREATE
    const insertResult = await students.insertOne({
      name: "Rahul",
      age: 21,
      course: "BCA"
    });

    const studentId = insertResult.insertedId;
    console.log("Inserted ID:", studentId);

    // READ one document by its unique ID
    const student = await students.findOne({
      _id: studentId
    });

    console.log("Student:", student);

    // UPDATE the inserted document
    const updateResult = await students.updateOne(
      { _id: studentId },
      { $set: { age: 22 } }
    );

    console.log("Matched:", updateResult.matchedCount);
    console.log("Modified:", updateResult.modifiedCount);

    // READ all documents (suitable for a small practice collection)
    const allStudents = await students.find({}).toArray();
    console.log("All students:", allStudents);

    // DELETE only the document created in this run
    const deleteResult = await students.deleteOne({
      _id: studentId
    });

    console.log("Deleted:", deleteResult.deletedCount);
  } catch (error) {
    console.error("MongoDB operation failed:", error);
  } finally {
    await client.close();
  }
}

main();
```

Run it:

```bash
npm start
```

This script is designed for learning. It opens a connection for the run and closes it afterward. In a production web server, reuse a client instead of creating and closing one for every incoming HTTP request.

## 11. Important Concepts

### `async` and `await`

MongoDB operations require communication with a database server, so many driver methods return promises.

```javascript
const student = await students.findOne({ name: "Rahul" });
```

`await` pauses the current async function until the promise settles. It does not block the entire Node.js event loop while waiting for the network response.

### `ObjectId`

MongoDB commonly uses `ObjectId` values for the `_id` field:

```javascript
const student = await students.findOne({
  _id: insertResult.insertedId
});
```

Use the exact `_id` returned by the insert operation when possible. If you receive an ID as a string from an HTTP request, validate it and convert it to an `ObjectId` when appropriate:

```javascript
import { ObjectId } from "mongodb";

const id = "64b000000000000000000000"; // Example only

if (!ObjectId.isValid(id)) {
  throw new Error("Invalid student ID");
}

const student = await students.findOne({
  _id: new ObjectId(id)
});
```

The example ID above is illustrative. Validation should be combined with the application's expected ID format and error-handling strategy.

### Connection pooling

The MongoDB driver manages a pool of connections for a `MongoClient`. Reusing one client in a long-running application helps avoid the overhead of establishing a new client connection for every request.

### Driver versus server

Installing `mongodb` in your Node.js project installs the driver package. It does **not** install or start the MongoDB database server. You need a running MongoDB server or a reachable MongoDB Atlas cluster.

## 12. Error Handling and Best Practices

1. **Reuse the client in a server application.** Create one shared `MongoClient` during application startup and close it during shutdown.
2. **Keep credentials secret.** Use environment variables or a secrets manager rather than committing credentials to Git.
3. **Validate incoming data.** Do not trust request bodies or query parameters automatically.
4. **Use specific filters.** Check filters before updating or deleting records.
5. **Handle missing documents.** `findOne()` may return `null`.
6. **Avoid loading huge collections into arrays.** Use cursors, pagination, or limits for larger datasets.
7. **Create indexes for important queries.** Indexes can improve read performance, but they add storage and write overhead.
8. **Use appropriate access controls.** Database users should have only the permissions they need.
9. **Do not expose MongoDB directly to the public internet without appropriate security controls.**
10. **Use `try/catch` for database failures.** Return suitable API errors from an Express application without exposing sensitive internal details.

### Using environment variables

Instead of hardcoding the URI, you can read it from an environment variable:

```javascript
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not configured");
}
```

Set `MONGODB_URI` in your environment before running the application. If you use a `.env` file, keep it out of version control and follow the setup required by your Node.js version or dotenv library.

## 13. Common Errors

### `ECONNREFUSED`

**Possible causes:**

- MongoDB Server is not running.
- The URI or port is incorrect.
- MongoDB is listening on a different network interface.

**What to check:** Confirm that the server is running and that the connection URI points to the correct host and port.

### `MongoServerSelectionError` or a timeout

**Possible causes:**

- Network connectivity or firewall restrictions.
- An unreachable host.
- Incorrect Atlas network-access settings.
- Incorrect connection details.

**What to check:** Verify the URI, server status, network path, and access rules. Do not disable security protections as a shortcut.

### Authentication failure

**Possible causes:**

- Incorrect username or password.
- Wrong authentication database.
- Insufficient permissions.

**What to check:** Verify credentials and database-user permissions. Use secure secret storage.

### `Cannot use import statement outside a module`

**Cause:** Node.js is treating the file as CommonJS.

**Fix:** Add `"type": "module"` to `package.json`, use an `.mjs` file, or adapt the code to CommonJS syntax.

### `ReferenceError: students is not defined`

**Cause:** The collection variable was not declared in the current scope.

**Fix:** Define it after selecting the database:

```javascript
const db = client.db("college");
const students = db.collection("students");
```

## 14. Suggested Project Structure

As the application grows, separate database connection code from routes and business logic:

```text
mongodb-node-practice/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── repositories/
│   │   └── studentRepository.js
│   ├── routes/
│   │   └── studentRoutes.js
│   └── app.js
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```

This is a suggested structure, not a requirement. For a small learning exercise, one `index.js` file is enough. In a larger Express application, keep connection setup, request handling, and database operations organized into appropriate modules.

Example `.gitignore`:

```gitignore
node_modules/
.env
```

Never commit real credentials or private connection strings.

## 15. Next Steps

After learning these basics, practise the following in order:

1. Insert one and multiple documents.
2. Query with filters and comparison operators.
3. Update selected fields using `$set` and remove fields using `$unset`.
4. Delete documents using specific filters.
5. Learn sorting, limits, and pagination.
6. Understand indexes and unique constraints.
7. Build a REST API with Express and MongoDB.
8. Learn Mongoose schemas and models.
9. Add validation, authentication, and authorization to a practice application.

A useful project is a **Student Management REST API** with endpoints to create, list, retrieve, update, and delete students.

## 16. Official Resources

- [MongoDB Node.js Driver Documentation](https://www.mongodb.com/docs/drivers/node/current/)
- [MongoDB CRUD Operations](https://www.mongodb.com/docs/manual/crud/)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [MongoDB Shell (`mongosh`) Documentation](https://www.mongodb.com/docs/mongodb-shell/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)

---

**Learning goal:** Understand how Node.js connects to MongoDB, how to perform CRUD operations using the native driver, and how to apply those concepts in a backend API.
