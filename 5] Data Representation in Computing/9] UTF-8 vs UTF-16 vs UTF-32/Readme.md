# UTF-8 vs UTF-16 vs UTF-32: Understanding Unicode Encodings

## Introduction

When working with text in programming, you'll often hear terms like **Unicode**, **UTF-8**, **UTF-16**, and **UTF-32**. Many developers confuse **Unicode** with **UTF encodings**, but they serve different purposes.

- **Unicode** defines **what** a character is.
- **UTF encodings** define **how** that character is stored as bytes.

This guide explains the differences between UTF-8, UTF-16, and UTF-32 in a simple and practical way.

---

# Unicode vs UTF

Every character has a unique **Unicode code point**.

Example:

| Character | Unicode Code Point |
| --------- | ------------------ |
| A         | U+0041             |
| €         | U+20AC             |
| 😀        | U+1F600            |

The Unicode code point never changes.

Different UTF encodings simply store the same code point differently.

```
Character
     │
     ▼
Unicode Code Point
     │
     ▼
Choose Encoding
     │
     ├── UTF-8
     ├── UTF-16
     └── UTF-32
     │
     ▼
Bytes
```

---

# UTF-8

UTF-8 is a **variable-length encoding**.

A character may occupy **1 to 4 bytes**.

## Encoding Patterns

| Bytes | Pattern                               |
| ----- | ------------------------------------- |
| 1     | `0xxxxxxx`                            |
| 2     | `110xxxxx 10xxxxxx`                   |
| 3     | `1110xxxx 10xxxxxx 10xxxxxx`          |
| 4     | `11110xxx 10xxxxxx 10xxxxxx 10xxxxxx` |

The **first byte tells the decoder how many bytes belong to the character**.

Example:

```
11100010
10000010
10101100
```

The first byte starts with:

```
1110
```

The decoder immediately knows:

> Read **3 bytes**.

---

# How UTF-8 Knows Character Length

UTF-8 is **byte-oriented**.

Algorithm:

```
Read first byte

↓

0xxxxxxx
    ↓
Read 1 byte

110xxxxx
    ↓
Read 2 bytes

1110xxxx
    ↓
Read 3 bytes

11110xxx
    ↓
Read 4 bytes
```

No additional metadata is needed because the first byte contains the length information.

---

# UTF-16

UTF-16 is **not byte-oriented**.

It is based on **16-bit code units**.

A character occupies:

- **2 bytes**
- or **4 bytes** (using surrogate pairs)

Never 1 byte.
Never 3 bytes.

---

# How UTF-16 Knows Character Length

Unlike UTF-8, UTF-16 **always reads 2 bytes first**.

It then checks whether those 16 bits are a surrogate.

### Case 1

```
0041
```

Not a surrogate.

Character complete.

Storage:

```
2 bytes
```

---

### Case 2

```
D83D
```

This falls inside:

```
D800–DBFF
```

which is the **High Surrogate** range.

The decoder now knows:

> Read another 16-bit code unit.

```
D83D DE00
```

Together they represent:

```
😀
```

Storage:

```
4 bytes
```

---

# UTF-16 Decoding Algorithm

```
Read 2 bytes

↓

Is it a High Surrogate?

No
↓

Done

Yes
↓

Read another 2 bytes

↓

Done
```

Notice:

UTF-16 **does not** use prefixes like:

```
110xxxxx
1110xxxx
```

Those belong **only to UTF-8**.

---

# UTF-32

UTF-32 is the simplest encoding.

Every Unicode character occupies exactly **4 bytes**.

No exceptions.

```
A
↓

00000000 00000000 00000000 01000001
```

```
€
↓

00000000 00000000 00100000 10101100
```

```
😀
↓

00000000 00000001 11110110 00000000
```

---

# How UTF-32 Knows Character Length

It doesn't need to.

Algorithm:

```
Read 4 bytes

↓

Done
```

There is no checking.

There are no prefixes.

There are no surrogate pairs.

---

# Storage Comparison

| Character | Unicode |   UTF-8 |  UTF-16 |  UTF-32 |
| --------- | ------- | ------: | ------: | ------: |
| A         | U+0041  |  1 byte | 2 bytes | 4 bytes |
| é         | U+00E9  | 2 bytes | 2 bytes | 4 bytes |
| €         | U+20AC  | 3 bytes | 2 bytes | 4 bytes |
| 你        | U+4F60  | 3 bytes | 2 bytes | 4 bytes |
| 😀        | U+1F600 | 4 bytes | 4 bytes | 4 bytes |

---

# Why UTF-16 Doesn't Need Prefix Bits

UTF-8 must determine where a character ends because it reads one byte at a time.

UTF-16 reads **16-bit code units**, not bytes.

Instead of looking for patterns like:

```
110xxxxx
```

it checks:

```
Is this value between D800 and DBFF?
```

If yes:

Read another 16-bit code unit.

Otherwise:

Character complete.

---

# Why UTF-32 Doesn't Need Any Detection

UTF-32 stores every Unicode code point in exactly **one 32-bit value**.

Every character is always:

```
4 bytes
```

So the decoder simply reads:

```
4 bytes

↓

Character complete
```

---

# Comparison

| Feature          | UTF-8             | UTF-16          | UTF-32         |
| ---------------- | ----------------- | --------------- | -------------- |
| Character Size   | 1–4 bytes         | 2 or 4 bytes    | Always 4 bytes |
| Length Detection | First byte prefix | Surrogate check | Fixed length   |
| ASCII Compatible | ✅ Yes            | ❌ No           | ❌ No          |
| Variable Length  | Yes               | Yes             | No             |
| Random Access    | Hard              | Moderate        | Easy           |
| Memory Usage     | Lowest            | Medium          | Highest        |
| Web Standard     | ✅ Yes            | Rare            | Rare           |

---

# How Decoding Works

## UTF-8

```
Read 1 byte

↓

Check prefix bits

↓

Determine total bytes

↓

Decode character
```

---

## UTF-16

```
Read 2 bytes

↓

Check for surrogate

↓

If surrogate

Read 2 more bytes

↓

Decode character
```

---

## UTF-32

```
Read 4 bytes

↓

Decode character
```

---

# Common Misconceptions

### ❌ UTF-16 uses prefixes like UTF-8

False.

Only UTF-8 uses byte prefixes such as:

```
110xxxxx
1110xxxx
11110xxx
```

---

### ❌ UTF-32 uses 8 bytes for larger characters

False.

Every valid Unicode character fits inside one 32-bit value.

UTF-32 always uses exactly **4 bytes**.

---

### ❌ A character using 2 bytes in UTF-8 must use 3 bytes in UTF-16

False.

Each encoding has its own storage rules.

Example:

| Character | UTF-8   | UTF-16  |
| --------- | ------- | ------- |
| é         | 2 bytes | 2 bytes |
| €         | 3 bytes | 2 bytes |
| 😀        | 4 bytes | 4 bytes |

---

# Which Encoding Should You Use?

| Scenario                 | Recommended Encoding                             |
| ------------------------ | ------------------------------------------------ |
| Websites                 | UTF-8                                            |
| APIs                     | UTF-8                                            |
| JSON                     | UTF-8                                            |
| HTML                     | UTF-8                                            |
| CSS                      | UTF-8                                            |
| Java Strings             | UTF-16                                           |
| Windows APIs             | UTF-16                                           |
| Internal text processing | UTF-32 (when fixed-width indexing is beneficial) |

---

# Key Takeaways

- Unicode defines characters; UTF encodings define how those characters are stored.
- UTF-8 uses **1–4 bytes** and identifies character length using **leading bit patterns**.
- UTF-16 uses **2 or 4 bytes** and determines length by checking for **surrogate pairs**.
- UTF-32 always uses **4 bytes**, making decoding simple but increasing memory usage.
- UTF-8 is the de facto standard for the web because it is compact, ASCII-compatible, and universally supported.

## Final Mental Model

```
Character
     │
     ▼
Unicode Code Point
     │
     ├──────────────┐
     │              │
     ▼              ▼
UTF-8          UTF-16          UTF-32

1–4 bytes      2 or 4 bytes    Always 4 bytes

Prefix Bits    Surrogate Pair  Fixed Length
```
