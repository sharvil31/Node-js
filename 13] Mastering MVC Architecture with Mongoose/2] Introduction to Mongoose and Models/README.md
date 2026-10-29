# Mongoose in Node.js

## 1. What Is Mongoose?

**Mongoose** is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a structured way to interact with MongoDB databases using JavaScript objects.

Mongoose helps developers define schemas, create models, validate data, perform database operations, and manage relationships between documents.

Without Mongoose, we can use the official MongoDB Node.js driver directly. However, Mongoose provides additional features that make application development easier and more organized.

### Key Features

- **Schema definition:** Defines the structure of documents.
- **Models:** Provides an interface for interacting with MongoDB collections.
- **Validation:** Validates data before saving it.
- **Middleware:** Executes functions before or after certain database operations.
- **Query building:** Provides convenient methods for querying documents.
- **Population:** Retrieves referenced documents from other collections.
- **Type casting:** Converts values into the types defined in the schema when possible.
- **Relationships:** Supports references between documents.
- **Indexing:** Allows indexes to be defined for improved query performance.

---

## 2. Mongoose vs. MongoDB Native Driver

The MongoDB Node.js driver and Mongoose both allow Node.js applications to communicate with MongoDB, but they work differently.

| Feature       | MongoDB Native Driver                                         | Mongoose                             |
| ------------- | ------------------------------------------------------------- | ------------------------------------ |
| Type          | Official database driver                                      | ODM library                          |
| Schema        | No built-in schema enforcement at the application model level | Provides schemas                     |
| Models        | Must be implemented separately if needed                      | Provides models                      |
| Validation    | Usually implemented manually or with other libraries          | Built-in schema validation           |
| Middleware    | No Mongoose-style document/query middleware                   | Supports middleware                  |
| Relationships | Manual queries or aggregation                                 | Supports references and `populate()` |
| Flexibility   | More direct control over MongoDB operations                   | Adds structure and abstraction       |
| Dependency    | `mongodb`                                                     | `mongoose`                           |

**Important:** MongoDB itself is schema-flexible by default. Mongoose schemas enforce rules at the application level; they do not automatically prevent every other client from inserting documents that violate those rules.

---

## 3. Installing Mongoose

First, make sure Node.js and npm are installed.

Check their versions:

```bash
node --version
npm --version
```

Create a project directory:

```bash
mkdir mongoose-learning
cd mongoose-learning
npm init -y
```

Install Mongoose:

```bash
npm install mongoose
```

If the project uses ES modules, add the following to `package.json`:

```json
{
  "type": "module"
}
```

You can now use `import` statements in your JavaScript files.

---

## 4. Connecting to MongoDB

Mongoose connects to MongoDB using a connection string.

### Example: Local MongoDB

Create a file named `server.js`:

```javascript
import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/mongooseDB";

try {
  await mongoose.connect(MONGO_URI);

  console.log("MongoDB connected successfully");
} catch (error) {
  console.error("MongoDB connection failed:", error.message);
}
```

### Understanding the Connection String

```text
mongodb://127.0.0.1:27017/mongooseDB
```

- `mongodb://` — MongoDB connection protocol.
- `127.0.0.1` — Local machine.
- `27017` — Default MongoDB port.
- `mongooseDB` — Database name.

Mongoose creates the database when data is first written to it, provided the MongoDB user has the required permissions.

### Connecting to an Authenticated MongoDB Instance

If MongoDB authentication is enabled, provide credentials and the appropriate authentication database.

```javascript
const MONGO_URI =
  "mongodb://username:password@127.0.0.1:27017/mongooseDB?authSource=admin";
```

Replace the username and password with your actual credentials.

For real projects, store credentials in environment variables rather than hardcoding them in source code.

### Using Environment Variables

Install `dotenv`:

```bash
npm install dotenv
```

Create a `.env` file:

```env
MONGO_URI=mongodb://127.0.0.1:27017/mongooseDB
```

Update the connection code:

```javascript
import "dotenv/config";
import mongoose from "mongoose";

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB connected successfully");
```

Add `.env` to `.gitignore` so credentials and configuration secrets are not committed to Git.

---

## 5. What Is a Schema in Mongoose?

A **Schema** defines the structure, data types, default values, validation rules, and other configuration for documents handled by a Mongoose model.

For example, suppose we want to store users with the following fields:

- `name`
- `email`
- `age`
- `isActive`

We can define a schema like this:

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  isActive: Boolean,
});
```

Here, `mongoose.Schema` is used to define the structure of user documents.

### Common Schema Types

| Schema Type | Description                     | Example                         |
| ----------- | ------------------------------- | ------------------------------- |
| `String`    | Text                            | `"Sharvil"`                     |
| `Number`    | Numeric values                  | `22`                            |
| `Boolean`   | True or false                   | `true`                          |
| `Date`      | Date and time                   | `new Date()`                    |
| `ObjectId`  | MongoDB document identifier     | `new mongoose.Types.ObjectId()` |
| `Array`     | A list of values                | `["React", "Node.js"]`          |
| `Buffer`    | Binary data                     | `Buffer.from("data")`           |
| `Mixed`     | Flexible value of varying types | `{ key: "value" }`              |
| `Map`       | Key-value collection            | `new Map()`                     |

Example with multiple schema types:

```javascript
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  inStock: Boolean,
  createdAt: Date,
  tags: [String],
});
```

---

## 6. Schema Options and Validation

Mongoose allows us to configure fields with additional options.

Instead of defining a field using only a type, we can define its type and validation rules.

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  age: {
    type: Number,
    min: 18,
    max: 80,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
```

### Explanation of Schema Options

**`type`**

Defines the expected data type.

```javascript
age: {
  type: Number,
}
```

**`required`**

Requires a value for the field.

```javascript
name: {
  type: String,
  required: true,
}
```

**`default`**

Sets a default value when the field is not provided.

```javascript
isActive: {
  type: Boolean,
  default: true,
}
```

**`min` and `max`**

Set the minimum and maximum values for numeric fields.

```javascript
age: {
  type: Number,
  min: 18,
  max: 80,
}
```

**`minlength` and `maxlength`**

Restrict the length of strings.

```javascript
name: {
  type: String,
  minlength: 2,
  maxlength: 50,
}
```

**`trim`**

Removes leading and trailing whitespace from strings.

```javascript
name: {
  type: String,
  trim: true,
}
```

**`lowercase`**

Converts strings to lowercase when Mongoose processes the value.

```javascript
email: {
  type: String,
  lowercase: true,
}
```

**`unique`**

Creates a unique index when the index is successfully created. It is not a normal Mongoose validator. Duplicate values can produce a MongoDB duplicate-key error.

For email uniqueness, handle duplicate-key errors in application code as well.

---

## 7. What Is a Model?

A **Model** is a class created from a Mongoose schema. It provides methods for creating, reading, updating, and deleting documents in a MongoDB collection.

Create a model using `mongoose.model()`:

```javascript
const User = mongoose.model("User", userSchema);
```

Here:

- `User` is the model name.
- `userSchema` defines the document structure.
- `User` provides methods for interacting with the corresponding collection.

By default, Mongoose normally converts the model name `User` into the collection name `users`.

Similarly, a model named `Product` normally uses the `products` collection.

You can explicitly specify the collection name:

```javascript
const User = mongoose.model("User", userSchema, "users");
```

### Schema vs. Model vs. Document

| Concept  | Meaning                                  |
| -------- | ---------------------------------------- |
| Schema   | Defines document structure and rules     |
| Model    | Provides methods for database operations |
| Document | An individual record managed by a model  |

Example:

```javascript
const userSchema = new mongoose.Schema({
  name: String,
});

const User = mongoose.model("User", userSchema);

const user = new User({
  name: "Sharvil",
});
```

In this example:

- `userSchema` is the schema.
- `User` is the model.
- `user` is a document instance.

---

## 8. Creating Documents

There are several ways to insert documents using Mongoose.

### Method 1: Using `new Model()`

```javascript
const user = new User({
  name: "Sharvil",
  email: "sharvil@example.com",
  age: 22,
});

await user.save();
```

The `save()` method saves the document to MongoDB.

### Method 2: Using `Model.create()`

```javascript
const user = await User.create({
  name: "Sharvil",
  email: "sharvil@example.com",
  age: 22,
});

console.log(user);
```

The `create()` method creates and saves a document in one operation.

### Method 3: Creating Multiple Documents

```javascript
const users = await User.insertMany([
  {
    name: "Amit",
    email: "amit@example.com",
    age: 25,
  },
  {
    name: "Priya",
    email: "priya@example.com",
    age: 24,
  },
]);

console.log(users);
```

`insertMany()` is useful when inserting multiple documents. By default, it validates documents before insertion, although its middleware behavior differs from individual document saves.

---

## 9. Reading Documents

Mongoose provides several methods for retrieving documents.

### `find()`

Returns all documents matching a query as an array.

```javascript
const users = await User.find();

console.log(users);
```

Find users older than 21:

```javascript
const users = await User.find({
  age: { $gt: 21 },
});
```

### `findOne()`

Returns the first document matching a query, or `null` if no document matches.

```javascript
const user = await User.findOne({
  email: "sharvil@example.com",
});
```

### `findById()`

Finds a document by its `_id`.

```javascript
const user = await User.findById("68f000000000000000000001");
```

Use an actual document ID from your database when testing.

### Selecting Specific Fields

You can use projections to return only the required fields.

```javascript
const users = await User.find().select("name email").exec();
```

Exclude a field:

```javascript
const users = await User.find().select("-email").exec();
```

By default, MongoDB's `_id` field remains included unless explicitly excluded.

### Sorting and Limiting Results

```javascript
const users = await User.find().sort({ age: -1 }).limit(5).exec();
```

- `sort({ age: -1 })` sorts by age in descending order.
- `sort({ age: 1 })` sorts by age in ascending order.
- `limit(5)` returns at most five documents.

### Pagination

```javascript
const page = 2;
const limit = 10;

const users = await User.find()
  .skip((page - 1) * limit)
  .limit(limit)
  .exec();
```

For page 2, this skips the first 10 documents and returns the next 10.

For large datasets, range-based pagination using indexed fields may be more efficient than large `skip()` values.

---

## 10. Updating Documents

Mongoose provides multiple methods for updating existing documents.

### `findByIdAndUpdate()`

Updates a document using its ID.

```javascript
const updatedUser = await User.findByIdAndUpdate(
  "68f000000000000000000001",
  {
    age: 23,
  },
  {
    new: true,
    runValidators: true,
  },
);

console.log(updatedUser);
```

Options:

- `new: true` returns the updated document.
- `runValidators: true` runs applicable schema validators during the update.

Update validators are not identical to full document validation and do not run for every possible update operator or context.

### `updateOne()`

Updates the first matching document.

```javascript
const result = await User.updateOne(
  { email: "sharvil@example.com" },
  { $set: { age: 23 } },
);

console.log(result);
```

### `updateMany()`

Updates all documents matching a query.

```javascript
const result = await User.updateMany(
  { isActive: false },
  { $set: { isActive: true } },
);

console.log(result);
```

### Important Update Operator: `$set`

`$set` assigns a new value to a field without replacing the entire document.

```javascript
await User.updateOne(
  { email: "sharvil@example.com" },
  {
    $set: {
      age: 23,
      isActive: true,
    },
  },
);
```

---

## 11. Deleting Documents

### `deleteOne()`

Deletes the first document matching the filter.

```javascript
const result = await User.deleteOne({
  email: "sharvil@example.com",
});

console.log(result);
```

### `deleteMany()`

Deletes all documents matching the filter.

```javascript
const result = await User.deleteMany({
  isActive: false,
});

console.log(result);
```

### `findByIdAndDelete()`

Deletes a document using its ID and returns the deleted document, or `null` if no document matches.

```javascript
const deletedUser = await User.findByIdAndDelete("68f000000000000000000001");

console.log(deletedUser);
```

**Warning:** Always verify your filters before running deletion operations, especially `deleteMany({})`, which matches all documents in the collection.

---

## 12. Mongoose Validation

Mongoose validates documents according to the rules defined in the schema.

Example:

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    min: 18,
    max: 80,
  },
});

const User = mongoose.model("User", userSchema);
```

Attempt to create an invalid document:

```javascript
try {
  await User.create({
    name: "Sharvil",
    age: 15,
  });
} catch (error) {
  console.log(error.name);
  console.log(error.message);
}
```

The operation fails because the age is below the minimum value.

### Common Built-in Validators

- `required`
- `min`
- `max`
- `minlength`
- `maxlength`
- `enum`
- `match`

### Using `enum`

Restrict a field to a predefined set of values.

```javascript
const taskSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
});
```

### Using `match`

Validate a string against a regular expression.

```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
});
```

This is a basic format check, not a guarantee that an email address exists.

### Custom Validation

```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    validate: {
      validator: function (value) {
        return value.length >= 3;
      },
      message: "Username must contain at least 3 characters",
    },
  },
});
```

Custom validators are useful when built-in validation rules are insufficient.

---

## 13. Timestamps

Mongoose can automatically maintain creation and update timestamps.

```javascript
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
```

Mongoose automatically manages two fields:

- `createdAt` — When the document was created.
- `updatedAt` — When the document was last updated through supported Mongoose operations.

Example document:

```javascript
{
  _id: ObjectId("..."),
  name: "Sharvil",
  email: "sharvil@example.com",
  createdAt: ISODate("2026-10-29T10:00:00.000Z"),
  updatedAt: ISODate("2026-10-29T10:00:00.000Z")
}
```

The dates above are illustrative.

---

## 14. Middleware in Mongoose

Mongoose middleware, also called hooks, allows you to execute functions before or after certain operations.

Common middleware types include:

- Document middleware
- Query middleware
- Model middleware
- Aggregate middleware

### Example: Pre-save Middleware

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

userSchema.pre("save", function () {
  console.log("About to save the user");
});

userSchema.post("save", function (doc) {
  console.log("User saved:", doc.name);
});

const User = mongoose.model("User", userSchema);
```

The pre-save hook runs before saving a document, while the post-save hook runs after a successful save.

Register middleware **before compiling the schema into a model**.

### Hashing Passwords

A pre-save hook can be used to hash a password before saving it. Passwords should never be stored as plain text.

In a real application, use a suitable password-hashing algorithm such as Argon2id or bcrypt, handle asynchronous hashing correctly, and hash only when the password changes.

Remember that `pre("save")` does not automatically run for operations such as `updateOne()` or `findOneAndUpdate()`.

---

## 15. Relationships and Population

MongoDB supports embedding documents and referencing documents in different collections.

Mongoose supports references using `ObjectId` and the `ref` option.

### Example: User and Post Relationship

First, create a user schema:

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
```

Create a post schema that references a user:

```javascript
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  content: String,

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Post = mongoose.model("Post", postSchema);
```

The `author` field stores the user's ObjectId, not the entire user document.

### Creating Related Documents

```javascript
const user = await User.create({
  name: "Sharvil",
});

const post = await Post.create({
  title: "Learning Mongoose",
  content: "Mongoose makes MongoDB operations structured.",
  author: user._id,
});
```

### Using `populate()`

By default, querying the post returns the author's ObjectId.

Use `populate()` to retrieve the referenced user:

```javascript
const post = await Post.findById(post._id).populate("author").exec();

console.log(post.author.name);
```

You can select specific fields:

```javascript
const post = await Post.findById(post._id).populate("author", "name").exec();
```

`populate()` performs additional retrieval work to resolve references. It is not the same as a MongoDB server-side `$lookup` aggregation stage.

---

## 16. Query Operators

Mongoose supports MongoDB's query operators.

### Comparison Operators

```javascript
const users = await User.find({
  age: { $gt: 18 },
});
```

Common comparison operators:

- `$eq` — Equal to
- `$ne` — Not equal to
- `$gt` — Greater than
- `$gte` — Greater than or equal to
- `$lt` — Less than
- `$lte` — Less than or equal to
- `$in` — Matches any value in an array
- `$nin` — Does not match any value in an array

### Logical Operators

```javascript
const users = await User.find({
  $or: [{ age: { $lt: 18 } }, { age: { $gt: 60 } }],
});
```

Common logical operators:

- `$and`
- `$or`
- `$nor`
- `$not`

### Searching with Regular Expressions

```javascript
const users = await User.find({
  name: { $regex: "^sha", $options: "i" },
});
```

This searches for names beginning with `sha`, ignoring case.

Be careful with untrusted regular-expression input and expensive patterns.

---

## 17. Lean Queries

By default, Mongoose returns full Mongoose documents. These documents provide features such as change tracking, validation, and methods like `save()`.

For read-only operations, `.lean()` returns plain JavaScript objects instead.

```javascript
const users = await User.find().lean().exec();
```

### Difference

Without `lean()`:

```javascript
const user = await User.findOne();

console.log(user.save);
```

The result is a Mongoose document with document methods.

With `lean()`:

```javascript
const user = await User.findOne().lean();

console.log(user.save);
```

The result is a plain JavaScript object and does not have Mongoose document methods.

Lean queries can reduce overhead for read-heavy operations, but lean results do not automatically provide all the behavior of normal Mongoose documents.

---

## 18. Error Handling

Database operations can fail for several reasons:

- MongoDB is unavailable.
- The connection string is incorrect.
- Authentication fails.
- Schema validation fails.
- A unique index detects duplicate data.
- A query or update fails.

Use `try...catch` to handle errors:

```javascript
try {
  const user = await User.create({
    name: "Sharvil",
    email: "sharvil@example.com",
    age: 22,
  });

  console.log("User created:", user);
} catch (error) {
  if (error.name === "ValidationError") {
    console.error("Validation failed:", error.message);
  } else if (error.code === 11000) {
    console.error("A unique field already exists");
  } else {
    console.error("Database operation failed:", error.message);
  }
}
```

For production applications, return appropriate HTTP status codes and safe error messages to clients. Avoid exposing database credentials or sensitive internal error details.

---

## 19. Complete Example

The following example demonstrates connecting to MongoDB, defining a schema, creating a model, inserting a document, reading documents, updating a document, and deleting a document.

Create a file named `app.js`:

```javascript
import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/mongooseDB";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    age: {
      type: Number,
      min: 18,
      max: 80,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

async function main() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    // CREATE
    const user = await User.create({
      name: "Sharvil",
      email: "sharvil@example.com",
      age: 22,
    });

    console.log("Created user:", user);

    // READ
    const users = await User.find();

    console.log("All users:", users);

    // UPDATE
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          age: 23,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    console.log("Updated user:", updatedUser);

    // DELETE
    const deletedUser = await User.findByIdAndDelete(user._id);

    console.log("Deleted user:", deletedUser);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
}

await main();
```

Run the application:

```bash
node app.js
```

Make sure your MongoDB server is running before executing the script.

**Note:** Running this example repeatedly with the same email may cause a duplicate-key error because `email` is configured as unique. Use a fresh test email or remove the previous test document before running it again.

---

## 20. Best Practices

1. **Use environment variables** for connection strings and credentials.
2. **Define clear schemas** with appropriate types and validation rules.
3. **Handle errors** for database connections, validation failures, and duplicate-key errors.
4. **Create indexes thoughtfully** to improve frequently used queries.
5. **Avoid unnecessary queries** and use projections to retrieve only required fields.
6. **Use `.lean()` for suitable read-only queries** when full Mongoose document functionality is unnecessary.
7. **Use `runValidators: true` where appropriate** for update operations.
8. **Never store plain-text passwords.** Use a suitable password-hashing algorithm.
9. **Register middleware before model compilation.**
10. **Keep MongoDB access organized** in dedicated model or database modules.
11. **Use least-privilege database accounts** rather than administrative credentials for ordinary application access.
12. **Understand the difference between embedding and referencing** when designing data relationships.
13. **Do not assume Mongoose validation replaces database-level validation or authorization.**
14. **Close connections gracefully** when shutting down long-running applications.

---

## 21. Common Interview Questions

### 1. What is Mongoose?

Mongoose is an ODM library for MongoDB and Node.js that provides schemas, models, validation, middleware, and convenient database operations.

### 2. What is the difference between a schema and a model?

A schema defines document structure and rules, while a model provides methods to interact with the corresponding MongoDB collection.

### 3. What is a Mongoose document?

A document is an individual record represented by a Mongoose document instance, which provides methods and change tracking.

### 4. What is the difference between `find()` and `findOne()`?

`find()` returns an array of matching documents. `findOne()` returns the first matching document or `null`.

### 5. What is the difference between `save()` and `create()`?

`save()` persists an existing or newly instantiated document. `Model.create()` creates and saves a new document in one operation.

### 6. What is `populate()`?

`populate()` retrieves documents referenced by fields in another document, such as retrieving an author's details for a post.

### 7. What is Mongoose middleware?

Middleware allows functions to execute before or after supported document, query, model, or aggregation operations.

### 8. What is the purpose of `timestamps: true`?

It automatically maintains `createdAt` and `updatedAt` for supported Mongoose operations.

### 9. What is the difference between `findByIdAndUpdate()` and `save()`?

`findByIdAndUpdate()` performs a query-based update, while `save()` persists changes made to a Mongoose document. Their validation and middleware behavior differ.

### 10. What does `.lean()` do?

It returns plain JavaScript objects instead of full Mongoose documents, reducing document-related overhead for suitable read operations.

### 11. Does `unique: true` validate a field?

No. It configures a unique index. MongoDB enforces uniqueness when that index exists, and duplicate-key errors must be handled separately from Mongoose validation errors.

### 12. Does Mongoose replace MongoDB?

No. Mongoose is an additional application-layer library. MongoDB remains the database that stores and retrieves the data.

---

## 22. Conclusion

Mongoose simplifies working with MongoDB in Node.js by providing a structured application-layer approach to database operations.

The most important concepts to understand are:

- **Schema:** Defines the structure and rules for documents.
- **Model:** Provides the interface for collection operations.
- **Document:** Represents an individual record.
- **Validation:** Checks data against schema rules.
- **Middleware:** Runs functions around supported database operations.
- **Population:** Retrieves referenced documents.
- **Queries:** Retrieves, filters, sorts, and modifies data.

Understanding these concepts provides a strong foundation for building REST APIs, authentication systems, and full-stack applications using Node.js, Express, Mongoose, and MongoDB.

### Official Documentation

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Mongoose Schemas](https://mongoosejs.com/docs/guide.html)
- [Mongoose Models](https://mongoosejs.com/docs/models.html)
- [Mongoose Validation](https://mongoosejs.com/docs/validation.html)
- [Mongoose Middleware](https://mongoosejs.com/docs/middleware.html)
- [Mongoose Populate](https://mongoosejs.com/docs/populate.html)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
