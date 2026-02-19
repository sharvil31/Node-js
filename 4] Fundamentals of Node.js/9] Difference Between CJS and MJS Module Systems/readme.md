# CJS vs MJS — CommonJS & ES6 Module Systems in Node.js

A concise reference guide covering the key differences between the **CommonJS (CJS)** and **ES Modules (MJS)** systems in Node.js — beyond just syntax.

---

## 📦 CommonJS (CJS)

| # | Feature | Detail |
|---|---------|--------|
| 1 | **Loading** | Synchronous — blocks the event loop until the module is fully loaded |
| 2 | **File Extension** | Optional — Node auto-resolves `.js`, `.json`, `.node` |
| 3 | **Convention** | Use `.cjs` extension when CJS and ESM coexist in one project |
| 4 | **Default in Node.js** | Yes — no configuration needed in `package.json` |
| 5 | **`this` keyword** | Points to `module.exports` by default |
| 6 | **Hoisting** | `require()` is NOT hoisted — runs wherever it is placed (even inside conditionals/loops) |
| 7 | **Top-level `await`** | ❌ Not supported |
| 8 | **Exports** | `module.exports` is a single value, but can be an object with multiple properties |
| 9 | **File/Dir name** | `__filename` and `__dirname` |
| 10 | **Strict Mode** | ❌ Disabled by default |

```js
// CJS Example
const fs = require('fs')

module.exports = { add, subtract }
```

---

## 🚀 ES Modules (MJS / ESM)

| # | Feature | Detail |
|---|---------|--------|
| 1 | **Loading** | Asynchronous — uses a 3-phase process: *construct → instantiate → evaluate* |
| 2 | **File Extension** | Mandatory — only `.js` (with `"type": "module"`) or `.mjs` |
| 3 | **Convention** | Use `.mjs` extension when CJS and ESM coexist in one project |
| 4 | **Setup in Node.js** | Requires `"type": "module"` in `package.json` |
| 5 | **`this` keyword** | `undefined` at the top level |
| 6 | **Hoisting** | `import` statements ARE hoisted — always execute before any other code |
| 7 | **Top-level `await`** | ✅ Supported |
| 8 | **Exports** | Multiple named exports supported natively |
| 9 | **File/Dir name** | `import.meta.filename` and `import.meta.dirname` *(Node.js v21.2.0+)* |
| 10 | **Strict Mode** | ✅ Enabled by default |

```js
// ESM Example
import fs from 'fs'

export const add = (a, b) => a + b
export const subtract = (a, b) => a - b
```

---

## ⚠️ Important Clarifications

### Multiple Exports in CJS
You **can** export multiple values in CJS — `module.exports` is a single value, but that value can be an object:
```js
module.exports = { add, subtract, multiply }
```

### Older Node.js — `import.meta.filename` / `import.meta.dirname`
`import.meta.filename` and `import.meta.dirname` require **Node.js v21.2.0+**. For older versions:
```js
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
```

### ESM Loading — 3 Phases
ESM doesn't just "load asynchronously." It follows a structured process:
1. **Construction** — Find, fetch, and parse all modules
2. **Instantiation** — Link all exported/imported bindings
3. **Evaluation** — Execute the code

This enables static analysis, tree-shaking, and circular dependency handling.

---

## 🆚 Quick Comparison

| Feature | CJS | ESM |
|---------|-----|-----|
| Loading | Synchronous | Asynchronous |
| `require()` / `import` hoisted? | ❌ | ✅ |
| Top-level `await` | ❌ | ✅ |
| Strict mode default | ❌ | ✅ |
| Tree-shakeable | ❌ | ✅ |
| Default in Node.js | ✅ | Needs config |
| Dynamic imports | ✅ (anywhere) | ✅ (`import()`) |

---

## 📁 File Extension Convention

```
project/
├── package.json         ← set "type": "module" for ESM default
├── utils.cjs            ← explicitly CommonJS
├── utils.mjs            ← explicitly ES Module
└── index.js             ← follows package.json "type"
```

---

## 📚 References

- [Node.js Docs — Modules: CommonJS](https://nodejs.org/api/modules.html)
- [Node.js Docs — ECMAScript Modules](https://nodejs.org/api/esm.html)
- [MDN — JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)