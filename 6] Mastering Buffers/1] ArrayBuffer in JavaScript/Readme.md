# ArrayBuffer in JavaScript

## What is an ArrayBuffer?

`ArrayBuffer` is a built-in JavaScript object that represents a **fixed-size block of raw binary memory**.

It is simply a container of bytes.

An `ArrayBuffer` does **not** know whether the bytes represent:

* Numbers
* Strings
* Images
* Audio
* Videos
* PDFs
* ZIP files
* Or any other type of data

It only stores raw bytes.

---

# Why do we need ArrayBuffer?

JavaScript usually works with high-level data types.

```js
const num = 100;
const str = "Hello";
const arr = [1, 2, 3];
```

These data types are easy to work with because JavaScript knows what they represent.

However, when working with binary data such as:

* Images
* Audio
* Video
* PDFs
* Network packets
* WebSockets
* Cryptography
* File systems
* WebAssembly

JavaScript needs a way to store raw bytes.

That's where `ArrayBuffer` comes in.

---

# Creating an ArrayBuffer

```js
const buffer = new ArrayBuffer(8);
```

This allocates **8 bytes** of memory.

```
Index

0   1   2   3   4   5   6   7

┌───┬───┬───┬───┬───┬───┬───┬───┐
│00 │00 │00 │00 │00 │00 │00 │00 │
└───┴───┴───┴───┴───┴───┴───┴───┘
```

Every byte is initialized to `0`.

---

# Important

People often say:

> ArrayBuffers don't contain any value.

This is **not entirely correct**.

The memory **does contain bytes**, and initially every byte is `0`.

The correct statement is:

> An `ArrayBuffer` does not contain any typed value.

JavaScript doesn't know whether those bytes should be interpreted as:

* integers
* floating-point numbers
* Unicode characters
* image pixels
* audio samples
* video frames

They are simply bytes.

---

# Can we access an ArrayBuffer directly?

No.

```js
const buffer = new ArrayBuffer(8);

console.log(buffer[0]);
```

Output

```js
undefined
```

Why?

Because an `ArrayBuffer` is only responsible for allocating memory.

It does not define how the bytes should be interpreted.

---

# ArrayBuffer Needs a View

To read or write bytes, JavaScript requires a **View**.

Examples:

* Uint8Array
* Int16Array
* Float32Array
* DataView

These views tell JavaScript how to interpret the bytes.

```
             ArrayBuffer

      Raw Binary Memory

             ▲
             │
      Different Views
             │

 Uint8Array
 Int16Array
 Float32Array
 DataView
```

---

# Example

```js
const buffer = new ArrayBuffer(8);

const view = new Uint8Array(buffer);

view[0] = 10;
view[1] = 20;
view[2] = 30;

console.log(view);
```

Output

```js
Uint8Array(8) [
 10,
 20,
 30,
 0,
 0,
 0,
 0,
 0
]
```

Memory

```
┌────┬────┬────┬────┬────┬────┬────┬────┐
│10  │20  │30  │0   │0   │0   │0   │0   │
└────┴────┴────┴────┴────┴────┴────┴────┘
```

---

# Multiple Views Share the Same Memory

```js
const buffer = new ArrayBuffer(8);

const uint8 = new Uint8Array(buffer);
const int16 = new Int16Array(buffer);
```

Both views point to the same memory.

Changing one immediately affects the other.

---

# ArrayBuffer and Files

Every file on your computer is stored as raw bytes.

Examples:

* photo.png
* song.mp3
* movie.mp4
* document.pdf

They are all just sequences of bytes.

Example

```
PNG File

89 50 4E 47 0D 0A 1A 0A ...
```

These bytes can be loaded into an `ArrayBuffer`.

---

# Are Files Stored as ArrayBuffers?

No.

This is a common misconception.

Files are stored on:

* SSD
* HDD
* USB drive
* Memory card

as raw bytes.

`ArrayBuffer` exists only in **RAM** while your JavaScript program is running.

```
SSD/HDD

photo.png

89 50 4E 47 ...

        │

        ▼

Operating System

        │

        ▼

Browser / Node.js

        │

        ▼

ArrayBuffer in RAM

89 50 4E 47 ...
```

---

# What Happens When JavaScript Reads a File?

Suppose you select a file.

```js
const file = input.files[0];

const buffer = await file.arrayBuffer();
```

Internally:

1. The operating system reads the bytes from disk.
2. The browser loads those bytes into memory.
3. The browser creates an `ArrayBuffer`.
4. JavaScript receives the `ArrayBuffer`.

---

# Does ArrayBuffer Know It's an Image or MP3?

No.

This is one of the most important concepts.

An `ArrayBuffer` only stores bytes.

```
ArrayBuffer

89 50 4E 47 0D 0A ...
```

JavaScript simply sees:

```
137
80
78
71
13
10
...
```

It has no idea whether these bytes represent:

* an image
* an MP3
* an MP4
* a PDF
* a ZIP archive

---

# Then Who Knows?

The program or decoder that reads those bytes.

Examples:

* PNG decoder
* JPEG decoder
* MP3 decoder
* MP4 decoder
* PDF parser
* ZIP parser

These programs understand the file format.

---

# File Signatures (Magic Numbers)

Many file formats begin with unique bytes called **magic numbers** or **file signatures**.

Examples

| File | Signature             |
| ---- | --------------------- |
| PNG  | `89 50 4E 47`         |
| JPEG | `FF D8 FF`            |
| GIF  | `47 49 46 38`         |
| PDF  | `25 50 44 46`         |
| ZIP  | `50 4B 03 04`         |
| MP3  | `49 44 33` (commonly) |

When a decoder starts reading the bytes, it checks these signatures to determine the file type.

Example

```
89 50 4E 47
↑

PNG Signature

↓

PNG Decoder
```

---

# Browser Example

```js
const file = input.files[0];

const buffer = await file.arrayBuffer();

const blob = new Blob([buffer], {
  type: "image/png",
});

const url = URL.createObjectURL(blob);

img.src = url;
```

The browser's PNG decoder reads the bytes and renders the image.

JavaScript itself never "understands" the image.

---

# Node.js

Node.js usually returns a `Buffer`.

```js
const data = await fs.promises.readFile("photo.png");
```

A Node.js `Buffer` is a subclass of `Uint8Array` and uses an underlying `ArrayBuffer` for its memory.

---

# Fixed Size

ArrayBuffers cannot grow or shrink.

```js
const buffer = new ArrayBuffer(8);
```

If you need more memory, create a new one.

```js
const bigger = new ArrayBuffer(16);
```

---

# Real-Life Analogy

Imagine receiving a sealed box.

```
📦
```

Until someone opens it, you don't know whether it contains:

* books
* clothes
* headphones
* a camera

An `ArrayBuffer` is that sealed box.

The bytes are the contents.

The decoder is the person who opens the box and understands what's inside.

---

# Summary

* `ArrayBuffer` is a fixed-size block of raw binary memory.
* It stores bytes, not typed values.
* Every byte is initialized to `0`.
* Files on disk are stored as raw bytes, **not** as `ArrayBuffer`s.
* When JavaScript reads a file, the browser or Node.js loads the file into memory and exposes the bytes as an `ArrayBuffer`.
* `ArrayBuffer` has no knowledge of whether the bytes represent an image, audio, video, or any other file type.
* Specialized decoders or parsers inspect the bytes (often using file signatures) and interpret them according to the file format.
* To access the bytes in an `ArrayBuffer`, you must use a view such as `Uint8Array`, `Int16Array`, or `DataView`.
