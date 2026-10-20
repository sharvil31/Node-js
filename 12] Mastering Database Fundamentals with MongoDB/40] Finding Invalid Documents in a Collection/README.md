# Finding Invalid Documents in a Collection in MongoDB

## 1. Introduction

MongoDB allows us to define validation rules for documents in a collection. These rules help ensure that documents follow a specific structure and contain valid data.

However, a collection might already contain invalid documents before a validator is added. Adding a validator does not automatically validate, repair, or remove all existing documents.

MongoDB provides ways to query documents that do not satisfy a specified JSON Schema.

In this guide, we will learn how to:

- Retrieve a collection's validation schema.
- Find documents that do not satisfy the schema.
- Understand the `$jsonSchema` operator.
- Understand the `$nor` operator.
- Distinguish schema validation from collection integrity validation.

---

## 2. What Are Invalid Documents?

Invalid documents are documents that do not satisfy the validation rules defined for a collection.

For example, suppose a `users` collection has the following rules:

- `name` must be a string.
- `age` must be an integer.
- `age` must be between 18 and 80.
- Both `name` and `age` are required.

The following document is valid:

```javascript
{
  name: "Amit",
  age: 25
}
```

The following documents are invalid:

```javascript
{
  name: "Rahul",
  age: 90
}
```

The age exceeds the maximum allowed value.

```javascript
{
  name: 123,
  age: 25
}
```

The name is not a string.

```javascript
{
  name: "Priya";
}
```

The required `age` field is missing.

Finding invalid documents is useful when auditing existing data, migrating databases, or introducing new validation rules.

---

## 3. Example JSON Schema Validator

Before finding invalid documents, we need a collection with a JSON Schema validator.

The following example creates a `users` collection with validation rules.

```javascript
import { MongoClient, Int32 } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

try {
  await client.connect();

  const db = client.db();
  const schema = {
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
  };

  await db.createCollection("users", {
    validator: {
      $jsonSchema: schema,
    },
  });

  const collection = db.collection("users");

  await collection.insertOne({
    name: "Amit",
    age: new Int32(25),
  });

  console.log("Collection created and valid document inserted.");
} catch (error) {
  console.error(error);
} finally {
  await client.close();
}
```

**Important:** Run this example only if the `users` collection does not already exist. If it exists, configure its validator using `collMod` instead of creating it again.

The `Int32` class ensures that `age` is stored as a BSON 32-bit integer, matching `bsonType: "int"`.

---

## 4. Retrieve the Collection's Validation Schema

MongoDB stores collection options, including the validator, in its collection metadata.

In the Node.js MongoDB driver, use `listCollections()` to retrieve this information.

```javascript
const collectionInfo = await db.listCollections({ name: "users" }).toArray();

console.log(collectionInfo);
```

The returned information includes collection options. If a JSON Schema validator is configured, it may look like this:

```javascript
{
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age"],
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
    }
  }
}
```

We can extract the schema with:

```javascript
const schema = collectionInfo[0].options.validator.$jsonSchema;

console.log(schema);
```

A safer version checks whether the collection and validator exist:

```javascript
if (collectionInfo.length === 0) {
  throw new Error("Collection does not exist.");
}

const schema = collectionInfo[0].options?.validator?.$jsonSchema;

if (!schema) {
  throw new Error("No JSON Schema validator found.");
}
```

**Note:** `getCollectionInfos()` is a MongoDB Shell helper, not a method available on the Node.js driver's `Db` object. In a Node.js application, use `db.listCollections()`.

---

## 5. Understanding the `$jsonSchema` Operator

The `$jsonSchema` query operator matches documents that satisfy the specified JSON Schema.

Example:

```javascript
const validDocs = await collection
  .find({
    $jsonSchema: schema,
  })
  .toArray();

console.log(validDocs);
```

This query returns documents that match the schema.

If the schema requires a string `name` and an integer `age` between 18 and 80, documents that satisfy those rules will match.

Documents that fail those rules will not match.

---

## 6. Understanding the `$nor` Operator

The `$nor` operator selects documents that fail to match **all** the query expressions inside its array.

For example:

```javascript
const result = await collection
  .find({
    $nor: [{ age: { $lt: 18 } }, { age: { $gt: 80 } }],
  })
  .toArray();
```

This query returns documents that do not match either of the specified conditions.

For invalid-document detection, we can combine `$nor` with `$jsonSchema`.

```javascript
const invalidDocs = await collection
  .find({
    $nor: [
      {
        $jsonSchema: schema,
      },
    ],
  })
  .toArray();
```

Here is the logic:

1. `$jsonSchema` matches documents that satisfy the schema.
2. `$nor` negates that match.
3. The resulting query returns documents that do not satisfy the schema.

This lets us find documents that violate the rules described by the specified schema.

---

## 7. Complete Node.js Example

The following code retrieves the existing schema and finds invalid documents.

```javascript
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

try {
  await client.connect();

  const db = client.db();
  const collection = db.collection("users");

  // Retrieve collection metadata
  const collectionInfo = await db.listCollections({ name: "users" }).toArray();

  // Check whether the collection exists
  if (collectionInfo.length === 0) {
    throw new Error("The users collection does not exist.");
  }

  // Retrieve the JSON Schema validator
  const schema = collectionInfo[0].options?.validator?.$jsonSchema;

  if (!schema) {
    throw new Error("No JSON Schema validator found for the users collection.");
  }

  console.log("Validation schema:", schema);

  // Find documents that fail the JSON Schema
  const invalidDocs = await collection
    .find({
      $nor: [
        {
          $jsonSchema: schema,
        },
      ],
    })
    .toArray();

  console.log("Invalid documents:", invalidDocs);
} catch (error) {
  console.error("Error:", error);
} finally {
  await client.close();
}
```

### How the code works

1. Connects to the MongoDB server.
2. Selects the database and `users` collection.
3. Retrieves the collection metadata using `listCollections()`.
4. Extracts the `$jsonSchema` validator.
5. Uses `$nor` to find documents that do not satisfy the schema.
6. Prints the invalid documents.
7. Closes the database connection, including when an error occurs.

**Database selection:** `client.db()` uses the default database from the connection URI, or `test` if no database is specified. If your collection is in another database, specify it explicitly:

```javascript
const db = client.db("storageApp");
```

---

## 8. Example Results

Suppose the collection contains these documents:

```javascript
[
  { name: "Amit", age: 25 },
  { name: "Rahul", age: 90 },
  { name: 123, age: 30 },
  { name: "Priya" },
];
```

Assuming the schema requires `name` to be a string and `age` to be an integer between 18 and 80, with both fields required, the invalid-document query identifies the documents with:

```javascript
[{ name: "Rahul", age: 90 }, { name: 123, age: 30 }, { name: "Priya" }];
```

The first document is valid, so it is excluded from the result.

**Note:** With a strict validator, MongoDB may reject invalid inserts or updates before such documents can be stored. These examples are useful for existing invalid data, data imported without validation, or collections whose validation settings previously allowed invalid writes.

---

## 9. Finding Invalid Documents When the Validator Is More Complex

The previous approach extracts only the `$jsonSchema` portion of the validator.

For example, a collection validator might contain both JSON Schema and an additional query expression:

```javascript
{
  $and: [
    {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "age"],
        properties: {
          name: { bsonType: "string" },
          age: { bsonType: "int", minimum: 18 },
        },
      },
    },
    {
      age: { $lte: 80 },
    },
  ];
}
```

In this case, extracting only `validator.$jsonSchema` ignores the additional `age: { $lte: 80 }` condition.

Therefore, the query shown earlier checks only the JSON Schema rules. It does not automatically check every condition in a complex validator.

For a validator containing multiple conditions, build a query that accurately represents the complete validation logic and find documents that fail it.

---

## 10. `$jsonSchema` vs. `validate` Command

MongoDB also provides a `validate` command, but it serves a different purpose.

### Finding schema-invalid documents

```javascript
const invalidDocs = await collection
  .find({
    $nor: [{ $jsonSchema: schema }],
  })
  .toArray();
```

This query finds documents that fail the specified JSON Schema.

### Checking collection integrity

```javascript
const result = await db.command({
  validate: "users",
});

console.log(result);
```

The `validate` command checks the collection's internal consistency, including aspects of its data and indexes.

It is **not** a query for identifying documents that violate a JSON Schema validator.

| Feature                    | `$nor` + `$jsonSchema`            | `validate` command                                  |
| -------------------------- | --------------------------------- | --------------------------------------------------- |
| Main purpose               | Find documents that fail a schema | Check collection integrity                          |
| Returns matching documents | Yes                               | No; returns a validation report                     |
| Checks schema rules        | Yes, for the supplied schema      | Not as a query to identify schema-invalid documents |
| Modifies documents         | No                                | No                                                  |

---

## 11. Important Points to Remember

- A collection validator does not automatically repair existing documents.
- `$jsonSchema` matches documents that satisfy a JSON Schema.
- `$nor` can negate that match to identify documents that fail the schema.
- `db.listCollections()` retrieves collection metadata in the Node.js driver.
- `db.getCollectionInfos()` is a MongoDB Shell helper, not a Node.js driver's `Db` method.
- `collectionInfo[0]` should be checked before accessing its options.
- A validator may contain rules beyond `$jsonSchema`; extracting the schema alone does not check those additional rules.
- `db.command({ validate: "users" })` checks collection integrity rather than finding schema-invalid documents.
- Finding invalid documents does not repair or delete them.

---

## 12. Conclusion

Finding invalid documents is an important part of MongoDB data validation and database maintenance.

By retrieving a collection's JSON Schema and combining `$jsonSchema` with `$nor`, we can identify documents that fail the specified validation rules. This is particularly useful when reviewing existing data before enforcing stricter validation.

Once the invalid documents are identified, we can inspect and correct them before relying on the schema to maintain data quality.
