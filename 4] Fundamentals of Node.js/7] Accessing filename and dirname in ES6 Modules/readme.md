# Accessing `filename` and `dirname` in ES6 Modules

## `import.meta`

`import.meta` might *look* like accessing a property on an object, but it's actually its own special syntax — a single meta-object provided by the JavaScript runtime. It is **not** a regular property access on `import`.

### Getting `filename` and `dirname`

Inside `import.meta`, there are `filename` and `dirname` properties. You can destructure them directly:

```javascript
const { filename, dirname } = import.meta;
```

You can also add custom properties to `import.meta`:

```javascript
import.meta.a = "Sharvil";
const { filename, dirname, a } = import.meta;
console.log(a); // "Sharvil"
```

---

## `import.meta.dirname` vs `process.cwd()`

These two are **not** the same, and the difference matters.

### `process.cwd()`

Returns the directory from which the **Node.js process was started** — not the directory of the currently executing file.

**Example:**

Suppose you're in `4] Fundamentals of Node.js` and you run:

```bash
node "7] Accessing filename and dirname in ES6 Modules/app.js"
```

`process.cwd()` returns the directory you executed the command **from**:

```
C:\Users\SHARVIL AMBURLE\Documents\node-js\4] Fundamentals of Node.js\
```

It does **not** include the subdirectory where `app.js` actually lives.

---

### `import.meta.dirname`

Always returns the **absolute path of the directory containing the current module file**, regardless of where Node.js was started from.

```
C:\Users\SHARVIL AMBURLE\Documents\node-js\4] Fundamentals of Node.js\7] Accessing filename and dirname in ES6 Modules
```

---

### What about `process.chdir()`?

If you change the working directory at runtime with:

```javascript
process.chdir("./src");
```

`process.cwd()` will now return the new working directory:

```
C:\Users\SHARVIL AMBURLE\Documents\node-js\4] Fundamentals of Node.js\7] Accessing filename and dirname in ES6 Modules\src
```

`import.meta.dirname` stays unchanged — it always points to the module's own directory.

---

## Summary

| | `import.meta.dirname` | `process.cwd()` |
|---|---|---|
| **Returns** | Directory of the current module file | Directory Node.js process was started from |
| **Affected by `process.chdir()`?** | ❌ No | ✅ Yes |
| **Reliable for file paths?** | ✅ Always | ⚠️ Not always |

> **Recommendation:** Use `import.meta.dirname` when you need the path of the current file. Use `process.cwd()` only when you specifically need the process's working directory.