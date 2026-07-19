# Handling Files Using `fs/promises` in Node.js

This example demonstrates how to work with files using the Promise-based File System API (`fs/promises`). Instead of callbacks, it uses `async/await`, making file operations cleaner and easier to manage.

## Code

```javascript
// Handling Files Using Promises

import fs from "fs/promises";

// Open the file in read & write mode
const fileHandle = await fs.open("text.txt", "r+");

// Read first 10 bytes from the file
const buff = await fileHandle.read({
  buffer: Buffer.alloc(10),
});

// Write "Hii" to the file
const { buffer, bytesWritten } = await fileHandle.write(
  Buffer.from("Hii")
);

console.log({ buffer });
console.log({ bytesWritten });

// Close the file
await fileHandle.close();
```

---

## Explanation

### 1. Import `fs/promises`

```javascript
import fs from "fs/promises";
```

This imports the Promise-based File System module, allowing the use of `async/await` instead of callbacks.

---

### 2. Open a File

```javascript
const fileHandle = await fs.open("text.txt", "r+");
```

`fs.open()` returns a **FileHandle** object.

The `"r+"` flag means:

- `r` → Open file for reading.
- `+` → Allow both reading and writing.
- The file **must already exist**.

Other common flags:

| Flag | Description |
|------|-------------|
| `r` | Read only |
| `r+` | Read & Write |
| `w` | Write (creates or truncates file) |
| `w+` | Read & Write (creates/truncates file) |
| `a` | Append |
| `a+` | Read & Append |

---

### 3. Read from the File

```javascript
const buff = await fileHandle.read({
  buffer: Buffer.alloc(10),
});
```

Creates a buffer of 10 bytes and reads data into it.

The returned object contains:

```javascript
{
  bytesRead,
  buffer
}
```

---

### 4. Write to the File

```javascript
const { buffer, bytesWritten } = await fileHandle.write(
  Buffer.from("Hii")
);
```

Writes `"Hii"` into the file.

Returns:

```javascript
{
  buffer,
  bytesWritten
}
```

- `buffer` → Buffer that was written.
- `bytesWritten` → Number of bytes written.

---

### 5. Close the File

```javascript
await fileHandle.close();
```

Always close the file after you're done to free the operating system resources.

`close()` returns a Promise that resolves to `undefined`.

---

## Output

```javascript
{
  buffer: <Buffer 48 69 69>
}

{
  bytesWritten: 3
}
```

---

## Why use `fs/promises`?

- Cleaner syntax with `async/await`
- No callback nesting
- Easier error handling using `try...catch`
- Better readability
- Ideal for modern Node.js applications

## Key Takeaways

- `fs/promises` provides Promise-based file operations.
- `fs.open()` returns a `FileHandle`.
- `read()` reads data into a Buffer.
- `write()` writes strings or Buffers to a file.
- Always close the file using `await fileHandle.close()`.