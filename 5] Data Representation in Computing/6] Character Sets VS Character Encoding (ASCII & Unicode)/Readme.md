# Character Sets vs Character Encodings (ASCII and Unicode)

## Overview

When working with text in computers, two important concepts are often confused:

1. **Character Set**
2. **Character Encoding**

Understanding the difference between them is essential for software development, databases, networking, APIs, file handling, and internationalization.

---

# Character Set

## Definition

A **Character Set** is a collection of characters that a computer system can represent.

It defines:

* Letters
* Digits
* Symbols
* Punctuation marks
* Emojis
* Characters from various languages

A character set answers the question:

> "What characters are available?"

---

## Examples

### English Character Set

```text
A B C D E F
a b c d e f
0 1 2 3 4 5
! @ # $ % ^
```

### Hindi Characters

```text
अ आ इ ई उ ऊ
क ख ग घ ङ
```

### Chinese Characters

```text
你 好 世 界
```

### Emojis

```text
😀 😊 🚀 ❤️
```

---

# Character Encoding

## Definition

A **Character Encoding** is the method used to convert characters into binary data that computers can store and process.

It answers the question:

> "How are these characters represented in memory?"

Computers understand only:

```text
0s and 1s
```

Therefore, every character must be assigned a numeric value.

---

## Example

Character:

```text
A
```

Stored as:

```text
65 (Decimal)
01000001 (Binary)
```

Encoding determines this conversion.

---

# ASCII

## What is ASCII?

ASCII stands for:

**American Standard Code for Information Interchange**

It is one of the earliest character standards used in computing.

---

## ASCII Characteristics

| Property           | Value   |
| ------------------ | ------- |
| Bits Used          | 7       |
| Total Characters   | 128     |
| Languages          | English |
| Introduced         | 1963    |
| Unicode Compatible | Yes     |

---

## ASCII Character Range

ASCII uses 7 bits:

```text
2^7 = 128 characters
```

Range:

```text
0 - 127
```

---

## ASCII Table Examples

| Character | Decimal | Binary   |
| --------- | ------- | -------- |
| A         | 65      | 01000001 |
| B         | 66      | 01000010 |
| a         | 97      | 01100001 |
| 0         | 48      | 00110000 |
| @         | 64      | 01000000 |

---

## ASCII Control Characters

These characters are not printable.

Examples:

| Character | Meaning         |
| --------- | --------------- |
| LF        | Line Feed       |
| CR        | Carriage Return |
| TAB       | Tab             |
| BEL       | Bell            |

---

## Limitations of ASCII

ASCII supports only English.

Cannot represent:

```text
नमस्ते
你好
مرحبا
😊
€
₹
```

This limitation led to the creation of Unicode.

---

# Unicode

## What is Unicode?

Unicode is a universal character standard designed to represent characters from almost every language and writing system.

Goal:

> One standard for all languages.

---

## Unicode Characteristics

| Property             | Value      |
| -------------------- | ---------- |
| Languages Supported  | Almost all |
| Emoji Support        | Yes        |
| Symbols              | Yes        |
| Mathematical Symbols | Yes        |
| Global Standard      | Yes        |

---

## Unicode Code Points

Every character receives a unique identifier called a **Code Point**.

Format:

```text
U+XXXX
```

Examples:

| Character | Unicode |
| --------- | ------- |
| A         | U+0041  |
| ₹         | U+20B9  |
| 你         | U+4F60  |
| 😀        | U+1F600 |
| 😊        | U+1F60A |

---

## Examples

### English

```text
A → U+0041
```

### Hindi

```text
न → U+0928
```

### Chinese

```text
你 → U+4F60
```

### Emoji

```text
😊 → U+1F60A
```

---

# Unicode Encodings

Unicode defines characters.

Encodings define how those characters are stored.

Popular Unicode encodings:

1. UTF-8
2. UTF-16
3. UTF-32

---

# UTF-8

## Overview

UTF-8 is the most widely used character encoding on the internet.

Characteristics:

* Variable length
* Uses 1–4 bytes
* Backward compatible with ASCII
* Memory efficient

---

## UTF-8 Storage

| Character | Unicode | Bytes |
| --------- | ------- | ----- |
| A         | U+0041  | 1     |
| ₹         | U+20B9  | 3     |
| 你         | U+4F60  | 3     |
| 😊        | U+1F60A | 4     |

---

## Why UTF-8 is Popular

### Advantages

* Saves memory
* Supports all languages
* Compatible with ASCII
* Standard on the web

Most websites today use:

```html
<meta charset="UTF-8">
```

---

# UTF-16

## Overview

UTF-16 uses:

```text
2 or 4 bytes
```

for storing Unicode characters.

Used in:

* Java
* Windows APIs
* Some databases

---

## Characteristics

### Advantages

* Efficient for many languages

### Disadvantages

* Less compact than UTF-8 for English text

---

# UTF-32

## Overview

UTF-32 uses:

```text
4 bytes per character
```

for every Unicode character.

---

## Characteristics

### Advantages

* Simple indexing
* Fixed size

### Disadvantages

* High memory consumption

Example:

```text
A
```

Requires:

```text
4 bytes
```

instead of:

```text
1 byte in UTF-8
```

---

# Relationship Between Character Sets and Encodings

## Character Set

Defines:

```text
What characters exist
```

Example:

```text
A
B
C
😊
你
₹
```

---

## Encoding

Defines:

```text
How those characters are stored
```

Example:

```text
A → 01000001
```

---

# ASCII vs Unicode

| Feature         | ASCII   | Unicode                         |
| --------------- | ------- | ------------------------------- |
| Character Count | 128     | 1,000,000+ possible code points |
| Languages       | English | Almost all languages            |
| Emoji Support   | No      | Yes                             |
| Symbols         | Limited | Extensive                       |
| Global Usage    | Limited | Universal                       |
| Web Standard    | No      | Yes                             |

---

# Real-World Examples

## HTML

```html
<meta charset="UTF-8">
```

---

## Node.js

```javascript
const fs = require("fs");

fs.readFile("file.txt", "utf8", (err, data) => {
  console.log(data);
});
```

---

## JavaScript

```javascript
console.log("₹");
console.log("😊");
console.log("你好");
```

---

## Database

```sql
VARCHAR(255) CHARACTER SET utf8mb4
```

`utf8mb4` supports:

```text
Unicode + Emojis
```

---

# Common Interview Questions

## What is a Character Set?

A collection of characters that can be represented by a computer system.

---

## What is Character Encoding?

A mechanism that converts characters into binary data.

---

## Is ASCII a Character Set or Encoding?

Both.

ASCII defines:

* Characters
* Numeric values

---

## Is Unicode an Encoding?

No.

Unicode is a character set standard.

Encodings include:

* UTF-8
* UTF-16
* UTF-32

---

## Why was Unicode Created?

To support multiple languages and symbols that ASCII cannot represent.

---

## Which Encoding is Most Popular?

UTF-8.

It is the default encoding for most websites and modern applications.

---

# Memory Trick

Think of a library:

## Character Set

List of all books available.

```text
"What books exist?"
```

---

## Character Encoding

Shelf numbering system.

```text
"Where are the books stored?"
```

---

## Example

ASCII:

```text
Small English library
```

Unicode:

```text
Massive worldwide library
```

UTF-8:

```text
Efficient shelf arrangement
```

---

# Quick Revision

### Character Set

Defines:

```text
What characters exist
```

Examples:

```text
ASCII
Unicode
```

---

### Character Encoding

Defines:

```text
How characters are stored
```

Examples:

```text
ASCII Encoding
UTF-8
UTF-16
UTF-32
```

---

### ASCII

* 7 bits
* 128 characters
* English only

---

### Unicode

* Universal standard
* Supports global languages
* Supports emojis

---

### UTF-8

* Most popular encoding
* Uses 1–4 bytes
* Compatible with ASCII
* Standard on the internet

```
```