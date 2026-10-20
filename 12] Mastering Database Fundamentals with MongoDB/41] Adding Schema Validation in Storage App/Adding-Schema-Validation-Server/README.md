# Adding Schema Validation in a MongoDB Storage App

## Overview

Schema validation in MongoDB allows us to define rules that documents must follow before they can be inserted or updated in a collection.

MongoDB is a flexible, document-oriented database, so documents within the same collection can have different structures by default. However, in real-world applications, maintaining a consistent document structure is important.

For example, a storage application may contain three collections:

- `users` — stores user account information.
- `directories` — stores directory information.
- `files` — stores file metadata.

Without schema validation, a document might be inserted with a missing field, an incorrect data type, or an invalid email format.

MongoDB schema validation helps prevent these problems by enforcing rules at the database level.

In this project, we use the MongoDB Node.js driver to create collections with validation rules or modify the validation rules of existing collections.

---

## 1. What Is Schema Validation?

Schema validation is a mechanism used to ensure that documents follow a predefined structure and satisfy specified conditions.

For example, a user document might look like this:

```javascript
{
  _id: ObjectId("671234567890123456789012"),
  name: "Sharvil",
  email: "sharvil@example.com",
  password: "hashedPassword123",
  rootDirId: ObjectId("671234567890123456789013")
}
```

We may want to enforce the following rules:

- `name` must be a string containing at least three characters.
- `email` must be a string that matches a basic email-format pattern.
- `password` must be a string containing at least four characters.
- `rootDirId` must be an ObjectId.
- Required fields must be present.

Schema validation allows MongoDB to reject documents that violate these rules.

### Why Is Schema Validation Important?

1. **Data consistency:** Documents follow a predictable structure.
2. **Data integrity:** Invalid documents can be rejected before they are stored.
3. **Error prevention:** Incorrect data types and missing fields are detected at the database level.
4. **Application reliability:** Application code can work with more predictable data.
5. **Centralized enforcement:** Validation applies to database writes from different applications, not just one frontend or API.

Schema validation complements application-level validation; it does not replace it.

---

## 2. MongoDB JSON Schema Validation

MongoDB supports JSON Schema validation through the `$jsonSchema` operator.

A basic example is:

```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email"],
      properties: {
        name: {
          bsonType: "string",
        },
        email: {
          bsonType: "string",
        },
      },
    },
  },
});
```

### Explanation

- `createCollection`: Creates a new collection.
- `validator`: Defines the validation rules for documents.
- `$jsonSchema`: Specifies that the validator uses JSON Schema-style rules supported by MongoDB.
- `bsonType`: Specifies the expected BSON data type.
- `required`: Lists fields that must be present.
- `properties`: Defines validation rules for individual fields.

MongoDB uses BSON, an extended binary representation of JSON, internally. Consequently, MongoDB validators support BSON-specific types such as `objectId`.

---

## 3. Understanding Important Validation Properties

### `bsonType`

The `bsonType` property specifies the expected data type of a field.

Examples:

```javascript
{
  name: {
    bsonType: "string"
  },
  age: {
    bsonType: "int"
  },
  price: {
    bsonType: "double"
  },
  userId: {
    bsonType: "objectId"
  },
  isActive: {
    bsonType: "bool"
  }
}
```

Common BSON types include:

| BSON type  | Description           |
| ---------- | --------------------- |
| `string`   | Text                  |
| `int`      | 32-bit integer        |
| `long`     | 64-bit integer        |
| `double`   | Floating-point number |
| `decimal`  | Decimal number        |
| `bool`     | Boolean value         |
| `objectId` | MongoDB ObjectId      |
| `date`     | Date and time         |
| `array`    | Array of values       |
| `object`   | Embedded document     |
| `null`     | Null value            |

Use the appropriate BSON type for each field.

### `required`

The `required` property defines fields that must exist in a document.

```javascript
required: ["name", "email", "password"];
```

A document missing any of these fields fails validation.

**Important:** `required` checks whether a field exists. It does not automatically prevent a field from containing `null`.

For example, if `name` is required and has `bsonType: "string"`, a document with `name: null` fails because `null` is not a string.

### `minLength`

The `minLength` property specifies the minimum length of a string.

```javascript
name: {
  bsonType: "string",
  minLength: 3
}
```

Values such as `"Al"` fail validation, while `"Alex"` passes this rule.

### `pattern`

The `pattern` property applies a regular expression to a string.

```javascript
email: {
  bsonType: "string",
  pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
}
```

This checks for a basic email-like format.

The double backslashes are needed because the pattern is written as a JavaScript string. MongoDB receives the regular expression containing `\s`.

This is only a basic format check. It does not verify that an email address exists or can receive messages.

### `additionalProperties`

The `additionalProperties` property determines whether fields not listed in `properties` are allowed.

```javascript
additionalProperties: false;
```

When set to `false`, fields not declared in `properties` are rejected.

For example, if a user schema does not define an `age` field, the following document fails validation:

```javascript
{
  name: "Sharvil",
  email: "sharvil@example.com",
  age: 22
}
```

**Important:** If you use `additionalProperties: false`, make sure every permitted field is declared in `properties`. Otherwise, legitimate application fields may be rejected.

---

## 4. Understanding MongoDB Server Instances

A MongoDB server is a running database process that stores and manages databases and collections.

On Windows, MongoDB can run as a Windows service or as a manually started process in a terminal.

These can be separate MongoDB server instances if they use different configurations or data directories.

For example:

```text
MongoDB Windows Service
        |
        |-- Port: 27017
        |-- Data directory: configured in mongod.cfg
        |-- Database: storageApp
        |-- Collections: users, directories, files

MongoDB Terminal Process
        |
        |-- Port: potentially different
        |-- Data directory: potentially different
        |-- Databases: may differ from the service instance
```

Two processes cannot normally listen on the same IP address and port simultaneously. If both instances are running, they must use compatible, non-conflicting network configurations.

### Why Can Two Instances Have Different Databases?

MongoDB stores its data in a configured data directory, commonly specified through `storage.dbPath` in `mongod.cfg`.

If two MongoDB processes use different data directories, they can contain different databases and collections.

For example, the Windows service may contain the `storageApp` database, while a separately started MongoDB process may not have that database or its collections.

The database name in a connection URI does not select a data directory or copy data between servers.

### How Does the Application Select a Server?

A connection URI identifies the MongoDB server to which the Node.js driver connects.

Example:

```javascript
const client = new MongoClient("mongodb://127.0.0.1:27017/storageApp");
```

Here:

- `mongodb://` specifies the MongoDB connection scheme.
- `127.0.0.1` is the loopback IP address of the local machine.
- `27017` is the MongoDB server port.
- `storageApp` is the database selected by `client.db()` when no other database name is provided.

If another MongoDB server uses a different port, the URI must use that port.

Changing the URI connects to another server; it does not transfer the database.

---

## 5. Connecting to MongoDB Using Node.js

Install the MongoDB Node.js driver:

```bash
npm install mongodb
```

Create a file named `db.js`:

```javascript
import { MongoClient } from "mongodb";

export const client = new MongoClient("mongodb://127.0.0.1:27017/storageApp");

export async function connectDB() {
  await client.connect();

  const db = client.db();

  console.log("Database Connected");

  return db;
}

process.on("SIGINT", async () => {
  try {
    await client.close();
    console.log("Client Disconnected!");
  } finally {
    process.exit(0);
  }
});
```

### Explanation

#### Importing `MongoClient`

```javascript
import { MongoClient } from "mongodb";
```

`MongoClient` is the main class used to connect Node.js applications to MongoDB.

#### Creating the client

```javascript
export const client = new MongoClient("mongodb://127.0.0.1:27017/storageApp");
```

This creates a client configured to connect to the specified MongoDB server.

Creating the client does not necessarily establish a network connection immediately.

#### Connecting to the server

```javascript
await client.connect();
```

This establishes the connection to MongoDB.

#### Selecting the database

```javascript
const db = client.db();
```

Because `storageApp` is specified in the URI, calling `client.db()` without an argument selects that database.

#### Handling `SIGINT`

```javascript
process.on("SIGINT", async () => {
  // Close the client
});
```

`SIGINT` is commonly generated when the user presses `Ctrl + C` in the terminal.

Closing the client helps release network resources.

For production applications, connection lifecycle management should also account for startup failures and graceful shutdown signals such as `SIGTERM`.

---

## 6. Creating Collections With Schema Validation

MongoDB's `create` command creates a collection and can define its validator at the same time.

Example:

```javascript
await db.command({
  create: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email"],
      properties: {
        name: {
          bsonType: "string",
          minLength: 3,
        },
        email: {
          bsonType: "string",
          pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        },
      },
      additionalProperties: false,
    },
  },
  validationAction: "error",
  validationLevel: "strict",
});
```

### Important characteristics of `create`

- Creates a new collection.
- Can define validation rules during collection creation.
- Fails if the collection already exists.
- Does not automatically migrate or copy existing data from another server.

Use `create` when initializing a collection that does not yet exist.

---

## 7. Modifying Existing Collections With `collMod`

MongoDB provides the `collMod` command to modify properties of an existing collection, including its validator.

Example:

```javascript
await db.command({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email"],
      properties: {
        name: {
          bsonType: "string",
          minLength: 3,
        },
        email: {
          bsonType: "string",
          pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        },
      },
      additionalProperties: false,
    },
  },
  validationAction: "error",
  validationLevel: "strict",
});
```

### Important characteristics of `collMod`

- Requires the target collection to exist.
- Can update the collection's validator.
- Does not create a missing collection.
- Does not automatically repair documents that already violate the new rules.

If the collection does not exist, MongoDB may return an error similar to:

```text
MongoServerError: namespace does not exist: storageApp.users
codeName: 'NamespaceNotFound'
```

This indicates that the specified collection namespace was not found on the server being queried.

Possible causes include a missing collection, the wrong database, or a connection to a different MongoDB instance.

### `create` vs. `collMod`

| Feature                                 | `create`        | `collMod` |
| --------------------------------------- | --------------- | --------- |
| Creates a new collection                | Yes             | No        |
| Modifies an existing validator          | Not its purpose | Yes       |
| Requires collection to exist beforehand | No              | Yes       |
| Can define a validator                  | Yes             | Yes       |
| Copies data from another server         | No              | No        |

---

## 8. Schema Validation for the Storage App

The storage application uses three collections: `users`, `directories`, and `files`.

### Users collection

The `users` collection stores account information and the identifier of each user's root directory.

Required fields:

- `_id`
- `name`
- `email`
- `password`
- `rootDirId`

Validation rules:

- `_id` must be an ObjectId.
- `name` must be a string with at least three characters.
- `email` must be a string matching a basic email-format pattern.
- `password` must be a string with at least four characters.
- `rootDirId` must be an ObjectId.

### Directories collection

The `directories` collection stores directory metadata.

Required fields:

- `_id`
- `name`
- `userId`
- `parentDirId`

Validation rules:

- `_id` must be an ObjectId.
- `name` must be a string.
- `userId` must be an ObjectId.
- `parentDirId` can be an ObjectId or `null`.

The `parentDirId` field can be `null` for a root directory that has no parent.

### Files collection

The `files` collection stores file metadata.

Required fields:

- `_id`
- `name`
- `extension`
- `userId`
- `parentDirId`

Validation rules:

- `_id` must be an ObjectId.
- `name` must be a string.
- `extension` must be a string.
- `userId` must be an ObjectId.
- `parentDirId` must be an ObjectId.

These rules validate the structure of file metadata, not the contents of the actual files stored on disk.

---

## 9. Implementing the Setup Script

Create a file named `config/setup.js`.

The following script is suitable for a fresh database where the three collections do not yet exist.

```javascript
import { connectDB, client } from "./db.js";

const db = await connectDB();

try {
  const collections = [
    {
      name: "users",
      required: ["_id", "name", "email", "password", "rootDirId"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string", minLength: 3 },
        email: {
          bsonType: "string",
          pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        },
        password: { bsonType: "string", minLength: 4 },
        rootDirId: { bsonType: "objectId" },
      },
    },
    {
      name: "directories",
      required: ["_id", "name", "userId", "parentDirId"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        userId: { bsonType: "objectId" },
        parentDirId: { bsonType: ["objectId", "null"] },
      },
    },
    {
      name: "files",
      required: ["_id", "name", "extension", "userId", "parentDirId"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        extension: { bsonType: "string" },
        userId: { bsonType: "objectId" },
        parentDirId: { bsonType: "objectId" },
      },
    },
  ];

  const existing = new Set(
    (await db.listCollections().toArray()).map((collection) => collection.name),
  );

  for (const collection of collections) {
    const validator = {
      $jsonSchema: {
        bsonType: "object",
        required: collection.required,
        properties: collection.properties,
        additionalProperties: false,
      },
    };

    if (existing.has(collection.name)) {
      await db.command({
        collMod: collection.name,
        validator,
        validationAction: "error",
        validationLevel: "strict",
      });

      console.log(`Updated validation: ${collection.name}`);
    } else {
      await db.command({
        create: collection.name,
        validator,
        validationAction: "error",
        validationLevel: "strict",
      });

      console.log(`Created collection: ${collection.name}`);
    }
  }

  console.log("Schema setup completed successfully.");
} finally {
  await client.close();
}
```

### How this script works

1. Connects to the database selected by the connection URI.
2. Retrieves the existing collection names.
3. Defines the validation rules for all three collections.
4. Checks whether each collection exists.
5. Creates missing collections with their validators.
6. Updates validators on collections that already exist.
7. Closes the MongoDB client, including when an operation fails.

This makes the setup script reusable across fresh and existing databases, provided the target database and permissions are correct.

**Important:** Because the script uses `additionalProperties: false`, it assumes that only the declared fields are permitted. If the application has other legitimate fields, add them to the schema before applying the validator.

Also, the script's required `_id` field is explicit. MongoDB normally generates `_id` automatically for inserted documents that omit it, so including `_id` in `required` may be unnecessary for most applications.

---

## 10. Understanding `validationAction` and `validationLevel`

### `validationAction`

This property determines what MongoDB does when a document violates validation rules.

#### `error`

```javascript
validationAction: "error";
```

Rejects inserts or updates that violate the validator.

#### `warn`

```javascript
validationAction: "warn";
```

Allows the write but logs a validation warning.

Use `error` when you want invalid documents to be rejected.

### `validationLevel`

This property controls which inserts and updates are subject to validation.

#### `strict`

```javascript
validationLevel: "strict";
```

Applies validation to all inserts and updates.

#### `moderate`

```javascript
validationLevel: "moderate";
```

Applies validation to inserts and updates of documents that already satisfy the validator, while allowing updates to existing invalid documents without requiring them to become valid.

#### `off`

```javascript
validationLevel: "off";
```

Disables validation for the collection.

For most applications, `strict` combined with `error` is a good choice when the existing data already follows the intended schema.

---

## 11. Testing Schema Validation

After configuring the validator, test it by inserting valid and invalid documents.

### Valid document

```javascript
db.users.insertOne({
  name: "Sharvil",
  email: "sharvil@example.com",
  password: "hashedPassword123",
  rootDirId: ObjectId(),
});
```

This document satisfies the example schema's field types and minimum string lengths.

### Invalid document: missing required fields

```javascript
db.users.insertOne({
  name: "Sharvil",
});
```

This fails because required fields such as `email`, `password`, and `rootDirId` are missing.

### Invalid document: incorrect data type

```javascript
db.users.insertOne({
  name: 123,
  email: "sharvil@example.com",
  password: "hashedPassword123",
  rootDirId: ObjectId(),
});
```

This fails because `name` must be a string.

### Invalid document: incorrect email format

```javascript
db.users.insertOne({
  name: "Sharvil",
  email: "invalid-email",
  password: "hashedPassword123",
  rootDirId: ObjectId(),
});
```

This fails the basic email-format pattern.

### Invalid document: undeclared field

```javascript
db.users.insertOne({
  name: "Sharvil",
  email: "sharvil@example.com",
  password: "hashedPassword123",
  rootDirId: ObjectId(),
  age: 22,
});
```

This fails because `age` is not declared in `properties` and `additionalProperties` is `false`.

---

## 12. Viewing Collection Validation Rules

You can inspect a collection's options through `mongosh`.

```javascript
db.getCollectionInfos({ name: "users" });
```

To inspect validation information through the Node.js driver:

```javascript
const collections = await db.listCollections({ name: "users" }).toArray();

console.dir(collections, { depth: null });
```

You can also use MongoDB Compass to inspect collection options and manage validation rules.

---

## 13. Common Errors and Solutions

### Error: `NamespaceNotFound`

Example:

```text
MongoServerError: namespace does not exist: storageApp.users
```

**Cause:** The collection does not exist on the connected server in the selected database.

**Solution:**

- Verify the connection URI.
- Check the selected database.
- Run `db.getCollectionNames()` in `mongosh`.
- Create the collection before applying `collMod`.

### Error: collection already exists

Example:

```text
MongoServerError: Collection already exists
```

**Cause:** The `create` command was run against a collection that already exists.

**Solution:** Use `collMod` to modify its validator, or make the setup script check for collection existence first.

### Error: document fails validation

**Cause:** The inserted or updated document violates one or more schema rules.

**Solution:**

- Check the required fields.
- Check BSON data types.
- Check string lengths and patterns.
- Check whether additional fields are permitted.
- Inspect the complete MongoDB error response.

### Error: validation rejects existing data after a schema change

Changing a validator does not automatically rewrite existing documents.

**Solution:** Audit existing documents and migrate or repair invalid data where necessary. New validation rules can also affect subsequent updates depending on the validation level and whether the resulting document satisfies the validator.

---

## 14. Creating a Database on Another MongoDB Server

A database is associated with the MongoDB server to which the client connects.

Suppose the Windows service runs on port `27017` and a separate MongoDB instance runs on port `27018`.

To connect to the second instance:

```javascript
const client = new MongoClient("mongodb://127.0.0.1:27018/storageApp");
```

Running your schema setup script with this connection URI applies the configuration to the second server.

However, **this does not copy documents or collections from the first server**.

If you need to migrate data, use tools such as `mongodump` and `mongorestore`, or another appropriate data migration process. Schema setup scripts are useful for recreating collection definitions and validation rules independently of the data.

In production, use a dedicated migration or deployment process rather than relying on manually started database instances.

---

## 15. Best Practices

1. Keep schema definitions and setup scripts in version control.
2. Use `create` for new collections and `collMod` for existing collections.
3. Make setup scripts safe to rerun by checking collection existence.
4. Use strict validation with the `error` action when appropriate.
5. Test validation rules with both valid and invalid documents.
6. Keep validators aligned with the fields actually used by the application.
7. Avoid `additionalProperties: false` unless all permitted fields are declared.
8. Validate user input in the application as well as at the database level.
9. Never store plain-text passwords; store appropriately hashed passwords.
10. Use environment variables or secure configuration for database connection strings.
11. Close MongoDB clients gracefully.
12. Verify the target host, port, database, and data directory before modifying a database.
13. Back up important data before making significant schema or data changes.
14. Use appropriate database permissions for schema administration.
15. Do not expose MongoDB directly to the public internet without appropriate authentication and network security.

---

## Conclusion

MongoDB schema validation helps maintain data consistency in flexible document-oriented databases.

In this storage application, `$jsonSchema` defines validation rules for the `users`, `directories`, and `files` collections. The `create` command creates collections with validators, while `collMod` updates validation rules on existing collections.

A reusable Node.js setup script can apply the same rules across different MongoDB instances. However, each script operates only on the server specified by its connection URI; it does not automatically transfer data between servers.

Understanding the difference between MongoDB server instances, database connections, collection creation, schema validation, and data migration is essential when building reliable Node.js applications.

## Key Takeaways

- MongoDB supports schema validation through `$jsonSchema`.
- `bsonType` defines the expected BSON type.
- `required` specifies mandatory fields.
- `minLength` and `pattern` provide additional string constraints.
- `additionalProperties: false` rejects undeclared fields.
- `create` creates a new collection with optional validation rules.
- `collMod` modifies an existing collection's configuration.
- `validationAction: "error"` rejects invalid writes.
- `validationLevel: "strict"` applies validation to all inserts and updates.
- Separate MongoDB instances can contain different data.
- Changing a connection URI targets a different server; it does not copy a database.
- Version-controlled setup scripts make database configuration reproducible.
