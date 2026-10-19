# Adding Basic Schema Validation in MongoDB

## 1. What Is Schema Validation?

Schema validation in MongoDB allows us to define rules that documents must follow before they can be inserted into or updated in a collection.

These rules help maintain data consistency by ensuring that fields contain the expected data types and values.

For example, in a `users` collection, we might require:

- `name` must be a string.
- `age` must be an integer.
- `age` must be between 18 and 80.

Without validation, MongoDB allows documents with different structures to exist in the same collection. Schema validation helps prevent invalid documents from being stored.

## 2. Why Do We Need Schema Validation?

Consider these documents in a `users` collection:

```javascript
{ name: "Sarvesh", age: 25 }
{ name: "Rahul", age: "twenty" }
{ name: 123, age: 25 }
{ name: "Amit", age: 90 }
```

Without appropriate validation, MongoDB can accept all these documents.

However, the last three documents violate our intended data structure:

- The second document has `age` as a string instead of an integer.
- The third document has `name` as a number instead of a string.
- The fourth document has an age outside the permitted range.

Schema validation allows us to enforce these requirements at the database level.

## 3. Importing MongoDB Classes

```javascript
import { MongoClient, ObjectId } from "mongodb";
```

- `MongoClient` is used to establish a connection to MongoDB.
- `ObjectId` is used to create or work with MongoDB document identifiers.

In this example, `ObjectId` is not required because the code does not use it.

We can simplify the import:

```javascript
import { MongoClient } from "mongodb";
```

## 4. Connecting to MongoDB

```javascript
const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();
```

Here:

- `127.0.0.1` refers to the local computer.
- `27017` is MongoDB's default port.
- `MongoClient` creates a client instance.
- `connect()` establishes the connection to the MongoDB server.

The `await` keyword ensures that the connection is established before the subsequent operations execute.

### Selecting a Database

```javascript
const db = client.db();
```

When `client.db()` is called without a database name, the driver uses the database specified in the connection string, if any. Otherwise, it uses the driver's default database name, which is `test`.

For example:

```javascript
const client = new MongoClient("mongodb://127.0.0.1:27017");

const db = client.db();
```

The code above uses the default database, `test`.

We can explicitly select a database by passing its name to `client.db()`:

```javascript
const db = client.db("storageApp");
```

Alternatively, the database can be specified in the connection string:

```javascript
const client = new MongoClient("mongodb://127.0.0.1:27017/storageApp");

const db = client.db();
```

Other examples:

```javascript
// Select the admin database
const adminDB = client.db("admin");

// Select the newDB database
const newDB = client.db("newDB");
```

**Important:** Creating a database object does not necessarily create the database on the server. MongoDB generally creates the database when data is first stored in it.

## 5. Selecting a Collection

```javascript
const collection = db.collection("users");
```

This obtains a reference to the `users` collection in the selected database.

If the collection does not exist, obtaining this reference does not automatically create it.

A collection can be created explicitly using:

```javascript
await db.createCollection("users");
```

Or it may be created automatically when a document is first inserted.

## 6. Adding Schema Validation Using `collMod`

The following code adds validation rules to an existing collection:

```javascript
await db.command({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age"],
      properties: {
        name: {
          bsonType: "string",
        },
        age: {
          bsonType: "int",
          minimum: 18,
          maximum: 80,
        },
      },
    },
  },
});
```

Let's understand each part.

### `db.command()`

```javascript
await db.command({
  // MongoDB command
});
```

The `db.command()` method executes a database command directly on MongoDB.

In this example, it is used to modify the validation settings of an existing collection.

### `collMod`

```javascript
collMod: "users";
```

`collMod` stands for **collection modification**.

It modifies the configuration of an existing collection, including its validator.

For example:

```javascript
await db.command({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        name: {
          bsonType: "string",
        },
      },
    },
  },
});
```

This adds a validator to the existing `users` collection.

**Important:** `collMod` requires the collection to exist already. If `users` does not exist, create it first.

### `validator`

```javascript
validator: {
  // Validation rules
}
```

The `validator` option defines the conditions that documents must satisfy.

MongoDB evaluates these conditions when documents are inserted or updated.

By default, validation failures reject the write operation.

### Using `$jsonSchema`

```javascript
validator: {
  $jsonSchema: {
    // Schema rules
  }
}
```

`$jsonSchema` allows us to define document structure and validation requirements using JSON Schema-inspired rules.

It supports constraints such as:

- BSON data types.
- Required fields.
- Minimum and maximum numeric values.
- String length restrictions.
- Nested document validation.
- Array validation.

### `bsonType`

```javascript
name: {
  bsonType: "string";
}
```

`bsonType` specifies the BSON data type that a field must have.

MongoDB uses BSON, a binary representation of JSON-like documents.

Common BSON types include:

| BSON type  | Example                              |
| ---------- | ------------------------------------ |
| `string`   | `"Sarvesh"`                          |
| `int`      | `25` stored as a BSON 32-bit integer |
| `long`     | A BSON 64-bit integer                |
| `double`   | `25.5`                               |
| `decimal`  | `Decimal128("25.50")`                |
| `bool`     | `true`                               |
| `objectId` | `ObjectId("...")`                    |
| `date`     | `new Date()`                         |
| `array`    | `["React", "Node.js"]`               |
| `object`   | `{ city: "Mumbai" }`                 |
| `null`     | `null`                               |

**Important:** JavaScript numbers are not all BSON integers. For example, a JavaScript number may be serialized as a BSON `double` rather than a BSON `int`. When testing an `int` validator, use a value that the MongoDB Node.js driver serializes as BSON `int`, or use an explicit BSON `Int32` value.

### `required`

```javascript
required: ["name", "age"];
```

The `required` array specifies fields that must be present in every document.

For example:

```javascript
{
  name: "Sarvesh",
  age: 25
}
```

This satisfies the required-field rule.

However:

```javascript
{
  name: "Sarvesh";
}
```

This fails validation because `age` is missing.

**Important:** A field being required does not automatically guarantee its data type. The `properties` rules specify the expected type separately.

### `properties`

```javascript
properties: {
  name: {
    bsonType: "string"
  },
  age: {
    bsonType: "int",
    minimum: 18,
    maximum: 80
  }
}
```

The `properties` object defines validation rules for individual fields.

Here:

- `name` must be a string.
- `age` must be an integer.
- `age` must be at least 18.
- `age` must not exceed 80.

### `minimum` and `maximum`

```javascript
age: {
  bsonType: "int",
  minimum: 18,
  maximum: 80
}
```

These numeric constraints define the permitted range.

| Age | Result   |
| --: | -------- |
|  17 | Rejected |
|  18 | Accepted |
|  25 | Accepted |
|  80 | Accepted |
|  81 | Rejected |

The minimum and maximum values are inclusive.

**Note:** In the `$jsonSchema` syntax, use `minimum` and `maximum` for numeric bounds. The `$gte` and `$lte` operators belong to MongoDB query expressions and should not be used as numeric constraints inside a JSON Schema property.

## 7. Understanding the Original Validator

Your original code contains:

```javascript
await db.command({
  collMod: "users",
  validator: {
    name: {
      $type: "string",
    },
    age: {
      $type: "int",
      $gte: 18,
      $lte: 80,
    },
  },
});
```

This is not the correct way to express the intended field rules in a collection validator.

The `validator` option expects a MongoDB query expression. A field-level `$type` query expression can be valid in that context, but the object shown above places `$type`, `$gte`, and `$lte` together as ordinary field properties rather than composing them as valid query predicates.

Use `$jsonSchema` for structured schema validation, or use a valid MongoDB query expression.

The JSON Schema approach is clearer for defining field types, required fields, and numeric ranges.

## 8. Reading Collection Validation Options

Your code includes:

```javascript
const collections = await db.listCollections().toArray();

console.log(collections[0].options);
```

### `listCollections()`

```javascript
db.listCollections();
```

Returns a cursor describing the collections in the selected database.

### `toArray()`

```javascript
await db.listCollections().toArray();
```

Converts the cursor results into a JavaScript array.

### `options`

```javascript
console.log(collections[0].options);
```

The `options` property contains the configuration of the selected collection, which may include its validator.

However, `collections[0]` is not guaranteed to be `users`. It refers to whichever collection happens to appear first in the returned array.

A safer approach is:

```javascript
const collections = await db.listCollections({ name: "users" }).toArray();

console.log(collections[0]?.options);
```

This filters the result to the `users` collection.

The output can contain the validator configuration, including the `$jsonSchema` rules.

## 9. Testing Schema Validation

After applying the validator, try inserting valid and invalid documents.

### Valid document

```javascript
await collection.insertOne({
  name: "Sarvesh",
  age: 25,
});
```

If the document satisfies all validation rules, MongoDB accepts it.

### Invalid age

```javascript
await collection.insertOne({
  name: "Sarvesh",
  age: 90,
});
```

This document fails because `age` exceeds the maximum of 80.

MongoDB normally throws a write error with code `121`, `DocumentValidationFailure`.

### Invalid name

```javascript
await collection.insertOne({
  name: 123,
  age: 25,
});
```

This document fails because `name` must be a string.

### Missing required field

```javascript
await collection.insertOne({
  name: "Sarvesh",
});
```

This document fails because the `age` field is required.

### Catching validation errors

```javascript
try {
  await collection.insertOne({
    name: "Sarvesh",
    age: 90,
  });
} catch (error) {
  console.log(error);
}
```

The `try...catch` block handles the error produced by MongoDB when the document fails validation.

This prevents the expected validation error from terminating the remaining application logic unexpectedly.

## 10. Complete Working Example

The following example creates the collection if necessary, applies schema validation, tests an invalid insert, and closes the database connection.

```javascript
import { MongoClient, Int32 } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

try {
  await client.connect();

  const db = client.db("storageApp");

  // Create the collection if it does not exist.
  const existingCollection = await db
    .listCollections({ name: "users" })
    .toArray();

  if (existingCollection.length === 0) {
    await db.createCollection("users");
  }

  const collection = db.collection("users");

  // Add schema validation.
  await db.command({
    collMod: "users",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "age"],
        properties: {
          name: {
            bsonType: "string",
          },
          age: {
            bsonType: "int",
            minimum: 18,
            maximum: 80,
          },
        },
      },
    },
    validationLevel: "strict",
    validationAction: "error",
  });

  // Valid document.
  await collection.insertOne({
    name: "Sarvesh",
    age: new Int32(25),
  });

  console.log("Valid document inserted successfully.");

  // Invalid document.
  try {
    await collection.insertOne({
      name: "Sarvesh",
      age: new Int32(90),
    });
  } catch (error) {
    console.log("Validation failed:", error.message);
  }

  // Inspect collection options.
  const collections = await db.listCollections({ name: "users" }).toArray();

  console.dir(collections[0]?.options, {
    depth: null,
  });
} catch (error) {
  console.error("Database error:", error);
} finally {
  await client.close();
}
```

### Why use `Int32`?

```javascript
import { Int32 } from "mongodb";

age: new Int32(25);
```

This explicitly represents the age as a BSON 32-bit integer. It is useful when testing a strict `bsonType: "int"` validator.

In applications where the input is a JavaScript number, validate and convert it appropriately before inserting it into MongoDB.

## 11. `validationLevel`

MongoDB supports different validation levels.

### `strict`

```javascript
validationLevel: "strict";
```

Applies validation to all inserts and updates.

This is the default validation level.

### `moderate`

```javascript
validationLevel: "moderate";
```

Applies validation to inserts and updates for documents that already satisfy the validator. Existing documents that do not satisfy the validator can be updated without being required to pass the validator.

This can be useful when introducing validation into a collection that contains older, nonconforming documents.

### `off`

```javascript
validationLevel: "off";
```

Disables validation for the collection.

Use this only when disabling validation is intentional.

## 12. `validationAction`

The `validationAction` option determines what MongoDB does when a document fails validation.

### `error`

```javascript
validationAction: "error";
```

Rejects writes that fail validation. This is the default action.

### `warn`

```javascript
validationAction: "warn";
```

Allows the write but logs a warning when validation fails.

This can be useful when introducing new validation rules and checking whether existing application behavior violates them.

## 13. Updating Documents With Schema Validation

Validation applies to updates as well as inserts.

Suppose the following document already exists:

```javascript
{
  name: "Sarvesh",
  age: 25
}
```

Attempting to update the age to 90 will fail under strict validation:

```javascript
await collection.updateOne(
  { name: "Sarvesh" },
  { $set: { age: new Int32(90) } },
);
```

MongoDB rejects the update because the resulting document violates the age constraint.

A valid update succeeds:

```javascript
await collection.updateOne(
  { name: "Sarvesh" },
  { $set: { age: new Int32(30) } },
);
```

The resulting document satisfies the schema.

## 14. Does Schema Validation Apply to Existing Documents?

Adding a validator does not automatically scan and repair existing documents.

Documents already stored in the collection may violate the new rules.

However, with the default `validationLevel: "strict"` and `validationAction: "error"`, subsequent updates to existing documents must satisfy the validation rules.

An existing invalid document can be corrected by updating it to a valid state.

For large collections, review existing data before enabling strict validation to avoid unexpected write failures.

## 15. Can Validation Be Bypassed?

MongoDB supports the `bypassDocumentValidation` option for certain write operations when the executing user has the necessary permissions.

For example:

```javascript
await collection.insertOne(
  {
    name: "Sarvesh",
    age: new Int32(90),
  },
  {
    bypassDocumentValidation: true,
  },
);
```

This allows the operation to bypass the document validator when permitted.

Use this feature cautiously because it can introduce invalid data into the collection.

## 16. Important Points to Remember

1. Schema validation enforces data rules at the database level.
2. Use `collMod` to modify validation settings on an existing collection.
3. Use `$jsonSchema` to define field types and structured validation rules.
4. Use `bsonType` to specify expected BSON types.
5. Use `required` to ensure that specific fields exist.
6. Use `minimum` and `maximum` for numeric bounds inside `$jsonSchema`.
7. Validation is applied to inserts and updates.
8. Existing documents are not automatically repaired when a validator is added.
9. `validationLevel` controls when validation is applied.
10. `validationAction` controls whether invalid writes are rejected or allowed with a warning.
11. `listCollections()` and `options` can help inspect a collection's configuration.
12. Use `try...catch` to handle expected validation errors in Node.js.
13. The MongoDB driver may serialize ordinary JavaScript numbers as different BSON numeric types, so strict type validation should be tested carefully.

## 17. Summary

Schema validation in MongoDB helps maintain consistent and reliable data by defining rules for documents stored in a collection.

For example, a `users` collection can require every document to contain a string `name` and an integer `age` between 18 and 80.

The `collMod` command updates the collection's validator, while `$jsonSchema` provides a readable way to define the required fields, BSON types, and value constraints.

Schema validation is especially useful in applications where the database must protect data integrity even when different parts of an application attempt to write data.
