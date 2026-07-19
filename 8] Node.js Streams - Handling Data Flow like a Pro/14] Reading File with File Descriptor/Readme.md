# Reading & Writing Files with File Descriptors in Node.js

This example demonstrates how to work directly with **File Descriptors (FDs)** in Node.js using the built-in `fs` module.

Instead of reading or writing files using helper methods like `fs.readFile()` or `fs.writeFile()`, this approach gives you low-level control over file operations.

---

# Opening a File

A file is opened using:

```js
const fd = fs.openSync("text.txt");
```

By default, `openSync()` opens the file in **read (`r`) mode**.

It returns a File Descriptor that can later be used for reading or writing.

---

# Reading a File

To read a file, use `fs.read()`.

Example:

```js
const fd = fs.openSync("text.txt");

const buffer = Buffer.alloc(10);

fs.read(
  fd,
  {
    buffer,
    length: 5,
    position: 2,
    offset: 2,
  },
  (err, bytesRead, data) => {
    console.log(bytesRead);
    console.log(data.toString());
  },
);
```

---

## Understanding the Options

### buffer

The destination buffer where the data will be stored.

```js
buffer: Buffer.alloc(10);
```

Here Node stores the read data inside this buffer.

---

### length

Number of bytes to read.

```js
length: 5;
```

Only 5 bytes will be read.

---

### position

The starting position inside the file.

```js
position: 2;
```

Reading begins from the 3rd byte of the file (index starts at 0).

Example:

```
Hello World
0123456789
```

Position `2` starts reading from:

```
llo W
```

---

### offset

Where inside the buffer the data should be placed.

```js
offset: 2;
```

The first two bytes of the buffer remain empty.

Example:

Buffer size = 10

Before reading:

```
00 00 00 00 00 00 00 00 00 00
```

After reading "llo W":

```
00 00 l l o   W 00 00 00
```

---

### bytesRead

The actual number of bytes read.

```js
console.log(bytesRead);
```

Output:

```
5
```

---

### buffer.toString()

Converts the buffer into a readable string.

```js
console.log(buffer.toString());
```

---

# File Opening Modes (Flags)

Node.js allows opening files in different modes.

## Read Mode (`r`)

```js
const fd = fs.openSync("text.txt", "r");
```

- Default mode
- Read only
- Throws error if file doesn't exist

---

## Write Mode (`w`)

```js
const fd = fs.openSync("text.txt", "w");
```

- Write only
- Creates file if it doesn't exist
- Truncates existing file

Example:

```
Hello World
```

After:

```js
fs.writeSync(fd, "Hi");
```

Result:

```
Hi
```

---

## Append Mode (`a`)

```js
const fd = fs.openSync("text.txt", "a");
```

- Creates file if needed
- Adds new content at the end

Example:

Before:

```
Hello
```

After:

```js
fs.writeSync(fd, " World");
```

Result:

```
Hello World
```

---

## Read + Write (`r+`)

```js
const fd = fs.openSync("text.txt", "r+");
```

- Read and write
- File must exist
- Does not truncate the file

---

## Write + Read (`w+`)

```js
const fd = fs.openSync("text.txt", "w+");
```

- Read and write
- Creates file if needed
- Clears existing content

---

## Append + Read (`a+`)

```js
const fd = fs.openSync("text.txt", "a+");
```

- Read and append
- Creates file if needed
- Existing content is preserved

---

# Writing to a File

Asynchronous example:

```js
const fd = fs.openSync("text.txt", "w");

fs.write(fd, "abc", (err, bytesWritten, buffer) => {
  console.log(bytesWritten);
  console.log(buffer);
});
```

Output:

```
3
abc
```

---

# Writing Using a Buffer

Instead of passing a string, we can pass a Buffer.

```js
const buffer = Buffer.from("123");

fs.write(fd, buffer, (err, bytesWritten) => {
  console.log(bytesWritten);
});
```

Output:

```
3
```

---

# Synchronous Writing

```js
const fd = fs.openSync("text.txt", "w");

const bytesWritten = fs.writeSync(fd, "abc");

console.log(bytesWritten);
```

Output:

```
3
```

---

# Why Use File Descriptors?

File Descriptors provide more control over file operations.

They allow you to:

- Read specific portions of a file
- Write at specific positions
- Open files in different modes
- Reuse the same opened file multiple times
- Perform low-level file operations

Higher-level methods like `fs.readFile()` and `fs.writeFile()` are easier to use, but File Descriptors are useful when you need precise control or are building systems such as databases, file editors, or streaming applications.

---

# Summary

| Method           | Purpose                                    |
| ---------------- | ------------------------------------------ |
| `fs.openSync()`  | Open a file and return its File Descriptor |
| `fs.read()`      | Read bytes from a file                     |
| `fs.write()`     | Write bytes to a file                      |
| `fs.writeSync()` | Synchronous write                          |
| `Buffer.alloc()` | Create an empty buffer                     |
| `Buffer.from()`  | Create a buffer from existing data         |

### Common File Flags

| Flag | Description                         |
| ---- | ----------------------------------- |
| `r`  | Read only                           |
| `w`  | Write only (truncate or create)     |
| `a`  | Append only                         |
| `r+` | Read and write                      |
| `w+` | Read and write (truncate or create) |
| `a+` | Read and append (create if needed)  |

---

## Key Takeaways

- A File Descriptor is an integer that identifies an opened file.
- `fs.openSync()` returns a File Descriptor.
- `fs.read()` reads data into a Buffer.
- `fs.write()` writes strings or Buffers.
- Different file flags control how files are opened.
- Buffers are used internally for efficient binary data handling.
- File Descriptors are the foundation of low-level file operations in Node.js.
