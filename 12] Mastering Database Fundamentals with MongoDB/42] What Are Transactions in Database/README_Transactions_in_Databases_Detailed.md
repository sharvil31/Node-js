# Transactions in Databases

## Table of Contents

-   [What Is a Transaction?](#what-is-a-transaction)
-   [Why Are Transactions Important?](#why-are-transactions-important)
-   [Example: Transferring Money](#example-transferring-money)
-   [ACID Properties](#acid-properties)
-   [How Transactions Work](#how-transactions-work)
-   [Commit and Abort](#commit-and-abort)
-   [Are Read Operations Part of a
    Transaction?](#are-read-operations-part-of-a-transaction)
-   [Transactions in MongoDB](#transactions-in-mongodb)
-   [MongoDB Transaction Example with
    Node.js](#mongodb-transaction-example-with-nodejs)
-   [Why MongoDB Transactions Require a Replica Set or Sharded
    Cluster](#why-mongodb-transactions-require-a-replica-set-or-sharded-cluster)
-   [Common Errors and
    Troubleshooting](#common-errors-and-troubleshooting)
-   [Best Practices](#best-practices)
-   [Key Differences: Single-Document Writes and Multi-Document
    Transactions](#key-differences-single-document-writes-and-multi-document-transactions)
-   [Conclusion](#conclusion)

------------------------------------------------------------------------

## What Is a Transaction?

A **transaction** in a database is a group of one or more database
operations treated as a single logical unit of work.

Transactions help maintain data integrity and consistency by ensuring
that related changes are committed together or that their uncommitted
changes are discarded if the transaction fails.

Database operations such as `INSERT`, `UPDATE`, `DELETE`, and `SELECT`
(or MongoDB's `find()`) can all be part of a transaction. Read
operations can be important because their results may determine whether
subsequent write operations should be performed.

For example, an application might need to create a user and the user's
root directory. If the application creates the directory but fails to
create the user record, the database may be left with incomplete related
data. A transaction can make those writes succeed or fail together.

## Why Are Transactions Important?

Transactions are useful when several related operations must be treated
as one logical action.

They can help:

-   Keep related data changes consistent.
-   Prevent partial updates when an operation fails.
-   Coordinate writes across multiple documents or collections.
-   Protect workflows that depend on reading data before deciding what
    to write.
-   Preserve application rules when concurrent operations occur.

An explicit transaction is not always necessary. For example, MongoDB
already provides atomicity for writes to a single document. A
multi-document transaction is useful when the application needs multiple
document changes to commit or abort together.

## Example: Transferring Money

Consider transferring ₹1,000 from Account A to Account B.

A transfer could involve the following operations:

1.  Read Account A's balance.
2.  Check whether Account A has at least ₹1,000.
3.  Deduct ₹1,000 from Account A.
4.  Add ₹1,000 to Account B.
5.  Commit the transaction if the required operations succeed.

Both balance updates should succeed together. If the transfer fails, the
transaction should not leave money deducted from Account A without
crediting Account B.

Conceptually:

``` text
BEGIN TRANSACTION

Read Account A balance
Check available funds
Deduct ₹1,000 from Account A
Add ₹1,000 to Account B

COMMIT
```

If an operation fails before the transaction is committed:

``` text
ABORT / ROLLBACK
```

The transaction's uncommitted changes are discarded.

> A real banking application also needs appropriate concurrency
> controls, validation, authorization, and reliable handling of
> transaction errors. A transaction alone does not implement the entire
> payment workflow.

## ACID Properties

ACID stands for **Atomicity, Consistency, Isolation, and Durability**.
These properties help ensure reliable transaction processing.

### 1. Atomicity

All operations within a transaction are treated as a single unit. Either
all the transaction's changes are committed, or none of its uncommitted
changes are applied.

**Example:** If money is deducted from one account but the credit to
another account fails, the transaction can be aborted so the deduction
is not committed.

**Remember:** Atomicity means "all or nothing" for the transaction's
changes.

### 2. Consistency

A transaction takes the database from one valid state to another,
preserving the applicable database rules and constraints.

**Example:** A banking application may enforce a rule that an account
balance cannot become negative.

Database constraints, schema validation, and application logic can all
contribute to consistency. A transaction does not automatically make
invalid data valid; operations must still satisfy the relevant rules.

### 3. Isolation

Isolation controls how concurrent transactions interact with one
another, according to the database's isolation guarantees.

**Example:** Two simultaneous withdrawals should not incorrectly use the
same available balance and cause an invalid result.

Isolation is important because multiple users or requests may access the
same data at the same time. The database's specific isolation behavior
determines how concurrent reads and writes interact.

### 4. Durability

Once a transaction is successfully committed, its changes persist
according to the database's durability guarantees, including the
configured handling of failures.

**Example:** After a payment transaction is confirmed, its committed
database changes should survive a server restart under the database's
configured durability guarantees.

In MongoDB, durability and acknowledgement behavior depend in part on
write concern and deployment configuration.

## How Transactions Work

A typical transaction follows these steps:

1.  **Start the transaction:** Begin a transaction explicitly when the
    database supports and requires it.
2.  **Execute operations:** Perform the necessary read and write
    operations.
3.  **Check the results:** Verify that the required conditions are
    satisfied.
4.  **Commit the transaction:** If everything succeeds, commit the
    changes.
5.  **Abort or roll back:** If an operation fails or a required
    condition is not satisfied, abort the transaction and discard its
    uncommitted changes.

### Commit

A **commit** finalizes the transaction's changes. After a successful
commit, the transaction is complete.

### Rollback / Abort

An **abort** or **rollback** discards the transaction's uncommitted
changes. The exact API name depends on the database.

In MongoDB's Node.js driver, the relevant methods include:

``` javascript
await session.commitTransaction();
await session.abortTransaction();
```

## Are Read Operations Part of a Transaction?

Yes. Read operations such as SQL's `SELECT` and MongoDB's `find()` can
be part of a transaction.

Reads are useful when decisions depend on the current database state.

For example:

-   Read the available account balance.
-   Check whether sufficient funds exist.
-   Deduct money from the source account.
-   Credit the destination account.
-   Commit the transaction if the required operations succeed.

Reads do not usually modify data themselves, but they can be essential
to the correctness of a transaction. In MongoDB, operations intended to
participate in a transaction must use the transaction's session.

## Transactions in MongoDB

MongoDB supports atomic writes to individual documents by default. When
multiple document changes must succeed or fail together, multi-document
transactions can be used.

Multi-document transactions require a **replica set** or **sharded
cluster**; a standalone MongoDB server does not support them.

Examples of workflows that may benefit from multi-document transactions
include:

-   Creating a user and a related record.
-   Creating an order while updating inventory.
-   Updating related account documents in a transfer.
-   Changing several documents that must remain consistent with one
    another.

Transactions can have additional performance and resource costs compared
with single-document writes. Use them when the application requires
their guarantees rather than automatically wrapping every operation in a
transaction.

## MongoDB Transaction Example with Node.js

The following example demonstrates a transaction that inserts related
documents into the `directories` and `users` collections.

``` javascript
import { MongoClient } from "mongodb";

const client = new MongoClient(
  "mongodb://127.0.0.1:27017/?replicaSet=myReplicaSet"
);

async function main() {
  let session;

  try {
    await client.connect();
    console.log("Database Connected");

    const db = client.db("storageApp");
    const directories = db.collection("directories");
    const users = db.collection("users");

    session = client.startSession();

    session.startTransaction();

    await directories.insertOne(
      {
        name: "db",
        userName: "SA",
      },
      { session }
    );

    await users.insertOne(
      {
        name: "SA",
        rootDirName: "db",
      },
      { session }
    );

    await session.commitTransaction();
    console.log("Transaction committed successfully");
  } catch (error) {
    console.error("Transaction failed:", error);

    if (session?.inTransaction()) {
      await session.abortTransaction();
      console.log("Transaction aborted");
    }
  } finally {
    if (session) {
      await session.endSession();
    }

    await client.close();
    console.log("Database Disconnected");
  }
}

main().catch(console.error);
```

### Understanding the Example

#### 1. Connect to MongoDB

``` javascript
await client.connect();
```

Connects the MongoDB Node.js driver to the database server.

#### 2. Select the database and collections

``` javascript
const db = client.db("storageApp");
const directories = db.collection("directories");
const users = db.collection("users");
```

These statements get references to the database and the two collections.
The database name should match the database used by your application.

#### 3. Start a session

``` javascript
session = client.startSession();
```

A session provides the context used to run operations in a transaction.

#### 4. Start the transaction

``` javascript
session.startTransaction();
```

Begins a transaction associated with the session.

#### 5. Pass the session to every participating operation

``` javascript
await directories.insertOne(
  { name: "db", userName: "SA" },
  { session }
);
```

The `{ session }` option makes this insert part of the transaction.
Every operation that should participate must use the same session.

#### 6. Commit

``` javascript
await session.commitTransaction();
```

If the required operations succeed, commit the transaction.

#### 7. Abort on failure

``` javascript
if (session?.inTransaction()) {
  await session.abortTransaction();
}
```

If an error occurs while the transaction is active, aborting discards
its uncommitted changes.

#### 8. End the session and close the connection

``` javascript
await session.endSession();
await client.close();
```

The session should be ended when it is no longer needed. The example
closes the client because it is a standalone script; a long-running
application commonly reuses its MongoDB client rather than closing it
after every request.

> **Schema validation note:** Both inserted documents must satisfy the
> validation rules configured for their collections. If an insert fails
> validation, the transaction should be aborted. Check the collection's
> schema and the error's `errInfo` details to identify the specific
> failing field or rule.

### Using `withTransaction()`

The MongoDB Node.js driver also provides a convenient transaction API:

``` javascript
const session = client.startSession();

try {
  await session.withTransaction(async () => {
    await directories.insertOne(
      { name: "db", userName: "SA" },
      { session }
    );

    await users.insertOne(
      { name: "SA", rootDirName: "db" },
      { session }
    );
  });
} finally {
  await session.endSession();
}
```

`withTransaction()` manages commit and abort behavior and can retry
certain transaction errors according to the driver's rules. Because the
callback may execute more than once, avoid placing non-idempotent
external side effects---such as sending an email or charging a payment
provider---inside it without appropriate safeguards.

## Why MongoDB Transactions Require a Replica Set or Sharded Cluster

A standalone MongoDB server does not support multi-document
transactions. MongoDB requires the deployment infrastructure provided by
a replica set or sharded cluster.

For local development, a MongoDB server can be configured as a
single-node replica set.

### Step 1: Configure the replica-set name

In the MongoDB configuration file (`mongod.conf` or `mongod.cfg`,
depending on the installation), configure:

``` yaml
replication:
  replSetName: myReplicaSet
```

The MongoDB service must be started with this configuration. Editing the
file alone does not initialize the replica set.

### Step 2: Initialize the replica set

Connect to the server using `mongosh`. If the replica set has not yet
been initialized, run:

``` javascript
rs.initiate();
```

Do not run this repeatedly on an already initialized replica set.

### Step 3: Check the status

``` javascript
rs.status();
```

Look for the member's state. A successfully elected primary is typically
reported as `PRIMARY`.

You can also inspect the replica-set configuration:

``` javascript
rs.conf();
```

### Step 4: Connect using the replica-set name

For example:

``` javascript
const client = new MongoClient(
  "mongodb://127.0.0.1:27017/?replicaSet=myReplicaSet"
);
```

The hostname advertised in the replica-set configuration must be
resolvable and reachable by the client. This is particularly important
when connecting from another device.

### Single-Node Replica Set Limitation

A single-node replica set is useful for local development and learning
transactions, but it does **not** provide high availability. If that one
server fails, there is no other member to become primary.

## Common Errors and Troubleshooting

### Error 1: Transactions are only allowed on a replica set member or mongos

Example:

``` text
MongoServerError: Transaction numbers are only allowed on a replica set member or mongos
```

**Cause:** The connection is reaching a standalone MongoDB server, or
the deployment is not configured for a supported transaction deployment.

**What to check:**

1.  Confirm that the server is configured with
    `replication.replSetName`.
2.  Confirm that the configuration is the one used by the running
    MongoDB service.
3.  Initialize the replica set if it has not been initialized.
4.  Check `rs.status()` in `mongosh`.
5.  Confirm that the application connects to the intended replica-set
    deployment.

### Error 2: `NotYetInitialized`

Example:

``` text
MongoServerError[NotYetInitialized]: no replset config has been received
```

**Cause:** The server has replica-set mode configured, but it has not
yet received an initialized replica-set configuration.

**What to do:** If this is a new replica set, run `rs.initiate()` once,
then verify with `rs.status()`.

### Error 3: `NotPrimaryOrSecondary`

Example:

``` text
MongoServerError[NotPrimaryOrSecondary]: node is not in primary or recovering state
```

**Cause:** The server is not currently in a state that can serve the
requested operation. This can happen before replica-set initialization
or while the member is transitioning between states.

**What to do:** Check `rs.status()`, finish initialization if needed,
and wait for the member to reach an appropriate state.

### Error 4: `Document failed validation`

Example:

``` text
MongoServerError: Document failed validation
```

**Cause:** An inserted or updated document violates the collection's
schema validation rules.

**What to do:**

1.  Inspect the collection's validator.
2.  Check the error's `errInfo` field for `details`.
3.  Verify required fields, field types, allowed values, and nested
    document structure.
4.  Correct the document or update the schema only if the intended data
    model requires it.
5.  Abort the transaction if the operation fails.

This is a validation problem, not necessarily a transaction or
replication problem.

### Error 5: Connection refused or server selection timeout

**Possible causes:**

-   MongoDB is not running.
-   The host or port is incorrect.
-   A firewall blocks the connection.
-   The replica set advertises a hostname that the client cannot resolve
    or reach.

**What to check:** Verify the MongoDB service, confirm port `27017`, and
ensure the advertised replica-set hostname is accessible from the
client.

## Best Practices

1.  **Use transactions only when needed.** A single-document write is
    already atomic in MongoDB.
2.  **Keep transactions short.** Long transactions can consume resources
    and increase contention.
3.  **Use the same session.** Pass `{ session }` to every operation that
    belongs to the transaction.
4.  **Handle errors.** Abort active transactions when needed and clean
    up sessions.
5.  **Respect schema validation.** A transaction does not bypass
    validation rules.
6.  **Be careful with retries.** Transaction callbacks may be retried;
    external side effects need appropriate idempotency safeguards.
7.  **Configure durability intentionally.** Choose appropriate write
    concern for the application's reliability requirements.
8.  **Protect the database.** Do not expose an unauthenticated MongoDB
    server to untrusted networks. Enable authentication and restrict
    network access when remote connections are required.
9.  **Use multiple replica-set members for availability.** A single-node
    replica set is for development and learning, not fault tolerance.

## Key Differences: Single-Document Writes and Multi-Document Transactions

  ------------------------------------------------------------------------
  Feature                 Single-document write   Multi-document
                                                  transaction
  ----------------------- ----------------------- ------------------------
  Atomicity               Atomic for the          Groups multiple
                          individual document     participating operations
                                                  into one transaction

  Deployment requirement  Works on a standalone   Requires a replica set
                          server or supported     or sharded cluster
                          cluster                 

  Typical use             Update one user's       Update related documents
                          profile                 that must commit
                                                  together

  Complexity              Usually simpler         Requires session and
                                                  transaction handling

  Overhead                Generally lower         Adds
                                                  transaction-management
                                                  overhead
  ------------------------------------------------------------------------

## Conclusion

A transaction groups related database operations into a single logical
unit of work. Transactions help maintain data integrity through the ACID
properties.

Remember:

-   **Atomicity:** All or none of the transaction's changes are
    committed.
-   **Consistency:** Database rules remain satisfied.
-   **Isolation:** Concurrent transactions are controlled according to
    isolation guarantees.
-   **Durability:** Committed changes persist according to durability
    guarantees.
-   **Commit:** Finalize the transaction.
-   **Abort / Rollback:** Discard uncommitted changes.
-   **MongoDB requirement:** Multi-document transactions require a
    replica set or sharded cluster.
-   **Replication:** Replication and transactions are related but
    different; replication maintains copies of data across members,
    while transactions coordinate related operations.

Transactions can include both read and write operations. Whether an
explicit transaction is needed depends on the database and the
operations being performed.
