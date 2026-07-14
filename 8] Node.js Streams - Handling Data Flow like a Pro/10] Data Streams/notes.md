# Standard Data Streams in Node.js

Every running program is called a **process**. Whenever we execute a Node.js application, the Operating System creates a process for it.

Every process automatically gets **three standard data streams** that allow it to communicate with the outside world.

These streams are:

- Standard Input (`stdin`)
- Standard Output (`stdout`)
- Standard Error (`stderr`)

Understanding these streams is important because they are the foundation of how command-line applications, pipes, and many Unix/Linux utilities work.

---

# Standard Input (stdin)

`stdin` stands for **Standard Input**.

It is used to receive input from an external source.

By default, when we run a Node.js program from a terminal, `stdin` is connected to the **keyboard**.

In Node.js, it is available through:

```javascript
process.stdin;
```

`process.stdin` is a **Readable Stream**, meaning we can read data from it.

### Example

```javascript
process.stdin.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

Whatever the user types into the terminal becomes available through this stream.

---

# Standard Output (stdout)

`stdout` stands for **Standard Output**.

It is used to display normal program output.

By default, it is connected to the terminal (monitor).

Node.js exposes it through:

```javascript
process.stdout;
```

`stdout` is a **Writable Stream**, meaning we can write data to it.

### Example

```javascript
process.stdout.write("Hello World\n");
```

Everything written to this stream appears in the terminal.

---

# Standard Error (stderr)

`stderr` stands for **Standard Error**.

It is used to display errors, warnings, or diagnostic messages.

Like `stdout`, it is connected to the terminal by default.

Node.js exposes it through:

```javascript
process.stderr;
```

It is also a **Writable Stream**.

### Example

```javascript
process.stderr.write("Something went wrong!\n");
```

Using a separate stream for errors allows them to be handled independently from normal program output.

---

# How Data Flows

Suppose we open the terminal inside VS Code.

The terminal itself is another process started by VS Code.

When we type a command like:

```bash
pwd
```

or

```bash
ls
```

the following happens:

1. The keyboard sends the input.
2. The input enters the process through `stdin`.
3. The process executes the command.
4. The result is written to `stdout`.
5. If an error occurs, it is written to `stderr`.

```
Keyboard
    │
    ▼
 stdin (0)
    │
    ▼
 Process
   │   │
   │   └────────► stderr (2)
   │
   ▼
stdout (1)
   │
   ▼
Terminal
```

---

# Why Learn Standard Streams?

At first, these streams seem simple because they are connected to the keyboard and terminal.

However, they become extremely powerful because they can be redirected.

Instead of sending data to the terminal, we can:

- Write output to a file.
- Read input from a file.
- Send output to another application.
- Build command-line pipelines.
- Process huge amounts of data efficiently.

This is exactly how Unix/Linux command pipelines work.

For example:

```
Application A
stdout
   │
   ▼
stdin
Application B
```

Here:

- Application A produces data.
- Application B consumes that data.

No temporary file is required.

This is one of the biggest reasons streams are so efficient.

---

# File Descriptors (fd)

Every open file and standard stream is assigned a number by the Operating System.

This number is called a **File Descriptor (fd)**.

For every process, the three standard streams always use the same file descriptor numbers.

| Stream | File Descriptor |
| ------ | --------------- |
| stdin  | 0               |
| stdout | 1               |
| stderr | 2               |

These descriptor numbers are reserved by the operating system.

---

# Example

```javascript
import fs from "fs";
import process from "process";

// console.log(process.stdin);
// console.log(process.stdout);
// console.log(process.stderr);

// process.stdout.write("Hello");

// process.stderr.write("Something went wrong");

// const writeStream = fs.createWriteStream("output.txt");

// process.stdin.pipe(writeStream);

console.log(process.stdin.fd);
console.log(process.stdout.fd);
console.log(process.stderr.fd);
```

Output

```
0
1
2
```

---

# What We Learned

- Every Node.js application runs as a process.
- Every process has three standard streams.
- `stdin` receives input.
- `stdout` prints normal output.
- `stderr` prints errors and warnings.
- `stdin`, `stdout`, and `stderr` are available through the `process` object.
- These streams can be redirected to files or other applications.
- Standard streams always use fixed file descriptor numbers:
  - `stdin` → 0
  - `stdout` → 1
  - `stderr` → 2

---

## Conclusion

Understanding standard streams is the first step toward learning how command-line applications work internally.

Many powerful Node.js concepts—such as pipes, child processes, logging, stream redirection, and inter-process communication—are built on top of these three standard streams.

Mastering them makes it much easier to understand how data flows between applications in real-world systems.
