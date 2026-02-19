# 📦 Different Module Types in Node.js

> **Note:** Module *types* and module *systems* are two different concepts — don't confuse them!

---

## 🗂️ User Modules

In Node.js, every file is treated as a **module**. Any file you create yourself — such as `app.js`, `math.js`, `utils.js` — is called a **user module**.

```js
// math.js — a user module
export function add(a, b) {
  return a + b;
}
```

```js
// app.js — importing a user module
import { add } from "./math.js";

console.log(add(2, 3)); // 5
```

---

## ⚙️ Native / Core Modules

**Native modules** (also called **core modules**) are modules that come **built into Node.js**. You don't need to install them or provide a file path — Node.js ships with them.

**Common examples:**

| Module   | Purpose                          |
|----------|----------------------------------|
| `fs`     | File system operations           |
| `http`   | Creating HTTP servers            |
| `https`  | Creating HTTPS servers           |
| `path`   | File path utilities              |
| `os`     | Operating system information     |
| `events` | Event-driven programming         |

```js
// Importing a native module
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
```

---

## ✅ Convention: Use the `node:` Prefix

It is **best practice** to prefix native module names with `node:` when importing them.

```js
// ✅ Recommended
import fs from "node:fs";

// ⚠️ Works, but not recommended
import fs from "fs";
```

### Why?

- Makes it **immediately clear** the module is native to Node.js
- Helps **differentiate** native modules from user-created or third-party (npm) modules
- Improves **readability** and maintainability in larger projects
- Avoids potential **naming conflicts** with npm packages

---

## 🔑 Quick Summary

| Type          | Created By | Needs Installation? | Example              |
|---------------|-----------|---------------------|----------------------|
| User Module   | You        | No                  | `./math.js`          |
| Native Module | Node.js    | No                  | `node:fs`, `node:http` |
| Third-party   | npm        | Yes (`npm install`) | `express`, `lodash`  |

---

> 💡 **Tip:** There's also a third category — **third-party modules** — installed via `npm`. These are covered separately under the Node.js module system.