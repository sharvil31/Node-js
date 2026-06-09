# Understanding How `npx` Searches and Executes Packages

## Introduction

`npx` is a package runner that comes bundled with npm (version 5.2.0 and later). It allows developers to execute Node.js packages without necessarily installing them globally.

### Common Examples

```bash
npx create-react-app my-app
npx create-next-app my-app
npx eslint src/
```

### Why Use `npx`?

- Execute locally installed packages.
- Execute globally installed packages.
- Download and execute packages temporarily.
- Avoid unnecessary global installations.
- Use the correct package version for a project.

---

# How `npx` Resolves Commands

When you run:

```bash
npx <command>
```

`npx` follows a sequence of lookup steps to find and execute the requested command.

---

# Step 1: Search Current Project Dependencies

`npx` first checks the current project.

### What Happens?

1. Searches for a `package.json` file in the current working directory.
2. Checks dependencies and devDependencies.
3. Reads the package's `"bin"` field to determine the executable.

### Example

**package.json**

```json
{
  "dependencies": {
    "eslint": "^9.0.0"
  }
}
```

Command:

```bash
npx eslint .
```

Result:

- `npx` finds ESLint in local dependencies.
- Reads ESLint's `"bin"` configuration.
- Executes the local version.

### Benefits

- Uses project-specific versions.
- Avoids version conflicts between developers.

---

# Step 2: Search `node_modules/.bin`

If the executable exists inside:

```text
node_modules/.bin
```

`npx` executes it directly.

### Example Structure

```text
node_modules/
└── .bin/
    ├── eslint
    ├── vite
    └── tsc
```

Command:

```bash
npx vite
```

Result:

```text
node_modules/.bin/vite
```

is executed.

### Why `.bin` Exists

Whenever a package contains a `"bin"` field, npm automatically creates a shortcut inside:

```text
node_modules/.bin
```

Example:

```json
{
  "bin": {
    "hello": "./index.js"
  }
}
```

Creates:

```text
node_modules/.bin/hello
```

---

# Step 3: Search Global Installations

If the package isn't available locally, `npx` checks globally installed packages.

### Example

Install globally:

```bash
npm install -g cowsay
```

Run:

```bash
npx cowsay "Hello World"
```

Result:

- `npx` finds the global package.
- Executes it.

### Global Locations

#### Linux/macOS

```text
/usr/local/lib/node_modules
```

#### Windows

```text
%AppData%\npm\node_modules
```

---

# Step 4: Search npm Cache

If the package isn't found locally or globally, `npx` checks npm's cache.

### Purpose

Avoid downloading packages repeatedly.

### Common Cache Locations

#### Linux/macOS

```text
~/.npm
```

#### Windows

```text
%AppData%\npm-cache
```

### Example

First execution:

```bash
npx create-react-app my-app
```

Later:

```bash
npx create-react-app another-app
```

`npx` may reuse the cached package instead of downloading it again.

---

# Step 5: Download from npm Registry

If the package cannot be found anywhere, `npx` contacts the npm registry.

### Process

1. Search npm registry.
2. Download package metadata.
3. Download package files.
4. Store package in cache.
5. Execute package.

### Example

```bash
npx create-next-app my-app
```

Prompt:

```text
Need to install the following packages:
create-next-app
Ok to proceed? (y)
```

After confirmation:

- Package is downloaded.
- Executed immediately.
- Stored in cache for future use.

---

# Complete Search Flow

```text
┌─────────────────────┐
│ npx <command>       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Local Dependencies  │
└──────────┬──────────┘
           │ Not Found
           ▼
┌─────────────────────┐
│ node_modules/.bin   │
└──────────┬──────────┘
           │ Not Found
           ▼
┌─────────────────────┐
│ Global Packages     │
└──────────┬──────────┘
           │ Not Found
           ▼
┌─────────────────────┐
│ npm Cache           │
└──────────┬──────────┘
           │ Not Found
           ▼
┌─────────────────────┐
│ npm Registry        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Download & Execute  │
└─────────────────────┘
```

---

# Understanding the `"bin"` Field

The `"bin"` field tells npm which file should be executed as a command-line tool.

Example:

```json
{
  "name": "hello-cli",
  "version": "1.0.0",
  "bin": {
    "hello": "./index.js"
  }
}
```

After installation:

```bash
npm install hello-cli
```

npm creates:

```text
node_modules/.bin/hello
```

Running:

```bash
npx hello
```

actually executes:

```text
./index.js
```

---

# Creating Your Own CLI Tool

## Project Structure

```text
hello-cli/
│
├── package.json
└── index.js
```

## package.json

```json
{
  "name": "hello-cli",
  "version": "1.0.0",
  "bin": {
    "hello": "./index.js"
  }
}
```

## index.js

```javascript
#!/usr/bin/env node

console.log("Hello from custom CLI!");
```

Run:

```bash
npx hello
```

Output:

```text
Hello from custom CLI!
```

---

# Advantages of `npx`

## 1. No Global Installation Required

Instead of:

```bash
npm install -g create-react-app
```

Use:

```bash
npx create-react-app my-app
```

---

## 2. Uses Correct Project Version

```bash
npx eslint .
```

Uses the project's local version of ESLint.

---

## 3. Faster Experimentation

```bash
npx serve
npx nodemon
npx vite
```

Run tools instantly without global installation.

---

## 4. Cleaner System

Reduces unnecessary globally installed packages.

---

# npm vs npx

| npm | npx |
|------|------|
| Installs packages | Executes packages |
| Manages dependencies | Runs commands |
| Updates package.json | Usually does not |
| May require global install | Can run temporary packages |

Example:

### npm

```bash
npm install create-react-app
```

### npx

```bash
npx create-react-app my-app
```

---

# Quick Revision

## Search Order

```text
1. Current Project Dependencies
2. node_modules/.bin
3. Global Installations
4. npm Cache
5. npm Registry
```

## Key Points

- `npx` executes packages.
- Prefers local project packages.
- Uses executables defined in the `"bin"` field.
- Can run packages without permanent installation.
- Downloads packages only when necessary.
- Caches downloaded packages for future use.

---

# One-Line Definition

> `npx` is a Node.js package runner that locates executables in local dependencies, node_modules/.bin, global installations, npm cache, or the npm registry and executes them without requiring permanent global installation.