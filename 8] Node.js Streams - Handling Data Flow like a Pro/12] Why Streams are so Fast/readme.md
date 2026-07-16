# Why Are Node.js Streams So Fast?

When working with files in Node.js, streams are significantly faster than repeatedly using methods like `appendFileSync()` or `appendFile()`. Let's understand why.

## Example 1: Using `appendFileSync()`

```js
import fs from "fs";

console.time();

for (let i = 1; i <= 100000; i++) {
  fs.appendFileSync("numbers.txt", `${i} `);
}

console.timeEnd();
```

**Output**

```
~23 seconds
```

---

## Example 2: Using Write Streams

```js
import { createWriteStream } from "fs";

console.time();

const writeStream = createWriteStream("streamNumbers.txt");

for (let i = 1; i <= 100000; i++) {
  writeStream.write(`${i} `);
}

writeStream.end();

writeStream.on("finish", () => {
  console.timeEnd();
});
```

**Output**

```
~400 ms
```

---

# Why Are Streams Much Faster?

## 1. File is opened only once

When using methods like:

- `appendFileSync()`
- `appendFile()`
- `writeFileSync()`
- `writeFile()`

Node.js performs several operations every time you write data.

For each write operation it typically:

1. Finds the file.
2. Opens the file.
3. Writes the data.
4. Closes the file.

If you're writing 100,000 times, these operations are repeated 100,000 times.

```
Open File
Write
Close

Open File
Write
Close

Open File
Write
Close
...
```

Opening and closing a file repeatedly is expensive because it involves communicating with the operating system and disk.

---

## 2. Streams open the file only once

When you call:

```js
const writeStream = createWriteStream("streamNumbers.txt");
```

Node.js opens the file a single time.

Then every call to:

```js
writeStream.write(data);
```

does **not** reopen the file.

Instead, the data is written into the stream's **internal buffer**.

Finally,

```js
writeStream.end();
```

flushes any remaining buffered data to the disk and closes the file.

```
Open File

Write → Buffer
Write → Buffer
Write → Buffer
Write → Buffer

↓

Flush Buffer to Disk

↓

Close File
```

This eliminates thousands of unnecessary file open/close operations.

---

## 3. Streams use an internal buffer

A write stream doesn't immediately write every chunk to disk.

Instead, it stores data inside an **internal memory buffer**.

```
Application
      │
      ▼
Internal Buffer (RAM)
      │
      ▼
Disk
```

Writing to RAM is much faster than writing directly to disk.

---

## 4. Batch writing improves performance

The default `highWaterMark` for a writable file stream is **16 KB**.

As data is written:

- Data accumulates in the buffer.
- Once the buffer reaches approximately **16 KB**, Node.js flushes that chunk to disk.
- This process repeats until all data has been written.

Instead of performing thousands of tiny disk writes, Node.js performs fewer, larger writes.

This significantly reduces disk I/O overhead.

---

## Visual Comparison

### Using `appendFileSync()`

```
Loop

↓

Open File
↓

Write
↓

Close File

↓

Repeat 100,000 times
```

---

### Using Streams

```
Open File (once)

↓

Write → Buffer

↓

Write → Buffer

↓

Write → Buffer

↓

Flush Buffer to Disk

↓

Close File
```

---

# Benefits of Streams

- Open the file only once
- Use an internal buffer in RAM
- Reduce disk I/O operations
- Batch multiple writes together
- Lower CPU and operating system overhead
- Handle very large files efficiently
- Better overall performance

---

## Note

Although `writeStream.write()` often appears to finish immediately, it doesn't necessarily mean the data has already been written to disk.

The data is first placed into the stream's internal buffer.

The stream writes buffered data to disk asynchronously.

To know when **all** data has actually been written, listen for the `finish` event after calling `writeStream.end()`.

```js
writeStream.end();

writeStream.on("finish", () => {
  console.log("All data has been written successfully.");
});
```

---

## Key Takeaway

Streams are faster not because they magically write data faster, but because they:

- avoid repeatedly opening and closing files,
- buffer data in memory,
- batch multiple writes together,
- and greatly reduce expensive disk operations.
