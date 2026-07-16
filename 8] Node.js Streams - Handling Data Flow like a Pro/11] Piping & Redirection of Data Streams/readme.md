# Piping and Redirection of Data Streams in Node.js

Piping (`|`) and Redirection (`>`, `>>`, `<`, `2>`) are powerful shell features that allow different processes and files to communicate using the standard data streams.

Node.js exposes these streams through the `process` object:

- `process.stdin` → Standard Input
- `process.stdout` → Standard Output
- `process.stderr` → Standard Error

---

# Data Streams

Every process has three standard streams:

| Stream | Description         | Default Connection |
| ------ | ------------------- | ------------------ |
| stdin  | Receives input      | Keyboard           |
| stdout | Sends normal output | Terminal           |
| stderr | Sends error output  | Terminal           |

---

# 1. Piping

Piping connects the **stdout of one process** to the **stdin of another process**.

```
Process A (stdout)
        │
        ▼
      Pipe (|)
        │
        ▼
Process B (stdin)
```

Instead of displaying output on the terminal, it becomes the input of another program.

---

## app.js

```javascript
process.stdin.setEncoding("utf-8");

process.stdin.on("data", (chunk) => {
  console.log("app.js:", chunk);
});
```

This program simply listens to whatever comes through **stdin**.

---

## Reading from the terminal

Run:

```bash
node app.js
```

Type:

```
Hello
```

Output

```
app.js: Hello
```

---

# Using echo with Pipe

Linux provides the `echo` command that prints text to stdout.

```
echo "Hi"
```

Output

```
Hi
```

Now pipe it into Node.js.

```bash
echo "Hi" | node app.js
```

Output

```
app.js: Hi
```

What happens internally?

```
echo
stdout
   │
   ▼
 Pipe (|)
   │
   ▼
node app.js
stdin
```

The output of `echo` becomes the input of `app.js`.

> **Note:** The `echo | node app.js` example works directly in Linux/WSL/macOS terminals. Windows Command Prompt behaves differently.

---

# Another Example

script.js

```javascript
process.stdout.write("Hello from script.js\n");
```

Run

```bash
node script.js | node app.js
```

Output

```
app.js: Hello from script.js
```

Here

```
script.js
stdout
     │
     ▼
 Pipe
     │
     ▼
app.js
stdin
```

---

# stdout vs stderr

Suppose

```javascript
process.stdout.write("stdout message\n");
process.stderr.write("stderr message\n");
```

Run

```bash
node script.js | node app.js
```

Output

```
stderr message
app.js: stdout message
```

Notice:

- stdout is piped
- stderr is NOT piped

Only **stdout** travels through the pipe.

---

## stderr only

```javascript
process.stderr.write("Something went wrong\n");
```

Run

```bash
node script.js | node app.js
```

Output

```
Something went wrong
```

`app.js` receives nothing because there was no stdout.

---

# Why stderr is Separate

Keeping errors separate from normal output allows programs to:

- Pipe only useful data
- Display errors directly to the terminal
- Redirect errors independently

This separation is extremely useful when chaining multiple commands.

---

# 2. Redirection

Redirection sends stream data to or from a file instead of another process.

---

## Redirect stdout

```bash
node script.js > output.txt
```

```
stdout
   │
   ▼
output.txt
```

Instead of printing on the terminal, stdout is written into the file.

---

## Redirect stderr

```bash
node script.js 2> output.txt
```

```
stderr
   │
   ▼
output.txt
```

The `2` represents the stderr stream.

---

## Redirect Both stdout and stderr

```bash
node script.js > output.txt 2> output.txt
```

Both streams are redirected to the same file.

---

## Append stderr

```bash
node script.js > output.txt 2>> output.txt
```

- stdout overwrites the file
- stderr appends to the end

---

## Append Both

```bash
node script.js >> output.txt 2>> output.txt
```

Nothing is overwritten.

Both stdout and stderr are appended.

---

# Input Redirection

Input redirection sends a file as stdin.

Suppose `output.txt` contains

```
Hello Node.js
```

Run

```bash
node app.js < output.txt
```

Output

```
app.js: Hello Node.js
```

Internally

```
output.txt
      │
      ▼
stdin
      │
      ▼
app.js
```

The file behaves exactly like keyboard input.

---

# Common Shell Operators

| Operator | Meaning                     |
| -------- | --------------------------- | ------------------------------ |
| `        | `                           | Pipe stdout to another process |
| `>`      | Redirect stdout (overwrite) |
| `>>`     | Redirect stdout (append)    |
| `2>`     | Redirect stderr (overwrite) |
| `2>>`    | Redirect stderr (append)    |
| `<`      | Read input from a file      |

---

# Visual Summary

### Piping

```
Process A
stdout
   │
   ▼
 Pipe (|)
   │
   ▼
Process B
stdin
```

---

### Output Redirection

```
stdout
   │
   ▼
output.txt
```

---

### Error Redirection

```
stderr
   │
   ▼
error.txt
```

---

### Input Redirection

```
input.txt
    │
    ▼
stdin
    │
    ▼
Node.js Program
```

---

# Key Takeaways

- Every process has three standard streams: stdin, stdout, and stderr.
- Pipes (`|`) connect one process's stdout to another process's stdin.
- Only stdout is piped by default.
- stderr remains separate unless explicitly redirected.
- `>` overwrites a file.
- `>>` appends to a file.
- `2>` redirects stderr.
- `<` uses a file as standard input.
- Piping and redirection are shell features that work seamlessly with Node.js streams.
