# Reading & Writing Data in JavaScript ArrayBuffers using DataView

> A complete guide to understanding how JavaScript reads and writes binary data in an `ArrayBuffer` using `DataView`.

---

# Table of Contents

1. Introduction
2. What is an ArrayBuffer?
3. Why Can't We Read or Write Directly?
4. What is DataView?
5. Creating a DataView
6. Reading and Writing Data
7. Supported Data Types
8. Signed vs Unsigned Values
9. Endianness (Big Endian & Little Endian)
10. Memory Visualizations
11. Common Mistakes
12. Best Practices
13. Summary

---

# Introduction

`ArrayBuffer` is JavaScript's way of working with **raw binary data**.

Unlike normal JavaScript variables, an `ArrayBuffer` does **not** store numbers, strings, arrays, or objects.

Instead, it stores **raw bytes** exactly as they exist in memory.

Think of it as reserving a block of RAM.

```text
Memory

+----+----+----+----+----+----+----+----+
| 00 | 00 | 00 | 00 | 00 | 00 | 00 | 00 |
+----+----+----+----+----+----+----+----+
```

Each box represents **1 byte (8 bits)**.

Initially every byte is `00`.

---

# What is an ArrayBuffer?

An `ArrayBuffer` is simply a fixed-size block of memory.

Example:

```javascript
const buffer = new ArrayBuffer(8);
```

This creates **8 bytes** of memory.

```text
Index

0   1   2   3   4   5   6   7

Value

00  00  00  00  00  00  00  00
```

The important thing to understand is that an `ArrayBuffer` only knows:

> "I have 8 bytes of memory."

It does **not** know whether those bytes represent:

- integers
- floating-point numbers
- characters
- images
- audio
- video
- network packets

It simply stores bytes.

---

# Why Can't We Read or Write Directly?

Many beginners expect something like this to work.

```javascript
const buffer = new ArrayBuffer(8);

buffer[0] = 100;
```

or

```javascript
console.log(buffer[0]);
```

Both are incorrect.

Why?

Because an `ArrayBuffer` has **no concept of elements**.

It doesn't know whether byte 0 should be interpreted as:

- Int8
- Uint8
- Int16
- Uint16
- Int32
- Float32
- Float64

JavaScript therefore requires something that tells it **how those bytes should be interpreted**.

That object is called **DataView**.

---

# What is DataView?

A `DataView` provides a way to **read** and **write** different kinds of values inside an `ArrayBuffer`.

Think of it like this:

```text
             ArrayBuffer
        (Raw Bytes in Memory)

+----+----+----+----+----+----+
| 00 | 00 | 00 | 00 | 00 | 00 |
+----+----+----+----+----+----+
              ▲
              │
          DataView
              │
 Reads and writes values
```

Without a `DataView`, JavaScript cannot interpret the bytes.

---

# Creating a DataView

First create an `ArrayBuffer`.

```javascript
const buffer = new ArrayBuffer(8);
```

Then create a `DataView`.

```javascript
const view = new DataView(buffer);
```

Now the buffer can be accessed.

---

# Reading and Writing Data

Suppose we write an integer.

```javascript
view.setInt8(0, 100);
```

Here:

- `0` → byte offset
- `100` → value

Memory becomes

```text
Index

0

64
```

because

```text
100(decimal)
=
64(hex)
```

Reading the value:

```javascript
console.log(view.getInt8(0));
```

Output

```text
100
```

---

# Byte Offset

Every `set...()` and `get...()` method starts with a **byte offset**.

Example

```javascript
view.setInt16(2, 500);
```

Meaning:

- Start writing at byte index **2**
- Store a 16-bit integer

Memory layout

```text
Byte

0   1   2   3   4   5   6   7
```

The number occupies bytes **2 and 3**.

---

# Supported Data Types

`DataView` can read and write many different data types.

Signed Integers

```javascript
setInt8();
setInt16();
setInt32();
```

Unsigned Integers

```javascript
setUint8();
setUint16();
setUint32();
```

Floating Point

```javascript
setFloat32();
setFloat64();
```

Reading

```javascript
getInt8();
getUint8();
getInt16();
getUint16();
getInt32();
getUint32();
getFloat32();
getFloat64();
```

---

# Signed vs Unsigned

Signed integers can store both positive and negative values.

```javascript
view.setInt8(0, -1);

console.log(view.getInt8(0));
```

Output

```text
-1
```

Reading the same byte as unsigned

```javascript
console.log(view.getUint8(0));
```

Output

```text
255
```

The stored byte is identical.

Only the interpretation changes.

---

# Endianness

When storing values larger than one byte, JavaScript must decide the order of bytes.

There are two possibilities.

## Big Endian

Most Significant Byte comes first.

## Little Endian

Least Significant Byte comes first.

---

Suppose we store

```javascript
view.setInt32(0, 0x7823e324);
```

Hexadecimal bytes

```text
78
23
E3
24
```

Memory

```text
Index

0   1   2   3

78  23  E3  24
```

This is **Big Endian**.

---

Writing in Little Endian

```javascript
view.setInt32(0, 0x7823e324, true);
```

Memory becomes

```text
Index

0   1   2   3

24  E3  23  78
```

Notice:

The value is the same.

Only the byte order changes.

---

# Reading Endianness

Suppose memory contains

```text
24 E3 23 78
```

Reading normally

```javascript
view.getInt32(0);
```

JavaScript assumes **Big Endian**.

Result

```text
0x24E32378
```

Reading with

```javascript
view.getInt32(0, true);
```

JavaScript interprets bytes as Little Endian.

Result

```text
0x7823E324
```

Always read using the same endianness used when writing.

---

# Memory Visualization

Writing

```javascript
view.setInt16(0, 500);
```

500 decimal

```text
01 F4
```

Big Endian

```text
Index

0   1

01  F4
```

Little Endian

```text
Index

0   1

F4  01
```

---

# Common Mistakes

## Reading with the wrong type

Wrong

```javascript
view.setInt32(0, 1000);

view.getInt8(0);
```

You wrote four bytes but only read one.

---

## Using different endianness

Wrong

```javascript
view.setInt32(0, value, true);

view.getInt32(0);
```

Correct

```javascript
view.setInt32(0, value, true);

view.getInt32(0, true);
```

---

## Writing outside the buffer

```javascript
const buffer = new ArrayBuffer(4);

view.setInt32(2, 100);
```

This throws a `RangeError` because four bytes cannot fit starting at byte index `2`.

---

# Best Practices

- Always create a `DataView` before accessing an `ArrayBuffer`.
- Use the correct data type (`Int8`, `Uint16`, `Float32`, etc.) when reading and writing.
- Read data using the same type that was used to write it.
- Use the same endianness for both writing and reading.
- Ensure there is enough space in the buffer before writing multi-byte values.

---

# Summary

- `ArrayBuffer` is a fixed-size block of raw memory.
- It stores only bytes.
- It cannot be accessed directly.
- `DataView` provides methods to read and write different data types.
- The first argument of every `get...()` and `set...()` method is the byte offset.
- Signed and unsigned methods interpret the same bytes differently.
- Multi-byte values can be stored in either Big Endian or Little Endian format.
- Reading and writing should use the same endianness to retrieve the original value correctly.
