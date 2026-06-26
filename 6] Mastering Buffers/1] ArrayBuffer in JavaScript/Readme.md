# ArrayBuffer in JavaScript

> Understanding how JavaScript stores raw binary data in memory.

---

# Table of Contents

- What is an ArrayBuffer?
- Creating an ArrayBuffer
- Maximum Size of an ArrayBuffer
- ArrayBuffer is Raw Memory
- Why Can't We Modify an ArrayBuffer Directly?
- Typed Arrays
- DataView
- Binary vs Hexadecimal
- Viewing Files in Hex
- Key Takeaways

---

# What is an ArrayBuffer?

`ArrayBuffer` is a **fixed-size container of raw bytes**.

It allocates a contiguous block of memory from the system's RAM. Each byte is assigned a sequential index starting from `0`.

Think of it as an empty block of memory.

```
Index

0   1   2   3   4   5   6   7

+---+---+---+---+---+---+---+---+
|   |   |   |   |   |   |   |   |
+---+---+---+---+---+---+---+---+
```

The buffer itself does **not** know what those bytes represent.

For example, the same bytes could represent:

- Numbers
- Text
- Images
- Audio
- Videos
- PDF files

It simply stores **raw binary data**.

---

# Creating an ArrayBuffer

An ArrayBuffer is created using the constructor.

```javascript
const buffer = new ArrayBuffer(8);
```

This allocates **8 bytes** of memory.

```
Length = 8 bytes

Index

0
1
2
3
4
5
6
7
```

Initially every byte is filled with **0x00**.

---

# Maximum Size of an ArrayBuffer

Many developers assume they can allocate up to **2 GiB**.

Example:

```javascript
const buffer = new ArrayBuffer(2 * 1024 * 1024 * 1024);
```

Output

```
Uncaught RangeError: Array buffer allocation failed
```

## Why?

The JavaScript engine tries to allocate **2 GiB** of contiguous memory.

Allocation may fail because:

- JavaScript engine limits
- Operating system memory limits
- Insufficient available RAM
- Memory fragmentation (no sufficiently large contiguous block available)

Therefore, the maximum size depends on:

- Browser
- JavaScript engine
- Operating system
- Available memory

There is **no universal maximum size** guaranteed by JavaScript.

---

# ArrayBuffer is Raw Memory

An ArrayBuffer only reserves memory.

```
+--------------------------------+
|00|00|00|00|00|00|00|00|
+--------------------------------+
```

It cannot:

- Read values
- Write values
- Interpret bytes

It simply stores bytes.

---

# Why Can't We Modify an ArrayBuffer Directly?

An `ArrayBuffer` exposes **raw memory only**.

JavaScript doesn't know whether those bytes should be interpreted as:

- 8-bit integers
- 16-bit integers
- 32-bit integers
- Floating-point numbers
- Unicode characters

Therefore, JavaScript requires another object to interpret the bytes.

There are two ways:

- Typed Arrays
- DataView

---

# Typed Arrays

Typed Arrays provide a structured way to read and write bytes.

Common Typed Arrays include:

- Uint8Array
- Int8Array
- Uint16Array
- Int16Array
- Uint32Array
- Float32Array
- Float64Array

Example

```javascript
const buffer = new ArrayBuffer(4);

const view = new Uint8Array(buffer);

view[0] = 65;
view[1] = 66;

console.log(view);
```

Output

```
Uint8Array(4) [65, 66, 0, 0]
```

Here,

```
65 → A
66 → B
```

---

# DataView

`DataView` provides low-level access to an ArrayBuffer.

Unlike Typed Arrays, it allows reading and writing different data types at arbitrary byte offsets and lets you choose the byte order (endianness).

Example

```javascript
const buffer = new ArrayBuffer(8);

const view = new DataView(buffer);

view.setUint16(0, 500);

console.log(view.getUint16(0));
```

Output

```
500
```

DataView is useful when working with:

- Binary file formats
- Network protocols
- Custom binary data
- Endianness (Big Endian / Little Endian)

---

# Binary vs Hexadecimal

Internally, computers store everything as **binary**.

Example

```
01000001
```

However, developer tools usually display bytes in **hexadecimal** because it is shorter and easier to read.

```
Binary

01000001

↓

Hexadecimal

41
```

Both represent the **same byte**.

---

# Why Hexadecimal?

One hexadecimal digit represents **4 bits**.

Therefore,

```
1 byte

=

8 bits

=

2 hexadecimal digits
```

Example

```
Binary

01000001

↓

Hex

41
```

Hexadecimal is easier to:

- Read
- Debug
- Compare
- Visualize binary data

That's why memory inspectors and hex editors display bytes in hexadecimal instead of binary.

---

# Viewing Files in Hex

Every file on your computer is ultimately stored as **a sequence of bytes**.

Examples include:

- .txt
- .pdf
- .jpg
- .png
- .mp4
- .mp3
- .zip
- .exe

A hex editor displays the bytes of any file in hexadecimal format.

## Example — Text File

Contents

```
AB
```

Bytes

```
41 42
```

because

```
A → 0x41
B → 0x42
```

---

## Example — MP4 File

The beginning of an MP4 file might look like:

```
00 00 00 20
66 74 79 70
69 73 6F 6D
```

Although these bytes represent video metadata, they are still just binary data displayed in hexadecimal.

---

# Key Takeaways

- `ArrayBuffer` is a fixed-size container of raw bytes.
- It allocates a contiguous block of memory from RAM.
- Each byte has its own index.
- An ArrayBuffer only reserves memory—it does not interpret the bytes.
- You cannot directly read or modify an ArrayBuffer.
- Use **Typed Arrays** or **DataView** to access and modify the underlying bytes.
- Everything stored in memory is binary.
- Developer tools display bytes in hexadecimal because it is compact and easier to read.
- Every file—whether text, image, audio, video, or executable—is ultimately stored as a sequence of bytes.
