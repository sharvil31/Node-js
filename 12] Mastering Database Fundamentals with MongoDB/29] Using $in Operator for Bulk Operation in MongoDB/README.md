# `$in` Operator for Bulk Operations in MongoDB

## Table of Contents

1. [Introduction](#1-introduction)
2. [What Is the `$in` Operator?](#2-what-is-the-in-operator)
3. [Sample Collection](#3-sample-collection)
4. [Using `$in` with `find()`](#4-using-in-with-find)
5. [Using `$in` with `updateMany()`](#5-using-in-with-updatemany)
6. [Using `$in` with `deleteMany()`](#6-using-in-with-deletemany)
7. [Using `$in` with `bulkWrite()`](#7-using-in-with-bulkwrite)
8. [Using `$in` with Projection](#8-using-in-with-projection)
9. [Using `$in` with Array Fields](#9-using-in-with-array-fields)
10. [`$in` vs `$or`](#10-in-vs-or)
11. [`updateMany()` vs `bulkWrite()`](#11-updatemany-vs-bulkwrite)
12. [Using `$in` in Node.js](#12-using-in-in-nodejs)
13. [Performance Considerations](#13-performance-considerations)
14. [Common Mistakes](#14-common-mistakes)
15. [Interview Questions and Answers](#15-interview-questions-and-answers)
16. [Quick Revision](#16-quick-revision)
17. [Conclusion](#17-conclusion)

---

## 1. Introduction

MongoDB provides several query operators that allow developers to retrieve, update, and delete documents based on specific conditions.

The `$in` operator is used to match documents where a field's value equals any value in a specified array.

It is particularly useful when working with multiple possible values.

For example, suppose we want to retrieve users who live in Mumbai, Pune, or Nashik. Instead of writing separate queries for each city, we can use `$in` to match all three values in a single query.

The `$in` operator can be used with methods such as:

- `find()`
- `findOne()`
- `updateOne()`
- `updateMany()`
- `deleteOne()`
- `deleteMany()`

It can also be used inside the filters of write operations passed to `bulkWrite()`.

### What Is a Bulk Operation?

A bulk operation involves processing multiple write operations together.

MongoDB provides methods such as `updateMany()`, `deleteMany()`, and `bulkWrite()` for different bulk-processing requirements.

It is important to understand that `$in` and bulk operations serve different purposes:

- `$in` specifies which values should match.
- Bulk methods determine which write operations are performed.

---

## 2. What Is the `$in` Operator?

The `$in` operator selects documents where the specified field matches at least one value in the supplied array.

### Syntax

```javascript
{
  fieldName: {
    $in: [value1, value2, value3];
  }
}
```

### Example

```javascript
db.users.find({
  city: {
    $in: ["Mumbai", "Pune", "Nashik"],
  },
});
```

This query returns all documents whose `city` field matches `"Mumbai"`, `"Pune"`, or `"Nashik"`.

### How Does It Work?

Suppose the collection contains users from five cities:

- Mumbai
- Pune
- Nashik
- Delhi
- Bengaluru

If we execute:

```javascript
db.users.find({
  city: {
    $in: ["Mumbai", "Pune"],
  },
});
```

MongoDB returns documents where `city` is either `"Mumbai"` or `"Pune"`.

Documents from other cities do not match.

**Important:** `$in` does not require every specified value to match. A document only needs to satisfy the condition for at least one of the values.

---

## 3. Sample Collection

Let's create a collection named `users`.

```javascript
db.users.insertMany([
  {
    _id: 1,
    name: "Sharvil",
    city: "Mumbai",
    status: "active",
    age: 22,
  },
  {
    _id: 2,
    name: "Rahul",
    city: "Pune",
    status: "active",
    age: 25,
  },
  {
    _id: 3,
    name: "Priya",
    city: "Nashik",
    status: "inactive",
    age: 20,
  },
  {
    _id: 4,
    name: "Amit",
    city: "Delhi",
    status: "active",
    age: 24,
  },
  {
    _id: 5,
    name: "Sneha",
    city: "Mumbai",
    status: "inactive",
    age: 23,
  },
]);
```

We will use these documents in the following examples.

---

## 4. Using `$in` with `find()`

The `find()` method retrieves documents matching a filter.

We can use `$in` in the filter to match multiple possible values.

### Example 1: Find Users from Multiple Cities

```javascript
db.users.find({
  city: {
    $in: ["Mumbai", "Pune"],
  },
});
```

Example output:

```javascript
[
  {
    _id: 1,
    name: "Sharvil",
    city: "Mumbai",
    status: "active",
    age: 22,
  },
  {
    _id: 2,
    name: "Rahul",
    city: "Pune",
    status: "active",
    age: 25,
  },
  {
    _id: 5,
    name: "Sneha",
    city: "Mumbai",
    status: "inactive",
    age: 23,
  },
];
```

Three documents match the condition.

### Example 2: Find Users with Specific Statuses

```javascript
db.users.find({
  status: {
    $in: ["active", "pending"],
  },
});
```

This returns documents whose status is either `"active"` or `"pending"`.

### Example 3: Combine `$in` with Another Condition

```javascript
db.users.find({
  city: {
    $in: ["Mumbai", "Pune"],
  },
  age: {
    $gte: 23,
  },
});
```

This query returns users who:

1. Live in Mumbai or Pune.
2. Have an age greater than or equal to 23.

When multiple conditions are supplied as separate fields in a query document, MongoDB combines them using implicit AND logic.

---

## 5. Using `$in` with `updateMany()`

The `updateMany()` method updates every document matching the specified filter.

When `$in` is used in the filter, multiple groups of documents can match the same update operation.

### Example: Update Users from Mumbai and Pune

Suppose we want to set the status of users from Mumbai or Pune to `"verified"`.

```javascript
db.users.updateMany(
  {
    city: {
      $in: ["Mumbai", "Pune"],
    },
  },
  {
    $set: {
      status: "verified",
    },
  },
);
```

### Explanation

**First argument — Filter**

```javascript
{
  city: {
    $in: ["Mumbai", "Pune"];
  }
}
```

Selects users whose city is Mumbai or Pune.

**Second argument — Update**

```javascript
{
  $set: {
    status: "verified";
  }
}
```

Sets the `status` field to `"verified"` for every matching document.

### Example Result

```javascript
{
    acknowledged: true,
    matchedCount: 3,
    modifiedCount: 3
}
```

The counts are illustrative. Actual values depend on the current collection contents.

- `acknowledged`: Indicates whether MongoDB acknowledged the write.
- `matchedCount`: The number of documents matching the filter.
- `modifiedCount`: The number of documents whose stored values actually changed.

If a matching document already has `status: "verified"`, it may count as matched but not modified.

### Important Point

`updateMany()` applies the same update definition to all matching documents. It does not assign a different update to each matching city.

---

## 6. Using `$in` with `deleteMany()`

The `deleteMany()` method removes every document matching the specified filter.

### Example: Delete Users from Delhi and Nashik

```javascript
db.users.deleteMany({
  city: {
    $in: ["Delhi", "Nashik"],
  },
});
```

This deletes all users whose city is either Delhi or Nashik.

Example result:

```javascript
{
    acknowledged: true,
    deletedCount: 2
}
```

The count is based on the original sample collection.

### Safety Tip

Before deleting documents, inspect the matching records:

```javascript
db.users.find({
  city: {
    $in: ["Delhi", "Nashik"],
  },
});
```

Only execute `deleteMany()` after confirming that the filter selects the intended documents.

---

## 7. Using `$in` with `bulkWrite()`

The `bulkWrite()` method allows us to submit multiple write operations in a single method call.

Supported operation types include:

- `insertOne`
- `updateOne`
- `updateMany`
- `replaceOne`
- `deleteOne`
- `deleteMany`

The `$in` operator can be used inside the filter of these operations.

### Example: Update and Delete in One Bulk Operation

Suppose we want to:

1. Update users from Mumbai and Pune to `"verified"`.
2. Delete users from Delhi.
3. Update Priya's age to 21.

We can execute these operations together:

```javascript
db.users.bulkWrite([
  {
    updateMany: {
      filter: {
        city: {
          $in: ["Mumbai", "Pune"],
        },
      },
      update: {
        $set: {
          status: "verified",
        },
      },
    },
  },
  {
    deleteMany: {
      filter: {
        city: {
          $in: ["Delhi"],
        },
      },
    },
  },
  {
    updateOne: {
      filter: {
        name: "Priya",
      },
      update: {
        $set: {
          age: 21,
        },
      },
    },
  },
]);
```

### How It Works

**Operation 1: `updateMany`**

```javascript
{
    updateMany: {
        filter: {
            city: {
                $in: ["Mumbai", "Pune"]
            }
        },
        update: {
            $set: {
                status: "verified"
            }
        }
    }
}
```

Updates every matching user from Mumbai or Pune.

**Operation 2: `deleteMany`**

```javascript
{
  deleteMany: {
    filter: {
      city: {
        $in: ["Delhi"];
      }
    }
  }
}
```

Deletes every user from Delhi.

**Operation 3: `updateOne`**

```javascript
{
    updateOne: {
        filter: {
            name: "Priya"
        },
        update: {
            $set: {
                age: 21
            }
        }
    }
}
```

Updates one matching document for Priya.

### Example Bulk Result

A successful bulk write may return a summary containing fields such as:

```javascript
{
    acknowledged: true,
    matchedCount: 4,
    modifiedCount: 4,
    deletedCount: 1
}
```

The exact result depends on the collection's current state and whether the updates modify any values.

### Ordered vs Unordered Bulk Operations

By default, MongoDB executes bulk write operations in ordered mode.

#### Ordered Bulk Write

```javascript
db.users.bulkWrite(
  [
    // Write operations
  ],
  {
    ordered: true,
  },
);
```

- Operations are executed in the specified order.
- If an operation encounters an error, subsequent operations are generally not executed.
- Earlier successful operations are not automatically rolled back.

#### Unordered Bulk Write

```javascript
db.users.bulkWrite(
  [
    // Write operations
  ],
  {
    ordered: false,
  },
);
```

- MongoDB attempts to execute the remaining operations even if an operation fails.
- The server may execute operations in a different order.
- It is useful when independent operations should continue despite individual failures.

**Important:** `bulkWrite()` does not automatically make all operations one atomic transaction. If you require all-or-nothing behavior across multiple operations, consider using a transaction where supported and appropriate.

---

## 8. Using `$in` with Projection

Projection controls which fields are returned from matching documents.

You can combine `$in` with projection to retrieve only the required fields.

### Example

```javascript
db.users.find(
  {
    city: {
      $in: ["Mumbai", "Pune"],
    },
  },
  {
    _id: 0,
    name: 1,
    city: 1,
  },
);
```

Example output:

```javascript
[
  {
    name: "Sharvil",
    city: "Mumbai",
  },
  {
    name: "Rahul",
    city: "Pune",
  },
  {
    name: "Sneha",
    city: "Mumbai",
  },
];
```

The filter selects documents from Mumbai or Pune, while the projection returns only their names and cities.

---

## 9. Using `$in` with Array Fields

The `$in` operator also works when a field contains an array.

Consider the following document:

```javascript
{
    _id: 1,
    name: "Sharvil",
    skills: ["React", "Node.js", "MongoDB"]
}
```

### Example

```javascript
db.users.find({
  skills: {
    $in: ["MongoDB", "Python"],
  },
});
```

The document matches because its `skills` array contains `"MongoDB"`.

For array fields, MongoDB matches a document when at least one array element matches one of the specified values.

---

## 10. `$in` vs `$or`

Both operators can match multiple alternatives, but their syntax and use cases differ.

### Using `$in`

```javascript
db.users.find({
  city: {
    $in: ["Mumbai", "Pune"],
  },
});
```

### Using `$or`

```javascript
db.users.find({
  $or: [{ city: "Mumbai" }, { city: "Pune" }],
});
```

Both queries match users from Mumbai or Pune.

### Comparison

| Feature          | `$in`                                     | `$or`                                    |
| ---------------- | ----------------------------------------- | ---------------------------------------- |
| Main purpose     | Match a field against multiple values     | Match at least one of several conditions |
| Syntax           | Compact for one field                     | Explicit list of conditions              |
| Different fields | Not directly for a single `$in` condition | Supports different fields                |
| Typical use      | `city` equals Mumbai or Pune              | `city` is Mumbai or `age` is 25          |

### Example Where `$or` Is More Suitable

```javascript
db.users.find({
  $or: [{ city: "Mumbai" }, { age: 25 }],
});
```

This matches users who live in Mumbai or are 25 years old.

Use `$in` when comparing one field against multiple values. Use `$or` when combining different or more complex conditions.

---

## 11. `updateMany()` vs `bulkWrite()`

Both methods can perform multiple writes, but they are intended for different situations.

| Feature                         | `updateMany()`                             | `bulkWrite()`                                        |
| ------------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| Main purpose                    | Apply one update to all matching documents | Submit multiple write operations                     |
| Number of operation definitions | One update definition                      | Multiple operation definitions                       |
| Different write types           | No                                         | Yes                                                  |
| Supports `$in` in filters       | Yes                                        | Yes                                                  |
| Example                         | Update all users in selected cities        | Update one group, delete another, insert new records |

### Use `updateMany()` When

You want to apply the same update to every matching document.

```javascript
db.users.updateMany(
  {
    city: {
      $in: ["Mumbai", "Pune"],
    },
  },
  {
    $set: {
      status: "verified",
    },
  },
);
```

### Use `bulkWrite()` When

You need to perform several different write operations in one method call.

```javascript
db.users.bulkWrite([
  {
    updateMany: {
      filter: {
        city: {
          $in: ["Mumbai", "Pune"],
        },
      },
      update: {
        $set: {
          status: "verified",
        },
      },
    },
  },
  {
    updateOne: {
      filter: {
        name: "Priya",
      },
      update: {
        $set: {
          age: 21,
        },
      },
    },
  },
]);
```

---

## 12. Using `$in` in Node.js

The MongoDB Node.js driver supports `$in` in query filters just as the MongoDB shell does.

### Example: Retrieve Matching Users

```javascript
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

async function main() {
  try {
    await client.connect();

    const db = client.db("myDatabase");
    const users = db.collection("users");

    const result = await users
      .find({
        city: {
          $in: ["Mumbai", "Pune"],
        },
      })
      .toArray();

    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
```

### Example: Update Matching Users

```javascript
const result = await users.updateMany(
  {
    city: {
      $in: ["Mumbai", "Pune"],
    },
  },
  {
    $set: {
      status: "verified",
    },
  },
);

console.log(result.matchedCount);
console.log(result.modifiedCount);
```

### Example: Perform Multiple Writes

```javascript
const result = await users.bulkWrite([
  {
    updateMany: {
      filter: {
        city: {
          $in: ["Mumbai", "Pune"],
        },
      },
      update: {
        $set: {
          status: "verified",
        },
      },
    },
  },
  {
    deleteMany: {
      filter: {
        city: {
          $in: ["Delhi"],
        },
      },
    },
  },
]);

console.log(result);
```

These examples assume that the connection and `users` collection have been configured appropriately. In a real application, keep database credentials secure and handle errors according to the application's requirements.

---

## 13. Performance Considerations

### 1. Use Indexes Where Appropriate

If queries frequently filter by `city`, an index may improve performance.

```javascript
db.users.createIndex({
  city: 1,
});
```

An index is not always necessary for small collections. Evaluate the workload before adding indexes.

### 2. Avoid Excessively Large `$in` Lists

A very large list of values can increase query-processing costs. If you frequently pass large lists, review the data model and query strategy.

### 3. Use `explain()` to Analyze Queries

```javascript
db.users
  .find({
    city: {
      $in: ["Mumbai", "Pune"],
    },
  })
  .explain("executionStats");
```

This provides information about the query execution plan and the work performed by the query.

### 4. Choose the Appropriate Write Method

- Use `updateMany()` when the same update applies to all matches.
- Use `deleteMany()` when all matching documents must be deleted.
- Use `bulkWrite()` when multiple different write operations need to be submitted together.

### 5. Understand Atomicity

MongoDB guarantees atomicity at the single-document level. A bulk operation containing writes to multiple documents is not automatically atomic as a whole.

For multi-document all-or-nothing behavior, use a transaction when the deployment and operation support it.

---

## 14. Common Mistakes

### Mistake 1: Using `$in` Without an Array

Incorrect:

```javascript
db.users.find({
  city: {
    $in: "Mumbai",
  },
});
```

Correct:

```javascript
db.users.find({
  city: {
    $in: ["Mumbai"],
  },
});
```

The `$in` operator expects an array of candidate values.

### Mistake 2: Confusing `$in` with `$or`

Incorrect assumption: `$in` can compare different fields in a single condition.

For conditions across different fields, use `$or` when appropriate:

```javascript
db.users.find({
  $or: [{ city: "Mumbai" }, { age: 25 }],
});
```

### Mistake 3: Assuming `$in` Performs an Update

`$in` only defines a filter condition. It does not modify any documents on its own.

To update matching documents, use it with `updateMany()` or an update operation inside `bulkWrite()`.

### Mistake 4: Assuming `bulkWrite()` Is a Transaction

A bulk write is not automatically an all-or-nothing operation. Earlier writes may succeed even if a later operation fails.

### Mistake 5: Forgetting That `updateMany()` Updates Every Match

If a filter matches 100 documents, `updateMany()` may update all 100.

Always check your filter before performing bulk updates or deletions.

---

## 15. Interview Questions and Answers

### Q1. What is the `$in` operator in MongoDB?

The `$in` operator matches documents where a field equals any value in a specified array.

### Q2. Can `$in` be used with `updateMany()`?

Yes. It can select multiple matching documents for a single update operation.

### Q3. What is the difference between `$in` and `bulkWrite()`?

`$in` is a query operator that matches values. `bulkWrite()` is a method that submits multiple write operations together.

### Q4. Does `$in` update documents by itself?

No. It specifies a matching condition and must be used with a query or write operation.

### Q5. What is the difference between `$in` and `$or`?

`$in` is useful for matching one field against several values. `$or` combines multiple conditions, which may involve different fields.

### Q6. Can `$in` be used with `deleteMany()`?

Yes. It can identify every document whose field matches one of the specified values.

### Q7. What is the difference between ordered and unordered bulk writes?

Ordered writes stop processing subsequent operations after an error. Unordered writes attempt to continue processing other operations despite individual errors.

### Q8. Does `bulkWrite()` guarantee atomicity across all operations?

No. Bulk writes are not automatically atomic across all documents and operations. Use a transaction when all-or-nothing multi-document behavior is required.

### Q9. Can `$in` match values inside an array field?

Yes. If an array field contains at least one value that matches a candidate in the `$in` array, the document can match.

### Q10. How can you improve the performance of a query using `$in`?

Consider appropriate indexes, avoid excessively large candidate lists, and inspect the execution plan using `explain("executionStats")`.

### Q11. When should you use `updateMany()` instead of `bulkWrite()`?

Use `updateMany()` when one update definition should apply to all matching documents. Use `bulkWrite()` when you need multiple different write operations.

### Q12. What does `matchedCount` mean in an update result?

It represents the number of documents that matched the update filter, regardless of whether their stored values changed.

---

## 16. Quick Revision

| Method or Operator | Purpose                                            |
| ------------------ | -------------------------------------------------- |
| `$in`              | Match any value in a specified array               |
| `find()`           | Retrieve matching documents                        |
| `updateMany()`     | Update all matching documents                      |
| `deleteMany()`     | Delete all matching documents                      |
| `bulkWrite()`      | Submit multiple write operations                   |
| `$or`              | Match at least one of multiple conditions          |
| `explain()`        | Analyze query execution                            |
| `createIndex()`    | Create an index that may improve query performance |

### Most Important Example

```javascript
db.users.updateMany(
  {
    city: {
      $in: ["Mumbai", "Pune"],
    },
  },
  {
    $set: {
      status: "verified",
    },
  },
);
```

This updates every user whose city is Mumbai or Pune.

### Bulk Write Example

```javascript
db.users.bulkWrite([
  {
    updateMany: {
      filter: {
        city: {
          $in: ["Mumbai", "Pune"],
        },
      },
      update: {
        $set: {
          status: "verified",
        },
      },
    },
  },
  {
    deleteMany: {
      filter: {
        city: {
          $in: ["Delhi"],
        },
      },
    },
  },
]);
```

This submits an update operation and a delete operation together in one bulk write call.

---

## 17. Conclusion

The `$in` operator is a useful MongoDB query operator for matching documents against multiple possible values.

When combined with `updateMany()` and `deleteMany()`, it can select multiple documents for a single write operation. When used inside `bulkWrite()`, it helps target documents as part of a larger group of write operations.

Understanding the distinction between query operators, bulk methods, and transaction atomicity is important when writing reliable MongoDB applications.

**Key takeaway:**

- `$in` determines which values match.
- `updateMany()` and `deleteMany()` apply one write operation to all matching documents.
- `bulkWrite()` submits multiple write operations in one method call.
- Indexes and query analysis can help optimize performance.
- Bulk writes are not automatically atomic across all documents.
