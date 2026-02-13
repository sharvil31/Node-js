# CommonJS Module System in Node.js

## Overview

CommonJS is the module system traditionally used in Node.js to organize code into reusable files.  
It allows one file to export functionality and another file to import and use it.

---

## require() Function

In Node.js, modules are loaded using the `require()` function.

Example:

```javascript
const product = require("./product");
```

## What require() does internally

When Node.js executes require("./product"), it performs the following steps:

1. Finds the file using the provided path

2. Loads the file into memory

3. Executes the file

4. Returns the value of module.exports

So the execution flow is:

```arduino
File → Executed → module.exports returned → Usable in another file
```
---

## module.exports

Every Node.js file has an object called module.exports.

This object defines what the module exposes to other files.

Example:

```javascript
// product.js
module.exports = {
  name: "Laptop",
  price: 50000
};
```

```javascript
// app.js
const product = require("./product");

console.log(product.name);
console.log(product.price);
```

### Key Concept

require() always returns the value stored in module.exports.

---

## CommonJS vs ES Modules

CommonJS (Traditional Node.js System)

```javascript
const product = require("./product");
module.exports = product;
```
ES Modules (Modern JavaScript)

```javascript
import product from "./product.js";
export default product;
```
---

## Why CommonJS Still Matters

- Many existing Node.js projects use CommonJS

- Node.js originally used CommonJS by default

- Important for understanding how Node.js loads and executes modules

- Frequently seen in backend applications and legacy systems

---

## Summary

- require() loads and executes a module

- module.exports defines what a module exposes

- CommonJS is the traditional Node.js module system

- ES Modules are the modern standard, but CommonJS is still widely used

---