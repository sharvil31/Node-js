# JSON Schema Validation in MongoDB

## 1. What Is JSON Schema Validation?

JSON Schema validation is a feature in MongoDB that allows us to define rules for the structure and content of documents stored in a collection.

MongoDB uses the `$jsonSchema` operator inside a collection's `validator` option to enforce these rules.

For example, suppose we have a `users` collection. We want every user document to contain:

- `name` as a string.
- `age` as an integer.
- `age` between 18 and 80.
- Both `name` and `age` as required fields.

We can define these rules using `$jsonSchema`.

```javascript
{
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
```

MongoDB checks documents against these rules during insert and update operations.

By default, MongoDB rejects writes that violate the validator.

---

## 2. Why Do We Need JSON Schema Validation?

MongoDB is a flexible, document-oriented database. Documents in the same collection can have different fields and structures.

For example, without a validator, a collection could contain:

```javascript
{ name: "Rahul", age: 25 }
{ name: 123, age: "twenty" }
{ name: "Amit" }
{ age: 90 }
```

These documents have inconsistent structures and data types.

If our application expects every user to have a string `name` and an integer `age` between 18 and 80, inconsistent data can cause errors in application logic.

JSON Schema validation helps maintain data integrity by enforcing these requirements at the database level.

---

## 3. Basic Syntax

The general structure of a JSON Schema validator is:

```javascript
{
  $jsonSchema: {
    bsonType: "object",
    required: ["field1", "field2"],
    properties: {
      field1: {
        bsonType: "string"
      },
      field2: {
        bsonType: "int"
      }
    }
  }
}
```

Let's understand the important properties.

| Property | Purpose |
|---|---|
| `$jsonSchema` | Enables JSON Schema-based validation. |
| `bsonType` | Specifies the expected BSON data type. |
| `required` | Lists fields that must be present. |
| `properties` | Defines validation rules for individual fields. |
| `minimum` | Sets the minimum numeric value. |
| `maximum` | Sets the maximum numeric value. |
| `minLength` | Sets the minimum string length. |
| `maxLength` | Sets the maximum string length. |
| `enum` | Restricts a value to a list of allowed values. |
| `pattern` | Validates a string against a regular expression. |
| `items` | Defines validation rules for array elements. |

---

## 4. Adding JSON Schema Validation to a Collection

MongoDB provides the `collMod` command to modify the configuration of an existing collection.

Example:

```javascript
import { MongoClient, Int32 } from "mongodb";

const client = new MongoClient(
  "mongodb://127.0.0.1:27017"
);

try {
  await client.connect();

  const db = client.db("storageApp");

  const collection = db.collection("users");

  await db.command({
    collMod: "users",
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
  });

  await collection.insertOne({
    name: "Rahul",
    age: new Int32(25)
  });

  console.log("Document inserted successfully.");
} catch (error) {
  console.error(error);
} finally {
  await client.close();
}
```

### Important points

- The `storageApp` database must be selected.
- The `users` collection must already exist when using `collMod`.
- `validator` contains the validation rules.
- `$jsonSchema` defines the expected document structure.
- `Int32` explicitly represents `age` as a BSON 32-bit integer.
- The connection is closed in the `finally` block.

If the collection does not exist, create it before running `collMod`:

```javascript
await db.createCollection("users");
```

---

## 5. Understanding `bsonType`

The `bsonType` property defines the expected BSON data type of a field.

Example:

```javascript
properties: {
  name: {
    bsonType: "string"
  },
  age: {
    bsonType: "int"
  },
  salary: {
    bsonType: "double"
  },
  isActive: {
    bsonType: "bool"
  }
}
```

Common BSON types include:

| BSON type | Example |
|---|---|
| `string` | `"Rahul"` |
| `int` | BSON 32-bit integer |
| `long` | BSON 64-bit integer |
| `double` | `45000.5` stored as a BSON double |
| `decimal` | BSON Decimal128 |
| `bool` | `true` |
| `objectId` | `ObjectId("...")` |
| `date` | `new Date()` |
| `array` | `["React", "Node.js"]` |
| `object` | `{ city: "Mumbai" }` |
| `null` | `null` |

### Important: JavaScript numbers and BSON integers

JavaScript has a single standard `Number` type for ordinary numeric values. The MongoDB Node.js driver may serialize a JavaScript number as a BSON `double`, depending on the value and serialization behavior.

For strict `bsonType: "int"` validation, use an explicit BSON `Int32` value when necessary:

```javascript
import { Int32 } from "mongodb";

const user = {
  name: "Rahul",
  age: new Int32(25)
};
```

This is useful when learning or testing strict BSON type validation.

---

## 6. Understanding `required`

The `required` property specifies which fields must exist in a document.

Example:

```javascript
{
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "age"],
    properties: {
      name: {
        bsonType: "string"
      },
      age: {
        bsonType: "int"
      }
    }
  }
}
```

The following document satisfies the required-field rule:

```javascript
{
  name: "Rahul",
  age: 25
}
```

The following document fails because `age` is missing:

```javascript
{
  name: "Rahul"
}
```

### Does `required` validate the data type?

No. `required` only ensures that the field exists.

For example:

```javascript
{
  name: "Rahul",
  age: "twenty"
}
```

The `age` field exists, but its value is a string instead of an integer. Therefore, it fails the `bsonType: "int"` rule.

**Remember:** Use `required` to enforce field presence and `properties` to enforce field types and other constraints.

---

## 7. Understanding `properties`

The `properties` object defines rules for individual fields.

Example:

```javascript
properties: {
  name: {
    bsonType: "string"
  },
  age: {
    bsonType: "int",
    minimum: 18,
    maximum: 80
  },
  email: {
    bsonType: "string"
  }
}
```

This specifies that:

- `name` must be a string if present.
- `age` must be an integer between 18 and 80 if present.
- `email` must be a string if present.

Notice that `email` is not listed in `required`. Therefore, a document can omit it.

If `email` is provided, however, it must satisfy its defined type rule.

---

## 8. Numeric Validation Using `minimum` and `maximum`

MongoDB supports numeric constraints in `$jsonSchema`.

Example:

```javascript
age: {
  bsonType: "int",
  minimum: 18,
  maximum: 80
}
```

This allows ages from 18 through 80, inclusive.

| Age | Result |
|---:|---|
| 17 | Rejected |
| 18 | Accepted |
| 25 | Accepted |
| 80 | Accepted |
| 81 | Rejected |

The `minimum` and `maximum` properties apply to numeric values.

Do not confuse these JSON Schema keywords with query operators such as `$gte` and `$lte`. Inside `$jsonSchema`, use `minimum` and `maximum` for numeric boundaries.

---

## 9. String Validation Using `minLength` and `maxLength`

We can restrict the length of a string using `minLength` and `maxLength`.

Example:

```javascript
name: {
  bsonType: "string",
  minLength: 3,
  maxLength: 30
}
```

This requires the name to contain between 3 and 30 characters.

Examples:

```javascript
{ name: "Al" }       // Rejected: too short
{ name: "Rahul" }   // Accepted
```

A name longer than 30 characters is also rejected.

To restrict the format of a string, we can use `pattern`.

```javascript
email: {
  bsonType: "string",
  pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"
}
```

This pattern checks for a basic email-like structure. It is not a complete guarantee that an email address is valid or deliverable.

---

## 10. Restricting Values Using `enum`

The `enum` property restricts a field to a specified list of values.

For example, suppose an employee's status can only be `active`, `inactive`, or `pending`.

```javascript
status: {
  bsonType: "string",
  enum: ["active", "inactive", "pending"]
}
```

Accepted:

```javascript
{
  status: "active"
}
```

Rejected:

```javascript
{
  status: "deleted"
}
```

This is useful for fields such as:

- User status.
- Order status.
- Payment status.
- Product category.
- Difficulty level.

---

## 11. Validating Arrays Using `items`

The `items` property defines the expected structure or type of elements inside an array.

Example:

```javascript
skills: {
  bsonType: "array",
  items: {
    bsonType: "string"
  }
}
```

Valid document:

```javascript
{
  name: "Rahul",
  skills: ["React", "Node.js", "MongoDB"]
}
```

Invalid document:

```javascript
{
  name: "Rahul",
  skills: ["React", 123, "MongoDB"]
}
```

The second document fails because one array element is a number instead of a string.

We can also restrict the number of elements:

```javascript
skills: {
  bsonType: "array",
  minItems: 1,
  maxItems: 10,
  items: {
    bsonType: "string"
  }
}
```

This requires between 1 and 10 string elements.

---

## 12. Validating Nested Objects

MongoDB documents can contain embedded objects.

Example document:

```javascript
{
  name: "Rahul",
  address: {
    city: "Mumbai",
    pincode: 421301
  }
}
```

We can validate nested fields using another `properties` object.

```javascript
{
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "address"],
    properties: {
      name: {
        bsonType: "string"
      },
      address: {
        bsonType: "object",
        required: ["city", "pincode"],
        properties: {
          city: {
            bsonType: "string"
          },
          pincode: {
            bsonType: "int"
          }
        }
      }
    }
  }
}
```

This validator requires:

- `name` to be a string.
- `address` to be an object.
- `address.city` to be a string.
- `address.pincode` to be an integer.

Nested validation helps maintain consistent structures for addresses, profiles, product specifications, and other embedded documents.

---

## 13. Restricting Additional Fields Using `additionalProperties`

By default, JSON Schema validation allows fields that are not listed in `properties`.

For example, this document can satisfy a schema that validates only `name` and `age`:

```javascript
{
  name: "Rahul",
  age: 25,
  city: "Mumbai"
}
```

If we want to reject any fields that are not explicitly defined, we can set `additionalProperties` to `false`.

```javascript
{
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "age"],
    properties: {
      name: {
        bsonType: "string"
      },
      age: {
        bsonType: "int"
      }
    },
    additionalProperties: false
  }
}
```

Now a document containing an additional field such as `city` fails validation.

This is useful when a collection must follow a fixed document structure.

Be careful when using it: legitimate new fields will also be rejected until the schema is updated.

---

## 14. What Happens When a Document Fails Validation?

By default, MongoDB rejects an insert or update that violates the collection validator.

Example:

```javascript
try {
  await collection.insertOne({
    name: "Rahul",
    age: new Int32(90)
  });
} catch (error) {
  console.log(error.message);
}
```

If the schema limits `age` to 80, MongoDB rejects this document.

A document validation failure typically produces MongoDB error code `121`, known as `DocumentValidationFailure`.

The `try...catch` block lets the application handle the error gracefully.

Schema validation applies to updates too. If an update produces a document that violates the rules, MongoDB rejects the update under the default strict validation settings.

---

## 15. JSON Schema Validation vs. Query Validation

MongoDB also allows collection validators to be written using query expressions.

For example:

```javascript
{
  age: {
    $gte: 18,
    $lte: 80
  }
}
```

This is a query-expression validator that checks the age range.

A `$jsonSchema` validator instead defines a more structured set of rules:

```javascript
{
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

| Feature | Query validation | `$jsonSchema` validation |
|---|---|---|
| Check numeric ranges | Yes | Yes |
| Enforce BSON types | Yes, using query operators | Yes, using `bsonType` |
| Require fields | Possible with query operators | Yes, using `required` |
| Validate nested structures | Possible | Yes |
| Validate array element types | Possible | Yes, using `items` |
| Define structured schemas | Less direct | Yes |

For document structure and multiple field constraints, `$jsonSchema` is often easier to read and maintain.

---

## 16. Important Points to Remember

1. `$jsonSchema` is used inside MongoDB's collection `validator` option.
2. `bsonType` defines the expected BSON data type.
3. `required` ensures that specified fields are present.
4. `properties` defines rules for individual fields.
5. `minimum` and `maximum` validate numeric ranges.
6. `minLength` and `maxLength` validate string lengths.
7. `enum` restricts a field to allowed values.
8. `items` validates array elements.
9. Nested `properties` objects validate embedded documents.
10. `additionalProperties: false` rejects fields that are not defined in the schema.
11. Validation applies to inserts and updates by default.
12. Existing documents are not automatically repaired when a validator is added.
13. `collMod` modifies an existing collection's validator; the collection must already exist.
14. JavaScript numeric values and BSON numeric types are not always interchangeable when using strict type validation.
15. Schema validation provides database-level protection in addition to application-level validation.

---

## 17. Conclusion

JSON Schema validation helps maintain data consistency in MongoDB by defining the expected structure, field types, required fields, and permitted values of documents.

For example, a `users` collection can require a string `name` and an integer `age` between 18 and 80.

By combining `$jsonSchema`, `bsonType`, `required`, `properties`, and other constraints, we can build reliable validation rules that protect data even when documents are inserted or updated through different parts of an application.
