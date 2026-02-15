# ES6 Modules in Node.js

A comprehensive guide to understanding and using ES6 modules in Node.js applications.

## Table of Contents

- [Introduction](#introduction)
- [Setup](#setup)
- [Exports](#exports)
- [Imports](#imports)
- [File Extensions](#file-extensions)
- [Key Differences from CommonJS](#key-differences-from-commonjs)
- [Best Practices](#best-practices)

## Introduction

ES6 (ECMAScript 2015) introduced a standardized module system for JavaScript. Node.js has supported ES6 modules since version 12, providing a modern alternative to the traditional CommonJS `require()` syntax.

## Setup

To use ES6 modules in Node.js, you need to configure your project:

**Option 1: Package.json Configuration (Recommended)**
```json
{
  "type": "module"
}
```

**Option 2: Use `.mjs` File Extension**

Files with `.mjs` extension are automatically treated as ES6 modules.

## Exports

ES6 modules support two types of exports: **named exports** and **default exports**.

### Named Exports

Named exports allow you to export multiple values from a module:

```javascript
// math.js
export const PI = 3.14159;
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```

You can also export at the end of the file:

```javascript
const PI = 3.14159;
const add = (a, b) => a + b;

export { PI, add };
```

### Default Exports

Each module can have **one** default export:

```javascript
// calculator.js
const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

export default calculator;
```

Or export directly:

```javascript
export default function calculateSum(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}
```

### Combining Both

You can use both named and default exports in the same module:

```javascript
// utils.js
export const version = '1.0.0';
export const author = 'Your Name';

export default function mainUtility() {
  console.log('Main utility function');
}
```

## Imports

### Importing Named Exports

```javascript
// Import specific named exports
import { PI, add } from './math.js';

// Import with aliases
import { add as sum, subtract as minus } from './math.js';

// Import all named exports
import * as math from './math.js';
console.log(math.PI); // 3.14159
```

### Importing Default Exports

```javascript
import calculator from './calculator.js';
// You can name it anything
import calc from './calculator.js';
```

### Combining Named and Default Imports

```javascript
import mainUtility, { version, author } from './utils.js';
```

### Dynamic Imports

ES6 also supports dynamic imports for lazy loading:

```javascript
async function loadModule() {
  const module = await import('./heavy-module.js');
  module.doSomething();
}
```

## File Extensions

### Extension Requirements

When importing ES6 modules, you **must include the file extension**:

```javascript
// ✅ Correct
import { something } from './module.js';

// ❌ Incorrect (will cause error)
import { something } from './module';
```

### Special Extensions

- **`.mjs`** - Explicitly marks a file as an ES6 module
- **`.cjs`** - Explicitly marks a file as a CommonJS module
- **`.js`** - Interpreted based on `package.json` `"type"` field

## Key Differences from CommonJS

| Feature | CommonJS | ES6 Modules |
|---------|----------|-------------|
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Loading | Synchronous | Asynchronous (static analysis) |
| Execution | Runtime | Compile time |
| Strict Mode | Optional | Always enabled |
| File Extension | Optional | Required |
| Top-level `await` | ❌ Not supported | ✅ Supported |
| `__dirname` / `__filename` | ✅ Available | ❌ Not available* |

*Use `import.meta.url` instead in ES6 modules

## Best Practices

### 1. Be Consistent with Export Styles

Choose either named or default exports as your primary pattern and stick with it across your project.

### 2. Prefer Named Exports

Named exports provide better IDE support and make refactoring easier:

```javascript
// Recommended
export const config = { ... };
export const helper = () => { ... };

// Instead of
export default { config, helper };
```

### 3. Use Descriptive Import Names

```javascript
// Good
import { getUserById, createUser } from './userService.js';

// Avoid
import { a, b } from './userService.js';
```

### 4. Group Imports Logically

```javascript
// External packages
import express from 'express';
import mongoose from 'mongoose';

// Internal modules
import { config } from './config.js';
import { logger } from './utils/logger.js';

// Relative imports
import { helper } from './helper.js';
```

### 5. Avoid Circular Dependencies

ES6 modules handle circular dependencies better than CommonJS, but it's still best to avoid them.

## Example Project Structure

```
my-project/
├── package.json          # { "type": "module" }
├── src/
│   ├── index.js         # Entry point
│   ├── config.js        # Configuration
│   ├── utils/
│   │   ├── logger.js
│   │   └── helpers.js
│   └── services/
│       └── userService.js
```

## Migration from CommonJS

If you're migrating from CommonJS to ES6 modules:

**Before (CommonJS):**
```javascript
const express = require('express');
const { helper } = require('./utils');
module.exports = app;
```

**After (ES6):**
```javascript
import express from 'express';
import { helper } from './utils.js';
export default app;
```

## Common Pitfalls

1. **Forgetting file extensions** - Always include `.js` in import paths
2. **Mixing module systems** - Don't mix `require()` and `import` in the same file
3. **Missing package.json configuration** - Set `"type": "module"` if using `.js` extension
4. **Using `__dirname`** - Use `import.meta.url` instead in ES6 modules

## Resources

- [Node.js ES Modules Documentation](https://nodejs.org/api/esm.html)
- [MDN Web Docs - JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [ES6 Module Specification](https://tc39.es/ecma262/#sec-modules)