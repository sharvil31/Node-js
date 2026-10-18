# Why MongoDB ObjectId Is Not a String?

## Table of Contents

1. [Introduction](#1-introduction)
2. [What Is ObjectId?](#2-what-is-objectid)
3. [What Is a String?](#3-what-is-a-string)
4. [Why Is ObjectId Different from a String?](#4-why-is-objectid-different-from-a-string)
5. [Internal Structure of ObjectId](#5-internal-structure-of-objectid)
6. [ObjectId vs String](#6-objectid-vs-string)
7. [How MongoDB Generates ObjectId](#7-how-mongodb-generates-objectid)
8. [Understanding ObjectId in MongoDB Documents](#8-understanding-objectid-in-mongodb-documents)
9. [Working with ObjectId in MongoDB Shell](#9-working-with-objectid-in-mongodb-shell)
10. [Working with ObjectId in Node.js](#10-working-with-objectid-in-nodejs)
11. [Converting ObjectId to String](#11-converting-objectid-to-string)
12. [Converting String to ObjectId](#12-converting-string-to-objectid)
13. [Common Error: Querying ObjectId Using a String](#13-common-error-querying-objectid-using-a-string)
14. [ObjectId in Express.js Route Parameters](#14-objectid-in-expressjs-route-parameters)
15. [ObjectId Validation](#15-objectid-validation)
16. [Can We Use Strings Instead of ObjectId?](#16-can-we-use-strings-instead-of-objectid)
17. [ObjectId in Relationships Between Collections](#17-objectid-in-relationships-between-collections)
18. [Common Mistakes](#18-common-mistakes)
19. [Best Practices](#19-best-practices)
20. [Interview Questions and Answers](#20-interview-questions-and-answers)
21. [Quick Revision](#21-quick-revision)

---

## 1. Introduction

In MongoDB, every document generally has a unique identifier called `_id`.

When we insert a document without providing an `_id`, MongoDB's driver typically generates an `ObjectId` automatically.

Example document:

```javascript
{
  _id: ObjectId("68f34a9e2c7b4a6d9f123456"),
  name: "Rahul",
  age: 25
}
```

At first glance, the value inside `ObjectId()` looks like a string because it contains hexadecimal characters.

However, **ObjectId is a distinct BSON data type, not a string.**

Understanding this difference is important when querying documents, working with Node.js, handling Express route parameters, and connecting related collections.

---

## 2. What Is ObjectId?

`ObjectId` is a BSON type that MongoDB commonly uses to identify documents uniquely.

BSON stands for **Binary JSON**. It is a binary-encoded format that supports data types such as strings, numbers, dates, arrays, embedded documents, and ObjectIds.

Example:

```javascript
{
  _id: ObjectId("68f34a9e2c7b4a6d9f123456");
}
```

Here:

- `_id` is the document's identifier field.
- `ObjectId(...)` represents a value of the ObjectId BSON type.
- The hexadecimal value represents the ObjectId's 12-byte data.

### Important characteristics

- ObjectId is a separate BSON type.
- It is 12 bytes long.
- Its conventional hexadecimal representation contains 24 characters.
- MongoDB drivers can generate ObjectIds automatically.
- ObjectIds are designed to be highly likely to be unique.
- They contain a timestamp component.
- They are commonly used as document identifiers, but they are not mandatory.

---

## 3. What Is a String?

A string is a sequence of characters used to represent text.

In JavaScript, strings are written inside quotation marks.

```javascript
const id = "68f34a9e2c7b4a6d9f123456";

console.log(typeof id);
// "string"
```

A MongoDB document can also store an identifier as a string:

```javascript
{
  _id: "68f34a9e2c7b4a6d9f123456",
  name: "Rahul"
}
```

Notice the difference between these two documents:

```javascript
// ObjectId
{
  _id: ObjectId("68f34a9e2c7b4a6d9f123456");
}
```

```javascript
// String
{
  _id: "68f34a9e2c7b4a6d9f123456";
}
```

Although the visible characters are identical, the stored values have different types.

---

## 4. Why Is ObjectId Different from a String?

The main reason is that **MongoDB stores ObjectId and String as different BSON types**.

Consider the following JavaScript values:

```javascript
const id1 = new ObjectId("68f34a9e2c7b4a6d9f123456");
const id2 = "68f34a9e2c7b4a6d9f123456";
```

The values look similar, but:

```javascript
console.log(typeof id1);
// "object"

console.log(typeof id2);
// "string"
```

The `ObjectId` constructor creates an ObjectId instance, whereas quotation marks create a string.

### A simple analogy

Think of these as two different types of information:

- The number `100`
- The string `"100"`

Their visible content looks similar, but one is numeric and the other is textual.

Similarly:

- `ObjectId("...")` is an ObjectId value.
- `"..."` is a string value.

The difference matters when MongoDB compares values during a query.

### Example

Suppose a collection contains:

```javascript
{
  _id: ObjectId("68f34a9e2c7b4a6d9f123456"),
  name: "Rahul"
}
```

This query matches the document:

```javascript
db.users.findOne({
  _id: ObjectId("68f34a9e2c7b4a6d9f123456"),
});
```

But this query does not match that document:

```javascript
db.users.findOne({
  _id: "68f34a9e2c7b4a6d9f123456",
});
```

Why?

Because the first query uses an ObjectId, while the second uses a string.

**MongoDB does not automatically convert the string into an ObjectId when comparing the values.**

---

## 5. Internal Structure of ObjectId

An ObjectId consists of **12 bytes**, conventionally displayed as 24 hexadecimal characters.

Its structure is:

| Component    |    Size | Purpose                                                      |
| ------------ | ------: | ------------------------------------------------------------ |
| Timestamp    | 4 bytes | Represents the creation time in seconds since the Unix epoch |
| Random value | 5 bytes | Helps distinguish ObjectIds generated by different processes |
| Counter      | 3 bytes | Helps distinguish ObjectIds generated by the same process    |

Total size:

```text
4 bytes + 5 bytes + 3 bytes = 12 bytes
```

Each byte is represented by two hexadecimal characters.

Therefore:

```text
12 bytes × 2 hexadecimal characters = 24 characters
```

Example:

```text
68f34a9e2c7b4a6d9f123456
```

This is the hexadecimal representation of an ObjectId.

### Why does ObjectId contain a timestamp?

The timestamp component makes it possible to extract an approximate creation time from an ObjectId.

In the MongoDB shell:

```javascript
const id = ObjectId();

id.getTimestamp();
```

The returned value is a JavaScript `Date` representing the timestamp encoded in the ObjectId.

### Does the timestamp provide the exact creation time?

Not necessarily.

It represents the time encoded when the ObjectId was generated, with second-level precision. It is not a guaranteed record of when the document was inserted into MongoDB.

For example:

- An ObjectId can be generated before a document is inserted.
- An application can insert an ObjectId created earlier.
- A document can use a custom `_id` instead.

If you need a reliable business record of when a document was created, store a separate timestamp:

```javascript
{
  _id: ObjectId("68f34a9e2c7b4a6d9f123456"),
  name: "Rahul",
  createdAt: new Date()
}
```

---

## 6. ObjectId vs String

| Feature                      | ObjectId                                                | String                                              |
| ---------------------------- | ------------------------------------------------------- | --------------------------------------------------- |
| BSON type                    | ObjectId                                                | String                                              |
| Typical representation       | `ObjectId("...")`                                       | `"..."`                                             |
| ObjectId size                | 12 bytes                                                | Depends on the text and encoding                    |
| Conventional ID format       | 24 hexadecimal characters                               | Any valid string                                    |
| Generated automatically      | Commonly generated for `_id`                            | Must be supplied or generated by application logic  |
| Contains timestamp component | Yes                                                     | Not inherently                                      |
| Query type matching          | Must use ObjectId for an ObjectId value                 | Must use a string for a string value                |
| Can be used as `_id`         | Yes                                                     | Yes                                                 |
| Can be converted             | Yes, when the string is valid for ObjectId construction | Yes, if it contains a valid ObjectId representation |

### Example comparison

```javascript
const objectId = new ObjectId("68f34a9e2c7b4a6d9f123456");
const stringId = "68f34a9e2c7b4a6d9f123456";
```

These values represent different types even though their textual content is the same.

---

## 7. How MongoDB Generates ObjectId

When we insert a document without an `_id`, the MongoDB driver usually generates one automatically.

Example:

```javascript
db.users.insertOne({
  name: "Rahul",
  age: 25,
});
```

MongoDB returns an inserted identifier similar to:

```javascript
{
  acknowledged: true,
  insertedId: ObjectId("68f34a9e2c7b4a6d9f123456")
}
```

The actual value will differ.

The inserted document will contain the generated `_id`:

```javascript
{
  _id: ObjectId("68f34a9e2c7b4a6d9f123456"),
  name: "Rahul",
  age: 25
}
```

### Can we provide our own `_id`?

Yes.

For example, using a string:

```javascript
db.users.insertOne({
  _id: "user-101",
  name: "Rahul",
});
```

Or using an ObjectId we create ourselves:

```javascript
db.users.insertOne({
  _id: ObjectId(),
  name: "Rahul",
});
```

The `_id` value must be unique within its collection. MongoDB enforces this using the unique index on `_id`.

---

## 8. Understanding ObjectId in MongoDB Documents

Consider this document:

```javascript
{
  _id: ObjectId("68f34a9e2c7b4a6d9f123456"),
  name: "Rahul",
  email: "rahul@example.com",
  age: 25
}
```

MongoDB stores `_id` as an ObjectId BSON value.

When you retrieve the document using MongoDB tools, the ObjectId is displayed in a readable form:

```javascript
ObjectId("68f34a9e2c7b4a6d9f123456");
```

That display format helps you recognize the BSON type. It does not mean the database stored the identifier as ordinary text.

### What happens when we convert it to JSON?

A JSON representation might look like:

```json
{
  "_id": "68f34a9e2c7b4a6d9f123456",
  "name": "Rahul",
  "email": "rahul@example.com",
  "age": 25
}
```

In ordinary JSON, ObjectId is not a native data type. When an application serializes an ObjectId into JSON, it is commonly represented as a string.

Some MongoDB-specific JSON formats, such as Extended JSON, can preserve the type explicitly:

```json
{
  "_id": {
    "$oid": "68f34a9e2c7b4a6d9f123456"
  }
}
```

**Important:** Converting an ObjectId to a string for an API response does not change the original value stored in MongoDB.

---

## 9. Working with ObjectId in MongoDB Shell

### Create an ObjectId

```javascript
const id = ObjectId();

print(id);
```

### Get its timestamp

```javascript
print(id.getTimestamp());
```

### Find a document using ObjectId

```javascript
db.users.findOne({
  _id: ObjectId("68f34a9e2c7b4a6d9f123456"),
});
```

### Find a document using a string `_id`

If the document was originally stored with a string identifier, query it using a string:

```javascript
db.users.findOne({
  _id: "user-101",
});
```

### Check the stored type

You can use the `$type` query operator:

```javascript
db.users.find({
  _id: {
    $type: "objectId",
  },
});
```

To find documents where `_id` is a string:

```javascript
db.users.find({
  _id: {
    $type: "string",
  },
});
```

This is useful when inspecting collections that contain different `_id` types.

---

## 10. Working with ObjectId in Node.js

To use ObjectId in a Node.js application, import it from the MongoDB Node.js driver.

Install the driver if necessary:

```bash
npm install mongodb
```

### Import ObjectId

Using ES modules:

```javascript
import { MongoClient, ObjectId } from "mongodb";
```

Using CommonJS:

```javascript
const { MongoClient, ObjectId } = require("mongodb");
```

### Create an ObjectId

```javascript
const id = new ObjectId();

console.log(id);
console.log(typeof id);
```

The type will be:

```text
object
```

The console output may look similar to:

```text
new ObjectId('68f34a9e2c7b4a6d9f123456')
object
```

The exact console representation depends on the Node.js driver version.

### Convert an ObjectId to its hexadecimal representation

```javascript
const id = new ObjectId();

console.log(id.toHexString());
```

Example output:

```text
68f34a9e2c7b4a6d9f123456
```

The result of `toHexString()` is a string.

### Important distinction

```javascript
const id1 = new ObjectId();
const id2 = id1.toHexString();

console.log(typeof id1); // "object"
console.log(typeof id2); // "string"
```

The first variable holds an ObjectId instance. The second holds its textual representation.

---

## 11. Converting ObjectId to String

Sometimes we need to send an identifier to a frontend, include it in a URL, or return it in an API response.

In these situations, converting an ObjectId to a string is useful.

### Using `toString()`

```javascript
const id = new ObjectId();

const stringId = id.toString();

console.log(stringId);
console.log(typeof stringId);
```

### Using `toHexString()`

```javascript
const id = new ObjectId();

const stringId = id.toHexString();

console.log(stringId);
console.log(typeof stringId);
```

Both methods give you the hexadecimal representation of the ObjectId.

For ObjectId-specific code, `toHexString()` makes the intended representation particularly clear.

### Example API response

```javascript
const user = await usersCollection.findOne({
  email: "rahul@example.com",
});

if (user) {
  const responseUser = {
    ...user,
    _id: user._id.toHexString(),
  };

  console.log(responseUser);
}
```

This prepares the identifier as a string for JSON serialization.

Keep in mind that MongoDB drivers often serialize ObjectIds to their hexadecimal strings in ordinary JSON responses already. Explicit conversion can still be useful when building a deliberate API response shape.

---

## 12. Converting String to ObjectId

This conversion is particularly important in backend development.

Suppose the frontend sends an identifier:

```javascript
const id = "68f34a9e2c7b4a6d9f123456";
```

Because it comes from a URL, JSON request body, or form, it is commonly a string.

To query a document whose `_id` is an ObjectId, convert the string:

```javascript
import { ObjectId } from "mongodb";

const objectId = new ObjectId(id);
```

Now use it in the query:

```javascript
const user = await usersCollection.findOne({
  _id: objectId,
});
```

### Why is conversion necessary?

Because the database stores the identifier as an ObjectId, but the application received a string.

The types must match for the query to match the stored value.

### Handle invalid values

This can throw an error if the supplied value cannot be used to construct an ObjectId:

```javascript
const id = "invalid-id";

const objectId = new ObjectId(id);
```

Therefore, validate incoming values before constructing the ObjectId.

A strict 24-character hexadecimal check is often appropriate when your API specifically expects a conventional ObjectId string.

---

## 13. Common Error: Querying ObjectId Using a String

This is one of the most common mistakes when learning MongoDB with Node.js.

Suppose the collection contains:

```javascript
{
  _id: ObjectId("68f34a9e2c7b4a6d9f123456"),
  name: "Rahul"
}
```

### Incorrect query

```javascript
const id = "68f34a9e2c7b4a6d9f123456";

const user = await usersCollection.findOne({
  _id: id,
});

console.log(user);
```

Output:

```javascript
null;
```

The query may return `null` because `id` is a string while the stored `_id` is an ObjectId.

### Correct query

```javascript
import { ObjectId } from "mongodb";

const id = "68f34a9e2c7b4a6d9f123456";

const user = await usersCollection.findOne({
  _id: new ObjectId(id),
});

console.log(user);
```

If the document exists and the identifier is valid, this query can find it.

### Remember

```javascript
// String
"68f34a9e2c7b4a6d9f123456";

// ObjectId
new ObjectId("68f34a9e2c7b4a6d9f123456");
```

They are not interchangeable in MongoDB queries.

---

## 14. ObjectId in Express.js Route Parameters

In a typical REST API, the frontend may request a resource using a URL such as:

```text
GET /users/68f34a9e2c7b4a6d9f123456
```

Express provides route parameters as strings.

Example:

```javascript
app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  console.log(typeof id);
  // "string"
});
```

If the database uses ObjectId for `_id`, convert the parameter before querying.

### Complete example

```javascript
import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();

const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();

const db = client.db("myDatabase");
const usersCollection = db.collection("users");

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the expected ObjectId format.
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user = await usersCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Request flow

1. The client sends a request containing the ID in the URL.
2. Express receives the route parameter as a string.
3. The application validates the string.
4. The application converts it into an ObjectId.
5. MongoDB searches for the matching document.
6. Express returns the document or an appropriate error response.

The example assumes your collection uses ObjectIds for user `_id` values.

---

## 15. ObjectId Validation

Before converting an incoming string to an ObjectId, validate it.

### Option 1: Strict format validation

```javascript
function isValidObjectIdString(id) {
  return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
}
```

Usage:

```javascript
const id = req.params.id;

if (!isValidObjectIdString(id)) {
  return res.status(400).json({
    message: "Invalid ObjectId format",
  });
}

const objectId = new ObjectId(id);
```

This checks whether the input contains exactly 24 hexadecimal characters.

### Option 2: Use `ObjectId.isValid()`

```javascript
const isValid = ObjectId.isValid(id);
```

This helper is available in the MongoDB Node.js driver's ObjectId implementation. Its accepted inputs can vary by driver/BSON version, so it is not always equivalent to a strict 24-character string check.

If your API requires a hexadecimal string specifically, the regular expression is a clear way to enforce that contract.

### Important distinction

Validation confirms that an identifier has an acceptable format. It does not prove that a document with that identifier exists.

For example:

```javascript
const id = "68f34a9e2c7b4a6d9f123456";
```

This string may have a valid ObjectId format even if no matching document exists in the collection.

---

## 16. Can We Use Strings Instead of ObjectId?

Yes. MongoDB allows strings as `_id` values.

Example:

```javascript
db.users.insertOne({
  _id: "user-101",
  name: "Rahul",
});
```

You can then query it using a string:

```javascript
db.users.findOne({
  _id: "user-101",
});
```

### When might a string ID be useful?

- When using a meaningful external identifier.
- When integrating with a system that already assigns string IDs.
- When using UUIDs or other application-defined identifiers in an appropriate format.
- When your system deliberately uses human-readable identifiers.

### When might ObjectId be useful?

- When you want the MongoDB driver's standard identifier generation.
- When you want a compact, fixed-size identifier.
- When your application commonly uses MongoDB's default `_id` behavior.

### Should you always use ObjectId?

No. ObjectId is a common default, not a universal requirement.

Choose an identifier strategy based on your application requirements. Be consistent about the identifier type within a collection and throughout your application's data-access code.

---

## 17. ObjectId in Relationships Between Collections

ObjectIds are often used as references between documents.

Consider two collections: `users` and `orders`.

### Users collection

```javascript
{
  _id: ObjectId("68f34a9e2c7b4a6d9f123456"),
  name: "Rahul"
}
```

### Orders collection

```javascript
{
  _id: ObjectId("78f34a9e2c7b4a6d9f123456"),
  product: "Laptop",
  userId: ObjectId("68f34a9e2c7b4a6d9f123456")
}
```

Here, `userId` stores the ObjectId of the related user.

You can query orders for that user:

```javascript
const userId = new ObjectId("68f34a9e2c7b4a6d9f123456");

const orders = await ordersCollection
  .find({
    userId,
  })
  .toArray();
```

### What if `userId` is stored as a string?

Suppose the order instead contains:

```javascript
{
  product: "Laptop",
  userId: "68f34a9e2c7b4a6d9f123456"
}
```

Then a query using an ObjectId will not match that string value.

```javascript
// Does not match a string-valued userId.
await ordersCollection
  .find({
    userId: new ObjectId("68f34a9e2c7b4a6d9f123456"),
  })
  .toArray();
```

Use the corresponding string when the field is stored as a string:

```javascript
await ordersCollection
  .find({
    userId: "68f34a9e2c7b4a6d9f123456",
  })
  .toArray();
```

**Best practice:** Keep reference fields consistent with the identifier type they reference. MongoDB does not automatically enforce relational foreign-key constraints.

---

## 18. Common Mistakes

### Mistake 1: Assuming ObjectId is a string

```javascript
const id = new ObjectId();

console.log(typeof id);
// "object"
```

**Correction:** ObjectId is a BSON type represented by an ObjectId instance in JavaScript.

### Mistake 2: Passing a route parameter directly into an ObjectId query

```javascript
const user = await usersCollection.findOne({
  _id: req.params.id,
});
```

**Correction:** If `_id` is an ObjectId, validate and convert `req.params.id` before querying.

### Mistake 3: Confusing string conversion with type preservation

```javascript
const id = new ObjectId();
const stringId = id.toString();
```

**Correction:** `stringId` is now a string. Convert it back with `new ObjectId(stringId)` if you need to query an ObjectId field.

### Mistake 4: Assuming every `_id` is an ObjectId

```javascript
{
  _id: "user-101",
  name: "Rahul"
}
```

This is valid. `_id` may use different BSON types, provided it satisfies MongoDB's `_id` requirements.

**Correction:** Inspect the actual stored type before writing a query.

### Mistake 5: Assuming a valid ID must exist

A valid 24-character hexadecimal string is not proof that a matching document exists.

**Correction:** Validate the format, query the database, and handle the case where no document is found.

### Mistake 6: Using ObjectId as a security mechanism

ObjectIds are identifiers, not authorization credentials.

**Correction:** Check the authenticated user's permissions before allowing access to or modification of a resource.

---

## 19. Best Practices

1. **Use a consistent identifier type.** If a collection uses ObjectIds for `_id`, keep that convention unless you have a specific reason to use another type.

2. **Validate external input.** Route parameters and request-body values should not be blindly passed into ObjectId constructors.

3. **Convert at the database boundary.** Convert incoming string IDs to ObjectIds in the server-side data-access flow when the database expects ObjectIds.

4. **Handle missing documents.** A syntactically valid ObjectId may not match any document.

5. **Use explicit timestamps when needed.** Do not rely on the ObjectId timestamp as the sole record of business creation time.

6. **Understand JSON serialization.** An ObjectId commonly appears as a string in ordinary JSON output, but that does not mean it is stored as a string in MongoDB.

7. **Keep reference types consistent.** If `users._id` is an ObjectId, store the corresponding `orders.userId` as an ObjectId when using that field as a reference.

8. **Do not rely on IDs for authorization.** Verify permissions independently of whether the client knows an identifier.

---

## 20. Interview Questions and Answers

### Q1. What is ObjectId in MongoDB?

ObjectId is a BSON data type commonly used as the default value for a document's `_id` field. It is 12 bytes long and conventionally represented by 24 hexadecimal characters.

### Q2. Why is ObjectId not a string?

Because ObjectId and String are different BSON types. Even if an ObjectId and a string contain the same visible characters, MongoDB treats them as different types when matching values.

### Q3. How many bytes does an ObjectId contain?

An ObjectId contains 12 bytes: 4 bytes for a timestamp, 5 bytes for a random value, and 3 bytes for a counter.

### Q4. Why does an ObjectId contain 24 hexadecimal characters?

Each byte is represented by two hexadecimal characters. Therefore, 12 bytes are represented by 24 hexadecimal characters.

### Q5. Does MongoDB automatically generate `_id`?

If an inserted document does not contain `_id`, the MongoDB driver typically generates an ObjectId. An application can also provide its own `_id` value.

### Q6. Can `_id` be a string?

Yes. MongoDB allows a string, ObjectId, and other supported BSON values to be used as `_id`, subject to its requirements.

### Q7. Why does a query using a string ID return `null`?

If the stored `_id` is an ObjectId but the query uses a string, the values have different types and do not match.

### Q8. How do you convert a string to ObjectId in Node.js?

```javascript
import { ObjectId } from "mongodb";

const id = new ObjectId("68f34a9e2c7b4a6d9f123456");
```

Validate external input before constructing the ObjectId.

### Q9. How do you convert ObjectId to a string?

```javascript
const stringId = objectId.toHexString();
```

You can also use `objectId.toString()`.

### Q10. What is the output of `typeof new ObjectId()`?

It returns `"object"` in JavaScript because the value is an ObjectId instance.

### Q11. Can we get the creation time from ObjectId?

You can extract the timestamp encoded in an ObjectId using `getTimestamp()`. It represents the time encoded when the ObjectId was generated, not necessarily the exact database insertion time.

### Q12. Does ObjectId guarantee uniqueness?

ObjectIds are designed to be highly likely to be unique, but they should not be treated as an absolute mathematical guarantee. MongoDB also enforces uniqueness for the `_id` field within a collection.

### Q13. Does MongoDB automatically convert a string ID to ObjectId?

No. The application should convert the string when the target field stores an ObjectId.

### Q14. Why are Express route parameters usually strings?

HTTP URLs are textual. Express exposes route parameters as strings, so an ObjectId parameter usually needs validation and conversion before an ObjectId-based database query.

### Q15. What is the difference between ObjectId and UUID?

ObjectId is a MongoDB BSON type with a 12-byte structure that includes a timestamp component. UUIDs are standardized 128-bit identifiers and are commonly represented as strings or stored using a BSON binary representation. The best choice depends on the application's needs.

---

## 21. Quick Revision

| Question                                                            | Answer                   |
| ------------------------------------------------------------------- | ------------------------ |
| Is ObjectId a string?                                               | No                       |
| Is ObjectId a BSON type?                                            | Yes                      |
| How many bytes?                                                     | 12                       |
| How many hexadecimal characters in its conventional representation? | 24                       |
| What does `typeof new ObjectId()` return?                           | `"object"`               |
| What does `typeof objectId.toHexString()` return?                   | `"string"`               |
| How do you create an ObjectId?                                      | `new ObjectId()`         |
| How do you convert ObjectId to a string?                            | `objectId.toHexString()` |
| How do you convert a valid hexadecimal string to ObjectId?          | `new ObjectId(idString)` |
| Does MongoDB automatically convert a query string to ObjectId?      | No                       |
| Can `_id` be a string?                                              | Yes                      |
| Does a valid ObjectId format guarantee a document exists?           | No                       |

### Final Takeaway

**ObjectId is not a string because it is a distinct BSON data type.**

The 24-character hexadecimal value is only its human-readable representation. When working with MongoDB and Node.js, always match the type of the value in your query to the type stored in the database.

For example:

```javascript
// String received from a URL
const id = req.params.id;

// Convert to ObjectId before querying an ObjectId field
const user = await usersCollection.findOne({
  _id: new ObjectId(id),
});
```

This small distinction prevents a common class of MongoDB query errors.
