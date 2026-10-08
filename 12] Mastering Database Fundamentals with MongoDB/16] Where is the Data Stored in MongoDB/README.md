# Where is Data Stored in MongoDB?

MongoDB stores data in **database files on the server's storage**, usually the computer's SSD or HDD.

When an application sends data to MongoDB:

```text
Application
     ↓
MongoDB Driver
     ↓
MongoDB Server
     ↓
Database
     ↓
Collection
     ↓
Document
     ↓
BSON
     ↓
Storage Files on Disk
```

For example:

```javascript
db.users.insertOne({
  name: "John",
  age: 25,
});
```

The document is stored by MongoDB as BSON data in its database storage system.

---

# Table of Contents

1. [Where Does MongoDB Store Data?](#where-does-mongodb-store-data)
2. [MongoDB Data Hierarchy](#mongodb-data-hierarchy)
3. [MongoDB Storage Engine](#mongodb-storage-engine)
4. [WiredTiger](#wiredtiger)
5. [Data Files on Disk](#data-files-on-disk)
6. [MongoDB Data Directory](#mongodb-data-directory)
7. [Linux Data Directory](#linux-data-directory)
8. [Windows Data Directory](#windows-data-directory)
9. [MongoDB Atlas Storage](#mongodb-atlas-storage)
10. [RAM vs Disk](#ram-vs-disk)
11. [What Happens During an Insert?](#what-happens-during-an-insert)
12. [What Happens During a Read?](#what-happens-during-a-read)
13. [What Happens During an Update?](#what-happens-during-an-update)
14. [What Happens During a Delete?](#what-happens-during-a-delete)
15. [Journal and Durability](#journal-and-durability)
16. [MongoDB Data Is Not Stored as JSON Files](#mongodb-data-is-not-stored-as-json-files)
17. [Can We Open MongoDB Data Files Directly?](#can-we-open-mongodb-data-files-directly)
18. [How to Find the MongoDB Data Directory](#how-to-find-the-mongodb-data-directory)
19. [Important MongoDB Storage Concepts](#important-mongodb-storage-concepts)
20. [Interview Questions](#interview-questions)
21. [Quick Revision](#quick-revision)

---

# Where Does MongoDB Store Data?

MongoDB stores persistent data on the **filesystem of the machine where MongoDB is running**.

For a local MongoDB installation:

```text
Your Computer
     |
     └── MongoDB Server
            |
            └── Data Directory
                   |
                   ├── Database files
                   ├── Collection data
                   ├── Index data
                   └── Other storage-engine files
```

MongoDB manages these files automatically.

You normally interact with MongoDB through:

```text
mongosh
MongoDB Compass
Node.js Driver
MongoDB Shell
Express.js
MongoDB Atlas
```

You generally should **not manually modify MongoDB's storage files**.

---

# MongoDB Data Hierarchy

It is useful to understand the logical hierarchy first.

```text
MongoDB Server
      |
      └── Database
            |
            ├── Collection
            │      |
            │      ├── Document
            │      ├── Document
            │      └── Document
            |
            └── Collection
                   |
                   ├── Document
                   └── Document
```

For example:

```text
MongoDB
   |
   └── ecommerce
          |
          ├── users
          │    ├── Document
          │    ├── Document
          │    └── Document
          │
          ├── products
          │    ├── Document
          │    └── Document
          │
          └── orders
               ├── Document
               └── Document
```

These are **logical concepts**.

They do not mean that MongoDB simply creates:

```text
ecommerce/
    users.json
    products.json
    orders.json
```

MongoDB uses a storage engine to manage the actual physical representation.

---

# MongoDB Storage Engine

A **storage engine** is the component responsible for managing how MongoDB stores and retrieves data.

MongoDB uses:

```text
WiredTiger
```

as its default storage engine.

The storage engine handles things such as:

- Reading data from disk
- Writing data to disk
- Caching data
- Index storage
- Compression
- Concurrency
- Journaling
- Recovery after failures

Conceptually:

```text
MongoDB Server
      |
      ↓
Storage Engine
      |
      ↓
Filesystem
      |
      ↓
SSD / HDD
```

---

# WiredTiger

**WiredTiger** is MongoDB's default storage engine.

It provides important features such as:

### 1. Document-level concurrency

Multiple operations can work concurrently without requiring the entire database to be locked for every operation.

### 2. Compression

WiredTiger can compress data to reduce storage requirements.

### 3. Caching

Frequently accessed data can be kept in memory.

### 4. Journaling

MongoDB can maintain journal information that helps with recovery after unexpected shutdowns.

### 5. Index management

Indexes are stored and managed by the storage engine.

---

# Data Files on Disk

MongoDB does not normally store each document as an individual file.

For example, if you have:

```javascript
{
  name: "John",
  age: 25
}
```

MongoDB does **not** create:

```text
john.json
```

Instead, MongoDB's storage engine organizes many documents into its internal storage structures.

Conceptually:

```text
Disk
 |
 └── MongoDB Data Directory
       |
       ├── Storage Engine Files
       ├── Collection Data
       ├── Index Data
       ├── Journal
       └── Other Metadata
```

The exact files and their organization depend on the MongoDB version and storage engine configuration.

---

# MongoDB Data Directory

MongoDB needs a directory where it stores its database files.

This is commonly called the:

```text
dbPath
```

The `dbPath` tells MongoDB:

> "Store the database files here."

For example:

```text
/data/db
```

MongoDB then uses this location for its persistent database storage.

---

# Linux Data Directory

A common default data directory for a manually configured MongoDB server is:

```text
/data/db
```

For example:

```text
/data/db
```

You may see MongoDB-related files inside this directory.

You can check:

```bash
ls /data/db
```

However, package-managed MongoDB installations can use a different configured `dbPath`.

Therefore, don't assume `/data/db` is always the active location.

---

# Windows Data Directory

On Windows, the data directory depends on how MongoDB was installed and configured.

A common location is:

```text
C:\data\db
```

For example:

```text
C:\data\db
```

But again, the actual location is determined by MongoDB's configuration and `dbPath`.

---

# MongoDB Atlas Storage

If you use **MongoDB Atlas**, MongoDB is running in the cloud rather than on your personal computer.

Conceptually:

```text
Your Application
       |
       ↓
Internet
       |
       ↓
MongoDB Atlas
       |
       ↓
Cloud Infrastructure
       |
       ↓
Persistent Storage
```

You don't normally access the underlying MongoDB data files directly.

Atlas manages the infrastructure and storage for you.

Therefore, you work with the database through:

```text
MongoDB Driver
MongoDB Compass
MongoDB Shell
Atlas UI
```

rather than manually managing the server's filesystem.

---

# RAM vs Disk

One of the most important concepts is understanding the difference between:

```text
RAM
```

and:

```text
Disk
```

MongoDB uses both.

---

## Disk

Disk provides **persistent storage**.

Examples:

```text
SSD
HDD
Cloud persistent storage
```

Data stored on disk survives a server restart.

Conceptually:

```text
MongoDB
   ↓
Disk
   ↓
Persistent Data
```

---

## RAM

RAM provides **fast temporary access**.

MongoDB/WiredTiger keeps frequently accessed data in memory through its cache and relies on the operating system's filesystem cache as well.

Conceptually:

```text
Disk
  ↓
RAM / Cache
  ↓
CPU
```

RAM is much faster than disk.

---

# Why Does MongoDB Use RAM?

Suppose your collection contains:

```text
10 GB of data
```

but your server has:

```text
4 GB RAM
```

MongoDB does not need to load the entire 10 GB collection into RAM.

Instead, frequently accessed data can be cached.

Conceptually:

```text
Disk
10 GB
 |
 | Frequently used data
 ↓
RAM
4 GB
```

The exact memory behavior depends on the MongoDB version, workload, operating system, indexes, and available resources.

---

# What Happens During an Insert?

Suppose you execute:

```javascript
db.users.insertOne({
  name: "John",
  age: 25,
});
```

Conceptually:

```text
1. Application sends request
          ↓
2. MongoDB receives request
          ↓
3. Document is encoded as BSON
          ↓
4. MongoDB/WiredTiger processes the write
          ↓
5. Data is written through the storage system
          ↓
6. MongoDB acknowledges the write according to
   the configured write concern
```

The document is persisted using MongoDB's storage engine rather than being saved as a simple `.json` file.

---

# What Happens During a Read?

Suppose:

```javascript
db.users.findOne({
  name: "John",
});
```

Conceptually:

```text
Application
     ↓
MongoDB
     ↓
Query
     ↓
Index / Collection
     ↓
Memory Cache
     ↓
Disk if necessary
     ↓
Document
     ↓
Application
```

If the required data is already available in memory/cache, MongoDB can avoid reading that data directly from disk.

If it isn't available, the storage system may need to retrieve it from disk.

---

# What Happens During an Update?

Suppose:

```javascript
db.users.updateOne(
  { name: "John" },
  {
    $set: {
      age: 26,
    },
  },
);
```

Conceptually:

```text
Application
     ↓
MongoDB
     ↓
Find matching document
     ↓
Apply update
     ↓
Storage Engine
     ↓
Persistent Storage
```

MongoDB and WiredTiger handle the underlying storage details.

You don't manually locate the document's physical position on disk.

---

# What Happens During a Delete?

Suppose:

```javascript
db.users.deleteOne({
  name: "John",
});
```

MongoDB handles the deletion through its storage engine.

Conceptually:

```text
Application
     ↓
MongoDB
     ↓
Find document
     ↓
Delete operation
     ↓
WiredTiger
     ↓
Storage management
```

The application should not directly manipulate the underlying database files.

---

# Journal and Durability

MongoDB's storage system includes mechanisms that help maintain data durability.

With WiredTiger, journaling provides a record of changes that can be used during recovery after certain failures.

Conceptually:

```text
Application
     |
     ↓
MongoDB
     |
     ├── Data
     |
     └── Journal
            |
            ↓
        Persistent Storage
```

If the server unexpectedly stops, MongoDB can use its recovery mechanisms when restarting.

---

# Write Concern

An important concept related to data persistence is:

```text
Write Concern
```

Write concern controls the level of acknowledgment MongoDB provides for a write operation.

For example:

```javascript
db.users.insertOne(
  {
    name: "John",
  },
  {
    writeConcern: {
      w: "majority",
    },
  },
);
```

`w: "majority"` requests acknowledgment after the write has been replicated to a majority of voting members of the replica set.

This is especially important when working with replicated/production MongoDB deployments.

---

# MongoDB Data Is Not Stored as JSON Files

A common beginner misconception is:

> "MongoDB stores every document as a JSON file."

This is incorrect.

MongoDB uses:

```text
BSON
```

and a storage engine such as:

```text
WiredTiger
```

The physical storage format is managed internally.

For example, this logical document:

```javascript
{
  name: "John",
  age: 25
}
```

does not mean MongoDB creates:

```text
users/John.json
```

Instead:

```text
Logical Document
       ↓
BSON
       ↓
WiredTiger
       ↓
MongoDB Storage Files
       ↓
Disk
```

---

# Can We Open MongoDB Data Files Directly?

Generally, **no**.

MongoDB storage files are internal database files.

You should not open or edit them manually.

Do not do things such as:

```text
Edit MongoDB data file
Delete MongoDB storage file
Rename internal storage file
Modify database files manually
```

Doing so can corrupt the database.

Instead, interact with MongoDB using:

```text
mongosh
MongoDB Compass
MongoDB Driver
MongoDB Atlas
MongoDB tools
```

---

# How to Find the MongoDB Data Directory

MongoDB uses the `dbPath` configuration to determine where its data is stored.

When running MongoDB, you can inspect the server configuration and startup parameters to determine the active `dbPath`.

For example, a server may be started with:

```bash
mongod --dbpath /data/db
```

This tells MongoDB:

```text
Use /data/db as the database storage directory.
```

Another example:

```bash
mongod --dbpath /home/user/mongodb-data
```

Now MongoDB stores its database files under:

```text
/home/user/mongodb-data
```

---

# MongoDB Local Installation

A typical local setup looks like:

```text
Your Computer
│
├── Application
│     └── Node.js / Express.js
│
└── MongoDB Server
      │
      └── dbPath
            │
            └── MongoDB Storage Files
```

For example:

```text
Node.js Application
        |
        | MongoDB Driver
        ↓
MongoDB Server
        |
        ↓
WiredTiger
        |
        ↓
/data/db
        |
        ↓
SSD / HDD
```

---

# MongoDB + Node.js

When using MongoDB from Node.js, your application does not directly write to the database files.

Example:

```javascript
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");

await client.connect();

const db = client.db("myDatabase");

const users = db.collection("users");

await users.insertOne({
  name: "John",
  age: 25,
});
```

The flow is:

```text
Node.js
   ↓
MongoDB Driver
   ↓
MongoDB Server
   ↓
WiredTiger
   ↓
Disk
```

Your Node.js application does **not** need to know where the physical MongoDB files are located.

---

# Logical Storage vs Physical Storage

This distinction is very important.

## Logical View

As a developer, you think in terms of:

```text
Database
   ↓
Collection
   ↓
Document
   ↓
Field
   ↓
Value
```

Example:

```text
ecommerce
   ↓
users
   ↓
John
   ↓
name = "John"
age = 25
```

## Physical View

MongoDB internally manages:

```text
Database Files
       ↓
Storage Engine
       ↓
WiredTiger Structures
       ↓
Indexes
       ↓
Journal / Recovery Data
       ↓
Disk
```

You normally work with the **logical view**.

MongoDB handles the physical view.

---

# Where Are Indexes Stored?

Indexes are also persisted by MongoDB's storage engine.

For example:

```javascript
db.users.createIndex({
  email: 1,
});
```

MongoDB stores and manages the index as part of its storage system.

Conceptually:

```text
MongoDB Storage
     |
     ├── Collection Data
     |
     ├── Index Data
     |
     └── Other Storage Metadata
```

Indexes are also loaded/cached as needed to make queries faster.

---

# Why Should We Not Manually Modify the Files?

MongoDB maintains complex relationships between:

```text
Documents
Indexes
Storage Structures
Metadata
Journal
Recovery Information
```

If you manually change an internal file:

```text
MongoDB
   ↓
Expected internal structure
   ❌
Manually modified file
```

the database may become inconsistent or corrupted.

Therefore:

> Always use MongoDB commands/tools to modify database contents.

For example:

```javascript
db.users.deleteOne({
  _id: someId,
});
```

instead of trying to delete the corresponding data from the filesystem.

---

# MongoDB Storage Flow

A useful way to remember the entire architecture is:

```text
                    Application
                         |
                         ↓
                  MongoDB Driver
                         |
                         ↓
                  MongoDB Server
                         |
                         ↓
                   Query / Write
                         |
                         ↓
                   Storage Engine
                         |
                      WiredTiger
                         |
              ┌──────────┴──────────┐
              ↓                     ↓
            Cache                 Disk
              |                     |
              |              Persistent Storage
              |                     |
              └──────────┬──────────┘
                         ↓
                    SSD / HDD
```

---

# Local MongoDB vs MongoDB Atlas

| Feature                | Local MongoDB                      | MongoDB Atlas                      |
| ---------------------- | ---------------------------------- | ---------------------------------- |
| Server location        | Your machine/server                | Cloud                              |
| Data storage           | Local disk/server storage          | Cloud persistent storage           |
| Manage OS              | You                                | Managed by Atlas                   |
| Manage MongoDB process | Usually you                        | Atlas                              |
| Access data            | Driver, Compass, mongosh           | Driver, Compass, Atlas UI, mongosh |
| Physical data files    | Accessible to server administrator | Managed by Atlas                   |
| Storage management     | Your responsibility                | Atlas-managed                      |

---

# Important MongoDB Storage Concepts

Remember these terms:

### Database

Logical container for collections.

```text
myDatabase
```

### Collection

Logical container for documents.

```text
users
```

### Document

Individual MongoDB record.

```javascript
{
  name: "John",
  age: 25
}
```

### BSON

Binary representation used by MongoDB.

### Storage Engine

Component responsible for managing persistent data.

### WiredTiger

MongoDB's default storage engine.

### `dbPath`

Directory where MongoDB stores its database files.

### Cache

Memory used to speed up frequently accessed data.

### Journal

Storage-engine mechanism that helps with durability and recovery.

---

# Interview Questions

## 1. Where does MongoDB store data?

MongoDB stores persistent data on the filesystem of the machine/server where MongoDB is running.

The exact location is determined by MongoDB's configured `dbPath`.

---

## 2. Does MongoDB store each document as a separate JSON file?

No.

MongoDB stores documents as BSON and manages their physical storage through its storage engine.

It does not normally create one JSON file per document.

---

## 3. What is the default storage engine in MongoDB?

The default storage engine is:

```text
WiredTiger
```

---

## 4. What is `dbPath`?

`dbPath` specifies the directory where MongoDB stores its database files.

Example:

```bash
mongod --dbpath /data/db
```

---

## 5. Does MongoDB store data in RAM or disk?

Both are involved.

```text
RAM → caching / faster access
Disk → persistent storage
```

The persistent database data ultimately needs to be stored on durable storage.

---

## 6. What happens if MongoDB restarts?

Persistent data remains on disk.

When MongoDB starts again, it can load and reconstruct the required state from its persistent storage and recovery mechanisms.

---

## 7. Why does MongoDB use RAM?

RAM provides much faster access than disk.

MongoDB/WiredTiger and the operating system use memory to cache frequently accessed data and indexes, improving performance.

---

## 8. Can we edit MongoDB database files manually?

No.

MongoDB storage files are internal files managed by the database.

Use MongoDB's APIs, commands, or administration tools instead.

---

## 9. Where does MongoDB Atlas store data?

MongoDB Atlas stores database data on cloud infrastructure with persistent storage.

The underlying storage infrastructure is managed by Atlas.

---

## 10. Are MongoDB indexes stored on disk?

Yes.

Indexes are persistent database structures managed by the storage engine.

They can also be cached in memory to improve query performance.

---

## 11. What is the difference between BSON and storage files?

BSON describes the binary representation of MongoDB values/documents.

Storage files are the physical files managed by the storage engine.

Conceptually:

```text
Document
   ↓
BSON
   ↓
Storage Engine
   ↓
Storage Files
```

---

# Quick Revision

```text
MongoDB Data Storage
        |
        ↓
   BSON Documents
        |
        ↓
   Storage Engine
        |
        ↓
    WiredTiger
        |
        ├── Cache / Memory
        |
        └── Persistent Storage
                |
                ↓
             Disk
```

### Key points

```text
1. MongoDB stores persistent data on disk.
2. MongoDB uses a storage engine to manage that data.
3. WiredTiger is the default storage engine.
4. dbPath determines the database storage directory.
5. MongoDB stores BSON, not ordinary JSON files.
6. Data is not normally stored as one file per document.
7. RAM is used heavily for caching and performance.
8. Indexes are persistent and are also cached as needed.
9. Journaling/recovery mechanisms help protect against failures.
10. Never manually modify MongoDB's internal data files.
11. Local MongoDB stores data on your server's storage.
12. MongoDB Atlas stores data on managed cloud infrastructure.
```

---

# Final Mental Model

Whenever you think:

> "Where is my MongoDB data actually stored?"

Think:

```text
                 MongoDB
                    |
              Logical Data
                    |
        ┌───────────┴───────────┐
        ↓                       ↓
    Database                 Collection
                                |
                                ↓
                            Documents
                                |
                                ↓
                              BSON
                                |
                                ↓
                         Storage Engine
                                |
                           WiredTiger
                                |
                    ┌───────────┴───────────┐
                    ↓                       ↓
                 Memory                   Disk
                 (Cache)              (Persistent)
                                            |
                                            ↓
                                      SSD / HDD
```

**In short:**

> MongoDB logically organizes data into databases → collections → documents, but physically stores that data through its storage engine (WiredTiger) in files under the configured `dbPath` on persistent storage, while memory is used extensively for caching and performance.
