# Understanding package.json and Semantic Versioning

## What is package.json?

`package.json` is the configuration file of a Node.js project. It contains metadata about the project, installed packages, scripts, project information, and dependency versions.

Example:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "axios": "^1.17.2"
  }
}
```

---

# Scripts

The `scripts` object contains commands that can be executed using npm.

Example:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest"
  }
}
```

Commands:

```bash
npm start
npm run dev
npm test
```

Equivalent execution:

```bash
node app.js
nodemon app.js
jest
```

### Common Scripts

| Script | Purpose                 |
| ------ | ----------------------- |
| start  | Start application       |
| dev    | Development server      |
| build  | Create production build |
| test   | Run tests               |
| lint   | Run linter              |
| format | Format code             |

---

# Dependencies

Dependencies are packages required for the application to run in production.

Example:

```json
{
  "dependencies": {
    "axios": "^1.17.2",
    "express": "^5.1.0"
  }
}
```

Install dependency:

```bash
npm install axios
```

or

```bash
npm i axios
```

### Examples

* Express
* Axios
* React
* Mongoose
* Socket.io

These packages are included when the application is deployed.

---

# DevDependencies

DevDependencies are packages used only during development.

Example:

```json
{
  "devDependencies": {
    "eslint": "^9.0.0",
    "jest": "^30.0.0"
  }
}
```

Install:

```bash
npm install --save-dev eslint
```

or

```bash
npm i -D eslint
```

### Examples

* ESLint
* Prettier
* Jest
* Nodemon
* Webpack
* Vite

These tools help developers but are not required for the application to run.

---

# package-lock.json

`package-lock.json` stores the exact versions of all installed packages and their sub-dependencies.

Purpose:

* Ensures consistent installations across machines.
* Prevents unexpected updates.
* Improves installation speed.

Example:

```json
{
  "dependencies": {
    "axios": {
      "version": "1.17.2"
    }
  }
}
```

---

## Installation Behavior

### Case 1: package-lock.json Exists

```bash
npm install
```

npm installs the exact versions recorded inside `package-lock.json`.

Result:

```text
axios 1.17.2
```

Even if newer versions exist.

---

### Case 2: package-lock.json Does Not Exist

npm reads version ranges from `package.json`.

Example:

```json
{
  "dependencies": {
    "axios": "^1.17.2"
  }
}
```

npm resolves the latest version allowed by the version range.

After installation, npm generates a new `package-lock.json`.

---

# Semantic Versioning (SemVer)

Format:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
1.17.2
```

Breakdown:

```text
1.17.2
│ │  │
│ │  └── PATCH
│ └───── MINOR
└──────── MAJOR
```

---

## PATCH Updates

Example:

```text
1.17.2 → 1.17.3
```

Changes:

* Bug fixes
* Performance improvements
* No breaking changes

---

## MINOR Updates

Example:

```text
1.17.2 → 1.18.0
```

Changes:

* New features
* Backward compatible

---

## MAJOR Updates

Example:

```text
1.17.2 → 2.0.0
```

Changes:

* Breaking changes
* APIs may change
* Existing code may stop working

---

# Version Range Symbols

---

## Caret (^)

Example:

```json
{
  "axios": "^1.17.2"
}
```

Range:

```text
>=1.17.2 <2.0.0
```

Allowed:

```text
1.17.3
1.18.0
1.99.0
```

Not Allowed:

```text
2.0.0
```

### Special Rule for Major Version 0

Example:

```json
{
  "package": "^0.5.2"
}
```

Range:

```text
>=0.5.2 <0.6.0
```

Only patch updates are allowed.

Reason:

Packages with major version `0` are considered unstable.

---

## Tilde (~)

Example:

```json
{
  "axios": "~1.17.2"
}
```

Range:

```text
>=1.17.2 <1.18.0
```

Allowed:

```text
1.17.3
1.17.9
```

Not Allowed:

```text
1.18.0
```

Use when you only want bug-fix updates.

---

## Exact Version

Example:

```json
{
  "axios": "1.17.2"
}
```

Only installs:

```text
1.17.2
```

No automatic updates.

---

## Wildcard (*)

Example:

```json
{
  "axios": "*"
}
```

Meaning:

```text
Any version
```

Usually installs the latest available version.

Use carefully because it can introduce breaking changes.

---

## Greater Than (>)

Example:

```json
{
  "axios": ">1.17.2"
}
```

Meaning:

```text
Any version greater than 1.17.2
```

Allowed:

```text
1.17.3
1.18.0
2.0.0
10.0.0
```

---

## Less Than (<)

Example:

```json
{
  "axios": "<1.17.2"
}
```

Meaning:

```text
Any version lower than 1.17.2
```

Allowed:

```text
1.17.1
1.16.0
0.5.0
```

---

## Greater Than or Equal (>=)

Example:

```json
{
  "axios": ">=1.17.2"
}
```

Meaning:

```text
1.17.2 or higher
```

Allowed:

```text
1.17.2
1.18.0
2.0.0
```

---

## Less Than or Equal (<=)

Example:

```json
{
  "axios": "<=1.17.2"
}
```

Meaning:

```text
1.17.2 or lower
```

Allowed:

```text
1.17.2
1.17.1
1.16.0
```

---

# X Ranges

## Patch Wildcard

```json
{
  "axios": "1.17.x"
}
```

Range:

```text
>=1.17.0 <1.18.0
```

Allowed:

```text
1.17.1
1.17.5
1.17.99
```

---

## Minor Wildcard

```json
{
  "axios": "1.x"
}
```

Range:

```text
>=1.0.0 <2.0.0
```

Allowed:

```text
1.5.0
1.99.0
```

---

# Useful npm Commands

## Initialize Project

```bash
npm init
```

Interactive setup.

---

## Quick Initialize

```bash
npm init -y
```

Creates package.json with default values.

---

## Install Package

```bash
npm install axios
```

or

```bash
npm i axios
```

---

## Install Dev Dependency

```bash
npm i -D nodemon
```

---

## Install All Dependencies

```bash
npm install
```

Reads package.json and package-lock.json.

---

## Uninstall Package

```bash
npm uninstall axios
```

---

## Update Packages

```bash
npm update
```

Updates packages within allowed version ranges.

---

## List Installed Packages

```bash
npm list
```

---

## View Outdated Packages

```bash
npm outdated
```

---

# Best Practices

### Use `^` for most projects

```json
{
  "axios": "^1.17.2"
}
```

Allows non-breaking updates.

---

### Commit package-lock.json

Always commit:

```text
package.json
package-lock.json
```

to version control.

This ensures every developer installs the same dependency tree.

---

### Avoid `*` in production

```json
{
  "axios": "*"
}
```

May install unexpected breaking versions.

---

### Keep Dependencies Updated

Regularly check:

```bash
npm outdated
```

and update safely.

---

# Quick Reference Table

| Symbol     | Meaning                                |
| ---------- | -------------------------------------- |
| `^1.17.2`  | `>=1.17.2 <2.0.0`                      |
| `~1.17.2`  | `>=1.17.2 <1.18.0`                     |
| `1.17.2`   | Exact version                          |
| `*`        | Any version                            |
| `>1.17.2`  | Greater than                           |
| `<1.17.2`  | Less than                              |
| `>=1.17.2` | Greater than or equal                  |
| `<=1.17.2` | Less than or equal                     |
| `1.17.x`   | Any patch version                      |
| `1.x`      | Any minor/patch version within major 1 |

---

# Key Takeaways

1. `package.json` describes the project and dependency ranges.
2. `package-lock.json` locks exact installed versions.
3. `dependencies` are required in production.
4. `devDependencies` are development-only tools.
5. Semantic Versioning follows `MAJOR.MINOR.PATCH`.
6. `^` allows minor and patch updates.
7. `~` allows patch updates only.
8. Exact versions provide maximum stability.
9. Commit `package-lock.json` to ensure reproducible installations.
10. Use `npm outdated` regularly to keep packages up to date.
