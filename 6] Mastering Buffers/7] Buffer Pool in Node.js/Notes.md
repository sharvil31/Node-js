# Buffer Pool in Node.js

## Introduction

When working with Node.js, you'll often use the `Buffer` class to handle binary data such as files, network packets, images, audio, or videos.

Creating a new memory allocation every time a small `Buffer` is needed would be expensive. To improve performance, Node.js uses a **Buffer Pool**.

A **Buffer Pool** is a pre-allocated block of memory that Node.js uses to create small Buffers efficiently. Instead of requesting new memory from the operating system for every small allocation, Node.js slices memory from this shared pool.

This optimization significantly improves the performance of I/O-intensive applications.

---

# Why Does Node.js Use a Buffer Pool?

Imagine an HTTP server receiving thousands of requests every second.

Each request may create several small Buffers.

Without a Buffer Pool:

```
Request
   ↓
Allocate Memory
   ↓
Create Buffer
   ↓
Return Buffer

(repeated thousands of times)
```

Every allocation requires the operating system to reserve new memory, which is relatively expensive.

With a Buffer Pool:

```
Node.js starts

        ↓

Allocates one large memory block (Pool)

        ↓

+------------------------------------------------------+
|                                                      |
|                Shared Buffer Pool                    |
|                                                      |
+------------------------------------------------------+

        ↓

Small Buffers are created by slicing this pool.
```

Only one large allocation is performed, and subsequent small Buffers reuse the same memory.

---

# Default Buffer Pool Size

Node.js maintains a default pool size of **8192 bytes (8 KB).**

```javascript
import { Buffer } from "buffer";

console.log(Buffer.poolSize);
```

Output:

```
8192
```

---

# Which APIs Use the Buffer Pool?

The Buffer Pool is primarily used by:

```javascript
Buffer.allocUnsafe(size);
```

and

```javascript
Buffer.from(...)
```

Examples:

```javascript
Buffer.allocUnsafe(128);

Buffer.from("Hello");

Buffer.from([65, 66, 67]);
```

These methods usually create Buffers by taking a slice from the shared pool instead of allocating brand-new memory.

---

# Which APIs Do NOT Use the Buffer Pool?

## Buffer.alloc()

```javascript
Buffer.alloc(100);
```

This method always creates a new Buffer and fills it with zeros for safety.

Because the memory must be initialized, it doesn't use the shared pool.

---

## Buffer.allocUnsafeSlow()

```javascript
Buffer.allocUnsafeSlow(100);
```

This method intentionally bypasses the Buffer Pool and allocates an entirely new block of memory.

Use it when you need a standalone Buffer that should not share memory with other small Buffers.

---

# When Does Node.js Use the Pool?

The Buffer Pool is used only for relatively small allocations.

The threshold is approximately half of the pool size.

Internally, Node.js checks a threshold around:

```
Buffer.poolSize >>> 1
```

For the default pool:

```
8192 bytes

↓

Threshold ≈ 4096 bytes
```

Examples:

```
Buffer.allocUnsafe(100)    ✅ Uses pool

Buffer.allocUnsafe(500)    ✅ Uses pool

Buffer.allocUnsafe(2000)   ✅ Uses pool

Buffer.allocUnsafe(4000)   ✅ Uses pool

Buffer.allocUnsafe(5000)   ❌ New allocation
```

Large Buffers receive their own dedicated memory allocation.

---

# Understanding Buffer.poolSize

You can change the pool size before creating Buffers.

```javascript
Buffer.poolSize = 10000;
```

Now Node.js creates a pool of approximately 10000 bytes.

Example:

```javascript
import { Buffer } from "buffer";

Buffer.poolSize = 10000;

const a = Buffer.allocUnsafe(4);

console.log(a.buffer.byteLength);
```

Output:

```
10000
```

Many beginners expect the output to be:

```
4
```

However, the Buffer itself is only 4 bytes long.

The underlying **ArrayBuffer** belongs to the entire shared pool.

Visual representation:

```
Shared Pool (10000 Bytes)

+------------------------------------------------------+
| a (4B) | Remaining Free Space                        |
+------------------------------------------------------+

ArrayBuffer Length

↓

10000 Bytes
```

The Buffer is simply a view into that shared memory.

---

# allocUnsafeSlow()

Example:

```javascript
const b = Buffer.allocUnsafeSlow(4);

console.log(b.buffer.byteLength);
```

Output:

```
4
```

Visual representation:

```
+------+
| 4 B  |
+------+
```

Unlike `allocUnsafe()`, this Buffer owns its own ArrayBuffer.

---

# How Buffers Consume the Pool

Assume the pool is only 100 bytes.

Initially:

```
+------------------------------------------------------+
|                                                      |
+------------------------------------------------------+
 ^
Offset = 0
```

Create:

```javascript
Buffer.allocUnsafe(10);
```

```
+----------+-------------------------------------------+
| Buffer A |                                           |
+----------+-------------------------------------------+
           ^
        Offset = 10
```

Create:

```javascript
Buffer.allocUnsafe(20);
```

```
+----------+----------------------+---------------------+
| Buffer A | Buffer B             |                     |
+----------+----------------------+---------------------+
                                 ^
                              Offset = 30
```

Create:

```javascript
Buffer.allocUnsafe(15);
```

```
+----------+----------------------+---------------+-----+
| Buffer A | Buffer B             | Buffer C      |     |
+----------+----------------------+---------------+-----+
                                                ^
                                             Offset = 45
```

Each Buffer occupies a different portion of the same pool.

---

# Verifying Shared Memory

Example:

```javascript
const a = Buffer.allocUnsafe(100);
const b = Buffer.allocUnsafe(200);

console.log(a.buffer === b.buffer);
```

Output:

```
true
```

Both Buffers reference the same underlying ArrayBuffer.

Now compare with:

```javascript
const a = Buffer.allocUnsafe(100);
const b = Buffer.allocUnsafeSlow(100);

console.log(a.buffer === b.buffer);
```

Output:

```
false
```

Because `allocUnsafeSlow()` allocates separate memory.

---

# Buffer Pool vs allocUnsafeSlow()

| Feature                  | Buffer.allocUnsafe()       | Buffer.allocUnsafeSlow() |
| ------------------------ | -------------------------- | ------------------------ |
| Uses Pool                | ✅ Yes (small allocations) | ❌ No                    |
| New Memory Allocation    | Only for large Buffers     | Always                   |
| Shares ArrayBuffer       | Yes                        | No                       |
| Faster for Small Buffers | ✅ Yes                     | ❌ No                    |
| Best For                 | Frequent small allocations | Standalone Buffers       |

---

# Summary

- A Buffer Pool is a shared block of memory used by Node.js to optimize small Buffer allocations.
- The default Buffer Pool size is **8192 bytes (8 KB)**.
- `Buffer.allocUnsafe()` usually allocates memory from the shared pool.
- `Buffer.from()` also uses the pool for small inputs.
- `Buffer.alloc()` never uses the pool because it initializes memory with zeros.
- `Buffer.allocUnsafeSlow()` always creates its own dedicated memory.
- Multiple Buffers created from the pool share the same underlying `ArrayBuffer` but reference different sections of it.
- Buffer Pools reduce memory allocation overhead and improve the performance of I/O-heavy Node.js applications.
