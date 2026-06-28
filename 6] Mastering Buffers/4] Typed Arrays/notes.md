# Typed Arrays in JavaScript

Typed Arrays are special array-like objects used to work with **binary data** efficiently.

An `ArrayBuffer` is simply a block of raw memory (bytes). It doesn't know what those bytes represent.

A **TypedArray** is a **view** over an `ArrayBuffer` that tells JavaScript how to interpret those bytes.

For example:

- Read every byte as an unsigned integer.
- Read every 2 bytes as a signed integer.
- Read every 4 bytes as a floating-point number.

---

# Why do Typed Arrays exist?

Normal JavaScript arrays are designed to store any type of value.

```javascript
const arr = [10, "Hello", true, {}, []];
```

A normal array can contain:

- Numbers
- Strings
- Objects
- Booleans
- Functions
- Arrays

Because of this flexibility, JavaScript arrays require additional memory and are not ideal for working with raw binary data.

Typed Arrays were introduced for situations where performance and memory efficiency matter.

Examples:

- Image processing
- Audio processing
- Video processing
- Reading binary files
- Networking
- Cryptography
- WebGL
- WebGPU
- WebAssembly

---

# Relationship between ArrayBuffer and TypedArray

Think of an `ArrayBuffer` as a notebook with empty boxes.

```
ArrayBuffer (4 bytes)

+----+----+----+----+
|    |    |    |    |
+----+----+----+----+
  0    1    2    3
```

The buffer only stores bytes.

It has no idea whether those bytes represent:

- integers
- floating point numbers
- colors
- audio samples
- pixels

A TypedArray acts like a lens.

```
ArrayBuffer

FE EE 00 8A

        ↓

Uint8Array

[254, 238, 0, 138]
```

or

```
Int16Array

[-4354, -30208]
```

Same memory.

Different interpretation.

---

# Types of Typed Arrays

## Signed Integer Typed Arrays

These can store both positive and negative integers.

| Typed Array   | Bytes per Element | Range             |
| ------------- | ----------------- | ----------------- |
| Int8Array     | 1                 | -128 to 127       |
| Int16Array    | 2                 | -32,768 to 32,767 |
| Int32Array    | 4                 | -2³¹ to 2³¹-1     |
| BigInt64Array | 8                 | 64-bit BigInt     |

---

## Unsigned Integer Typed Arrays

These only store positive values.

| Typed Array       | Bytes per Element |
| ----------------- | ----------------- |
| Uint8Array        | 1                 |
| Uint8ClampedArray | 1                 |
| Uint16Array       | 2                 |
| Uint32Array       | 4                 |
| BigUint64Array    | 8                 |

---

## Floating Point Typed Arrays

Used for decimal numbers.

| Typed Array  | Bytes per Element |
| ------------ | ----------------- |
| Float32Array | 4                 |
| Float64Array | 8                 |

---

# Creating a TypedArray

A TypedArray can allocate its own memory.

```javascript
const numbers = new Uint8Array(4);

console.log(numbers);
```

Output

```
Uint8Array(4) [0, 0, 0, 0]
```

Internally JavaScript creates

```
ArrayBuffer

00 00 00 00
```

Because `Uint8Array` uses one byte per element,

```
Length = 4
Bytes = 4
```

---

# Creating a TypedArray from an ArrayBuffer

```javascript
const buffer = new ArrayBuffer(4);

const uint8 = new Uint8Array(buffer);
```

Memory

```
ArrayBuffer

+----+----+----+----+
|00  |00  |00  |00  |
+----+----+----+----+

        ↑
TypedArray View
```

Notice that the TypedArray does **not** create another copy.

It simply points to the existing memory.

---

# Multiple Typed Arrays can share one ArrayBuffer

```javascript
const buffer = new ArrayBuffer(4);

const uint8 = new Uint8Array(buffer);
const uint16 = new Uint16Array(buffer);
const uint32 = new Uint32Array(buffer);
```

Memory

```
ArrayBuffer

+----+----+----+----+
| B0 | B1 | B2 | B3 |
+----+----+----+----+
```

Viewed as Uint8Array

```
[B0] [B1] [B2] [B3]
```

Viewed as Uint16Array

```
[B0 B1]
[B2 B3]
```

Viewed as Uint32Array

```
[B0 B1 B2 B3]
```

No memory is copied.

Only different views are created.

---

# Example

```javascript
const buffer = new ArrayBuffer(4);

const uint8 = new Uint8Array(buffer);
const uint16 = new Uint16Array(buffer);
```

Initially

```
00 00 00 00
```

Store a value

```javascript
uint8[2] = 0xf3;
```

Memory becomes

```
00 00 F3 00
```

Reading through `Uint8Array`

```
[0, 0, 243, 0]
```

Reading through `Uint16Array`

The same bytes are interpreted differently.

---

Another example

```javascript
uint16[0] = 0x34ea;
```

On little-endian systems the bytes become

```
EA 34 F3 00
```

Reading through `Uint8Array`

```
[234, 52, 243, 0]
```

Notice that changing one view changes the underlying buffer, so every other view immediately sees the updated bytes.

---

# Creating from a JavaScript Array

```javascript
const uint8 = new Uint8Array([0xfe, 0xee, 0x00, 0x8a]);
```

Output

```
Uint8Array(4)

[254, 238, 0, 138]
```

Internally JavaScript creates an ArrayBuffer.

```
ArrayBuffer

FE EE 00 8A
```

---

# Accessing the underlying ArrayBuffer

Every TypedArray has a `.buffer` property.

```javascript
const arr = new Uint8Array([1, 2, 3, 4]);

console.log(arr.buffer);
```

Output

```
ArrayBuffer
```

The `.buffer` property returns the underlying memory.

---

# length

Returns the number of elements.

```javascript
const arr = new Uint16Array(5);

console.log(arr.length);
```

Output

```
5
```

Even though the array occupies

```
5 × 2 = 10 bytes
```

its length is still 5 because it contains five elements.

---

# byteLength

Returns the total memory occupied by the TypedArray.

```javascript
const arr = new Uint16Array(5);

console.log(arr.byteLength);
```

Output

```
10
```

Calculation

```
5 elements × 2 bytes = 10 bytes
```

---

# byteOffset

Indicates where the TypedArray begins inside the ArrayBuffer.

```javascript
const buffer = new ArrayBuffer(8);

const arr = new Uint16Array(buffer, 2);
```

Memory

```
0 1 2 3 4 5 6 7
    ↑
Starts here
```

```javascript
console.log(arr.byteOffset);
```

Output

```
2
```

---

# Sharing Memory

```javascript
const buffer = new ArrayBuffer(4);

const a = new Uint8Array(buffer);
const b = new Uint16Array(buffer);

a[0] = 100;

console.log(b);
```

Both arrays point to the same memory.

Changing one immediately affects the other.

This is one of the biggest advantages of Typed Arrays.

---

# Typed Arrays are Fixed Length

```javascript
const arr = new Uint8Array(4);
```

The length is fixed.

Trying to resize it directly is not allowed.

```javascript
arr.push(10);
```

Output

```
TypeError
```

Unlike normal JavaScript arrays, Typed Arrays cannot grow or shrink.

---

# Resizable ArrayBuffer

Modern JavaScript allows creating resizable ArrayBuffers.

```javascript
const buffer = new ArrayBuffer(4, {
  maxByteLength: 16,
});
```

Current size

```
4 bytes
```

Maximum size

```
16 bytes
```

Resize

```javascript
buffer.resize(8);
```

Now the buffer contains

```
8 bytes
```

Existing TypedArrays may update their visible length depending on how they were created.

---

# transfer()

Ownership of an ArrayBuffer can be transferred.

```javascript
const a = new ArrayBuffer(4);

const b = a.transfer();
```

After transfer

```
a

Detached

byteLength = 0
```

```
b

Contains the original bytes
```

The memory is moved from `a` to `b`.

The original buffer becomes detached and can no longer be used.

---

# TypedArray vs Normal Array

| Feature                   | Normal Array | TypedArray |
| ------------------------- | ------------ | ---------- |
| Mixed Data Types          | ✅           | ❌         |
| Fixed Size                | ❌           | ✅         |
| Contiguous Memory         | ❌           | ✅         |
| Optimized for Binary Data | ❌           | ✅         |
| High Performance          | ❌           | ✅         |
| Supports push()           | ✅           | ❌         |

---

# Common Use Cases

Typed Arrays are commonly used for:

- Reading binary files
- Processing images
- Audio processing
- Video processing
- Network protocols
- Cryptography
- Machine Learning
- WebGL
- WebGPU
- WebAssembly
- High-performance mathematical computations

---

# Summary

- `ArrayBuffer` is a raw block of memory.
- A `TypedArray` is a typed view over that memory.
- Different TypedArrays interpret the same bytes differently.
- Multiple TypedArrays can share one ArrayBuffer.
- Changes made through one view are immediately visible to every other view sharing the same buffer.
- Typed Arrays are fixed-length and optimized for working with binary data.
- They are significantly more memory-efficient and faster than normal JavaScript arrays for numerical and binary operations.
