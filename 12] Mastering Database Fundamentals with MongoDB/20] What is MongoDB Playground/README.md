# MongoDB Playground

## What Is MongoDB Playground?

MongoDB Playground is a feature provided by the **MongoDB for VS Code** extension. It lets you write and run MongoDB queries from a JavaScript-style file directly inside Visual Studio Code.

It is useful for learning MongoDB, experimenting with queries, testing CRUD operations, and viewing query results without constantly switching to a terminal or MongoDB Compass.

> **Important:** A Playground is not a separate database. It runs operations against the MongoDB server selected by your connection.

## How It Works

1. Write MongoDB commands in a `.mongodb.js` file.
2. Run the file using the MongoDB extension in VS Code.
3. The extension sends the commands to the connected MongoDB server.
4. View the returned documents and operation results in VS Code.

```text
MongoDB Playground file
          |
          v
MongoDB for VS Code extension
          |
          v
Connected MongoDB server
          |
          v
Query results in VS Code
```

## Requirements

- [Visual Studio Code](https://code.visualstudio.com/)
- The official **MongoDB for VS Code** extension
- Access to a running MongoDB server
- A MongoDB connection configured in the extension

## Getting Started

1. Install Visual Studio Code.
2. Install the MongoDB extension published by MongoDB.
3. Open the MongoDB panel in VS Code and connect to your MongoDB server.
4. Create a file such as `practice.mongodb.js`.
5. Write your MongoDB commands in the file.
6. Click the **Play** or **Run** control provided by the extension to execute the playground.

If VS Code and MongoDB Server are running on the same computer, a typical local connection string is:

```text
mongodb://localhost:27017
```

Use the connection string that matches your actual server setup. If authentication is enabled, provide the appropriate credentials through a secure connection configuration.

## Example: CRUD Operations

The following example demonstrates creating, reading, updating, and deleting documents in a `students` collection inside a database named `college`.

```javascript
use("college");

// CREATE: Insert documents
db.students.insertMany([
  { name: "Rahul", age: 21, course: "BCA" },
  { name: "Priya", age: 22, course: "BBA" },
  { name: "Amit", age: 20, course: "BCA" }
]);

// READ: Find all students
db.students.find();

// READ: Find students studying BCA
db.students.find({ course: "BCA" });

// UPDATE: Change Rahul's age
db.students.updateOne(
  { name: "Rahul" },
  { $set: { age: 22 } }
);

// DELETE: Remove Amit
db.students.deleteOne({ name: "Amit" });
```

### Notes About the Example

- `use("college")` selects the `college` database for the playground.
- `insertMany()` inserts multiple documents.
- `find()` retrieves documents matching a query.
- `updateOne()` updates the first document that matches the filter.
- `$set` changes the specified field without replacing the entire document.
- `deleteOne()` removes the first document matching the filter.

**Avoid repeatedly running the entire script:** each run can insert the sample documents again. For repeatable practice, run the insert section once, or clear the test collection before reseeding it. Only clear data in a database you are comfortable modifying.

## MongoDB Playground vs. `mongosh` vs. Compass

| Feature | MongoDB Playground | MongoDB Shell (`mongosh`) | MongoDB Compass |
| --- | --- | --- | --- |
| Interface | Editor in VS Code | Terminal | Graphical application |
| Write and run queries | Yes | Yes | Yes |
| View query results | In VS Code | Text output | Graphical document view |
| Best suited for | Practising and testing query scripts | Command-line workflows | Browsing and managing data visually |

## Benefits

- Write and keep queries in files.
- Test multiple operations in one place.
- Practise MongoDB CRUD methods.
- View query results without leaving VS Code.
- Keep useful query examples alongside a project.

## Safety Tips

- Confirm the active connection and database before running commands.
- Be especially careful with `deleteMany()`, `drop()`, and updates without a filter.
- Use a practice database for experiments.
- Do not store database passwords or other secrets in committed files.
- Remember that Playground commands can modify real data on the connected server.

## Useful Resources

- [MongoDB for VS Code documentation](https://www.mongodb.com/docs/mongodb-vscode/)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [MongoDB CRUD Operations](https://www.mongodb.com/docs/manual/crud/)
- [MongoDB Shell (`mongosh`) documentation](https://www.mongodb.com/docs/mongodb-shell/)

---

**Purpose:** MongoDB learning and query practice using Visual Studio Code.
