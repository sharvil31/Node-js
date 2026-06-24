# Byte Order Mark (BOM) and Endianness (Big Endian & Little Endian)

## Introduction

When computers store data larger than **1 byte** (such as a 16-bit, 32-bit, or 64-bit integer), they must decide **in which order the bytes should be stored in memory**.

This ordering is called **Endianness**.

For example, consider the hexadecimal number:

```text
0x425A
```

This is a **16-bit (2-byte)** value.

```
MSB      LSB
42       5A
```

- **42** is the **Most Significant Byte (MSB)**.
- **5A** is the **Least Significant Byte (LSB)**.

The same value can be stored in memory in two different ways.

---

# What is Endianness?

**Endianness** is the order in which multiple bytes are stored in memory.

There are two types:

1. Big Endian
2. Little Endian

---

# Big Endian

In **Big Endian**, the **Most Significant Byte (MSB)** is stored at the **lowest memory address**.

Example:

```
Value:
0x425A

Memory

Address      Value
0             42
1             5A
```

Memory layout:

```
42 5A
```

### Rule

```
Lowest Address  → Most Significant Byte (MSB)
Highest Address → Least Significant Byte (LSB)
```

### Why is it called Big Endian?

Because the **"big end"** (most significant part) comes first.

### Advantages

- Easy for humans to read.
- Matches how we naturally write numbers.
- Used as the standard byte order for Internet protocols (Network Byte Order).

---

# Little Endian

In **Little Endian**, the **Least Significant Byte (LSB)** is stored at the **lowest memory address**.

Example:

```
Value:
0x425A

Memory

Address      Value
0             5A
1             42
```

Memory layout:

```
5A 42
```

### Rule

```
Lowest Address  → Least Significant Byte (LSB)
Highest Address → Most Significant Byte (MSB)
```

### Why is it called Little Endian?

Because the **"little end"** (least significant part) comes first.

### Advantages

- Used by Intel and AMD processors.
- Simplifies certain low-level arithmetic operations.
- Dominant byte order on modern desktop computers.

---

# Visual Comparison

Suppose we store:

```
0x12345678
```

### Big Endian

```
Address

0   1   2   3
12  34  56  78
```

### Little Endian

```
Address

0   1   2   3
78  56  34  12
```

---

# Which One Do Humans Prefer?

Humans naturally read numbers from **left to right**.

For example:

```
12345678
```

We first read:

```
12
```

then

```
34
```

then

```
56
```

then

```
78
```

This matches **Big Endian**, making it easier for people to understand.

---

# Which One Do Computers Use?

Computers can use **either** byte order.

The choice depends on the processor architecture.

Examples:

| Processor | Endianness                               |
| --------- | ---------------------------------------- |
| Intel x86 | Little Endian                            |
| AMD x64   | Little Endian                            |
| ARM       | Usually Little Endian (can support both) |
| PowerPC   | Big or Little Endian (Bi-endian)         |

Neither approach is universally faster or better. It is simply a design choice made by the processor architecture.

---

# Network Byte Order

When data is transferred between different computers, both systems must interpret the bytes in the same order.

Instead of sending additional information about the byte order every time, Internet protocols define a standard:

> **Network Byte Order = Big Endian**

Example:

Suppose a Little Endian computer stores:

```
0x12345678

Memory

78 56 34 12
```

Before sending over the network, it converts the value to:

```
12 34 56 78
```

The receiving computer knows that network data is always Big Endian and converts it back if necessary.

---

# Byte Order Mark (BOM) and Endianness

## BOM (Byte Order Mark)

The **Byte Order Mark (BOM)** is a **Unicode character** (U+FEFF) used at the beginning of a text file or data stream to indicate the encoding and the **endianness** (byte order) of the file. It plays an essential role in helping systems correctly interpret the text encoding, especially in encodings like **UTF-16** and **UTF-32**.

### Key Points About BOM:

- **Unicode Character**: BOM is encoded as the Unicode character **U+FEFF**. While it is a real Unicode character, it is not intended to appear in the visible text of the file.
- **Purpose**: Its main function is to signal the encoding of the text and, in the case of multi-byte encodings like UTF-16 and UTF-32, to specify the **byte order** (endianness).
- **UTF-8**: In UTF-8, the BOM is optional and is not strictly needed because UTF-8 is byte-oriented and does not have endianness issues. However, when present, the BOM in UTF-8 is represented by the byte sequence **`EF BB BF`**.

# BOM in Different Encodings

| Encoding             | BOM         |
| -------------------- | ----------- |
| UTF-8                | EF BB BF    |
| UTF-16 Big Endian    | FE FF       |
| UTF-16 Little Endian | FF FE       |
| UTF-32 Big Endian    | 00 00 FE FF |
| UTF-32 Little Endian | FF FE 00 00 |

---

## Endianness

**Endianness** refers to the order in which bytes are stored in memory or transmitted in a data stream. It is important in multi-byte encodings like **UTF-16** and **UTF-32**, where characters are represented by two or more bytes. The order in which these bytes are arranged determines how a system interprets the data.

There are two types of endianness:

### 1. Little Endian:

- In **Little Endian** systems, the **least significant byte (LSB)** is stored first (at the lowest memory address), and the **most significant byte (MSB)** is stored last.
- Example: For the hexadecimal number `0x12345678`, in little-endian format, it would be stored as `78 56 34 12`.

### Advantages of Little Endian:

- Easier for systems to perform operations on lower significant bytes first, which is useful in many low-level operations.
- Commonly used by modern hardware architectures like **Intel** and **AMD** processors.

### 2. Big Endian:

- In **Big Endian** systems, the **most significant byte (MSB)** is stored first (at the lowest memory address), and the **least significant byte (LSB)** is stored last.
- Example: For the hexadecimal number `0x12345678`, in big-endian format, it would be stored as `12 34 56 78`.

### Advantages of Big Endian:

- Easier for humans to read since the bytes are stored in the same order as the digits appear in a multi-byte value (e.g., a number written left to right).
- Commonly used in **network protocols** (often referred to as **network byte order**).

---

# Why Do We Need a BOM?

Consider the character:

```
A
```

Unicode code point:

```
U+0041
```

### UTF-16 Big Endian

```
00 41
```

### UTF-16 Little Endian

```
41 00
```

Without knowing the byte order, a program cannot determine whether:

```
41 00
```

means:

```
U+0041
```

or

```
U+4100
```

The BOM removes this ambiguity.

---

# Why is the BOM U+FEFF?

The BOM character is intentionally chosen so that its byte sequence reveals the byte order.

### Big Endian

```
U+FEFF

Stored as:

FE FF
```

### Little Endian

```
Stored as:

FF FE
```

When software reads the first two bytes, it immediately knows which byte order is being used.

```
FE FF
↓

Big Endian
```

```
FF FE
↓

Little Endian
```

---

# UTF-8 BOM

UTF-8 does **not** have an endianness because it stores data one byte at a time.

Therefore, the UTF-8 BOM is **optional**.

UTF-8 BOM:

```
EF BB BF
```

Its purpose is simply to indicate:

> "This file is encoded using UTF-8."

It does **not** specify any byte order.

Many Windows editors include it by default, while Unix/Linux tools typically omit it.

---

# Is the BOM Required?

No.

The BOM is **optional** according to the Unicode Standard.

It is mainly useful when the encoding or byte order is unknown.

For example:

If a file format already specifies:

```
UTF-16LE
```

then a BOM is unnecessary because the byte order is already known.

---

## How BOM and Endianness Work Together:

- In **UTF-16** and **UTF-32**, BOM is crucial because it indicates the **endianness** of the data.
  - For example, if a BOM of `FF FE` is detected, the system knows the data is in **little-endian** format.
  - If the BOM is `FE FF`, the system understands that the data is in **big-endian** format.

- In **UTF-8**, endianness doesn't apply because the encoding is byte-oriented, so the BOM is not strictly required. However, some applications may still include it (`EF BB BF`) as a signal that the file is UTF-8 encoded.

---

## Comparison Table

| Aspect                | Description                                                              | Usage/Encoding                                                             |
| --------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| BOM (Byte Order Mark) | A Unicode character (U+FEFF) used to signal encoding and endianness.     | Present in UTF-8 (optional) and UTF-16/32 (required for endian detection). |
| Endianness            | Refers to the byte order in multi-byte encodings like UTF-16 and UTF-32. | Applicable to encodings like UTF-16/32 where byte order matters.           |
| Little Endian         | Least Significant Byte (LSB) stored first; used by Intel and AMD.        | Dominant in most modern hardware architectures.                            |
| Big Endian            | Most Significant Byte (MSB) stored first; used in network protocols.     | Used in network protocols and some older systems.                          |

# Summary

## Endianness

- Determines how multi-byte values are stored in memory.
- Affects UTF-16 and UTF-32 because characters occupy multiple bytes.
- Does not affect UTF-8.

---

## Big Endian

- MSB stored first.
- Lowest memory address contains the MSB.
- Easy for humans to read.
- Used for Network Byte Order.

---

## Little Endian

- LSB stored first.
- Lowest memory address contains the LSB.
- Used by Intel and AMD processors.
- Most common on modern computers.

---

# Key Takeaways

- **Endianness** defines the order in which bytes are stored in memory.
- **Big Endian** stores the **Most Significant Byte (MSB)** first.
- **Little Endian** stores the **Least Significant Byte (LSB)** first.
- Humans naturally write and read numbers in **Big Endian** order.
- Most modern processors (Intel and AMD) use **Little Endian**.
- Internet protocols use **Big Endian**, known as **Network Byte Order**.
- **BOM (U+FEFF)** helps identify the encoding and, for UTF-16/UTF-32, the byte order.
- UTF-8 does not require endianness because it is a byte-oriented encoding.
