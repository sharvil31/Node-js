# Transactions in Databases

## What Is a Transaction?

A **transaction** in a database is a group of one or more database operations treated as a single logical unit of work.

Transactions help maintain data integrity and consistency by ensuring that related changes are committed together or that their uncommitted changes are discarded if the transaction fails.

Database operations such as `INSERT`, `UPDATE`, `DELETE`, and `SELECT` (or MongoDB's `find`) can all be part of a transaction.

Read operations can be important because their results may determine whether subsequent write operations should be performed.

### Example

Consider transferring ₹1,000 from Account A to Account B.

The transaction involves:

1. Reading Account A's balance.
2. Checking whether Account A has sufficient funds.
3. Deducting ₹1,000 from Account A.
4. Adding ₹1,000 to Account B.

Both balance updates should succeed together. If the transfer fails, the transaction should not leave money deducted from Account A without crediting Account B.

## ACID Properties

ACID stands for **Atomicity, Consistency, Isolation, and Durability**. These properties help ensure reliable transaction processing.

### 1. Atomicity

All operations within a transaction are treated as a single unit. Either all the transaction's changes are committed, or none of its uncommitted changes are applied.

**Example:** If money is deducted from one account but the credit to another account fails, the transaction can be aborted so the deduction is not committed.

### 2. Consistency

A transaction takes the database from one valid state to another, preserving the applicable database rules and constraints.

**Example:** A banking application may enforce a rule that an account balance cannot become negative.

### 3. Isolation

Isolation controls how concurrent transactions interact with one another, according to the database's isolation guarantees.

**Example:** Two simultaneous withdrawals should not incorrectly use the same available balance and cause an invalid result.

### 4. Durability

Once a transaction is successfully committed, its changes persist according to the database's durability guarantees, including the configured handling of failures.

**Example:** After a payment transaction is confirmed, its committed database changes should survive a server restart under the database's configured durability guarantees.

---

## How Do Transactions Work?

A typical transaction follows these steps:

1. **Start the transaction:** Begin a transaction explicitly when the database supports and requires it.
2. **Execute operations:** Perform the necessary read and write operations.
3. **Check the results:** Verify that the required conditions are satisfied.
4. **Commit the transaction:** If everything succeeds, commit the changes.
5. **Abort or roll back:** If an operation fails or a required condition is not satisfied, abort the transaction and discard its uncommitted changes.

### Commit

A commit finalizes the transaction's changes.

### Rollback / Abort

A rollback or abort discards the transaction's uncommitted changes.

## Are Read Operations Part of a Transaction?

Yes. Read operations such as SQL's `SELECT` and MongoDB's `find()` can be part of a transaction.

Reads are useful when decisions depend on the current database state.

For example:

- Read the available account balance.
- Check whether sufficient funds exist.
- Deduct money from the source account.
- Credit the destination account.
- Commit the transaction if the required operations succeed.

Reads do not usually modify data themselves, but they can be essential to the correctness of a transaction.

## Transactions in MongoDB

MongoDB supports atomic writes to individual documents by default. When multiple document changes must succeed or fail together, multi-document transactions can be used.

Multi-document transactions require a replica set or sharded cluster; a standalone MongoDB server does not support them.

For example, an e-commerce application may use a transaction to coordinate inventory changes and order creation.

## Conclusion

A transaction groups related database operations into a single logical unit of work. Transactions help maintain data integrity through the ACID properties.

Remember:

- **Atomicity:** All or none of the transaction's changes are committed.
- **Consistency:** Database rules remain satisfied.
- **Isolation:** Concurrent transactions are controlled according to isolation guarantees.
- **Durability:** Committed changes persist according to durability guarantees.
- **Commit:** Finalize the transaction.
- **Abort / Rollback:** Discard uncommitted changes.

Transactions can include both read and write operations. However, whether an explicit transaction is needed depends on the database and the operations being performed.
