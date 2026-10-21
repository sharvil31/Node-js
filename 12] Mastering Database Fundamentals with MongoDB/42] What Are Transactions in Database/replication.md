# Replication in MongoDB

## Table of Contents

1. [Introduction](#1-introduction)
2. [What Is Replication?](#2-what-is-replication)
3. [What Is a Replica Set?](#3-what-is-a-replica-set)
4. [Replica Set Architecture](#4-replica-set-architecture)
5. [How Replication Works](#5-how-replication-works)
6. [Primary and Secondary Nodes](#6-primary-and-secondary-nodes)
7. [Oplog (Operation Log)](#7-oplog-operation-log)
8. [Automatic Failover and Elections](#8-automatic-failover-and-elections)
9. [Setting Up a Replica Set](#9-setting-up-a-replica-set)
10. [Important Replica Set Commands](#10-important-replica-set-commands)
11. [Replication in Node.js](#11-replication-in-nodejs)
12. [Read Preference](#12-read-preference)
13. [Write Concern](#13-write-concern)
14. [Replication vs Backup](#14-replication-vs-backup)
15. [Advantages of Replication](#15-advantages-of-replication)
16. [Limitations of Replication](#16-limitations-of-replication)
17. [Common Problems](#17-common-problems)
18. [Interview Questions and Answers](#18-interview-questions-and-answers)
19. [Summary](#19-summary)

---

## 1. Introduction

**Replication in MongoDB is the process of maintaining multiple copies of the same data across different database servers.**

It improves database availability, fault tolerance, and data redundancy.

If one database server fails, another eligible server can become the primary server and continue accepting writes.

MongoDB implements replication using a **replica set**.

### Example

Suppose an e-commerce application stores information about users, products, and orders.

Without replication, if the only database server fails, the application may lose access to its data until the server recovers.

With replication, MongoDB maintains copies of the data on multiple servers.

```text
                 Application
                      |
                      v
                MongoDB Primary
                      |
              Replication Process
                 /          \
                v            v
          Secondary 1    Secondary 2
```

If the primary server becomes unavailable, the remaining eligible replica set members can elect a new primary.

---

## 2. What Is Replication?

Replication is the process of copying and maintaining data from one database server to other database servers.

In MongoDB, replication normally happens between members of a replica set.

When a client writes data to the primary, the primary records the operation in its operation log. Secondary members replicate the operation and apply it to their own data.

### Example

Suppose we insert a document into the `users` collection.

```javascript
db.users.insertOne({
  name: "Sharvil",
  age: 22
});
```

The document is written to the primary node.

The secondary nodes replicate the operation so that they maintain their own copies of the data.

Conceptually:

```text
Primary:
{
  name: "Sharvil",
  age: 22
}

Secondary 1:
{
  name: "Sharvil",
  age: 22
}

Secondary 2:
{
  name: "Sharvil",
  age: 22
}
```

Replication is asynchronous by default, so the secondary nodes may take some time to reflect the latest writes.

**Important:** Replication does not necessarily mean every secondary has the latest data at the exact same moment.

---

## 3. What Is a Replica Set?

A **replica set** is a group of MongoDB processes that maintain the same data set and coordinate to provide redundancy and high availability.

A typical replica set contains:

- One primary member.
- One or more secondary members.

A common production configuration uses three data-bearing members.

```text
                 Replica Set
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
       Primary    Secondary   Secondary
```

Each member runs its own MongoDB server process, usually on a separate machine or host in a production deployment.

### Why Do We Need a Replica Set?

A replica set helps protect an application against a single database server failure.

For example:

1. The primary accepts a write operation.
2. The operation is replicated to secondary members.
3. The primary server unexpectedly fails.
4. The remaining eligible members hold an election.
5. A new primary is elected.
6. The application can continue writing after the driver discovers the new primary and reconnects.

The exact recovery time depends on the failure, network conditions, election process, and client configuration.

---

## 4. Replica Set Architecture

### 4.1 Primary Member

The primary is the member that normally receives write operations from clients.

Example:

```javascript
db.products.insertOne({
  name: "Laptop",
  price: 55000
});
```

The write is directed to the primary member.

The primary records the operation in its oplog, which secondary members use to replicate the change.

A replica set has only one primary at a time under normal operation.

### 4.2 Secondary Members

Secondary members replicate data from the primary by applying operations recorded in the oplog.

They maintain copies of the data set and can participate in elections when eligible.

By default, ordinary client reads and writes use the primary, although read preferences and other configuration options can change where reads are directed.

### 4.3 Arbiter

An arbiter participates in elections but does not store a copy of the data set.

Its purpose is to contribute a vote when determining which member can become primary.

For example:

```text
             Replica Set
                  |
        +---------+---------+
        |         |         |
        v         v         v
     Primary  Secondary   Arbiter
     (Data)     (Data)   (No Data)
```

An arbiter does not provide an additional data copy and cannot replace a data-bearing secondary.

In general, a three-member replica set with three data-bearing members provides better redundancy than a configuration that uses an arbiter.

### 4.4 Voting Members

Replica set members can have voting rights.

Votes help determine whether a candidate has enough support to become primary.

A majority of voting members must be available for a primary to be elected.

For example, in a replica set with three voting members:

```text
Total voting members = 3
Majority = 2
```

At least two votes are required for an election majority.

A network partition can prevent a member from remaining primary if it cannot communicate with a majority of voting members.

---

## 5. How Replication Works

MongoDB replication can be understood through the following steps.

### Step 1: A Client Sends a Write Operation

The application sends a write request to the primary.

```javascript
db.users.insertOne({
  name: "Rahul",
  age: 25
});
```

### Step 2: The Primary Applies the Write

The primary processes the operation and records the change in its data set.

The operation is also recorded in the primary's oplog.

### Step 3: The Operation Is Replicated

Secondary members fetch new oplog entries from a synchronization source and apply those operations to their own data sets.

### Step 4: Secondary Members Catch Up

Each secondary independently tracks its replication progress.

If a secondary falls behind, it attempts to catch up by obtaining and applying the missing oplog operations.

If the required operations are no longer available in the oplog, the secondary may need to perform an initial sync.

### Step 5: Write Acknowledgment

The client receives a response according to the configured write concern.

For example:

- `w: 1` generally acknowledges the write after it has been applied on the primary.
- `w: "majority"` waits for acknowledgment from a majority of voting members under MongoDB's write concern rules.

A write acknowledgment does not always mean every secondary has applied the write.

### Replication Flow

```text
Client
  |
  | Insert / Update / Delete
  v
Primary
  |
  | Apply operation
  | Record operation in oplog
  v
Secondary Members
  |
  | Fetch oplog entries
  | Apply operations
  v
Replicated Data
```

---

## 6. Primary and Secondary Nodes

| Feature | Primary | Secondary |
|---|---|---|
| Stores data | Yes | Yes |
| Accepts ordinary writes | Yes | No, not as the normal replica set write target |
| Replicates operations | Produces oplog entries | Fetches and applies oplog entries |
| Participates in elections | Yes | Yes, if eligible |
| Can become primary | Already primary | If eligible and elected |
| Serves reads | Yes | Yes, when permitted by read preference and configuration |

### Important Note

A secondary is not automatically a writable replacement while it is still secondary.

It must be elected as the new primary before it can accept ordinary replica set writes.

Applications should use a replica set connection string and a compatible MongoDB driver so the driver can discover the primary and respond to topology changes.

---

## 7. Oplog (Operation Log)

The **oplog**, short for operation log, is a special capped collection that records data-changing operations performed on the primary.

The oplog is stored in the `local` database under the `oplog.rs` collection.

Secondaries use the oplog to replicate changes.

### Check the Oplog

Run this command in `mongosh`:

```javascript
use local

db.oplog.rs.find().sort({ $natural: -1 }).limit(5);
```

This displays recent oplog entries, if present.

You can also inspect the replica set status:

```javascript
rs.status();
```

### Example of an Oplog Entry

A simplified conceptual example:

```javascript
{
  ts: Timestamp(...),
  op: "i",
  ns: "shop.users",
  o: {
    _id: ObjectId("..."),
    name: "Sharvil",
    age: 22
  }
}
```

This represents an insert operation in the `shop.users` namespace.

The actual oplog entry format can vary by operation and MongoDB version.

Common operation codes historically include:

- `i` — Insert
- `u` — Update
- `d` — Delete
- `c` — Command

### Why Is the Oplog Important?

The oplog allows secondary members to determine which operations they need to apply.

For example:

```text
Primary Oplog
     |
     +-------> Secondary 1
     |
     +-------> Secondary 2
```

The oplog has a limited retention window determined by its size, write volume, and configuration.

If a secondary falls too far behind and the required oplog history has been overwritten, it may require an initial sync to recover.

**Important:** The oplog is not a permanent audit log or a substitute for database backups.

---

## 8. Automatic Failover and Elections

Automatic failover is one of the most important benefits of MongoDB replication.

Failover happens when the primary becomes unavailable or steps down, requiring eligible members to elect a new primary.

### Example

Initially, the replica set looks like this:

```text
Primary: P1
Secondary: S1
Secondary: S2
```

Suppose P1 fails.

```text
P1: Failed
S1: Available
S2: Available
```

The remaining eligible members conduct an election.

If S1 wins the election:

```text
New Primary: S1
Secondary: S2
P1: Unavailable
```

The application can resume writes after discovering the new primary.

### How Does an Election Work?

1. The replica set detects that the primary is unavailable or no longer primary.
2. Eligible members evaluate whether they can participate in an election.
3. Voting members exchange election messages.
4. A candidate must obtain a majority of votes.
5. The winner becomes the new primary.

The election process considers factors such as member eligibility, configuration, and replication progress.

### What Happens to the Application?

MongoDB drivers monitor the replica set topology.

When the primary changes, the driver attempts to discover the new primary and route operations appropriately.

Some requests may fail during the transition. Applications should implement suitable error handling and retry behavior where appropriate.

### Can Two Members Become Primary at the Same Time?

The replica set election and majority rules are designed to prevent two members from both acting as the valid primary at the same time.

During network partitions, a member that loses communication with the majority steps down or cannot remain primary.

This protects the replica set from accepting conflicting writes on two independent primaries.

---

## 9. Setting Up a Replica Set

This section demonstrates a basic local development setup.

For this example, we use three MongoDB instances on one computer with different ports.

**Important:** This configuration is for learning and testing. Three instances on one computer do not provide the same fault tolerance as servers distributed across independent machines.

### Step 1: Start Three MongoDB Instances

You need a MongoDB Server installation and three separate data directories.

Create directories such as:

```text
replica-data/
├── node1/
├── node2/
└── node3/
```

Start each instance in a separate terminal.

Example commands for a system where `mongod` is available in the terminal:

```bash
mongod --replSet rs0 --port 27017 --dbpath ./replica-data/node1 --bind_ip localhost
```

```bash
mongod --replSet rs0 --port 27018 --dbpath ./replica-data/node2 --bind_ip localhost
```

```bash
mongod --replSet rs0 --port 27019 --dbpath ./replica-data/node3 --bind_ip localhost
```

Each data directory must exist and be used by only one running MongoDB instance.

On Windows, use valid Windows directory paths and the appropriate executable path for `mongod.exe`.

If MongoDB cannot find a directory, create it first.

### Step 2: Connect to the First Instance

Open another terminal and run:

```bash
mongosh --port 27017
```

### Step 3: Initialize the Replica Set

Run:

```javascript
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" },
    { _id: 2, host: "localhost:27019" }
  ]
});
```

Here:

- `rs0` is the replica set name.
- Each member has a unique numeric `_id`.
- `host` specifies the address and port of each member.

All members must be able to reach one another using the configured hostnames and ports.

### Step 4: Check the Replica Set Status

```javascript
rs.status();
```

Wait until one member becomes `PRIMARY` and the others become `SECONDARY`.

You can also run:

```javascript
rs.isMaster();
```

This legacy command is retained for compatibility. Newer applications and tooling generally use the `hello` command for topology discovery.

### Step 5: Check the Current Primary

```javascript
db.hello();
```

Inspect the `isWritablePrimary` field in the response.

For the primary, it should be `true`.

### Step 6: Insert Data

On the primary:

```javascript
use shop

db.users.insertOne({
  name: "Sharvil",
  age: 22
});
```

The data will be replicated to the secondary members.

### Step 7: Read Data from a Secondary

Connect directly to a secondary:

```bash
mongosh "mongodb://localhost:27018/?directConnection=true"
```

Secondary reads are not enabled by default for a normal shell session. Run:

```javascript
rs.secondaryOk();

use shop

db.users.find();
```

This enables secondary reads in the current shell session. Secondary data can lag behind the primary.

For application code, use the driver's read preference settings instead of relying on shell-specific behavior.

### Step 8: Verify Replication

On the secondary, run:

```javascript
db.users.find();
```

You should see the replicated document after the secondary catches up.

### Step 9: Stop an Instance to Test Failover

Stop the process running on port `27017` using its terminal's normal interrupt mechanism.

Check the status from a surviving member or reconnect through the replica set connection string.

With three voting members, the remaining two members can retain a majority and elect a new primary, provided they are healthy and eligible.

Restart the stopped instance afterward. It should rejoin the replica set and catch up when connectivity and configuration permit.

---

## 10. Important Replica Set Commands

### Initialize a Replica Set

```javascript
rs.initiate();
```

Use this when initializing a replica set for the first time. You can also provide an explicit configuration document.

### Check Replica Set Status

```javascript
rs.status();
```

Displays the current state of replica set members.

### View Replica Set Configuration

```javascript
rs.conf();
```

Displays the configured members and replica set settings.

### Check the Current Node

```javascript
db.hello();
```

Provides topology information, including whether the node is writable primary.

### Check Replication Information

```javascript
rs.printReplicationInfo();
```

Displays information about the primary's oplog.

```javascript
rs.printSecondaryReplicationInfo();
```

Displays replication information for secondary members.

### Step Down the Primary

```javascript
rs.stepDown(60);
```

Requests that the current primary step down for approximately 60 seconds.

Use this only in a controlled test environment. It can trigger an election and temporarily interrupt writes.

### Add a Member

```javascript
rs.add("localhost:27020");
```

Adds a member to the replica set. The target MongoDB instance must be running with a compatible replica set configuration and must be reachable by the other members.

### Remove a Member

```javascript
rs.remove("localhost:27020");
```

Removes a configured member from the replica set. Use caution because changing membership can affect voting and availability.

---

## 11. Replication in Node.js

When using MongoDB with Node.js, the connection string should identify the replica set members and the replica set name.

Install the official MongoDB Node.js driver:

```bash
npm install mongodb
```

### Example Connection String

```javascript
const uri =
  "mongodb://localhost:27017,localhost:27018,localhost:27019/shop?replicaSet=rs0";
```

This connection string identifies all three members and specifies the replica set name.

The MongoDB driver uses server discovery and monitoring to identify the primary and respond to topology changes.

### Complete Example

```javascript
import { MongoClient } from "mongodb";

const uri =
  "mongodb://localhost:27017,localhost:27018,localhost:27019/shop?replicaSet=rs0";

const client = new MongoClient(uri);

try {
  await client.connect();

  const db = client.db("shop");
  const users = db.collection("users");

  const result = await users.insertOne({
    name: "Sharvil",
    age: 22
  });

  console.log("Inserted ID:", result.insertedId);

  const allUsers = await users.find().toArray();

  console.log("Users:", allUsers);
} catch (error) {
  console.error("MongoDB operation failed:", error);
} finally {
  await client.close();
}
```

### Important Points

- Use a replica set connection string in applications that need replica set discovery and failover.
- Specify the correct replica set name.
- Ensure all advertised member addresses are reachable from the application.
- In a long-running production application, create and reuse a `MongoClient` instead of connecting and closing it for every request.
- Configure timeouts, error handling, and retry behavior according to your application's requirements.

---

## 12. Read Preference

Read preference determines which replica set members can serve read operations.

By default, MongoDB reads from the primary.

Read preference can be changed when an application needs to distribute read traffic or access secondary data.

### Common Read Preferences

| Read Preference | Description |
|---|---|
| `primary` | Reads only from the primary. |
| `primaryPreferred` | Prefers the primary, but may read from a secondary if the primary is unavailable. |
| `secondary` | Reads only from eligible secondary members. |
| `secondaryPreferred` | Prefers secondary members, falling back to the primary if necessary. |
| `nearest` | Reads from eligible members with suitable network latency, subject to selection rules. |

### Example

Using the MongoDB Node.js driver:

```javascript
import { MongoClient, ReadPreference } from "mongodb";

const client = new MongoClient(
  "mongodb://localhost:27017,localhost:27018,localhost:27019/shop?replicaSet=rs0"
);

try {
  await client.connect();

  const db = client.db("shop");

  const users = await db
    .collection("users")
    .find({})
    .withReadPreference(ReadPreference.SECONDARY)
    .toArray();

  console.log(users);
} finally {
  await client.close();
}
```

### Important Consideration

Secondary reads can return stale data because replication is asynchronous.

For example, a user may update their profile on the primary and immediately read an older version from a secondary.

Choose read preference based on your application's consistency and latency requirements.

---

## 13. Write Concern

Write concern specifies the level of acknowledgment requested for a write operation.

It helps an application control how much confirmation it receives before considering a write successful.

### `w: 1`

Requests acknowledgment from the primary.

```javascript
await db.collection("users").insertOne(
  {
    name: "Rahul"
  },
  {
    writeConcern: { w: 1 }
  }
);
```

This does not require acknowledgment from secondary members. A primary failure before replication can cause an acknowledged write to be rolled back in some circumstances.

### `w: "majority"`

Requests acknowledgment after the write satisfies the replica set's majority write concern rules.

```javascript
await db.collection("users").insertOne(
  {
    name: "Rahul"
  },
  {
    writeConcern: { w: "majority" }
  }
);
```

A majority write concern improves durability guarantees against certain failures, but it does not mean every member has applied the operation.

### Write Concern Timeout

An application can specify a timeout for waiting for write concern acknowledgment.

```javascript
await db.collection("users").insertOne(
  {
    name: "Rahul"
  },
  {
    writeConcern: {
      w: "majority",
      wtimeout: 5000
    }
  }
);
```

The timeout is measured in milliseconds.

A write concern timeout does not necessarily mean the write was never applied. The operation may have succeeded on some or all members even though the requested acknowledgment was not received in time.

**Remember:** Write concern and read preference solve different problems. Write concern controls write acknowledgment; read preference controls where reads are directed.

---

## 14. Replication vs Backup

Replication and backup are different concepts.

| Feature | Replication | Backup |
|---|---|---|
| Main purpose | Availability and redundancy | Recovery from data loss |
| Copies data | Yes | Yes |
| Can help after a server failure | Yes | Yes, through recovery |
| Protects against accidental deletion | Not necessarily | Yes, if a suitable backup exists |
| Protects against application bugs | Not necessarily | Can help restore an earlier state |
| Provides historical recovery | Not by itself | Depends on backup and point-in-time recovery strategy |
| Automatically creates an independent historical copy | No | Depends on backup design |

### Example

Suppose an application accidentally deletes every document in a collection.

Because replication propagates data changes, the deletion may also be replicated to the secondary members.

A backup taken before the deletion can help restore the lost data.

Therefore, **replication is not a replacement for backups**.

A reliable production deployment should have both an appropriate replica set design and a tested backup and recovery strategy.

---

## 15. Advantages of Replication

### 1. High Availability

The replica set can elect a new primary when the current primary fails, provided the remaining members can form a voting majority.

### 2. Data Redundancy

Multiple data-bearing members maintain copies of the data.

### 3. Fault Tolerance

The application can continue operating through certain member failures.

### 4. Read Scaling

Applications can direct suitable read operations to secondary members when appropriate.

This can reduce some primary read workload, but it introduces potential replication lag and does not guarantee better performance for every workload.

### 5. Automatic Failover

The replica set manages primary elections without requiring an administrator to manually promote a secondary in normal failure scenarios.

### 6. Maintenance Flexibility

Some maintenance operations can be performed on individual members with appropriate planning, although availability and performance depend on the deployment and procedure.

---

## 16. Limitations of Replication

### 1. Additional Resource Usage

Every data-bearing member requires storage, memory, CPU, and network resources.

### 2. Replication Lag

Secondary members may temporarily have older data than the primary.

### 3. Network Dependency

Members need reliable communication with one another to replicate operations and maintain replica set availability.

### 4. Election Interruption

Writes may be temporarily unavailable during primary elections.

### 5. Operational Complexity

Replica sets require appropriate configuration, monitoring, access control, maintenance, and recovery procedures.

### 6. Not a Backup

Accidental or malicious changes can be replicated across the replica set.

---

## 17. Common Problems

### Problem 1: No Primary Available

**Possible causes:**

- Too few voting members are reachable.
- Replica set configuration is incorrect.
- Members cannot communicate.
- Elections are still in progress.

**Useful commands:**

```javascript
rs.status();
```

```javascript
rs.conf();
```

Check network connectivity and ensure the configured member addresses are reachable.

### Problem 2: Secondary Is Not Catching Up

**Possible causes:**

- Network problems.
- Heavy write load.
- Insufficient resources.
- Missing required oplog history.

Inspect replica set status and replication lag. A secondary that cannot obtain the operations it needs may require an initial sync.

### Problem 3: `not running with --replSet`

This commonly occurs when you run replica set commands against a MongoDB instance that was not started with a replica set configuration.

Start the instance with the appropriate `--replSet` option or configure the equivalent setting in the MongoDB configuration file.

### Problem 4: Member Address Is Unreachable

Replica set members advertise addresses that other members and clients need to reach.

For example, `localhost:27018` is appropriate for the local multi-instance example, but it is not appropriate for members running on different computers because each computer's `localhost` refers to itself.

Use hostnames or IP addresses that are reachable from every relevant machine.

### Problem 5: Writes Fail During Failover

A primary election can temporarily interrupt writes.

Use a replica set-aware MongoDB driver, configure appropriate timeouts, and implement safe retry handling.

Do not blindly retry operations that are not safe to repeat.

---

## 18. Interview Questions and Answers

### Q1. What is replication in MongoDB?

Replication is the process of maintaining multiple copies of the same data across multiple MongoDB servers using a replica set.

It improves availability, redundancy, and fault tolerance.

### Q2. What is a replica set?

A replica set is a group of MongoDB instances that maintain the same data set and coordinate to provide redundancy and high availability.

### Q3. What is the difference between a primary and a secondary?

The primary normally receives writes from clients. Secondaries replicate operations from the primary and can become primary through an election if eligible.

### Q4. What is an oplog?

The oplog is a special capped collection in the `local` database that records data-changing operations on the primary. Secondaries use it to replicate changes.

### Q5. What happens if the primary fails?

The remaining eligible members attempt to elect a new primary. If a voting majority is available, the replica set can continue accepting writes after the election and client reconnection.

### Q6. Can a replica set have multiple primaries?

A normally functioning MongoDB replica set has one primary at a time. Election and majority rules prevent independent members from both remaining valid primaries during a network partition.

### Q7. Can we read data from a secondary?

Yes. Reads can be directed to secondaries by configuring a suitable read preference. However, secondary data may be stale because replication is asynchronous.

### Q8. What is an arbiter?

An arbiter participates in replica set elections but does not store the data set. It contributes a vote but does not provide another data copy.

### Q9. What is replication lag?

Replication lag is the delay between an operation being applied on the primary and the corresponding operation being applied on a secondary.

### Q10. What is the difference between replication and sharding?

Replication maintains redundant copies of a data set across replica set members.

Sharding distributes data across multiple shards to support horizontal scaling. A sharded MongoDB deployment commonly uses replica sets for redundancy within its components.

### Q11. Does replication guarantee that every secondary has the latest data immediately?

No. Replication is asynchronous by default, and secondary members can temporarily lag behind the primary.

### Q12. What is the difference between `w: 1` and `w: "majority"`?

`w: 1` requests acknowledgment from the primary. `w: "majority"` requests acknowledgment that satisfies the majority write concern rules, providing stronger protection against certain failures.

### Q13. Is replication a replacement for backup?

No. Replication maintains current copies of data. A backup provides a recovery point that can help restore data after accidental deletion, corruption, or other failures.

### Q14. What is automatic failover?

Automatic failover is the process through which eligible replica set members elect a new primary after the current primary becomes unavailable or steps down.

### Q15. Why is a three-member replica set common?

Three voting members can tolerate the loss of one voting member while retaining a majority, assuming the other two remain available and eligible. Three data-bearing members also provide multiple data copies.

### Q16. Can a secondary become a primary?

Yes. An eligible secondary can become primary after winning a replica set election.

### Q17. What happens if the majority of voting members becomes unavailable?

The replica set cannot elect or maintain a primary without a voting majority. It generally stops accepting ordinary primary writes until a majority is restored.

### Q18. Can replication protect against accidental deletion?

Not by itself. Deletions can be replicated to secondary members. Backups and recovery procedures are needed to recover previous data.

### Q19. How does Node.js connect to a replica set?

The MongoDB Node.js driver uses a connection string that identifies replica set members and the replica set name. The driver discovers the topology and routes operations to appropriate members.

### Q20. What is the difference between read preference and write concern?

Read preference determines which members may serve reads. Write concern determines the acknowledgment required for writes.

---

## 19. Summary

Replication is an essential MongoDB feature that maintains multiple copies of data across a group of database instances.

Key concepts to remember:

- A replica set is the foundation of MongoDB replication.
- The primary normally handles writes.
- Secondary members replicate operations from the primary.
- The oplog records operations that secondaries apply.
- Elections provide automatic primary failover.
- A voting majority is required to elect and maintain a primary.
- Read preference determines where reads are directed.
- Write concern determines the requested write acknowledgment.
- Secondary reads may return stale data.
- Replication does not replace backups.
- A replica set-aware Node.js driver helps applications handle topology changes and failover.

**In one sentence:** MongoDB replication keeps redundant copies of data on multiple servers so a database can remain available through certain failures and recover from individual member outages more effectively.