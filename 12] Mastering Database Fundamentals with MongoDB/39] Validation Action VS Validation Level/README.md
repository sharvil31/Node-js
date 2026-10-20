# Validation Action vs Validation Level in MongoDB

## 1. Introduction

MongoDB provides schema validation to ensure that documents follow specific rules before they are inserted into or updated in a collection.

Two important options control how validation works:

- `validationLevel`
- `validationAction`

Although their names are similar, they serve different purposes.

**`validationLevel` determines WHEN validation is applied.**

**`validationAction` determines WHAT HAPPENS when validation fails.**

Both options can be configured when creating a collection or modifying an existing collection.

---

## 2. What Is `validationLevel`?

The `validationLevel` option determines which documents MongoDB validates during insert and update operations.

MongoDB supports three validation levels:

1. `strict`
2. `moderate`
3. `off`

### A. `strict`

`strict` is the default validation level.

MongoDB applies the validator to all inserts and updates.

Example:

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
  validationLevel: "strict",
});
```

Suppose we try to insert:

```javascript
{
  name: "Rahul",
  age: 90
}
```

MongoDB rejects the document because `age` exceeds the permitted maximum.

The same rule applies to updates that produce an invalid document.

**Use case:** When all documents must comply with the collection's validation rules.

### B. `moderate`

The `moderate` validation level behaves differently for documents that already violate the validator.

- New documents must satisfy validation.
- Updates to documents that currently satisfy validation must continue to satisfy it.
- Existing documents that already violate validation can be updated without being required to satisfy the validator.

Example:

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
  validationLevel: "moderate",
});
```

Suppose the collection contains these documents:

```javascript
// Document A: Valid
{
  _id: 1,
  name: "Rahul",
  age: 25
}

// Document B: Invalid under the validator
{
  _id: 2,
  name: "Amit",
  age: 90
}
```

Now consider updating each document.

**Updating Document A:**

```javascript
await collection.updateOne({ _id: 1 }, { $set: { age: new Int32(30) } });
```

This update succeeds because the resulting document satisfies the validator.

However, attempting to change Rahul's age to `90` would fail because Document A currently satisfies the validator.

**Updating Document B:**

```javascript
await collection.updateOne({ _id: 2 }, { $set: { age: new Int32(95) } });
```

Under `moderate`, this update is not required to pass the validator because Document B already violates it.

The update can succeed even though the resulting document remains invalid.

**Use case:** When introducing new validation rules into a collection that already contains legacy or inconsistent data.

### C. `off`

The `off` validation level disables validation for the collection.

Example:

```javascript
await db.command({
  collMod: "users",
  validationLevel: "off",
});
```

With validation disabled, MongoDB does not apply the collection's validator to inserts and updates.

For example, the following document can be inserted despite the age rule:

```javascript
await collection.insertOne({
  name: "Rahul",
  age: new Int32(90),
});
```

This assumes there are no other constraints preventing the write.

**Use case:** Temporary maintenance or migration operations where validation must intentionally be disabled.

Disabling validation should be done cautiously because invalid data can enter the collection.

---

## 3. What Is `validationAction`?

The `validationAction` option determines how MongoDB handles a document that fails validation when validation is applied.

MongoDB supports two actions:

1. `error`
2. `warn`

### A. `error`

`error` is the default validation action.

MongoDB rejects a write operation if the document fails validation.

Example:

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
  validationAction: "error",
});
```

Now try inserting an invalid document:

```javascript
await collection.insertOne({
  name: "Rahul",
  age: new Int32(90),
});
```

MongoDB rejects the insert because the age exceeds 80.

The write fails with a document validation error, typically error code `121`.

**Use case:** When invalid documents must not be stored.

### B. `warn`

The `warn` action allows writes that violate the validator but logs a warning.

Example:

```javascript
await db.command({
  collMod: "users",
  validationAction: "warn",
});
```

Now try inserting:

```javascript
await collection.insertOne({
  name: "Rahul",
  age: new Int32(90),
});
```

If the validation level applies to this insert, MongoDB allows the document to be stored and logs a validation warning.

**Important:** `warn` does not fix invalid data. It allows the invalid write while recording the violation in the server logs.

**Use case:** Monitoring validation violations before enforcing stricter rules.

---

## 4. Difference Between `validationLevel` and `validationAction`

| Feature                                            | `validationLevel`                                                                        | `validationAction`                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Purpose                                            | Determines when validation applies                                                       | Determines how failed validation is handled          |
| Main question                                      | Should this document be validated?                                                       | What happens if it fails?                            |
| Options                                            | `strict`, `moderate`, `off`                                                              | `error`, `warn`                                      |
| Controls validation for existing invalid documents | Yes, with `moderate` behavior                                                            | No, it controls the response to a violation          |
| Can allow invalid writes                           | `off` can disable validation; `moderate` can exempt updates to already-invalid documents | `warn` allows writes that fail applicable validation |
| Default                                            | `strict`                                                                                 | `error`                                              |

**Easy way to remember:**

- `validationLevel` = When should MongoDB check?
- `validationAction` = What should MongoDB do when a check fails?

---

## 5. Understanding Both Options Together

The two options work together.

Suppose our validator requires `age` to be an integer between 18 and 80.

```javascript
validator: {
  $jsonSchema: {
    bsonType: "object",
    required: ["age"],
    properties: {
      age: {
        bsonType: "int",
        minimum: 18,
        maximum: 80
      }
    }
  }
}
```

The following table shows how the options behave for a **new document with `age: 90`**:

| Validation level | Action: `error`                      | Action: `warn`                       |
| ---------------- | ------------------------------------ | ------------------------------------ |
| `strict`         | Write rejected                       | Write allowed; warning logged        |
| `moderate`       | Write rejected                       | Write allowed; warning logged        |
| `off`            | Write allowed; validator not applied | Write allowed; validator not applied |

Notice that `moderate` behaves like `strict` for new documents. Its special behavior concerns updates to documents that already violate the validator.

For example, with `moderate` and `error`:

- A new invalid document is rejected.
- An update to a currently valid document that makes it invalid is rejected.
- An update to a currently invalid document is not required to satisfy the validator.

The `validationAction` only matters when the validator is actually applied.

---

## 6. How to Configure Both Options

We can configure the validator, validation level, and validation action together using `collMod`.

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

  validationLevel: "strict",
  validationAction: "error",
});
```

This configuration means:

1. Validate every insert and update.
2. Require `name` and `age`.
3. Require `name` to be a string.
4. Require `age` to be an integer between 18 and 80.
5. Reject writes that violate these rules.

You can change only one option without redefining the validator.

For example:

```javascript
await db.command({
  collMod: "users",
  validationAction: "warn",
});
```

This changes the action while leaving the existing validator and validation level unchanged.

Similarly:

```javascript
await db.command({
  collMod: "users",
  validationLevel: "moderate",
});
```

This changes the validation level without replacing the existing validator or action.

---

## 7. Creating a Collection With Both Options

If the collection does not exist, you can specify these options during creation instead of using `collMod`.

```javascript
await db.createCollection("users", {
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
```

Remember:

- Use `createCollection()` when creating a new collection.
- Use `collMod` when modifying an existing collection.
- Do not call `createCollection("users")` again if the collection already exists.

---

## 8. Inspecting Validation Settings

You can inspect the collection's current options using `listCollections()`.

```javascript
const collections = await db.listCollections({ name: "users" }).toArray();

console.dir(collections[0]?.options, {
  depth: null,
});
```

The options can include:

- `validator`
- `validationLevel`
- `validationAction`

This is useful for confirming that the intended validation settings have been applied.

---

## 9. Best Practices

1. Use `strict` and `error` for collections where data integrity is essential.
2. Use `moderate` when introducing validation to collections with existing invalid documents.
3. Use `warn` temporarily when monitoring violations before enforcing validation.
4. Avoid leaving validation disabled with `off` unless there is a specific operational reason.
5. Fix existing invalid documents before moving from a permissive configuration to strict validation.
6. Test both insert and update operations when configuring validators.
7. Remember that `warn` allows invalid writes; it does not automatically correct them.
8. Do not rely solely on frontend validation. Database-level validation protects data written through different application paths.

---

## 10. Conclusion

MongoDB's `validationLevel` and `validationAction` options work together to control document validation.

`validationLevel` determines whether validation applies to a write operation. Its three settings are `strict`, `moderate`, and `off`.

`validationAction` determines what happens when an applicable validator fails. Its settings are `error` and `warn`.

For most production collections, `strict` with `error` is a sensible default because it enforces validation consistently and rejects invalid writes.
