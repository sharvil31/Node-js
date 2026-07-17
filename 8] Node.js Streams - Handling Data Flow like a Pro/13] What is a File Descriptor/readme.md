# File Descriptors (FD) in Node.js

## What is a File Descriptor?

A **File Descriptor (FD)** is a **non-negative integer** assigned by the operating system to every opened file or I/O resource. Instead of directly working with a file, programs use its file descriptor to perform operations such as reading, writing, and closing the file.

Think of a file descriptor as a **unique identifier (or handle)** that the operating system uses to keep track of an opened file.

---

## Why Do File Descriptors Start from 3?

Every process already has three file descriptors reserved by the operating system.

| File Descriptor | Stream   | Description                            |
| --------------: | -------- | -------------------------------------- |
|           **0** | `stdin`  | Standard Input (Keyboard/Input Stream) |
|           **1** | `stdout` | Standard Output (Console Output)       |
|           **2** | `stderr` | Standard Error (Error Output)          |

Because these three descriptors are already occupied, the first file opened by your program usually gets **FD 3**, the next gets **FD 4**, and so on.

---

## Checking the Standard Streams

```javascript
import fs from "fs";

console.log(process.stdin.fd); // 0
console.log(process.stdout.fd); // 1
console.log(process.stderr.fd); // 2
```

### Output

```text
0
1
2
```

---

## Opening Files (Asynchronous)

The callback version of `fs.open()` opens a file and returns its file descriptor.

```javascript
import fs from "fs";

fs.open("text.txt", (err, fd) => {
  if (err) throw err;

  console.log(fd); // Usually 3

  fs.close(fd, () => {});
});
```

---

## Opening Multiple Files

```javascript
import fs from "fs";

fs.open("text.txt", (err, fd) => {
  console.log(fd); // 3
});

fs.open("num.txt", (err, fd) => {
  console.log(fd); // 4
});
```

### Possible Output

```text
3
4
```

The operating system assigns the next available file descriptor to each newly opened file.

---

## Opening Files Synchronously

```javascript
import fs from "fs";

const fd1 = fs.openSync("text.txt");
const fd2 = fs.openSync("num.txt");

console.log({ fd1, fd2 });
```

### Output

```text
{ fd1: 3, fd2: 4 }
```

---

## Closing File Descriptors

Whenever you open a file manually, it's a good practice to close it after you're done.

### Synchronous

```javascript
fs.closeSync(fd1);
fs.closeSync(fd2);
```

### Asynchronous

```javascript
fs.close(fd, (err) => {
  if (err) throw err;
});
```

Closing file descriptors releases operating system resources.

---

## Behind the Scenes

When your application opens a file:

1. Your program requests the operating system to open the file.
2. The operating system creates an internal entry for the opened file.
3. The operating system returns a **file descriptor**.
4. Your application uses that file descriptor for future operations like:
   - Reading
   - Writing
   - Seeking
   - Closing

```
Application
      │
      ▼
File Descriptor (3)
      │
      ▼
Operating System
      │
      ▼
Actual File
```

---

## Important Points

- A file descriptor is a **non-negative integer**.
- It uniquely identifies an opened file **within a process**.
- File descriptors are assigned by the **operating system**, not by Node.js.
- Every process starts with:
  - `0` → `stdin`
  - `1` → `stdout`
  - `2` → `stderr`

- Newly opened files usually start from **3**.
- File descriptors should be closed after use to avoid resource leaks.
- File descriptors exist in almost every operating system and programming language, not just Node.js.

---

## Common Node.js APIs That Use File Descriptors

Many low-level `fs` APIs work directly with file descriptors.

```javascript
fs.open();
fs.openSync();

fs.read();
fs.readSync();

fs.write();
fs.writeSync();

fs.close();
fs.closeSync();
```

Higher-level APIs such as `fs.readFile()` and `fs.writeFile()` manage file descriptors internally, so you don't have to handle them manually.

---

## Summary

- **File Descriptor (FD)** is a numeric identifier for an opened file.
- The operating system manages file descriptors.
- `0`, `1`, and `2` are reserved for standard input, output, and error streams.
- The first opened file typically gets **FD 3**.
- File descriptors are used internally by Node.js for reading, writing, and closing files.
- Always close manually opened file descriptors to free system resources.
