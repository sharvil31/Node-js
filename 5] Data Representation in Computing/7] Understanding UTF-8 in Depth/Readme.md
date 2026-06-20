# UTF-8 Encoding Explained in Detail

## What is UTF-8?

UTF-8 (Unicode Transformation Format - 8-bit) is the most widely used character encoding standard in the world.

It is designed to represent every character defined in Unicode while remaining fully compatible with ASCII.

UTF-8 is a **variable-length encoding**, meaning different characters can use different numbers of bytes:

- 1 byte for common ASCII characters
- 2 bytes for extended characters
- 3 bytes for most world languages
- 4 bytes for emojis and special symbols

---

# Why Do We Need UTF-8?

Before Unicode, different countries used different character encodings.

Examples:

- ASCII → English
- ISO-8859-1 → Western Europe
- Shift-JIS → Japanese
- GB2312 → Chinese

Problems:

- Files created on one system often displayed incorrectly on another.
- Multiple encodings could represent the same byte differently.
- Difficult to exchange data globally.

Unicode solved this by assigning every character a unique code point.

Example:

| Character | Unicode |
| --------- | ------- |
| A         | U+0041  |
| €         | U+20AC  |
| ह         | U+0939  |
| 😀        | U+1F600 |

UTF-8 is one way to store those Unicode code points as bytes.

---

# Unicode vs UTF-8

Many developers confuse these terms.

## Unicode

Unicode is a character set.

Example:

| Character | Code Point |
| --------- | ---------- |
| A         | U+0041     |
| B         | U+0042     |
| 😀        | U+1F600    |

Unicode only defines the number.

It does not define how that number is stored.

---

## UTF-8

UTF-8 is an encoding scheme.

It converts Unicode code points into bytes.

Example:

| Character | Unicode | UTF-8 Bytes |
| --------- | ------- | ----------- |
| A         | U+0041  | 41          |
| €         | U+20AC  | E2 82 AC    |
| 😀        | U+1F600 | F0 9F 98 80 |

---

# UTF-8 Byte Structure

UTF-8 uses special bit patterns.

## 1 Byte Character

Pattern:

```text
0xxxxxxx
```

Uses:

```text
U+0000 → U+007F
```

Available bits:

```text
7 bits
```

Example:

```text
A = U+0041
```

Binary:

```text
01000001
```

---

## 2 Byte Character

Pattern:

```text
110xxxxx 10xxxxxx
```

Uses:

```text
U+0080 → U+07FF
```

Available bits:

```text
11 bits
```

Example:

```text
¢ = U+00A2
```

UTF-8:

```text
11000010 10100010
```

---

## 3 Byte Character

Pattern:

```text
1110xxxx 10xxxxxx 10xxxxxx
```

Uses:

```text
U+0800 → U+FFFF
```

Available bits:

```text
16 bits
```

Example:

```text
€ = U+20AC
```

UTF-8:

```text
11100010 10000010 10101100
```

---

## 4 Byte Character

Pattern:

```text
11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
```

Uses:

```text
U+10000 → U+10FFFF
```

Available bits:

```text
21 bits
```

Example:

```text
😀 = U+1F600
```

UTF-8:

```text
11110000 10011111 10011000 10000000
```

---

# How UTF-8 Determines Character Length

The first byte tells us how many bytes belong to the character.

| Prefix | Bytes |
| ------ | ----- |
| 0      | 1     |
| 110    | 2     |
| 1110   | 3     |
| 11110  | 4     |

Examples:

```text
0xxxxxxx
```

Means:

```text
1-byte character
```

---

```text
110xxxxx
```

Means:

```text
2-byte character
```

---

```text
1110xxxx
```

Means:

```text
3-byte character
```

---

```text
11110xxx
```

Means:

```text
4-byte character
```

---

# Continuation Bytes

All continuation bytes start with:

```text
10xxxxxx
```

This helps UTF-8 identify where characters begin and end.

Example:

```text
11100010 10000010 10101100
```

First byte:

```text
1110
```

means:

```text
3-byte character
```

Remaining bytes:

```text
10xxxxxx
10xxxxxx
```

are continuation bytes.

---

# UTF-8 Encoding Process (Step-by-Step)

Let's encode the Euro sign (€).

Unicode:

```text
U+20AC
```

Convert to binary:

```text
0010 0000 1010 1100
```

Since it needs 16 bits:

```text
3-byte UTF-8 format
```

Template:

```text
1110xxxx 10xxxxxx 10xxxxxx
```

Fill bits:

```text
0010 0000 1010 1100
```

Result:

```text
11100010 10000010 10101100
```

Hex:

```text
E2 82 AC
```

---

# UTF-8 Encoding Example (Emoji)

Emoji:

```text
😀
```

Unicode:

```text
U+1F600
```

Binary:

```text
0001 1111 0110 0000 0000
```

Needs:

```text
21 bits
```

Template:

```text
11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
```

Fill bits:

```text
11110000
10011111
10011000
10000000
```

Hex:

```text
F0 9F 98 80
```

---

# Why UTF-8 Became Popular

## 1. Backward Compatible with ASCII

ASCII:

```text
A = 65
```

UTF-8:

```text
A = 65
```

No conversion needed.

---

## 2. Saves Space

English text mostly uses ASCII.

Each character uses:

```text
1 byte
```

instead of:

```text
2 or 4 bytes
```

used by other encodings.

---

## 3. Supports Every Language

Examples:

```text
English
हिंदी
中文
日本語
한국어
😀
```

All supported.

---

## 4. Internet Standard

Most websites use UTF-8.

HTML:

```html
<meta charset="UTF-8" />
```

This tells browsers to decode content as UTF-8.

---

# UTF-8 vs UTF-16 vs UTF-32

| Feature           | UTF-8     | UTF-16 | UTF-32 |
| ----------------- | --------- | ------ | ------ |
| Variable Length   | Yes       | Yes    | No     |
| Bytes             | 1-4       | 2-4    | 4      |
| ASCII Compatible  | Yes       | No     | No     |
| Storage Efficient | Excellent | Good   | Poor   |
| Most Used on Web  | Yes       | No     | No     |

---

# Memory Comparison

Text:

```text
Hello
```

UTF-8:

```text
5 bytes
```

UTF-16:

```text
10 bytes
```

UTF-32:

```text
20 bytes
```

---

# Common Interview Questions

### Why is UTF-8 variable-length?

To save storage while supporting all Unicode characters.

---

### Why do continuation bytes start with `10`?

To allow decoders to identify character boundaries.

---

### Is UTF-8 backward compatible with ASCII?

Yes.

ASCII bytes remain exactly the same in UTF-8.

---

### Maximum bytes used by UTF-8?

```text
4 bytes
```

---

### Can UTF-8 represent all Unicode characters?

Yes.

UTF-8 covers:

```text
U+0000 → U+10FFFF
```

---

# Quick Revision

```text
1 Byte  -> 0xxxxxxx

2 Bytes -> 110xxxxx 10xxxxxx

3 Bytes -> 1110xxxx 10xxxxxx 10xxxxxx

4 Bytes -> 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
```

Continuation bytes:

```text
10xxxxxx
```

Remember:

- Unicode defines characters.
- UTF-8 encodes those characters into bytes.
- UTF-8 uses 1–4 bytes.
- ASCII is a subset of UTF-8.
- UTF-8 is the standard encoding used on the web.
