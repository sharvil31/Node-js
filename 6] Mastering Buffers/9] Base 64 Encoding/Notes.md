# Base64 Encoding

## What is Base64?

Base64 is an **encoding scheme** that converts **binary data (bytes)** into **ASCII text** using a set of **64 characters**.

> **Important**
>
> Base64 is **not encryption** and **not compression**.
>
> It only changes how data is represented.

---

# Why do we need Base64?

Computers store everything as bytes, but many systems were originally designed to transmit only text.

Examples include:

- HTTP
- JSON
- XML
- HTML
- Email (MIME)
- URLs

Raw binary data may contain control bytes like:

```
00000000
00001010
00001101
11111111
```

These bytes can be interpreted as special control characters by text-based systems.

Instead, we encode binary data into printable ASCII characters.

```
Image
   │
   ▼
Raw Bytes
   │
   ▼
Base64 Encoding
   │
   ▼
iVBORw0KGgoAAAANSUhEUg...
```

Now the data can safely travel through text-based protocols.

---

# Why is it called Base64?

Base64 uses **64 different characters**.

```
ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz
0123456789
+ /
```

Character count:

- 26 Uppercase letters
- 26 Lowercase letters
- 10 Digits
- +
- /

Total = **64 characters**

Each Base64 character represents one value from:

```
0 → 63
```

---

# Why exactly 64 characters?

Because:

```
2^6 = 64
```

One Base64 character stores exactly:

```
6 bits
```

Compare:

```
ASCII Character

8 bits

↓

Base64 Character

6 bits
```

---

# How Base64 Works

Computers store data in bytes.

```
1 byte = 8 bits
```

Base64 does not read data 8 bits at a time.

Instead, it groups the bits into:

```
6-bit chunks
```

---

# Encoding Example

Text:

```
abc
```

ASCII values:

```
a = 97
b = 98
c = 99
```

Binary:

```
01100001
01100010
01100011
```

Combine all bytes:

```
011000010110001001100011
```

Now divide into groups of 6 bits:

```
011000
010110
001001
100011
```

Convert to decimal:

```
24
22
9
35
```

Lookup in Base64 table:

```
24 → Y
22 → W
9  → J
35 → j
```

Final Base64:

```
YWJj
```

---

# Visual Representation

```
abc

↓

01100001 01100010 01100011

↓

011000010110001001100011

↓

011000 010110 001001 100011

↓

24 22 9 35

↓

Y  W  J  j

↓

YWJj
```

---

# Why does Base64 use 3-byte blocks?

Base64 processes input in **3-byte (24-bit)** chunks.

```
3 bytes

↓

24 bits

↓

4 groups of 6 bits

↓

4 Base64 characters
```

Since:

```
24 ÷ 6 = 4
```

---

# Does the input need to be a multiple of 3 bytes?

**No.**

Base64 processes data in **3-byte blocks**, but the input **does not have to be a multiple of 3 bytes**.

If the final block has fewer than 3 bytes, Base64 pads it internally with zero bits and uses `=` characters in the output.

---

# Padding

## 1 Byte

```
A

↓

QQ==
```

Two padding characters.

---

## 2 Bytes

```
Hi

↓

SGk=
```

One padding character.

---

## 3 Bytes

```
abc

↓

YWJj
```

No padding.

---

# Why does Base64 increase size?

Original:

```
3 bytes = 24 bits
```

Encoded:

```
4 ASCII characters

↓

4 × 8 = 32 bits
```

Increase:

```
32 / 24 = 1.333...

≈ 33%
```

Base64 increases the size of data by approximately **33%**.

---

# btoa() and atob()

JavaScript provides two browser APIs for Base64.

## btoa()

Binary TO ASCII

Encodes a string into Base64.

```javascript
const encoded = btoa("abc");

console.log(encoded);

// YWJj
```

---

## atob()

ASCII TO Binary

Decodes Base64 back into the original string.

```javascript
const decoded = atob("YWJj");

console.log(decoded);

// abc
```

---

# Limitation of btoa()

`btoa()` only works with **Latin-1 (8-bit)** characters.

Example:

```javascript
btoa("😊")
```

Throws:

```
DOMException:
The string to be encoded contains characters outside of the Latin1 range.
```

---

# Base64 in Node.js

Node.js uses **Buffer** instead.

Encode:

```javascript
const encoded = Buffer
    .from("Hello", "utf8")
    .toString("base64");

console.log(encoded);
```

Decode:

```javascript
const decoded = Buffer
    .from(encoded, "base64")
    .toString("utf8");

console.log(decoded);
```

---

# Common Uses of Base64

- Email Attachments (MIME)
- JSON APIs
- HTTP Basic Authentication
- Data URLs
- Images inside HTML/CSS
- JWT Tokens (Base64URL)
- Binary data transmission

---

# Base64 vs Encryption

| Base64 | Encryption |
|---------|------------|
| Reversible by anyone | Requires a key |
| No security | Provides security |
| Changes representation | Protects data |
| Used for transport | Used for confidentiality |

---

# Key Takeaways

- Base64 is an **encoding scheme**, not encryption.
- Converts binary data into printable ASCII text.
- Uses **64 characters**.
- Every Base64 character represents **6 bits**.
- Processes data in **3-byte (24-bit)** blocks.
- Produces **4 Base64 characters** for every 3 input bytes.
- Uses `=` padding when the final block has fewer than 3 bytes.
- Increases data size by approximately **33%**.
- Browser APIs: `btoa()` and `atob()`.
- Node.js uses `Buffer` for Base64 encoding and decoding.