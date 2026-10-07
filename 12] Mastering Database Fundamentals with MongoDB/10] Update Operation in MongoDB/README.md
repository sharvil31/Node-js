# MongoDB Update Operation

## 📌 Overview

The **Update operation** is the third operation in MongoDB's CRUD operations:

- **C** → Create
- **R** → Read
- **U** → Update
- **D** → Delete

The Update operation is used to **modify existing documents** inside a MongoDB collection.

MongoDB provides several update methods:

```javascript
updateOne();
updateMany();
replaceOne();
```

MongoDB also provides many update operators that allow us to modify specific fields without replacing the entire document.

Common update operators include:

```text
$set
$unset
$inc
$mul
$min
$max
$rename

$push
$pop
$pull
$pullAll
$addToSet
```

We can also use **upsert**, which creates a new document when no matching document exists.

---

# 📚 Table of Contents

1. [What is the Update Operation?](#-what-is-the-update-operation)
2. [MongoDB Update Methods](#-mongodb-update-methods)
3. [`updateOne()`](#-updateone)
4. [`updateMany()`](#-updatemany)
5. [`replaceOne()`](#-replaceone)
6. [Update Operators](#-update-operators)
7. [`$set`](#-set)
8. [`$unset`](#-unset)
9. [`$inc`](#-inc)
10. [`$mul`](#-mul)
11. [`$min`](#-min)
12. [`$max`](#-max)
13. [`$rename`](#-rename)
14. [Updating Arrays](#-updating-arrays)
15. [`$push`](#-push)
16. [`$pop`](#-pop)
17. [`$pull`](#-pull)
18. [`$pullAll`](#-pullall)
19. [`$addToSet`](#-addtoset)
20. [Updating Nested Fields](#-updating-nested-fields)
21. [Updating Multiple Fields](#-updating-multiple-fields)
22. [Upsert](#-upsert)
23. [Update Result](#-update-result)
24. [Node.js MongoDB Driver](#-nodejs-mongodb-driver)
25. [Update vs Replace](#-update-vs-replace)
26. [Common Mistakes](#-common-mistakes)
27. [Interview Questions](#-interview-questions)
28. [Quick Revision](#-quick-revision)
29. [CRUD Progress](#-crud-progress)

---

# 🔹 What is the Update Operation?

The Update operation is used to modify one or more existing documents in a MongoDB collection.

Suppose we have:

```javascript
{
  name: "Sharvil",
  age: 22,
  city: "Mumbai"
}
```

We want to change the city:

```text
Mumbai → Pune
```

We can use:

```javascript
db.users.updateOne(
  {
    name: "Sharvil",
  },
  {
    $set: {
      city: "Pune",
    },
  },
);
```

The document becomes:

```javascript
{
  name: "Sharvil",
  age: 22,
  city: "Pune"
}
```

Notice that only the `city` field was changed.

---

# 🔹 MongoDB Update Methods

MongoDB provides three primary methods for updating documents:

```javascript
updateOne();
updateMany();
replaceOne();
```

---

## `updateOne()`

Updates the **first matching document**.

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $set: {
      city: "Pune",
    },
  },
);
```

---

## `updateMany()`

Updates **all matching documents**.

```javascript
db.users.updateMany(
  { city: "Mumbai" },
  {
    $set: {
      state: "Maharashtra",
    },
  },
);
```

Every matching document gets:

```javascript
state: "Maharashtra";
```

---

## `replaceOne()`

Replaces the **entire document**, except for the document's `_id`, which MongoDB preserves when the replacement doesn't specify a different `_id`.

```javascript
db.users.replaceOne(
  { name: "Sharvil" },
  {
    name: "Sharvil",
    age: 23,
    city: "Pune",
  },
);
```

Unlike `$set`, this is a **replacement**, not a field-level update.

---

# 🔹 `updateOne()`

`updateOne()` updates the first document that matches the filter.

## Syntax

```javascript
db.collection.updateOne(filter, update, options);
```

Example:

```javascript
db.users.updateOne(
  {
    name: "Sharvil",
  },
  {
    $set: {
      age: 23,
    },
  },
);
```

---

## Before

```javascript
{
  name: "Sharvil",
  age: 22,
  city: "Mumbai"
}
```

## After

```javascript
{
  name: "Sharvil",
  age: 23,
  city: "Mumbai"
}
```

Only `age` was modified.

---

# 🔹 `updateMany()`

`updateMany()` updates every document matching the filter.

## Syntax

```javascript
db.collection.updateMany(filter, update, options);
```

Example:

```javascript
db.users.updateMany(
  {
    city: "Mumbai",
  },
  {
    $set: {
      country: "India",
    },
  },
);
```

Every matching Mumbai user gets:

```javascript
country: "India";
```

---

# 🔹 `replaceOne()`

`replaceOne()` replaces the complete document matching the filter.

Example:

### Original

```javascript
{
  _id: ObjectId("..."),
  name: "Sharvil",
  age: 22,
  city: "Mumbai",
  role: "developer"
}
```

### Operation

```javascript
db.users.replaceOne(
  {
    name: "Sharvil",
  },
  {
    name: "Sharvil",
    age: 23,
  },
);
```

### Result

```javascript
{
  _id: ObjectId("..."),
  name: "Sharvil",
  age: 23
}
```

The fields:

```text
city
role
```

are removed because the original document was replaced.

---

# ⚠️ `updateOne()` vs `replaceOne()`

This is an important distinction.

### `updateOne()` with `$set`

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $set: {
      age: 23,
    },
  },
);
```

Only `age` changes.

Existing fields remain.

---

### `replaceOne()`

```javascript
db.users.replaceOne(
  { name: "Sharvil" },
  {
    name: "Sharvil",
    age: 23,
  },
);
```

The existing document is replaced with the new document.

Fields that aren't present in the replacement disappear.

---

# 🔹 Update Operators

MongoDB provides update operators to modify documents.

## Field Update Operators

| Operator  | Purpose                             |
| --------- | ----------------------------------- |
| `$set`    | Set or update a field               |
| `$unset`  | Remove a field                      |
| `$inc`    | Increment/decrement a number        |
| `$mul`    | Multiply a number                   |
| `$min`    | Update only if new value is smaller |
| `$max`    | Update only if new value is larger  |
| `$rename` | Rename a field                      |

## Array Update Operators

| Operator    | Purpose                                 |
| ----------- | --------------------------------------- |
| `$push`     | Add an element                          |
| `$pop`      | Remove first/last element               |
| `$pull`     | Remove matching elements                |
| `$pullAll`  | Remove multiple specified elements      |
| `$addToSet` | Add only if value doesn't already exist |

---

# 🔹 `$set`

`$set` is one of the most commonly used update operators.

It sets a field to a specified value.

## Syntax

```javascript
{
  $set: {
    field: value;
  }
}
```

Example:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $set: {
      age: 23,
    },
  },
);
```

---

## `$set` can create a field

Suppose the document is:

```javascript
{
  name: "Sharvil",
  age: 22
}
```

Execute:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $set: {
      city: "Mumbai",
    },
  },
);
```

Result:

```javascript
{
  name: "Sharvil",
  age: 22,
  city: "Mumbai"
}
```

If the field doesn't exist, MongoDB creates it.

---

# 🔹 `$unset`

`$unset` removes a field from a document.

## Syntax

```javascript
{
  $unset: {
    field: "";
  }
}
```

Example:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $unset: {
      city: "",
    },
  },
);
```

Before:

```javascript
{
  name: "Sharvil",
  age: 22,
  city: "Mumbai"
}
```

After:

```javascript
{
  name: "Sharvil",
  age: 22
}
```

The value assigned to `$unset` is generally ignored; an empty string is commonly used.

---

# 🔹 `$inc`

`$inc` increments a numeric field.

It can be used for:

- Counters
- Age
- Stock
- Views
- Likes
- Quantity

## Increment

```javascript
db.products.updateOne(
  { name: "Laptop" },
  {
    $inc: {
      stock: 5,
    },
  },
);
```

If:

```text
stock = 10
```

After update:

```text
stock = 15
```

---

## Decrement

We can provide a negative value.

```javascript
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

```text
stock = 10
```

Result:

```text
stock = 9
```

---

# 🔹 `$mul`

`$mul` multiplies an existing numeric field by a specified value.

Example:

```javascript
db.products.updateOne(
  { name: "Laptop" },
  {
    $mul: {
      price: 2,
    },
  },
);
```

If:

```text
price = 50000
```

Result:

```text
price = 100000
```

---

# 🔹 `$min`

`$min` updates a field **only if the new value is smaller than the current value**.

Suppose:

```javascript
{
  name: "Sharvil",
  score: 80
}
```

Execute:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $min: {
      score: 70,
    },
  },
);
```

Result:

```text
score = 70
```

If we execute:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $min: {
      score: 90,
    },
  },
);
```

The score remains:

```text
70
```

because `90` is not smaller than `70`.

---

# 🔹 `$max`

`$max` updates a field **only if the new value is greater than the current value**.

Suppose:

```javascript
{
  name: "Sharvil",
  score: 80
}
```

Execute:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $max: {
      score: 90,
    },
  },
);
```

Result:

```text
score = 90
```

If we try:

```javascript
$max: {
  score: 70;
}
```

the value remains:

```text
90
```

---

# 🔹 `$rename`

`$rename` changes the name of a field.

Example:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $rename: {
      city: "location",
    },
  },
);
```

Before:

```javascript
{
  name: "Sharvil",
  city: "Mumbai"
}
```

After:

```javascript
{
  name: "Sharvil",
  location: "Mumbai"
}
```

---

# 🔹 Updating Multiple Fields

Multiple fields can be updated in a single operation.

```javascript
db.users.updateOne(
  {
    name: "Sharvil",
  },
  {
    $set: {
      age: 23,
      city: "Pune",
      role: "full-stack developer",
    },
  },
);
```

This is generally preferable to performing multiple separate update operations when the changes belong together.

---

# 🔹 Updating Nested Fields

Consider:

```javascript
{
  name: "Sharvil",
  address: {
    city: "Mumbai",
    pincode: 421301
  }
}
```

We can update the nested city using dot notation:

```javascript
db.users.updateOne(
  {
    name: "Sharvil",
  },
  {
    $set: {
      "address.city": "Pune",
    },
  },
);
```

Result:

```javascript
{
  name: "Sharvil",
  address: {
    city: "Pune",
    pincode: 421301
  }
}
```

Only the nested `city` field changes.

---

# 🔹 `$push`

`$push` adds an element to an array.

Suppose:

```javascript
{
  name: "Sharvil",
  skills: [
    "JavaScript",
    "React"
  ]
}
```

Execute:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $push: {
      skills: "Node.js",
    },
  },
);
```

Result:

```javascript
{
  name: "Sharvil",
  skills: [
    "JavaScript",
    "React",
    "Node.js"
  ]
}
```

---

# 🔹 `$push` with `$each`

`$each` allows multiple values to be pushed into an array.

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $push: {
      skills: {
        $each: ["MongoDB", "Express"],
      },
    },
  },
);
```

Result:

```javascript
skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"];
```

---

# 🔹 `$push` with `$slice`

`$slice` can limit the number of elements retained when using `$push`.

Example:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $push: {
      skills: {
        $each: ["MongoDB"],
        $slice: -5,
      },
    },
  },
);
```

This can be useful when maintaining a fixed-size list.

---

# 🔹 `$pop`

`$pop` removes an element from an array.

### Remove last element

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $pop: {
      skills: 1,
    },
  },
);
```

`1` means remove the last element.

---

### Remove first element

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $pop: {
      skills: -1,
    },
  },
);
```

`-1` means remove the first element.

---

# 🔹 `$pull`

`$pull` removes array elements that match a condition.

Suppose:

```javascript
{
  name: "Sharvil",
  skills: [
    "JavaScript",
    "React",
    "Angular",
    "Node.js"
  ]
}
```

Remove `"Angular"`:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $pull: {
      skills: "Angular",
    },
  },
);
```

Result:

```javascript
skills: ["JavaScript", "React", "Node.js"];
```

---

## `$pull` with a condition

Suppose:

```javascript
{
  scores: [10, 20, 30, 40, 50];
}
```

Remove values greater than `30`:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $pull: {
      scores: {
        $gt: 30,
      },
    },
  },
);
```

Result:

```javascript
scores: [10, 20, 30];
```

---

# 🔹 `$pullAll`

`$pullAll` removes multiple specified values.

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $pullAll: {
      skills: ["Angular", "Vue"],
    },
  },
);
```

Both matching values are removed from the array.

---

# 🔹 `$addToSet`

`$addToSet` adds a value to an array **only if that value doesn't already exist**.

Example:

```javascript
{
  skills: ["JavaScript", "React"];
}
```

Execute:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $addToSet: {
      skills: "React",
    },
  },
);
```

The array remains:

```javascript
["JavaScript", "React"];
```

No duplicate `"React"` is added.

---

## `$push` vs `$addToSet`

### `$push`

```javascript
$push: {
  skills: "React";
}
```

Can create duplicates.

### `$addToSet`

```javascript
$addToSet: {
  skills: "React";
}
```

Prevents adding the same value again.

| Operator    | Duplicate allowed? |
| ----------- | ------------------ |
| `$push`     | Yes                |
| `$addToSet` | No                 |

---

# 🔹 `$addToSet` with `$each`

Multiple unique values can be added using `$each`.

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $addToSet: {
      skills: {
        $each: ["MongoDB", "Express", "React"],
      },
    },
  },
);
```

Existing values are not duplicated.

---

# 🔹 Upsert

**Upsert** means:

> Update if a matching document exists; otherwise insert a new document.

It combines:

```text
Update + Insert
```

Use:

```javascript
{
  upsert: true;
}
```

Example:

```javascript
db.users.updateOne(
  {
    email: "sharvil@example.com",
  },
  {
    $set: {
      name: "Sharvil",
      role: "developer",
    },
  },
  {
    upsert: true,
  },
);
```

### If matching document exists

MongoDB updates it.

### If matching document does not exist

MongoDB creates a new document.

---

# 🔹 Update Result

Update methods return information about what happened.

Example:

```javascript
const result = db.users.updateOne(
  {
    name: "Sharvil",
  },
  {
    $set: {
      age: 23,
    },
  },
);
```

The result contains information such as:

```text
matchedCount
modifiedCount
upsertedCount
upsertedId
```

Depending on the operation, some values may be zero or absent.

---

## `matchedCount`

Number of documents matching the filter.

Example:

```text
matchedCount: 1
```

means one document matched.

---

## `modifiedCount`

Number of documents actually modified.

Example:

```text
modifiedCount: 1
```

means one document was changed.

An important distinction:

```text
matchedCount = 1
modifiedCount = 0
```

can happen when a document matches but the requested update doesn't actually change its stored value.

---

## `upsertedCount`

Number of documents inserted as a result of an upsert.

---

## `upsertedId`

The `_id` of a document inserted through an upsert, when applicable.

---

# 🔹 Node.js MongoDB Driver

Install the MongoDB driver:

```bash
npm install mongodb
```

Import:

```javascript
import { MongoClient } from "mongodb";
```

Connect:

```javascript
const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();

const db = client.db("company");
const users = db.collection("users");
```

---

# 🔹 `updateOne()` in Node.js

```javascript
const result = await users.updateOne(
  {
    name: "Sharvil",
  },
  {
    $set: {
      age: 23,
    },
  },
);

console.log(result);
```

---

# 🔹 `updateMany()` in Node.js

```javascript
const result = await users.updateMany(
  {
    city: "Mumbai",
  },
  {
    $set: {
      state: "Maharashtra",
    },
  },
);

console.log(result);
```

---

# 🔹 `replaceOne()` in Node.js

```javascript
const result = await users.replaceOne(
  {
    name: "Sharvil",
  },
  {
    name: "Sharvil",
    age: 23,
    city: "Pune",
  },
);

console.log(result);
```

---

# 🔹 Upsert in Node.js

```javascript
const result = await users.updateOne(
  {
    email: "sharvil@example.com",
  },
  {
    $set: {
      name: "Sharvil",
      role: "developer",
    },
  },
  {
    upsert: true,
  },
);

console.log(result);
```

---

# 🔹 Complete Node.js Example

```javascript
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

try {
  await client.connect();

  const db = client.db("company");
  const users = db.collection("users");

  const result = await users.updateOne(
    {
      name: "Sharvil",
    },
    {
      $set: {
        age: 23,
        city: "Pune",
      },
      $inc: {
        loginCount: 1,
      },
    },
  );

  console.log("Matched:", result.matchedCount);
  console.log("Modified:", result.modifiedCount);
} catch (error) {
  console.error(error);
} finally {
  await client.close();
}
```

---

# 🔹 Updating Arrays in Node.js

```javascript
const result = await users.updateOne(
  {
    name: "Sharvil",
  },
  {
    $addToSet: {
      skills: "MongoDB",
    },
  },
);

console.log(result);
```

---

# 🔹 Multiple Update Operators

Multiple update operators can be used in the same update document when they target compatible fields.

Example:

```javascript
db.users.updateOne(
  {
    name: "Sharvil",
  },
  {
    $set: {
      city: "Pune",
    },
    $inc: {
      age: 1,
    },
    $addToSet: {
      skills: "MongoDB",
    },
  },
);
```

This performs multiple changes as one update operation.

---

# 🔹 Update vs Replace

| Feature              | `updateOne()`            | `replaceOne()`              |
| -------------------- | ------------------------ | --------------------------- |
| Purpose              | Modify fields            | Replace document            |
| Existing fields      | Remain                   | Can be removed              |
| Operators            | Supported                | Replacement document        |
| Partial modification | Yes                      | No                          |
| Common use           | Updating specific fields | Replacing complete document |

Example:

### Update

```javascript
db.users.updateOne(
  { _id: id },
  {
    $set: {
      age: 23,
    },
  },
);
```

### Replace

```javascript
db.users.replaceOne(
  { _id: id },
  {
    name: "Sharvil",
    age: 23,
  },
);
```

---

# 🔹 `updateOne()` vs `updateMany()`

| Feature            | `updateOne()`           | `updateMany()`             |
| ------------------ | ----------------------- | -------------------------- |
| Matching documents | First matching document | All matching documents     |
| Use case           | Individual record       | Bulk update                |
| Example            | Update one user         | Update all users in a city |

Example:

```javascript
db.users.updateOne(
  {
    city: "Mumbai",
  },
  {
    $set: {
      active: true,
    },
  },
);
```

Only one matching document is updated.

Whereas:

```javascript
db.users.updateMany(
  {
    city: "Mumbai",
  },
  {
    $set: {
      active: true,
    },
  },
);
```

All matching documents are updated.

---

# ⚠️ Common Mistakes

## 1. Forgetting the update operator

For field-level updates, use an update operator such as `$set`.

Correct:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $set: {
      age: 23,
    },
  },
);
```

Don't confuse this with replacement syntax.

---

## 2. Accidentally using `replaceOne()`

If you only want to change one field:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $set: {
      age: 23,
    },
  },
);
```

Using `replaceOne()` with a partial document can remove fields you didn't include.

---

## 3. Using `updateMany()` without a careful filter

Be careful with:

```javascript
db.users.updateMany(
  {},
  {
    $set: {
      active: true,
    },
  },
);
```

An empty filter matches all documents.

Therefore, this updates the entire collection.

---

## 4. Using `$push` when duplicates are not desired

If duplicate values are not allowed, prefer:

```javascript
$addToSet;
```

instead of:

```javascript
$push;
```

---

## 5. Using `$inc` on non-numeric data

`$inc` is intended for numeric fields.

For example:

```javascript
{
  age: "twenty-two";
}
```

should not be incremented using:

```javascript
$inc: {
  age: 1;
}
```

The field must have an appropriate numeric value.

---

# 🎯 Interview Questions

## 1. What is the Update operation in MongoDB?

The Update operation modifies existing documents in a MongoDB collection.

Common update methods include:

```text
updateOne()
updateMany()
replaceOne()
```

---

## 2. What is the difference between `updateOne()` and `updateMany()`?

`updateOne()` modifies the first matching document, while `updateMany()` modifies all documents matching the filter.

---

## 3. What is the difference between `updateOne()` and `replaceOne()`?

`updateOne()` can modify specific fields using update operators, while `replaceOne()` replaces the entire document with a replacement document.

---

## 4. What does `$set` do?

`$set` sets a field to a specified value. If the field doesn't exist, MongoDB creates it.

---

## 5. What does `$unset` do?

`$unset` removes a field from a document.

---

## 6. What is `$inc`?

`$inc` increments or decrements a numeric field.

```javascript
{
  $inc: {
    age: 1;
  }
}
```

---

## 7. How do you decrement a value?

Use `$inc` with a negative value.

```javascript
{
  $inc: {
    stock: -1;
  }
}
```

---

## 8. What is `$push`?

`$push` adds an element to an array.

---

## 9. What is `$addToSet`?

`$addToSet` adds an element to an array only if it doesn't already exist.

---

## 10. What is the difference between `$push` and `$addToSet`?

`$push` allows duplicates, while `$addToSet` prevents adding the same value again.

---

## 11. What is `$pull`?

`$pull` removes array elements that match a specified condition.

---

## 12. What does `$pop` do?

`$pop` removes an element from either the beginning or the end of an array.

```javascript
$pop: {
  items: 1;
}
```

removes the last element.

```javascript
$pop: {
  items: -1;
}
```

removes the first element.

---

## 13. What is upsert?

Upsert means:

> Update the document if it exists; otherwise insert a new document.

Example:

```javascript
{
  upsert: true;
}
```

---

## 14. What is `matchedCount`?

`matchedCount` tells us how many documents matched the update filter.

---

## 15. What is `modifiedCount`?

`modifiedCount` tells us how many documents were actually modified.

A document can match the filter without being modified if the requested update doesn't change its stored value.

---

## 16. What is `$rename`?

`$rename` changes the name of a field.

```javascript
{
  $rename: {
    username: "name";
  }
}
```

---

## 17. What is `$min`?

`$min` updates a field only when the supplied value is smaller than the existing value.

---

## 18. What is `$max`?

`$max` updates a field only when the supplied value is greater than the existing value.

---

## 19. How can you update a nested field?

Use dot notation:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $set: {
      "address.city": "Pune",
    },
  },
);
```

---

## 20. Can multiple update operators be used in one operation?

Yes.

Example:

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $set: {
      city: "Pune",
    },
    $inc: {
      age: 1,
    },
    $addToSet: {
      skills: "MongoDB",
    },
  },
);
```

---

# 🧠 Update Operators Cheat Sheet

```text
FIELD OPERATORS
│
├── $set
│   └── Set/update a field
│
├── $unset
│   └── Remove a field
│
├── $inc
│   └── Increment/decrement
│
├── $mul
│   └── Multiply
│
├── $min
│   └── Keep smaller value
│
├── $max
│   └── Keep larger value
│
└── $rename
    └── Rename a field


ARRAY OPERATORS
│
├── $push
│   └── Add element
│
├── $pop
│   └── Remove first/last element
│
├── $pull
│   └── Remove matching elements
│
├── $pullAll
│   └── Remove specified elements
│
└── $addToSet
    └── Add unique element
```

---

# 🔹 Common Update Examples

### Update one field

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $set: {
      age: 23,
    },
  },
);
```

### Update multiple fields

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $set: {
      age: 23,
      city: "Pune",
    },
  },
);
```

### Increment

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $inc: {
      age: 1,
    },
  },
);
```

### Remove field

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $unset: {
      city: "",
    },
  },
);
```

### Add to array

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $push: {
      skills: "MongoDB",
    },
  },
);
```

### Add unique value

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $addToSet: {
      skills: "MongoDB",
    },
  },
);
```

### Remove from array

```javascript
db.users.updateOne(
  { name: "Sharvil" },
  {
    $pull: {
      skills: "Angular",
    },
  },
);
```

### Update all matching documents

```javascript
db.users.updateMany(
  { city: "Mumbai" },
  {
    $set: {
      country: "India",
    },
  },
);
```

### Upsert

```javascript
db.users.updateOne(
  { email: "sharvil@example.com" },
  {
    $set: {
      name: "Sharvil",
    },
  },
  {
    upsert: true,
  },
);
```

---

# 🔹 Complete Update Flow

```text
Application
     ↓
MongoDB Driver
     ↓
Collection
     ↓
Filter
     ↓
Find Matching Document(s)
     ↓
Update / Replacement
     ↓
MongoDB
     ↓
Update Result
     ↓
Application
```

---

# 🚀 CRUD Progress

| Operation | MongoDB Method                                  | Status |
| --------- | ----------------------------------------------- | ------ |
| Create    | `insertOne()` / `insertMany()`                  | ✅     |
| Read      | `find()` / `findOne()`                          | ✅     |
| Update    | `updateOne()` / `updateMany()` / `replaceOne()` | ✅     |
| Delete    | `deleteOne()` / `deleteMany()`                  | ⏳     |

---

# 🎯 Key Takeaways

1. `updateOne()` updates the first matching document.
2. `updateMany()` updates all matching documents.
3. `replaceOne()` replaces an entire document.
4. `$set` updates or creates a field.
5. `$unset` removes a field.
6. `$inc` increments or decrements numeric values.
7. `$mul` multiplies numeric values.
8. `$min` keeps the smaller value.
9. `$max` keeps the larger value.
10. `$rename` renames a field.
11. `$push` adds values to arrays.
12. `$addToSet` adds values without introducing duplicates.
13. `$pull` removes matching array elements.
14. `$pop` removes the first or last array element.
15. `$pullAll` removes specified array values.
16. Dot notation can update nested fields.
17. `upsert: true` creates a document if no matching document exists.
18. `matchedCount` tells how many documents matched.
19. `modifiedCount` tells how many documents were actually modified.
20. Always be careful with broad filters, especially when using `updateMany()`.

---

# 📖 Next Topic

The next CRUD operation is:

## Delete Operation in MongoDB

Important methods:

```text
deleteOne()
deleteMany()
```

Topics to cover:

```text
Deleting one document
Deleting multiple documents
Deleting by _id
Delete filters
deleteMany({})
Dropping collections
Dropping databases
Delete vs Drop
Node.js MongoDB driver
Interview questions
```

This completes the four fundamental MongoDB CRUD operations:

```text
Create → Read → Update → Delete
```
