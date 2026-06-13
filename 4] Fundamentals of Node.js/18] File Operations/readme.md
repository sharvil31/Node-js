# Node.js File Operations

This file contains examples of commonly used file system operations using the `fs/promises` module in Node.js.

## Import

```js
import {
  rename,
  copyFile,
  cp,
  unlink,
  rmdir,
  rm,
  writeFile,
  mkdir,
  stat,
  watch
} from "node:fs/promises";
```

---

# 1. Rename a File

Renames a file from one name/path to another.

```js
rename("aot.jpg", "aot1.jpg");
```

---

# 2. Copy a File

Creates a duplicate of an existing file.

```js
copyFile("aot1.jpg", "aot.jpg");
```

---

# 3. Copy a Directory

Copies an entire folder and its contents.

```js
cp("./src", "C:\\Users\\SHARVIL AMBURLE\\Desktop\\src", {
  recursive: true
});
```

### Options

| Option    | Description                             |
| --------- | --------------------------------------- |
| recursive | Required to copy folders and subfolders |

---

# 4. Move a File

Moves a file from one location to another.

```js
rename(
  "./aot.jpg",
  "C:\\Users\\SHARVIL AMBURLE\\Desktop\\aot.jpg"
);
```

> Moving a file is simply renaming it with a different destination path.

---

# 5. Delete a File

Permanently removes a file.

```js
unlink("./aot1.jpg");
```

---

# 6. Delete an Empty Directory

Removes a folder that contains no files.

```js
rmdir("./test");
```

---

# 7. Delete a Non-Empty Directory

Removes a folder and all of its contents.

```js
rm("./src", {
  recursive: true
});
```

---

# 8. Create a File

Creates a new file.

```js
writeFile("test.txt", "");
```

### Parameters

| Parameter | Description       |
| --------- | ----------------- |
| File Name | Name/path of file |
| Data      | Content to write  |

---

# 9. Create a Directory

Creates a new folder.

```js
mkdir("src");
```

---

# 10. Get File Information

Returns detailed metadata about a file.

```js
const stats = await stat(
  "C:\\Users\\SHARVIL AMBURLE\\Documents\\node-js\\4] Fundamentals of Node.js\\18] File Operations\\app.js"
);

console.log(stats);
```

### Common Properties

```js
stats.isFile();
stats.isDirectory();
stats.size;
stats.birthtime;
stats.mtime;
```

| Property      | Description                   |
| ------------- | ----------------------------- |
| size          | File size in bytes            |
| birthtime     | Creation date                 |
| mtime         | Last modified date            |
| isFile()      | Checks if path is a file      |
| isDirectory() | Checks if path is a directory |

---

# 11. Watch a File

Listens for changes made to a file.

```js
watch("test.txt", (eventType) => {
  console.log(eventType);
});
```

### Possible Events

| Event  | Description             |
| ------ | ----------------------- |
| change | File content modified   |
| rename | File renamed or deleted |

---

# Summary

| Operation               | Method        |
| ----------------------- | ------------- |
| Rename File             | `rename()`    |
| Move File               | `rename()`    |
| Copy File               | `copyFile()`  |
| Copy Folder             | `cp()`        |
| Delete File             | `unlink()`    |
| Delete Empty Folder     | `rmdir()`     |
| Delete Non-Empty Folder | `rm()`        |
| Create File             | `writeFile()` |
| Create Folder           | `mkdir()`     |
| File Metadata           | `stat()`      |
| Watch File Changes      | `watch()`     |

---

## Notes

* All methods belong to the `fs/promises` module.
* Most methods return a Promise and should be used with `await`.
* Use `recursive: true` when working with directories containing files and subdirectories.
* `watch()` is useful for detecting file changes during development.
