# Node.js FS Module (File System) and reading files with fs.readFile()

## What is the FS Module?

The **FS (File System)** module is a built-in (Core/Native) Node.js module used for performing file operations such as:

* Reading files
* Writing files
* Updating files
* Deleting files
* Creating directories

Since it is a core module, it comes bundled with Node.js and does not require installation.

### Importing FS Module

```javascript
import fs from "node:fs";
```

---

# Synchronous vs Asynchronous Methods

Most file system operations in the `fs` module are available in two versions:

1. **Synchronous Version**

   * Blocks the main thread.
   * Code execution waits until the operation completes.

2. **Asynchronous Version**

   * Does not block the main thread.
   * Operation runs in the background.
   * Preferred in most real-world applications.

---

# 1. readFileSync()

## Syntax

```javascript
fs.readFileSync(path, encoding);
```

## Parameters

| Parameter | Description                        |
| --------- | ---------------------------------- |
| path      | Path of the file to read           |
| encoding  | Character encoding (e.g., "utf-8") |

## Example

```javascript
import fs from "node:fs";

const data = fs.readFileSync("./data.txt");

console.log(data);
```

Output:

```text
<Buffer 48 65 6c 6c 6f>
```

### Why Buffer?

When no encoding is provided, Node.js returns the file contents as a **Buffer**.

Convert buffer to string:

```javascript
const data = fs.readFileSync("./data.txt");

console.log(data.toString());
```

Output:

```text
Hello
```

### Using Encoding

```javascript
const data = fs.readFileSync("./data.txt", "utf-8");

console.log(data);
```

Output:

```text
Hello
```

### Characteristics

✅ Returns data immediately

❌ Blocks the main thread

❌ Not recommended for large applications

---

# 2. readFile()

## Syntax

```javascript
fs.readFile(path, encoding, callback);
```

## Parameters

| Parameter | Description                     |
| --------- | ------------------------------- |
| path      | Path of the file                |
| encoding  | Character encoding              |
| callback  | Function executed after reading |

---

## Callback Parameters

```javascript
(error, data)
```

### error

Contains error information if reading fails.

Example:

```javascript
if (error) {
  console.log(error);
  return;
}
```

### data

Contains file content if reading succeeds.

---

## Example

```javascript
import fs from "node:fs";

fs.readFile("./data.txt", "utf-8", (error, data) => {
  if (error) {
    console.log(error);
    return;
  }

  console.log(data);
});
```

Output:

```text
Hello
```

---

## Without Encoding

```javascript
fs.readFile("./data.txt", (error, data) => {
  console.log(data);
});
```

Output:

```text
<Buffer 48 65 6c 6c 6f>
```

The returned data is a Buffer.

---

## Characteristics

✅ Non-blocking

✅ Asynchronous

✅ Suitable for production applications

❌ Uses callback functions (can lead to callback nesting)

---

# 3. node:fs/promises

Node.js provides a Promise-based version of the FS module.

## Import

```javascript
import fs from "node:fs/promises";
```

This module contains only asynchronous methods and works seamlessly with:

* Promises
* async/await

---

# readFile() Using Promises

## Example

```javascript
import fs from "node:fs/promises";

const data = await fs.readFile("./data.txt", "utf-8");

console.log(data);
```

Output:

```text
Hello
```

---

# Using try-catch

```javascript
import fs from "node:fs/promises";

try {
  const data = await fs.readFile("./data.txt", "utf-8");

  console.log(data);
} catch (error) {
  console.log(error);
}
```

---

# Why Prefer node:fs/promises?

### Traditional Callback Style

```javascript
fs.readFile("./data.txt", "utf-8", (error, data) => {
  if (error) {
    console.log(error);
    return;
  }

  console.log(data);
});
```

### Promise Style

```javascript
const data = await fs.readFile("./data.txt", "utf-8");
```

Benefits:

✅ Cleaner syntax

✅ Easier error handling

✅ Better readability

✅ Works naturally with async/await

✅ Avoids callback nesting

---

# Understanding Buffers

When no encoding is provided:

```javascript
const data = await fs.readFile("./data.txt");
```

Output:

```text
<Buffer 48 65 6c 6c 6f>
```

This is a Buffer object representing raw binary data.

Convert it to a string:

```javascript
console.log(data.toString());
```

or simply provide encoding:

```javascript
const data = await fs.readFile("./data.txt", "utf-8");
```

Output:

```text
Hello
```

---

# Comparison

| Method                 | Type         | Blocks Main Thread? | Return Type     |
| ---------------------- | ------------ | ------------------- | --------------- |
| readFileSync()         | Synchronous  | Yes                 | Buffer/String   |
| readFile()             | Asynchronous | No                  | Callback Result |
| fs/promises.readFile() | Asynchronous | No                  | Promise         |

---

# Best Practices

### Avoid

```javascript
fs.readFileSync()
```

for production applications because it blocks the event loop.

### Prefer

```javascript
import fs from "node:fs/promises";
```

and use:

```javascript
await fs.readFile();
```

because it provides cleaner and more maintainable code.

---

# Key Takeaways

1. `fs` is a built-in Node.js module for file operations.
2. Most methods exist in both synchronous and asynchronous versions.
3. `readFileSync()` blocks the main thread and should generally be avoided.
4. `readFile()` is asynchronous and uses callbacks.
5. `node:fs/promises` provides Promise-based asynchronous methods.
6. Promise-based APIs work better with `async/await`.
7. Without encoding, file contents are returned as a Buffer.
8. Providing an encoding such as `"utf-8"` returns a human-readable string.
9. For modern Node.js applications, `node:fs/promises` is usually the preferred approach.
