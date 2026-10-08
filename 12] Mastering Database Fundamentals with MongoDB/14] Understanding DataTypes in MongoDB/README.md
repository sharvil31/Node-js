# MongoDB Data Types

MongoDB stores data in **BSON (Binary JSON)** format.

BSON extends JSON by providing additional data types such as:

* `ObjectId`
* `Int32`
* `Int64`
* `Double`
* `Decimal128`
* `Date`
* `Binary`
* `Regular Expression`
* `JavaScript Code`
* `Timestamp`
* `MinKey`
* `MaxKey`

Understanding MongoDB data types is important because the **type of a value affects how MongoDB stores, compares, queries, and processes that value**.

---

# Table of Contents

1. [What is BSON?](#what-is-bson)
2. [MongoDB Data Types Overview](#mongodb-data-types-overview)
3. [1. ObjectId](#1-objectid)
4. [2. Number - Int32](#2-number---int32)
5. [3. Number - Int64](#3-number---int64)
6. [4. Double](#4-double)
7. [5. Decimal128](#5-decimal128)
8. [6. String](#6-string)
9. [7. Boolean](#7-boolean)
10. [8. Date](#8-date)
11. [9. Array](#9-array)
12. [10. Embedded Document](#10-embedded-document)
13. [11. Null](#11-null)
14. [12. Binary Data](#12-binary-data)
15. [13. Regular Expression](#13-regular-expression)
16. [14. JavaScript Code](#14-javascript-code)
17. [15. JavaScript Code with Scope](#15-javascript-code-with-scope)
18. [16. MinKey](#16-minkey)
19. [17. MaxKey](#17-maxkey)
20. [18. Timestamp](#18-timestamp)
21. [BSON Types vs JavaScript Types](#bson-types-vs-javascript-types)
22. [MongoDB Data Types Example](#mongodb-data-types-example)
23. [Querying Different Data Types](#querying-different-data-types)
24. [Checking Data Types with `$type`](#checking-data-types-with-type)
25. [Important Type Conversion Concepts](#important-type-conversion-concepts)
26. [Common Mistakes](#common-mistakes)
27. [Quick Revision](#quick-revision)
28. [Interview Questions](#interview-questions)
29. [Complete Data Types Cheat Sheet](#complete-data-types-cheat-sheet)

---

# What is BSON?

**BSON** stands for:

> Binary JSON

MongoDB documents look similar to JSON:

```json
{
  "name": "John",
  "age": 25
}
```

But internally MongoDB stores documents using **BSON**.

BSON supports additional types that standard JSON does not provide.

For example, JSON does not have a native `ObjectId` or `Decimal128` type.

MongoDB BSON supports:

```text
ObjectId
Int32
Int64
Double
Decimal128
String
Boolean
Date
Array
Embedded Document
Null
Binary
Regular Expression
JavaScript Code
JavaScript Code with Scope
MinKey
MaxKey
Timestamp
```

---

# MongoDB Data Types Overview

| Data Type                  | Description                        | Example                             |
| -------------------------- | ---------------------------------- | ----------------------------------- |
| ObjectId                   | Unique identifier for documents    | `ObjectId()`                        |
| Int32                      | 32-bit integer                     | `NumberInt(42)`                     |
| Int64                      | 64-bit integer                     | `NumberLong("9223372036854775807")` |
| Double                     | Floating-point number              | `3.14`                              |
| Decimal128                 | High-precision decimal             | `NumberDecimal("123.456")`          |
| String                     | Text data                          | `"Hello"`                           |
| Boolean                    | True/false value                   | `true`                              |
| Date                       | Date and time                      | `new Date()`                        |
| Array                      | Collection of values               | `[1, 2, 3]`                         |
| Embedded Document          | Nested document                    | `{ "name": "John" }`                |
| Null                       | Represents null                    | `null`                              |
| Binary                     | Binary data                        | `BinData(...)`                      |
| Regular Expression         | Regex pattern                      | `/pattern/i`                        |
| JavaScript Code            | JavaScript code                    | `Code(...)`                         |
| JavaScript Code with Scope | Code with variables/scope          | `Code(..., {...})`                  |
| MinKey                     | Smaller than all other BSON values | `MinKey()`                          |
| MaxKey                     | Greater than all other BSON values | `MaxKey()`                          |
| Timestamp                  | Internal BSON timestamp type       | `Timestamp()`                       |

---

# 1. ObjectId

`ObjectId` is one of the most commonly used MongoDB data types.

It is commonly used as the default value for the `_id` field.

Example:

```javascript
{
  _id: ObjectId("68f123456789abcdef123456"),
  name: "John",
  age: 25
}
```

## ObjectId Structure

An ObjectId is:

```text
12 bytes
```

It is usually represented as:

```text
24 hexadecimal characters
```

Example:

```text
68f123456789abcdef123456
```

Conceptually, an ObjectId contains:

```text
4-byte timestamp
5-byte random value
3-byte counter
```

This makes ObjectIds compact and generally unique.

## Creating ObjectId

In `mongosh`:

```javascript
ObjectId()
```

Example:

```javascript
ObjectId("68f123456789abcdef123456")
```

In Node.js:

```javascript
import { ObjectId } from "mongodb";

const id = new ObjectId();
```

## Convert String to ObjectId

```javascript
const id = new ObjectId("68f123456789abcdef123456");
```

## Validate ObjectId

```javascript
ObjectId.isValid("68f123456789abcdef123456");
```

## Comparing ObjectIds

Do not normally use:

```javascript
id1 === id2
```

because two ObjectId instances can represent the same value while being different JavaScript objects.

Use:

```javascript
id1.equals(id2);
```

## Important

These are different BSON types:

```javascript
"68f123456789abcdef123456"
```

and:

```javascript
ObjectId("68f123456789abcdef123456")
```

A string is **not** automatically equal to an ObjectId.

---

# 2. Number - Int32

`Int32` represents a signed 32-bit integer.

It uses:

```text
4 bytes
```

Range:

```text
-2,147,483,648
to
2,147,483,647
```

Example:

```javascript
NumberInt(42)
```

In `mongosh`:

```javascript
db.users.insertOne({
  age: NumberInt(25)
});
```

Example document:

```javascript
{
  name: "John",
  age: NumberInt(25)
}
```

## Node.js

The MongoDB Node.js driver provides:

```javascript
import { Int32 } from "mongodb";

const age = new Int32(25);
```

---

# 3. Number - Int64

`Int64` represents a signed 64-bit integer.

It uses:

```text
8 bytes
```

Range:

```text
-2^63
to
2^63 - 1
```

Maximum value:

```text
9,223,372,036,854,775,807
```

In `mongosh`:

```javascript
NumberLong("9223372036854775807")
```

Example:

```javascript
{
  accountNumber: NumberLong("9223372036854775807")
}
```

## Node.js

The MongoDB driver uses `Long` for BSON Int64 values.

```javascript
import { Long } from "mongodb";

const value = Long.fromString("9223372036854775807");
```

## Why not use JavaScript Number?

JavaScript's `Number` cannot safely represent every integer above:

```text
9,007,199,254,740,991
```

This is:

```javascript
Number.MAX_SAFE_INTEGER
```

Therefore, for very large integers, use an appropriate BSON `Int64` representation rather than relying on JavaScript `Number`.

---

# 4. Double

`Double` represents a floating-point number.

It uses:

```text
8 bytes
```

Example:

```javascript
3.14
```

In MongoDB shell-style syntax:

```javascript
NumberDouble(3.14)
```

Example:

```javascript
{
  temperature: NumberDouble(36.5)
}
```

## Floating-Point Precision

Double follows IEEE 754 floating-point representation.

Therefore, some decimal calculations can have floating-point precision issues.

For example, in JavaScript:

```javascript
0.1 + 0.2
```

can produce:

```text
0.30000000000000004
```

This is not a MongoDB-specific problem; it is a common floating-point representation issue.

For applications requiring exact decimal semantics, consider `Decimal128`.

---

# 5. Decimal128

`Decimal128` is a high-precision decimal BSON type.

It uses:

```text
16 bytes
```

It supports up to:

```text
34 decimal digits of precision
```

It is particularly useful for:

* Financial values
* Currency
* Accounting
* Precise decimal calculations
* Applications where floating-point approximation is undesirable

Example:

```javascript
NumberDecimal("123.4567890123456789")
```

Example document:

```javascript
{
  price: NumberDecimal("999.99")
}
```

## Node.js

Use:

```javascript
import { Decimal128 } from "mongodb";

const price = Decimal128.fromString("999.99");
```

### Important

Prefer:

```javascript
Decimal128.fromString("999.99")
```

instead of first creating a JavaScript floating-point number and then converting it.

For example, this is less desirable:

```javascript
Decimal128.fromString(String(0.1 + 0.2))
```

because the JavaScript calculation may already contain floating-point rounding.

---

# 6. String

A `String` stores text data.

Example:

```javascript
"Hello, World!"
```

MongoDB document:

```javascript
{
  name: "John",
  city: "Mumbai"
}
```

Strings are commonly used for:

* Names
* Email addresses
* Usernames
* Descriptions
* URLs
* Phone numbers
* Text content

Example:

```javascript
{
  username: "sharvil",
  email: "user@example.com"
}
```

---

# 7. Boolean

A Boolean represents one of two values:

```javascript
true
false
```

Example:

```javascript
{
  isActive: true,
  isVerified: false
}
```

Common use cases:

```text
isActive
isDeleted
isVerified
isAdmin
isCompleted
hasPermission
```

Example:

```javascript
db.users.insertOne({
  name: "John",
  isActive: true
});
```

---

# 8. Date

MongoDB has a BSON `Date` type for storing date and time values.

A BSON Date represents a signed 64-bit integer containing:

```text
milliseconds since Unix Epoch
```

Unix Epoch:

```text
1970-01-01T00:00:00.000Z
```

Example:

```javascript
new Date()
```

Example document:

```javascript
{
  name: "John",
  createdAt: new Date()
}
```

Specific date:

```javascript
new Date("2026-10-08")
```

## Common Uses

```text
createdAt
updatedAt
dateOfBirth
publishedAt
expiresAt
deletedAt
```

Example:

```javascript
{
  createdAt: new Date(),
  updatedAt: new Date()
}
```

## Query by Date

```javascript
db.users.find({
  createdAt: {
    $gte: new Date("2026-01-01")
  }
});
```

---

# 9. Array

An Array stores multiple values inside a document.

Example:

```javascript
{
  name: "John",
  hobbies: ["coding", "music", "reading"]
}
```

Arrays can contain:

* Strings
* Numbers
* Booleans
* Documents
* Arrays
* Mixed values

Example:

```javascript
{
  numbers: [1, 2, 3, 4],
  skills: ["React", "Node.js", "MongoDB"]
}
```

## Array of Objects

```javascript
{
  name: "John",
  addresses: [
    {
      city: "Mumbai",
      pincode: 400001
    },
    {
      city: "Pune",
      pincode: 411001
    }
  ]
}
```

MongoDB allows querying array elements:

```javascript
db.users.find({
  skills: "MongoDB"
});
```

---

# 10. Embedded Document

An Embedded Document is a document nested inside another document.

Example:

```javascript
{
  name: "John",
  address: {
    city: "Mumbai",
    country: "India"
  }
}
```

Here:

```javascript
address
```

is an embedded document.

## Nested Fields

You can query nested fields using dot notation:

```javascript
db.users.find({
  "address.city": "Mumbai"
});
```

Another example:

```javascript
{
  product: {
    name: "Laptop",
    price: 50000
  }
}
```

Query:

```javascript
db.products.find({
  "product.price": 50000
});
```

Embedded documents are useful when related data naturally belongs together.

---

# 11. Null

`null` represents the absence of a value.

Example:

```javascript
{
  name: "John",
  middleName: null
}
```

Example:

```javascript
{
  phone: null
}
```

## Important Difference

There is an important distinction between:

```javascript
{
  phone: null
}
```

and:

```javascript
{
  name: "John"
}
```

In the second document, the `phone` field does not exist.

A query like:

```javascript
db.users.find({
  phone: null
});
```

can match documents where `phone` is either:

```text
null
```

or:

```text
missing
```

To specifically find an existing field containing `null`:

```javascript
db.users.find({
  phone: {
    $exists: true,
    $type: 10
  }
});
```

---

# 12. Binary Data

Binary data is used to store raw binary values.

Examples include:

* Images
* Audio
* Encoded data
* Encryption-related data
* Other binary content

MongoDB represents binary data using the BSON Binary type.

In shell-style syntax:

```javascript
BinData(0, "data")
```

In Node.js:

```javascript
import { Binary } from "mongodb";

const binaryData = new Binary(Buffer.from("Hello"));
```

Example:

```javascript
{
  fileData: binaryData
}
```

## Should You Store Large Files Directly?

For large files, applications commonly use:

* GridFS
* Object storage
* File storage services

rather than placing large binary payloads directly inside ordinary documents.

MongoDB documents have a maximum BSON document size, so large-file architecture should be considered carefully.

---

# 13. Regular Expression

MongoDB supports regular expressions for pattern matching.

Example:

```javascript
/pattern/i
```

The `i` flag means case-insensitive matching.

Example:

```javascript
db.users.find({
  name: /john/i
});
```

This can match:

```text
John
john
JOHN
JoHn
```

## Another Example

Find emails from a particular domain:

```javascript
db.users.find({
  email: /@gmail\.com$/i
});
```

Regular expressions are useful for:

* Search
* Pattern matching
* Validation-like queries
* Case-insensitive matching

However, regex queries should be designed carefully because some regex patterns can prevent efficient index usage.

---

# 14. JavaScript Code

MongoDB BSON supports a JavaScript `Code` type.

Example:

```javascript
Code("function() { return 42; }")
```

This represents JavaScript source code as a BSON value.

In Node.js:

```javascript
import { Code } from "mongodb";

const code = new Code(
  "function() { return 42; }"
);
```

Example:

```javascript
{
  script: code
}
```

## Important

Although BSON supports JavaScript code, modern MongoDB application design generally does **not** use stored JavaScript as a normal application pattern.

Most application logic should live in your application code, such as:

```text
Node.js
Express.js
Python
Java
C#
etc.
```

---

# 15. JavaScript Code with Scope

BSON also has a JavaScript Code type that can contain an associated scope.

The scope is a set of variables available to the JavaScript code.

Conceptually:

```javascript
Code(
  "function() { return x; }",
  {
    x: 42
  }
)
```

The code references:

```javascript
x
```

and the associated scope provides:

```javascript
{
  x: 42
}
```

In Node.js:

```javascript
import { Code } from "mongodb";

const code = new Code(
  "function() { return x; }",
  {
    x: 42
  }
);
```

## Important

`Code` and `Code with Scope` are BSON types supported for compatibility and specialized use cases.

They are not commonly used in modern MongoDB application development.

---

# 16. MinKey

`MinKey` is a special BSON type.

It compares as **less than every other BSON value**.

Example:

```javascript
MinKey()
```

Conceptually:

```text
MinKey < all other BSON values
```

Example:

```javascript
{
  value: MinKey()
}
```

`MinKey` is primarily useful for:

* Internal MongoDB behavior
* Specialized comparisons
* Database internals
* Edge cases

It is not normally used for ordinary application data.

---

# 17. MaxKey

`MaxKey` is the opposite of `MinKey`.

It compares as **greater than every other BSON value**.

Example:

```javascript
MaxKey()
```

Conceptually:

```text
all other BSON values < MaxKey
```

Example:

```javascript
{
  value: MaxKey()
}
```

Like `MinKey`, `MaxKey` is mainly useful for:

* Internal MongoDB behavior
* Specialized comparisons
* Database internals
* Edge cases

It is not commonly used in normal application documents.

---

# 18. Timestamp

MongoDB has a BSON `Timestamp` type.

Example:

```javascript
Timestamp()
```

Timestamp is a special BSON type consisting of two 32-bit unsigned integer components:

```text
timestamp value
ordinal/increment value
```

It is primarily intended for **internal MongoDB use**, especially for tracking operations and replication-related mechanisms.

## Important Difference: Date vs Timestamp

Do not confuse:

```text
Date
```

with:

```text
Timestamp
```

### Date

Used for application-level date and time:

```javascript
{
  createdAt: new Date()
}
```

Examples:

```text
createdAt
updatedAt
birthDate
expiryDate
```

### Timestamp

A special BSON type mainly associated with MongoDB's internal operation/replication mechanisms.

Therefore:

> Use BSON Date for normal application date/time values.

Do not use MongoDB Timestamp as a replacement for normal application dates.

---

# BSON Types vs JavaScript Types

MongoDB BSON types do not map one-to-one with JavaScript types.

| MongoDB BSON               | JavaScript / Node.js Representation |
| -------------------------- | ----------------------------------- |
| String                     | `string`                            |
| Double                     | `number` / driver `Double`          |
| Int32                      | driver `Int32`                      |
| Int64                      | driver `Long`                       |
| Decimal128                 | driver `Decimal128`                 |
| Boolean                    | `boolean`                           |
| ObjectId                   | `ObjectId`                          |
| Date                       | `Date`                              |
| Array                      | `Array`                             |
| Embedded Document          | `Object`                            |
| Null                       | `null`                              |
| Binary                     | `Binary` / `Buffer`                 |
| Regular Expression         | `RegExp`                            |
| JavaScript Code            | `Code`                              |
| JavaScript Code with Scope | `Code` with scope                   |
| MinKey                     | `MinKey`                            |
| MaxKey                     | `MaxKey`                            |
| Timestamp                  | `Timestamp`                         |

---

# MongoDB Data Types Example

A document can contain many different BSON types at the same time.

Example:

```javascript
{
  _id: ObjectId("68f123456789abcdef123456"),

  name: "John",

  age: NumberInt(25),

  largeNumber: NumberLong("9223372036854775807"),

  salary: NumberDecimal("75000.50"),

  rating: NumberDouble(4.5),

  isActive: true,

  createdAt: new Date(),

  skills: [
    "JavaScript",
    "Node.js",
    "MongoDB"
  ],

  address: {
    city: "Mumbai",
    country: "India"
  },

  middleName: null
}
```

This demonstrates:

```text
ObjectId
String
Int32
Int64
Decimal128
Double
Boolean
Date
Array
Embedded Document
Null
```

---

# Querying Different Data Types

MongoDB queries can filter based on values and their types.

## String

```javascript
db.users.find({
  name: "John"
});
```

## Integer

```javascript
db.users.find({
  age: 25
});
```

## Boolean

```javascript
db.users.find({
  isActive: true
});
```

## Date

```javascript
db.users.find({
  createdAt: {
    $gte: new Date("2026-01-01")
  }
});
```

## ObjectId

```javascript
db.users.find({
  _id: new ObjectId("68f123456789abcdef123456")
});
```

## Array

```javascript
db.users.find({
  skills: "Node.js"
});
```

## Embedded Document

```javascript
db.users.find({
  "address.city": "Mumbai"
});
```

---

# Checking Data Types with `$type`

MongoDB provides the `$type` query operator.

It allows you to find documents based on the BSON type of a field.

Example:

```javascript
db.users.find({
  age: {
    $type: "int"
  }
});
```

Find strings:

```javascript
db.users.find({
  name: {
    $type: "string"
  }
});
```

Find ObjectIds:

```javascript
db.users.find({
  _id: {
    $type: "objectId"
  }
});
```

Find dates:

```javascript
db.users.find({
  createdAt: {
    $type: "date"
  }
});
```

Find null:

```javascript
db.users.find({
  middleName: {
    $type: "null"
  }
});
```

You can also use numeric BSON type aliases where supported.

For example:

```javascript
$type: 10
```

represents BSON `null`.

---

# Important Type Conversion Concepts

MongoDB also provides aggregation expressions for converting values between types.

Examples include:

```text
$toString
$toInt
$toLong
$toDouble
$toDecimal
$toDate
$toObjectId
```

Example:

```javascript
db.users.aggregate([
  {
    $project: {
      ageAsString: {
        $toString: "$age"
      }
    }
  }
]);
```

Another example:

```javascript
db.products.aggregate([
  {
    $project: {
      priceAsDecimal: {
        $toDecimal: "$price"
      }
    }
  }
]);
```

For more flexible conversion, MongoDB also provides:

```javascript
$convert
```

Example:

```javascript
{
  $convert: {
    input: "$age",
    to: "int"
  }
}
```

---

# Common Mistakes

## 1. Confusing String and ObjectId

Incorrect:

```javascript
db.users.find({
  _id: "68f123456789abcdef123456"
});
```

when `_id` is actually an ObjectId.

Correct:

```javascript
db.users.find({
  _id: new ObjectId("68f123456789abcdef123456")
});
```

---

## 2. Using Double for Everything

A JavaScript number does not always mean you should use floating-point semantics for every database value.

For example, financial values may benefit from:

```text
Decimal128
```

rather than ordinary floating-point numbers.

---

## 3. Using JavaScript Number for Huge Integers

JavaScript `Number` cannot safely represent every integer.

Safe maximum:

```javascript
Number.MAX_SAFE_INTEGER
```

which is:

```text
9,007,199,254,740,991
```

For larger exact integers, consider BSON `Int64`.

---

## 4. Treating MongoDB Date and Timestamp as the Same

They are different BSON types.

For application dates:

```javascript
new Date()
```

is normally the appropriate choice.

---

## 5. Assuming `null` Means Field Does Not Exist

These are different:

```javascript
{
  phone: null
}
```

and:

```javascript
{
  name: "John"
}
```

where `phone` is missing.

Use `$exists` and `$type` when you need to distinguish them.

---

## 6. Storing Large Files Directly in Documents

MongoDB supports binary data, but large files require careful design.

Consider:

```text
GridFS
Object Storage
File Storage Service
```

depending on the application.

---

## 7. Using BSON JavaScript Code for Normal Business Logic

MongoDB supports `Code` and `Code with Scope`, but modern applications generally keep business logic inside the application layer.

For example:

```text
Node.js
Express.js
```

rather than storing application logic as BSON JavaScript code.

---

# MongoDB Flexible Schema

MongoDB is often described as "schema-less", but a more accurate description is:

> MongoDB has a flexible schema.

For example, one document can contain:

```javascript
{
  name: "John",
  age: 25
}
```

while another document can contain:

```javascript
{
  name: "Jane",
  age: 28,
  skills: ["React", "Node.js"],
  address: {
    city: "Mumbai"
  }
}
```

MongoDB does not require every document in a collection to have exactly the same fields by default.

However, applications should still maintain a **consistent logical schema**.

MongoDB also supports schema validation when stricter rules are required.

---

# When Should You Use Which Type?

| Requirement                    | Recommended Type   |
| ------------------------------ | ------------------ |
| Unique document ID             | ObjectId           |
| Normal text                    | String             |
| Small integer                  | Int32              |
| Very large integer             | Int64              |
| General floating-point value   | Double             |
| Exact decimal/financial value  | Decimal128         |
| True/false                     | Boolean            |
| Date/time                      | Date               |
| Multiple values                | Array              |
| Related nested data            | Embedded Document  |
| Explicit absence of value      | Null               |
| Binary content                 | Binary             |
| Pattern matching               | Regular Expression |
| Stored JavaScript code         | Code               |
| JavaScript code + variables    | Code with Scope    |
| Lowest BSON comparison value   | MinKey             |
| Highest BSON comparison value  | MaxKey             |
| MongoDB internal timestamp use | Timestamp          |

---

# Complete Data Types Cheat Sheet

```text
MongoDB
   |
   └── BSON
       |
       ├── ObjectId
       |
       ├── Numbers
       │   ├── Int32
       │   ├── Int64
       │   ├── Double
       │   └── Decimal128
       |
       ├── String
       ├── Boolean
       ├── Date
       ├── Array
       ├── Embedded Document
       ├── Null
       ├── Binary
       ├── Regular Expression
       ├── JavaScript Code
       ├── JavaScript Code with Scope
       ├── MinKey
       ├── MaxKey
       └── Timestamp
```

---

# Quick Revision

## ObjectId

```javascript
ObjectId()
```

Unique identifier commonly used for `_id`.

---

## Int32

```javascript
NumberInt(42)
```

32-bit integer.

---

## Int64

```javascript
NumberLong("9223372036854775807")
```

64-bit integer.

---

## Double

```javascript
NumberDouble(3.14)
```

Floating-point number.

---

## Decimal128

```javascript
NumberDecimal("123.456")
```

High-precision decimal.

---

## String

```javascript
"Hello World"
```

Text.

---

## Boolean

```javascript
true
false
```

True/false.

---

## Date

```javascript
new Date()
```

Date and time.

---

## Array

```javascript
[1, 2, 3]
```

Collection of values.

---

## Embedded Document

```javascript
{
  city: "Mumbai"
}
```

Nested document.

---

## Null

```javascript
null
```

Explicit null value.

---

## Binary

```javascript
BinData(...)
```

Binary data.

---

## Regular Expression

```javascript
/pattern/i
```

Pattern matching.

---

## Code

```javascript
Code("function() { return 42; }")
```

JavaScript code.

---

## Code with Scope

```javascript
Code(
  "function() { return x; }",
  { x: 42 }
)
```

JavaScript code with associated scope.

---

## MinKey

```javascript
MinKey()
```

Less than every other BSON value.

---

## MaxKey

```javascript
MaxKey()
```

Greater than every other BSON value.

---

## Timestamp

```javascript
Timestamp()
```

Special BSON timestamp type, mainly associated with MongoDB internal operations.

---

# Interview Questions

## 1. What is BSON?

BSON stands for **Binary JSON**.

MongoDB uses BSON to store documents. BSON extends JSON by supporting additional types such as ObjectId, Date, Binary, Decimal128, Int64, and others.

---

## 2. What is the difference between JSON and BSON?

JSON is a text-based data format.

BSON is a binary representation that provides additional data types and is used internally by MongoDB.

---

## 3. What is ObjectId?

ObjectId is a BSON type commonly used as MongoDB's default `_id`.

It is 12 bytes and is commonly represented as a 24-character hexadecimal string.

---

## 4. What is the difference between Int32 and Int64?

`Int32` stores signed 32-bit integers.

`Int64` stores signed 64-bit integers.

```text
Int32 → 4 bytes
Int64 → 8 bytes
```

---

## 5. What is Decimal128?

Decimal128 is a 128-bit decimal BSON type that supports up to 34 decimal digits of precision.

It is useful when exact decimal representation is important, such as financial values.

---

## 6. What is the difference between Double and Decimal128?

`Double` uses floating-point representation and can have precision limitations.

`Decimal128` provides high-precision decimal representation and is more suitable for exact decimal/financial values.

---

## 7. What is a BSON Date?

BSON Date represents date and time using a signed 64-bit integer containing milliseconds since the Unix Epoch.

---

## 8. What is an Embedded Document?

An Embedded Document is a document nested inside another MongoDB document.

Example:

```javascript
{
  name: "John",
  address: {
    city: "Mumbai"
  }
}
```

---

## 9. What is a BSON Array?

An array stores multiple values inside a document.

Example:

```javascript
{
  skills: ["React", "Node.js", "MongoDB"]
}
```

---

## 10. What is the difference between null and a missing field?

`null` means the field exists and contains a null value.

A missing field means the field does not exist in the document.

---

## 11. What is Binary BSON type?

Binary is used to store raw binary data such as encoded data or file content.

---

## 12. What is MinKey?

`MinKey` is a special BSON type that compares as less than all other BSON values.

---

## 13. What is MaxKey?

`MaxKey` is a special BSON type that compares as greater than all other BSON values.

---

## 14. What is BSON Timestamp?

Timestamp is a special BSON type primarily used for MongoDB internal operations, including replication-related functionality.

It should not normally be used as a replacement for application-level dates.

---

## 15. What is BSON Code?

BSON Code stores JavaScript source code as a BSON value.

Example:

```javascript
Code("function() { return 42; }")
```

---

## 16. What is Code with Scope?

Code with Scope stores JavaScript code together with variables available to that code.

Example:

```javascript
Code(
  "function() { return x; }",
  { x: 42 }
)
```

---

## 17. Which MongoDB type should be used for money?

Generally, `Decimal128` is a good BSON choice when exact decimal semantics are required.

Example:

```javascript
Decimal128.fromString("999.99")
```

The application should also define appropriate currency and rounding rules.

---

## 18. Does MongoDB use JSON internally?

No.

MongoDB uses **BSON** internally.

MongoDB documents are represented in a JSON-like format when working with them, but the stored representation is BSON.

---

# Final Summary

MongoDB supports a rich set of BSON data types:

```text
ObjectId
Int32
Int64
Double
Decimal128
String
Boolean
Date
Array
Embedded Document
Null
Binary
Regular Expression
JavaScript Code
JavaScript Code with Scope
MinKey
MaxKey
Timestamp
```

The most commonly used types in everyday application development are:

```text
ObjectId
String
Int32 / Int64
Double
Decimal128
Boolean
Date
Array
Embedded Document
Null
```

The remaining types are useful for specialized or compatibility-related scenarios.

A good MongoDB developer should understand not only **what each type is**, but also **when to use it and how type differences affect queries and application behavior**.

---

# MongoDB Learning Progress

```text
MongoDB
   |
   ├── Databases
   ├── Collections
   ├── Documents
   |
   ├── BSON Data Types       ✅
   │   ├── ObjectId          ✅
   │   ├── Numbers           ✅
   │   ├── String            ✅
   │   ├── Boolean           ✅
   │   ├── Date              ✅
   │   ├── Array             ✅
   │   ├── Embedded Document ✅
   │   ├── Null              ✅
   │   ├── Binary            ✅
   │   ├── Regex             ✅
   │   ├── Code              ✅
   │   ├── Code + Scope      ✅
   │   ├── MinKey            ✅
   │   ├── MaxKey            ✅
   │   └── Timestamp         ✅
   |
   ├── Create Operation       ✅
   ├── Read Operation        ✅
   ├── Update Operation      ✅
   ├── Delete Operation      ✅
   |
   ├── Indexes
   ├── Query Operators
   ├── Aggregation
   ├── Schema Design
   ├── Relationships
   ├── Transactions
   |
   └── MongoDB + Express REST API
```

The next useful MongoDB topics after **Data Types + CRUD** are:

```text
1. MongoDB Query Operators
2. MongoDB Indexes
3. MongoDB Aggregation
4. Schema Design
5. Embedding vs Referencing
6. MongoDB Relationships
7. MongoDB Transactions
8. MongoDB with Node.js
9. MongoDB with Express.js
10. Building a Complete REST API
```