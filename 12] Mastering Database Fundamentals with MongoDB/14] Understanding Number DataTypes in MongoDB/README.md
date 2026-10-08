# MongoDB Number DataTypes

MongoDB supports multiple numeric BSON data types.

Unlike JavaScript, where most ordinary numbers use the `Number` type, MongoDB has different numeric BSON types for different ranges and precision requirements.

The main numeric BSON types are:

```text
1. Double
2. Int32
3. Int64
4. Decimal128
```

MongoDB can automatically determine an appropriate numeric representation in many situations, but when precision and integer range matter, understanding these types becomes important.

---

# Table of Contents

- [1. Introduction](#1-introduction)
- [2. MongoDB Numeric BSON Types](#2-mongodb-numeric-bson-types)
- [3. Double](#3-double)
- [4. Int32](#4-int32)
- [5. Int64](#5-int64)
- [6. Decimal128](#6-decimal128)
- [7. Comparing Numeric Types](#7-comparing-numeric-types)
- [8. JavaScript Number vs MongoDB Number Types](#8-javascript-number-vs-mongodb-number-types)
- [9. NumberLong](#9-numberlong)
- [10. NumberDecimal](#10-numberdecimal)
- [11. NumberInt](#11-numberint)
- [12. Creating Numeric Types in Node.js](#12-creating-numeric-types-in-nodejs)
- [13. Querying Numeric Values](#13-querying-numeric-values)
- [14. Updating Numeric Values](#14-updating-numeric-values)
- [15. Important Precision Example](#15-important-precision-example)
- [16. Choosing the Correct Number Type](#16-choosing-the-correct-number-type)
- [17. Common Mistakes](#17-common-mistakes)
- [18. Interview Questions](#18-interview-questions)
- [19. Quick Revision](#19-quick-revision)
- [20. MongoDB Learning Progress](#20-mongodb-learning-progress)

---

# 1. Introduction

MongoDB stores data internally using **BSON**.

BSON provides several numeric data types.

The four main numeric types are:

| Type         |     Size | Purpose                        |
| ------------ | -------: | ------------------------------ |
| `double`     |  8 bytes | Floating-point numbers         |
| `int32`      |  4 bytes | 32-bit integers                |
| `int64`      |  8 bytes | 64-bit integers                |
| `decimal128` | 16 bytes | High-precision decimal numbers |

So:

```text
MongoDB Numeric Types
│
├── Double
├── Int32
├── Int64
└── Decimal128
```

---

# 2. MongoDB Numeric BSON Types

MongoDB supports:

```text
Double
Int32
Int64
Decimal128
```

Each type has different characteristics.

### Double

Used for floating-point values.

Example:

```js
19.99;
```

### Int32

Used for 32-bit signed integers.

Example:

```js
100;
```

### Int64

Used for 64-bit signed integers.

Example:

```text
9007199254740992
```

### Decimal128

Used when exact decimal precision is important.

Example:

```text
19.99
```

---

# 3. Double

`Double` is an **IEEE 754 64-bit floating-point number**.

It occupies:

```text
8 bytes
```

It is commonly used for values containing decimal fractions.

Example:

```js
{
  price: 99.99,
  rating: 4.5
}
```

Depending on the context and driver, these values may be stored as BSON doubles.

---

## Example in MongoDB

```js
db.products.insertOne({
  name: "Laptop",
  price: 59999.99,
});
```

The numeric value:

```text
59999.99
```

can be represented as a BSON `double`.

---

## When to Use Double

Double is suitable for values where tiny floating-point representation differences are acceptable.

Examples:

- Scientific calculations
- Measurements
- Coordinates
- Ratios
- Approximate calculations
- Some analytics

Example:

```js
{
  temperature: 36.7,
  latitude: 19.2183,
  longitude: 73.1628
}
```

---

## Double Precision

A double provides approximately:

```text
15–17 decimal digits of precision
```

It is a binary floating-point representation.

Therefore, decimal fractions such as:

```text
0.1
0.2
```

cannot always be represented exactly in binary floating-point.

This is important for financial calculations.

---

# 4. Int32

`Int32` is a **32-bit signed integer**.

It occupies:

```text
4 bytes
```

Its range is:

```text
-2,147,483,648
to
2,147,483,647
```

In other words:

```text
-2³¹
to
2³¹ - 1
```

---

## Example

```js
{
  age: 22,
  quantity: 10,
  stock: 500
}
```

These values can be represented as integers.

---

## `NumberInt()` in `mongosh`

In `mongosh`, you can explicitly create an Int32 value:

```js
NumberInt(100);
```

Example:

```js
db.products.insertOne({
  quantity: NumberInt(100),
});
```

The value is explicitly represented as BSON Int32.

---

## When to Use Int32

Int32 is useful when you know the value fits within the 32-bit signed integer range.

Examples:

```text
age
quantity
count
rating
small counters
```

For example:

```js
{
  age: NumberInt(22),
  quantity: NumberInt(50)
}
```

---

# 5. Int64

`Int64` is a **64-bit signed integer**.

It occupies:

```text
8 bytes
```

Its range is:

```text
-9,223,372,036,854,775,808
to
9,223,372,036,854,775,807
```

or:

```text
-2⁶³
to
2⁶³ - 1
```

---

## Why Do We Need Int64?

Int32 has a relatively limited range.

For example:

```text
2,147,483,647
```

is the maximum positive Int32 value.

If an integer can become larger than that, Int64 may be required.

Examples:

```text
Large counters
Large identifiers
Large timestamps
Database sequence numbers
```

---

## `NumberLong()` in `mongosh`

In `mongosh`, `NumberLong()` is commonly used to represent a BSON Int64.

Example:

```js
NumberLong("9007199254740992");
```

Notice that a string is often used for large values to avoid JavaScript number precision issues.

Example:

```js
db.orders.insertOne({
  orderNumber: NumberLong("9007199254740992"),
});
```

---

# 6. Decimal128

`Decimal128` is a **128-bit decimal floating-point type**.

It occupies:

```text
16 bytes
```

It is designed for **exact decimal arithmetic** within its supported precision/range.

This makes it particularly useful for financial and monetary values.

---

## Example

```js
{
  price: Decimal128("199.99");
}
```

In `mongosh`:

```js
NumberDecimal("199.99");
```

Example:

```js
db.products.insertOne({
  price: NumberDecimal("199.99"),
});
```

---

## Why Use Decimal128?

Consider financial values:

```text
₹99.99
₹100.50
₹1250.75
```

For financial calculations, exact decimal representation is often preferred over binary floating-point.

For example:

```js
{
  price: NumberDecimal("199.99");
}
```

is preferable to relying on a binary floating-point representation when exact decimal semantics are required.

---

## Common Decimal128 Use Cases

Use Decimal128 for:

- Money
- Financial calculations
- Accounting
- Tax calculations
- Precise decimal measurements
- Currency values

Example:

```js
{
  product: "Laptop",
  price: NumberDecimal("59999.99"),
  tax: NumberDecimal("10799.9982")
}
```

---

# 7. Comparing Numeric Types

MongoDB's numeric types have different characteristics.

| Type       |     Size | General Use                 |
| ---------- | -------: | --------------------------- |
| Double     |  8 bytes | Floating-point calculations |
| Int32      |  4 bytes | Normal 32-bit integers      |
| Int64      |  8 bytes | Large integers              |
| Decimal128 | 16 bytes | Exact decimal calculations  |

---

## Range Comparison

### Int32

```text
-2,147,483,648
to
2,147,483,647
```

### Int64

```text
-9,223,372,036,854,775,808
to
9,223,372,036,854,775,807
```

### Double

Approximately:

```text
15–17 decimal digits of precision
```

It has a much larger approximate range than Int64, but it does not provide exact integer representation across the entire range.

### Decimal128

Provides:

```text
34 decimal digits of precision
```

and is designed for decimal arithmetic.

---

# 8. JavaScript Number vs MongoDB Number Types

This is especially important when using MongoDB with Node.js.

JavaScript has one main numeric primitive:

```js
number;
```

For example:

```js
const age = 22;
const price = 99.99;
```

JavaScript's `number` uses IEEE 754 double-precision floating-point representation.

MongoDB, however, supports:

```text
Int32
Int64
Double
Decimal128
```

Therefore:

```text
JavaScript
     │
     │ number
     ↓
MongoDB Driver
     │
     ├── Int32
     ├── Int64
     ├── Double
     └── Decimal128
```

---

# 9. NumberLong

`NumberLong` is a `mongosh` representation commonly used for BSON Int64 values.

Example:

```js
NumberLong("1234567890123");
```

It represents a 64-bit signed integer.

Example:

```js
db.users.insertOne({
  largeNumber: NumberLong("1234567890123"),
});
```

---

## Why Use a String Inside NumberLong?

For very large integers, using a string avoids JavaScript's normal `Number` precision limitations.

For example:

```js
NumberLong("9007199254740992");
```

is safer than trying to represent that value as an ordinary JavaScript number.

---

# 10. NumberDecimal

`NumberDecimal()` is a `mongosh` representation of BSON Decimal128.

Example:

```js
NumberDecimal("19.99");
```

Insert:

```js
db.products.insertOne({
  price: NumberDecimal("19.99"),
});
```

The string representation is important because it preserves the intended decimal value without first converting it through JavaScript's binary floating-point `Number`.

---

## Example

```js
db.products.insertOne({
  name: "Laptop",
  price: NumberDecimal("59999.99"),
});
```

Result conceptually:

```js
{
  name: "Laptop",
  price: Decimal128("59999.99")
}
```

---

# 11. NumberInt

`NumberInt()` is a `mongosh` representation of BSON Int32.

Example:

```js
NumberInt(100);
```

Insert:

```js
db.products.insertOne({
  quantity: NumberInt(100),
});
```

Result conceptually:

```js
{
  quantity: 100;
}
```

where the BSON type is Int32.

---

# 12. Creating Numeric Types in Node.js

The MongoDB Node.js driver provides classes for BSON numeric types.

You can import them from `mongodb`:

```js
import { Int32, Long, Decimal128 } from "mongodb";
```

---

## Int32

```js
const age = new Int32(22);
```

Example:

```js
const user = {
  name: "Sharvil",
  age: new Int32(22),
};

await users.insertOne(user);
```

---

## Int64

The Node.js driver uses the `Long` BSON type for 64-bit integers.

```js
const largeNumber = Long.fromString("9007199254740992");
```

Example:

```js
const document = {
  value: Long.fromString("9007199254740992"),
};

await collection.insertOne(document);
```

---

## Decimal128

Create Decimal128 using:

```js
const price = Decimal128.fromString("199.99");
```

Example:

```js
const product = {
  name: "Laptop",
  price: Decimal128.fromString("59999.99"),
};

await products.insertOne(product);
```

---

## Double

JavaScript `number` values are commonly encoded as BSON doubles when the driver does not otherwise preserve an integer representation.

For an explicitly typed BSON double, the Node.js driver also provides `Double`:

```js
import { Double } from "mongodb";

const value = new Double(99.99);
```

Example:

```js
const product = {
  price: new Double(99.99),
};

await products.insertOne(product);
```

---

# 13. Querying Numeric Values

MongoDB queries work across numeric BSON types using MongoDB's numeric comparison semantics.

Suppose:

```js
{
  name: "Laptop",
  price: 59999
}
```

You can query:

```js
db.products.find({
  price: 59999,
});
```

---

## Greater Than

```js
db.products.find({
  price: {
    $gt: 50000,
  },
});
```

---

## Less Than

```js
db.products.find({
  price: {
    $lt: 100000,
  },
});
```

---

## Greater Than or Equal

```js
db.products.find({
  price: {
    $gte: 50000,
  },
});
```

---

## Less Than or Equal

```js
db.products.find({
  price: {
    $lte: 100000,
  },
});
```

---

# 14. Updating Numeric Values

MongoDB provides update operators specifically useful for numeric values.

---

## `$inc`

`$inc` increments a numeric field.

```js
db.products.updateOne(
  { name: "Laptop" },
  {
    $inc: {
      stock: 1,
    },
  },
);
```

If:

```js
stock: 10;
```

After:

```js
stock: 11;
```

---

## Decrement Using `$inc`

You can provide a negative value:

```js
db.products.updateOne(
  { name: "Laptop" },
  {
    $inc: {
      stock: -1,
    },
  },
);
```

If:

```js
stock: 10;
```

After:

```js
stock: 9;
```

---

## `$mul`

`$mul` multiplies a numeric field.

```js
db.products.updateOne(
  { name: "Laptop" },
  {
    $mul: {
      price: 1.1,
    },
  },
);
```

This can be useful for percentage-based calculations, although financial applications should carefully choose numeric types and rounding rules.

---

## `$min`

`$min` updates the field only when the specified value is smaller.

```js
db.products.updateOne(
  { name: "Laptop" },
  {
    $min: {
      lowestPrice: 50000,
    },
  },
);
```

---

## `$max`

`$max` updates the field only when the specified value is larger.

```js
db.products.updateOne(
  { name: "Laptop" },
  {
    $max: {
      highestPrice: 70000,
    },
  },
);
```

---

# 15. Important Precision Example

JavaScript's `Number` uses binary floating-point.

For example:

```js
console.log(0.1 + 0.2);
```

You may see:

```text
0.30000000000000004
```

instead of:

```text
0.3
```

This happens because many decimal fractions cannot be represented exactly in binary floating-point.

---

## Why This Matters in MongoDB

Suppose you are storing money:

```js
{
  price: 0.1;
}
```

Using an ordinary JavaScript number means the value is handled using binary floating-point semantics.

For applications where exact decimal arithmetic matters, use Decimal128:

```js
{
  price: NumberDecimal("0.10");
}
```

In Node.js:

```js
{
  price: Decimal128.fromString("0.10");
}
```

---

# 16. Choosing the Correct Number Type

A simple decision guide:

```text
                    Need a number?
                         │
             ┌───────────┴───────────┐
             │                       │
          Integer?                Decimal?
             │                       │
       ┌─────┴─────┐           ┌─────┴─────┐
       │           │           │           │
    Small       Very large   Approximate   Exact decimal
    integer      integer     calculation   calculation
       │           │           │           │
     Int32        Int64      Double      Decimal128
```

---

## Use Int32 when:

The value is an ordinary integer that fits in the Int32 range.

Example:

```js
{
  age: 22,
  quantity: 50
}
```

---

## Use Int64 when:

You need a large integer beyond the safe exact range of JavaScript `Number` or beyond Int32.

Example:

```text
Large counters
Large sequence numbers
Large integer IDs
```

---

## Use Double when:

You need approximate floating-point calculations.

Examples:

```text
Scientific measurements
Coordinates
Ratios
Some analytics
```

---

## Use Decimal128 when:

Exact decimal arithmetic is important.

Examples:

```text
Money
Currency
Accounting
Tax
Financial calculations
```

---

# 17. Common Mistakes

## Mistake 1: Thinking all MongoDB numbers are the same type

MongoDB has multiple numeric BSON types:

```text
Int32
Int64
Double
Decimal128
```

The BSON type can matter for precision, storage, and application behavior.

---

## Mistake 2: Using JavaScript Number for very large integers

JavaScript `Number` can exactly represent integers only up to:

```text
9,007,199,254,740,991
```

which is:

```text
2^53 - 1
```

Beyond this safe integer range, use an appropriate representation such as BSON Int64 (`Long`) or another suitable type.

---

## Mistake 3: Using Double for financial precision

Avoid relying on binary floating-point when exact decimal arithmetic is required.

Prefer:

```js
Decimal128.fromString("199.99");
```

for monetary values that need decimal precision.

---

## Mistake 4: Creating Decimal128 from an already-rounded JavaScript Number

Avoid:

```js
Decimal128.fromString(String(0.1 + 0.2));
```

if your intention was exact decimal `0.3`.

Instead, construct it from the intended decimal representation:

```js
Decimal128.fromString("0.3");
```

---

## Mistake 5: Using a number for an identifier without considering precision

If an identifier can exceed JavaScript's safe integer range, don't store it as an ordinary JavaScript `Number`.

For example, instead of:

```js
{
  transactionId: 9007199254740993;
}
```

consider a suitable representation such as:

```js
{
  transactionId: Long.fromString("9007199254740993");
}
```

or a string, depending on the application's requirements.

---

# 18. Interview Questions

## Q1. What numeric data types does MongoDB support?

MongoDB supports four main numeric BSON types:

```text
Double
Int32
Int64
Decimal128
```

---

## Q2. What is the difference between Int32 and Int64?

`Int32` is a 32-bit signed integer.

Range:

```text
-2,147,483,648
to
2,147,483,647
```

`Int64` is a 64-bit signed integer.

Range:

```text
-9,223,372,036,854,775,808
to
9,223,372,036,854,775,807
```

---

## Q3. What is Decimal128 used for?

Decimal128 is used for high-precision decimal arithmetic.

It is particularly useful for:

- Money
- Currency
- Accounting
- Financial calculations

---

## Q4. What is Double?

Double is an IEEE 754 64-bit floating-point BSON type.

It is useful for approximate floating-point calculations.

---

## Q5. How many bytes does Int32 use?

```text
4 bytes
```

---

## Q6. How many bytes does Int64 use?

```text
8 bytes
```

---

## Q7. How many bytes does Double use?

```text
8 bytes
```

---

## Q8. How many bytes does Decimal128 use?

```text
16 bytes
```

---

## Q9. What is `NumberLong()`?

`NumberLong()` is a `mongosh` representation commonly used for BSON Int64 values.

Example:

```js
NumberLong("9007199254740992");
```

---

## Q10. What is `NumberDecimal()`?

`NumberDecimal()` is a `mongosh` representation of BSON Decimal128.

Example:

```js
NumberDecimal("199.99");
```

---

## Q11. What is `NumberInt()`?

`NumberInt()` is a `mongosh` representation of BSON Int32.

Example:

```js
NumberInt(100);
```

---

## Q12. What is the maximum safe integer in JavaScript?

JavaScript's `Number` can exactly represent integers up to:

```text
9,007,199,254,740,991
```

which is:

```text
Number.MAX_SAFE_INTEGER
```

or:

```js
2 ** 53 - 1;
```

For integers larger than this, consider BSON Int64/`Long`, `Decimal128`, or a string depending on the use case.

---

## Q13. Which MongoDB type should be used for money?

When exact decimal arithmetic is required, **Decimal128** is generally the appropriate MongoDB numeric type.

Example:

```js
Decimal128.fromString("199.99");
```

---

## Q14. Why shouldn't we blindly use Double for money?

Double uses binary floating-point representation, so some decimal fractions cannot be represented exactly.

Decimal128 provides decimal arithmetic designed for exact decimal values within its supported precision.

---

## Q15. How do you create Decimal128 in Node.js?

```js
import { Decimal128 } from "mongodb";

const price = Decimal128.fromString("199.99");
```

---

## Q16. How do you create Int64 in Node.js?

The MongoDB Node.js driver uses `Long`:

```js
import { Long } from "mongodb";

const value = Long.fromString("9007199254740992");
```

---

# 19. Quick Revision

## MongoDB Numeric Types

```text
┌────────────┬─────────┬─────────────────────────┐
│ Type       │ Size    │ Main Use                │
├────────────┼─────────┼─────────────────────────┤
│ Int32      │ 4 bytes │ 32-bit integers         │
│ Int64      │ 8 bytes │ Large integers          │
│ Double     │ 8 bytes │ Floating-point values   │
│ Decimal128 │ 16 bytes│ Precise decimals        │
└────────────┴─────────┴─────────────────────────┘
```

---

## Int32

```js
NumberInt(100);
```

Range:

```text
-2,147,483,648
to
2,147,483,647
```

---

## Int64

```js
NumberLong("9007199254740992");
```

Node.js:

```js
Long.fromString("9007199254740992");
```

---

## Double

```js
99.99;
```

Node.js explicit BSON type:

```js
new Double(99.99);
```

---

## Decimal128

```js
NumberDecimal("199.99");
```

Node.js:

```js
Decimal128.fromString("199.99");
```

---

## JavaScript Safe Integer

```js
Number.MAX_SAFE_INTEGER;
```

equals:

```text
9,007,199,254,740,991
```

---

# 20. MongoDB Learning Progress

```text
MongoDB
│
├── Database
├── Collections
├── Documents
├── BSON
│   ├── ObjectId       ✅
│   └── Number Types   ✅
│       ├── Int32
│       ├── Int64
│       ├── Double
│       └── Decimal128
│
└── CRUD
    ├── Create         ✅
    ├── Read           ✅
    ├── Update         ✅
    └── Delete         ✅
```

### Recommended Next BSON Data Types

After ObjectId and Number types, useful BSON types to learn are:

```text
String
Boolean
Date
Array
Embedded Document
Null
Binary Data
Regular Expression
```

After BSON types, continue with:

```text
Indexes
    ↓
Aggregation Pipeline
    ↓
Schema Design
    ↓
Relationships
    ↓
MongoDB + Express REST API
    ↓
Transactions
```

---

# Final Takeaway

MongoDB has four major numeric BSON types:

```text
Int32
Int64
Double
Decimal128
```

Remember them like this:

```text
Int32
  ↓
Normal 32-bit integers

Int64
  ↓
Large integers

Double
  ↓
Approximate floating-point calculations

Decimal128
  ↓
Precise decimal calculations
  ↓
Especially useful for money
```

For Node.js:

```js
import { Int32, Long, Double, Decimal128 } from "mongodb";
```

Examples:

```js
new Int32(100);

Long.fromString("9007199254740992");

new Double(99.99);

Decimal128.fromString("199.99");
```

The most important concept is that **JavaScript's `Number` and MongoDB's BSON numeric types are not exactly the same thing**. When working with large integers or precise decimal values, you need to deliberately choose an appropriate BSON type.
