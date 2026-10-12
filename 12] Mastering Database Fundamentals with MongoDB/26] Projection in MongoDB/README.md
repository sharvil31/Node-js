# Projection in MongoDB

## Table of Contents

1. [Introduction](#1-introduction)
2. [Syntax of Projection](#2-syntax-of-projection)
3. [Sample Collection](#3-sample-collection)
4. [Including Specific Fields](#4-including-specific-fields)
5. [Excluding Specific Fields](#5-excluding-specific-fields)
6. [Understanding the `_id` Field](#6-understanding-the-_id-field)
7. [Inclusion vs Exclusion](#7-inclusion-vs-exclusion)
8. [Projection with Query Filters](#8-projection-with-query-filters)
9. [Projection with `findOne()`](#9-projection-with-findone)
10. [Projection on Nested Fields](#10-projection-on-nested-fields)
11. [Projection on Array Fields](#11-projection-on-array-fields)
12. [Projection in MongoDB Node.js Driver](#12-projection-in-mongodb-nodejs-driver)
13. [Projection and Aggregation](#13-projection-and-aggregation)
14. [Benefits of Projection](#14-benefits-of-projection)
15. [Common Mistakes](#15-common-mistakes)
16. [Interview Questions and Answers](#16-interview-questions-and-answers)
17. [Quick Revision](#17-quick-revision)
18. [Conclusion](#18-conclusion)

---

## 1. Introduction

**Projection in MongoDB** is a feature that allows us to specify which fields should be included or excluded in the documents returned by a query.

By default, MongoDB returns all fields of a matching document. Projection helps us retrieve only the fields required by our application.

For example, a user document may contain:

- `_id`
- `name`
- `age`
- `email`
- `city`
- `password`

If an application needs only the user's name and email address, projection allows us to return those fields instead of the entire document.

### Why Do We Need Projection?

- To retrieve only the required fields.
- To reduce the amount of data transferred between MongoDB and the application.
- To produce cleaner query results.
- To avoid unnecessarily returning sensitive or irrelevant fields.
- To reduce the amount of data processed by the application.

**Important:** Projection controls the fields returned by a query. It does not modify the original documents stored in the collection.

---

## 2. Syntax of Projection

The `find()` method accepts two primary arguments: a filter and an optional projection.

```javascript
db.collection.find(filter, projection);
```

### Parameters

| Parameter    | Description                                                                      |
| ------------ | -------------------------------------------------------------------------------- |
| `filter`     | Specifies which documents should match the query.                                |
| `projection` | Specifies which fields should be included or excluded in the returned documents. |

Example:

```javascript
db.users.find({ age: { $gte: 18 } }, { name: 1, email: 1, _id: 0 });
```

Explanation:

- `{ age: { $gte: 18 } }` is the filter.
- `{ name: 1, email: 1, _id: 0 }` is the projection.
- Only matching users' names and email addresses are returned.
- The `_id` field is excluded.

---

## 3. Sample Collection

Consider a collection named `users`.

```javascript
db.users.insertMany([
  {
    _id: 1,
    name: "Sharvil",
    age: 22,
    email: "sharvil@example.com",
    city: "Mumbai",
    password: "secret123",
  },
  {
    _id: 2,
    name: "Rahul",
    age: 25,
    email: "rahul@example.com",
    city: "Pune",
    password: "secret456",
  },
  {
    _id: 3,
    name: "Priya",
    age: 20,
    email: "priya@example.com",
    city: "Nashik",
    password: "secret789",
  },
]);
```

The following examples use this collection.

> Note: These documents are simplified examples for learning purposes. Passwords should never be stored as plain text in a real application.

---

## 4. Including Specific Fields

To include specific fields in the query results, set their projection values to `1`.

### Example 1: Include Only the Name

```javascript
db.users.find({}, { name: 1 });
```

Example output:

```javascript
[
  {
    _id: 1,
    name: "Sharvil",
  },
  {
    _id: 2,
    name: "Rahul",
  },
  {
    _id: 3,
    name: "Priya",
  },
];
```

Only `name` and `_id` are returned.

The `_id` field appears automatically because MongoDB includes it by default unless it is explicitly excluded.

### Example 2: Include Name and Email

```javascript
db.users.find(
  {},
  {
    name: 1,
    email: 1,
  },
);
```

Example output:

```javascript
[
  {
    _id: 1,
    name: "Sharvil",
    email: "sharvil@example.com",
  },
  {
    _id: 2,
    name: "Rahul",
    email: "rahul@example.com",
  },
  {
    _id: 3,
    name: "Priya",
    email: "priya@example.com",
  },
];
```

Other fields, such as `age`, `city`, and `password`, are omitted.

### Example 3: Include Name and Email Without `_id`

```javascript
db.users.find(
  {},
  {
    _id: 0,
    name: 1,
    email: 1,
  },
);
```

Example output:

```javascript
[
  {
    name: "Sharvil",
    email: "sharvil@example.com",
  },
  {
    name: "Rahul",
    email: "rahul@example.com",
  },
  {
    name: "Priya",
    email: "priya@example.com",
  },
];
```

This is useful when an API response should contain only the fields required by the frontend.

---

## 5. Excluding Specific Fields

To exclude fields, set their projection values to `0`.

When using exclusion projection, MongoDB returns all other fields by default.

### Example 1: Exclude Password

```javascript
db.users.find({}, { password: 0 });
```

Example output:

```javascript
[
  {
    _id: 1,
    name: "Sharvil",
    age: 22,
    email: "sharvil@example.com",
    city: "Mumbai",
  },
  {
    _id: 2,
    name: "Rahul",
    age: 25,
    email: "rahul@example.com",
    city: "Pune",
  },
  {
    _id: 3,
    name: "Priya",
    age: 20,
    email: "priya@example.com",
    city: "Nashik",
  },
];
```

The `password` field is omitted, while the other fields remain.

### Example 2: Exclude Multiple Fields

```javascript
db.users.find(
  {},
  {
    password: 0,
    city: 0,
  },
);
```

All fields are returned except `password` and `city`.

### Important Difference

Inclusion projection selects the fields to return.

Exclusion projection selects the fields to omit.

You generally cannot mix these two approaches in the same projection, except for the special handling of `_id`.

---

## 6. Understanding the `_id` Field

The `_id` field is MongoDB's primary identifier for a document.

MongoDB automatically generates an `_id` field when a document is inserted without one. By default, its value is an `ObjectId`.

### Example 1: Automatic `_id` Generation

```javascript
db.users.insertOne({
  name: "Amit",
  age: 24,
});
```

MongoDB automatically adds an `_id` field if one was not supplied.

A document may look like this:

```javascript
{
    _id: ObjectId("..."),
    name: "Amit",
    age: 24
}
```

The actual `ObjectId` will be generated by MongoDB.

### Example 2: Supplying a Custom `_id`

```javascript
db.users.insertOne({
  _id: 101,
  name: "Amit",
  age: 24,
});
```

MongoDB uses `101` as the document's `_id`.

The `_id` field does not have to contain an `ObjectId`. It can use another supported BSON value, such as a string or number.

### Is `_id` Automatically Included in Query Results?

Yes. MongoDB includes `_id` in query results by default.

```javascript
db.users.find({}, { name: 1 });
```

Example output:

```javascript
{
    _id: 1,
    name: "Sharvil"
}
```

To exclude it:

```javascript
db.users.find(
  {},
  {
    name: 1,
    _id: 0,
  },
);
```

Example output:

```javascript
{
  name: "Sharvil";
}
```

### Important Rules About `_id`

1. MongoDB automatically creates `_id` when it is omitted during insertion.
2. `_id` is included in query results by default.
3. Projection can exclude `_id` by setting `_id: 0`.
4. You can supply a custom `_id` when inserting a document.
5. `_id` values must be unique within a collection.

---

## 7. Inclusion vs Exclusion

| Feature          | Inclusion (`1`)                 | Exclusion (`0`)                        |
| ---------------- | ------------------------------- | -------------------------------------- |
| Purpose          | Select fields to return         | Select fields to omit                  |
| Default behavior | Other fields are omitted        | Other fields are retained              |
| `_id` behavior   | Included by default             | Included unless excluded               |
| Example          | `{ name: 1, age: 1 }`           | `{ password: 0 }`                      |
| Typical use case | Return a specific set of fields | Remove selected fields from the result |

### Valid Inclusion Projection

```javascript
db.users.find(
  {},
  {
    name: 1,
    email: 1,
    _id: 0,
  },
);
```

### Valid Exclusion Projection

```javascript
db.users.find(
  {},
  {
    password: 0,
    city: 0,
  },
);
```

### Invalid Mixed Projection

```javascript
db.users.find(
  {},
  {
    name: 1,
    password: 0,
  },
);
```

This causes an error because it mixes inclusion and exclusion.

The `_id` field is the exception: it may be excluded from an inclusion projection.

For example, this is valid:

```javascript
db.users.find(
  {},
  {
    name: 1,
    email: 1,
    _id: 0,
  },
);
```

---

## 8. Projection with Query Filters

Projection can be combined with filters to control both the matching documents and the returned fields.

### Example: Find Users from Mumbai

```javascript
db.users.find(
  { city: "Mumbai" },
  {
    name: 1,
    email: 1,
    _id: 0,
  },
);
```

Example output:

```javascript
[
  {
    name: "Sharvil",
    email: "sharvil@example.com",
  },
];
```

Explanation:

- The filter selects users whose `city` is `"Mumbai"`.
- The projection returns only `name` and `email`.
- The `_id` field is excluded.

### Example: Find Adults and Return Their Names

```javascript
db.users.find(
  { age: { $gte: 18 } },
  {
    name: 1,
    _id: 0,
  },
);
```

This returns the names of users whose age is greater than or equal to 18.

**Remember:** Filtering decides which documents match; projection decides which fields those documents contain in the query results.

---

## 9. Projection with `findOne()`

Projection can also be used with `findOne()` to return a single matching document containing only the required fields.

### Example

```javascript
db.users.findOne(
  { name: "Sharvil" },
  {
    name: 1,
    email: 1,
    _id: 0,
  },
);
```

Example output:

```javascript
{
    name: "Sharvil",
    email: "sharvil@example.com"
}
```

Unlike `find()`, which returns a cursor, `findOne()` returns one matching document or `null` if no matching document exists.

---

## 10. Projection on Nested Fields

MongoDB supports projection on nested document fields using dot notation.

Consider this document:

```javascript
{
    name: "Sharvil",
    address: {
        city: "Mumbai",
        state: "Maharashtra",
        country: "India"
    }
}
```

### Example 1: Include Only the Nested City

```javascript
db.users.find(
  {},
  {
    name: 1,
    "address.city": 1,
    _id: 0,
  },
);
```

Example output:

```javascript
{
    name: "Sharvil",
    address: {
        city: "Mumbai"
    }
}
```

### Example 2: Exclude the Nested Country

```javascript
db.users.find(
  {},
  {
    "address.country": 0,
  },
);
```

The other fields are returned, but `address.country` is omitted.

**Note:** Use quotation marks around dotted field paths, such as `"address.city"`, in JavaScript query objects.

---

## 11. Projection on Array Fields

MongoDB provides projection operators for retrieving specific portions or matching elements of arrays.

### Example Document

```javascript
{
    name: "Sharvil",
    scores: [70, 85, 90, 95, 100]
}
```

### Example 1: Using `$slice`

The `$slice` projection operator returns a specified number of elements from an array.

Return the first two elements:

```javascript
db.users.find(
  {},
  {
    name: 1,
    scores: { $slice: 2 },
    _id: 0,
  },
);
```

Example output:

```javascript
{
    name: "Sharvil",
    scores: [70, 85]
}
```

Return the last two elements:

```javascript
db.users.find(
  {},
  {
    scores: { $slice: -2 },
  },
);
```

Example output:

```javascript
{
    _id: 1,
    scores: [95, 100]
}
```

### Example 2: Using `$elemMatch`

The `$elemMatch` projection operator returns only the first array element that matches the specified condition.

Consider:

```javascript
{
    name: "Sharvil",
    scores: [60, 75, 90, 95]
}
```

Query:

```javascript
db.users.find(
  {},
  {
    scores: {
      $elemMatch: {
        $gte: 90,
      },
    },
    _id: 0,
  },
);
```

Example output:

```javascript
{
  scores: [90];
}
```

### Example 3: Positional `$` Projection

The positional `$` projection operator returns the first array element that matches the array condition in the query.

For example, if a document contains:

```javascript
{
    name: "Sharvil",
    scores: [60, 75, 90, 95]
}
```

Query:

```javascript
db.users.find({ scores: 90 }, { "scores.$": 1 });
```

The matching array element is returned:

```javascript
{
    _id: ObjectId("..."),
    scores: [90]
}
```

The examples illustrate different approaches; choose the operator based on whether you need a slice, a condition-based match, or the positional match associated with the query.

---

## 12. Projection in MongoDB Node.js Driver

When using MongoDB with Node.js, projection is passed through the `projection` option in the `find()` options object.

### Example

```javascript
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

async function main() {
  try {
    await client.connect();

    const db = client.db("myDatabase");
    const users = db.collection("users");

    const result = await users
      .find(
        {},
        {
          projection: {
            name: 1,
            email: 1,
            _id: 0,
          },
        },
      )
      .toArray();

    console.log(result);
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    await client.close();
  }
}

main();
```

### Explanation

1. `MongoClient` creates a connection to MongoDB.
2. `client.db()` selects the database.
3. `db.collection()` selects the collection.
4. `find()` retrieves matching documents.
5. The `projection` option selects the required fields.
6. `toArray()` collects the cursor results into an array.
7. `finally` ensures that the client connection is closed.

### Projection with a Filter in Node.js

```javascript
const result = await users
  .find(
    { city: "Mumbai" },
    {
      projection: {
        name: 1,
        email: 1,
        _id: 0,
      },
    },
  )
  .toArray();
```

This returns only the names and email addresses of users from Mumbai.

### Projection with `findOne()` in Node.js

```javascript
const user = await users.findOne(
  { name: "Sharvil" },
  {
    projection: {
      name: 1,
      email: 1,
      _id: 0,
    },
  },
);

console.log(user);
```

The result is a single document or `null`.

---

## 13. Projection and Aggregation

Projection can also be performed in an aggregation pipeline using the `$project` stage.

### Example

```javascript
db.users.aggregate([
  {
    $project: {
      name: 1,
      email: 1,
      _id: 0,
    },
  },
]);
```

This returns only the `name` and `email` fields.

### `$project` vs `find()` Projection

| Feature         | `find()` Projection                | `$project`                                |
| --------------- | ---------------------------------- | ----------------------------------------- |
| Usage           | With `find()` or `findOne()`       | In an aggregation pipeline                |
| Purpose         | Include or exclude returned fields | Shape documents and compute output fields |
| Computed fields | Limited projection operators       | Supports aggregation expressions          |
| Typical use     | Simple document retrieval          | Data transformation and reporting         |

For example, `$project` can create a new field using an expression:

```javascript
db.users.aggregate([
  {
    $project: {
      name: 1,
      isAdult: {
        $gte: ["$age", 18],
      },
      _id: 0,
    },
  },
]);
```

This returns each user's name and a computed Boolean field called `isAdult`.

---

## 14. Benefits of Projection

### 1. Reduced Data Transfer

Returning only the necessary fields reduces the amount of data sent to the application.

### 2. Cleaner API Responses

Projection helps produce structured responses that are easier for frontend applications to consume.

### 3. Less Unnecessary Data Exposure

Fields that are not required can be excluded from query results.

However, projection is not a substitute for authorization or access control.

### 4. Improved Application Efficiency

Smaller result documents may reduce the amount of data the application needs to process.

### 5. Better Control Over Output

Projection allows developers to define which fields should be present in the returned documents.

**Performance note:** Projection does not automatically make every query faster. Actual performance depends on document size, indexes, query patterns, and whether MongoDB can satisfy the query through a covered index.

---

## 15. Common Mistakes

### Mistake 1: Forgetting `_id` Is Included by Default

Incorrect expectation:

```javascript
db.users.find({}, { name: 1 });
```

The result includes `_id`.

Correct query when only `name` is needed:

```javascript
db.users.find(
  {},
  {
    name: 1,
    _id: 0,
  },
);
```

### Mistake 2: Mixing Inclusion and Exclusion

Invalid:

```javascript
db.users.find(
  {},
  {
    name: 1,
    password: 0,
  },
);
```

Use either inclusion or exclusion, except for excluding `_id` in an inclusion projection.

### Mistake 3: Confusing Filter and Projection

Incorrect understanding:

```javascript
db.users.find({ name: 1 }, { age: 1 });
```

The first object is a filter, not a projection. `{ name: 1 }` matches documents whose `name` field equals `1`; it does not mean "include the name field."

Correct:

```javascript
db.users.find(
  { city: "Mumbai" },
  {
    name: 1,
    age: 1,
    _id: 0,
  },
);
```

### Mistake 4: Thinking Projection Modifies Stored Data

Projection changes the returned result, not the stored document.

To modify stored data, use update operations such as `updateOne()` or `updateMany()`.

### Mistake 5: Assuming Projection Alone Secures Sensitive Fields

Excluding a password from one query does not guarantee that it will be excluded from every API response. Apply consistent access controls and response shaping throughout the application.

---

## 16. Interview Questions and Answers

### Q1. What is projection in MongoDB?

Projection is a feature that specifies which fields should be included or excluded in the documents returned by a query.

### Q2. Why do we use projection?

We use projection to retrieve only the required fields, reduce unnecessary data transfer, and produce cleaner query results.

### Q3. How do you include a field in projection?

Set the field to `1`.

```javascript
db.users.find({}, { name: 1 });
```

### Q4. How do you exclude a field?

Set the field to `0`.

```javascript
db.users.find({}, { password: 0 });
```

### Q5. Is `_id` automatically included in query results?

Yes. MongoDB includes `_id` by default unless it is explicitly excluded.

### Q6. How do you exclude `_id`?

```javascript
db.users.find(
  {},
  {
    name: 1,
    _id: 0,
  },
);
```

### Q7. Can we mix inclusion and exclusion in projection?

Generally, no. The exception is `_id`, which can be excluded while other fields are included.

### Q8. What is the difference between a filter and a projection?

A filter determines which documents match the query. A projection determines which fields are returned from those documents.

### Q9. Does projection modify the original document?

No. Projection affects only the returned query results.

### Q10. Can projection be used with `findOne()`?

Yes. The projection can be supplied through the options argument of `findOne()`.

### Q11. How do you project a nested field?

Use dot notation.

```javascript
db.users.find({}, { "address.city": 1 });
```

### Q12. What is `$slice` in projection?

`$slice` returns a specified portion of an array.

```javascript
db.users.find({}, { scores: { $slice: 2 } });
```

### Q13. What is the difference between `find()` projection and `$project`?

`find()` projection selects fields in ordinary queries, while `$project` is an aggregation stage that can also transform documents and calculate new fields.

### Q14. Does projection always improve query performance?

No. It can reduce the amount of data returned, but the overall performance benefit depends on the query, document structure, indexes, and execution plan.

### Q15. Is `_id` always an `ObjectId`?

No. MongoDB can use other supported BSON types for `_id`, including strings and numbers, provided the value is unique within the collection.

---

## 17. Quick Revision

| Requirement                     | Projection                  |
| ------------------------------- | --------------------------- |
| Include `name`                  | `{ name: 1 }`               |
| Include `name` and `email`      | `{ name: 1, email: 1 }`     |
| Exclude `_id`                   | `{ _id: 0 }`                |
| Exclude `password`              | `{ password: 0 }`           |
| Include `name` without `_id`    | `{ name: 1, _id: 0 }`       |
| Include a nested city           | `{ "address.city": 1 }`     |
| Return first two array elements | `{ scores: { $slice: 2 } }` |

### Remember These Three Rules

1. `1` means include the field.
2. `0` means exclude the field.
3. `_id` is included by default unless explicitly excluded.

Example combining a filter and projection:

```javascript
db.users.find(
  { age: { $gte: 18 } },
  {
    name: 1,
    email: 1,
    _id: 0,
  },
);
```

This returns users aged 18 or older, showing only their names and email addresses.

---

## 18. Conclusion

Projection is an important MongoDB feature that allows developers to control which fields are returned by queries.

It supports inclusion and exclusion, works with filters and `findOne()`, handles nested fields and arrays, and is available in the MongoDB Node.js driver.

Understanding projection is essential for building efficient queries, creating clean API responses, and avoiding unnecessary data exposure.

**Core concept:** Filtering determines which documents are returned, while projection determines which fields appear in those documents.
