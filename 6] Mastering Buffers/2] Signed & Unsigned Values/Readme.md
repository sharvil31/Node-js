# Signed vs Unsigned Values (Two's Complement)

A binary number is just a sequence of bits.

The **same bits can represent different values** depending on whether they are interpreted as:

- **Unsigned integer**
- **Signed integer (Two's Complement)**

---

## Unsigned Values

Unsigned integers can store **only positive numbers and zero**.

For an 8-bit unsigned integer:

```
00000000 -> 0
00000001 -> 1
00000010 -> 2
...
11111111 -> 255
```

Range:

```
0 to 255
```

Formula:

```
0 → (2^8 - 1)

0 → 255
```

---

## Signed Values (Two's Complement)

Signed integers can store **both positive and negative numbers**.

For an 8-bit signed integer:

```
00000000 -> 0
00000001 -> 1
...
01111111 -> 127

10000000 -> -128
10000001 -> -127
...
11111111 -> -1
```

Range:

```
-128 to 127
```

Formula:

```
-(2^(n-1)) → (2^(n-1) - 1)

For 8 bits:

-128 → 127
```

---

# Important Rule

The bits themselves do **not** tell you whether they are signed or unsigned.

It depends entirely on **how the program interprets them.**

Example:

```
10000000
```

If interpreted as:

Unsigned:

```
128
```

Signed:

```
-128
```

Same bits.

Different interpretation.

---

# Does a signed number always start with 1?

No.

A common misunderstanding is:

> "Signed numbers start with 1."

This is **not true**.

Instead:

- In **signed representation**
    - MSB = 0 → Positive number
    - MSB = 1 → Negative number

Examples:

```
00001010 -> +10

10000001 -> -127

11111111 -> -1
```

So **positive signed numbers also begin with 0.**

---

# Why is the MSB special?

In Two's Complement, the **Most Significant Bit (MSB)** acts as the sign bit.

```
0xxxxxxx → Positive

1xxxxxxx → Negative
```

---

# Finding the Decimal Value of a Negative Number

Suppose we have:

```
10000000
```

Since MSB is 1, it represents a negative number.

To find its magnitude:

Step 1: Flip every bit

```
10000000

↓

01111111
```

Step 2: Add 1

```
01111111

+

00000001

=

10000000
```

Binary:

```
10000000
```

Decimal:

```
128
```

Therefore:

```
10000000 = -128
```

---

Another example:

```
10000001
```

Flip bits:

```
01111110
```

Add 1:

```
01111111
```

Decimal:

```
127
```

Therefore:

```
10000001 = -127
```

---

One more example:

```
11111111
```

Flip bits:

```
00000000
```

Add 1:

```
00000001
```

Decimal:

```
1
```

Therefore:

```
11111111 = -1
```

---

# Positive Numbers

For positive values, signed and unsigned representations are identical.

Examples:

```
Binary      Signed      Unsigned

00000000       0             0

00000101       5             5

01111111     127           127
```

No difference exists because the MSB is 0.

---

# When do Signed and Unsigned Differ?

They differ whenever the MSB becomes 1.

Examples:

| Binary | Unsigned | Signed |
|---------|---------:|-------:|
|10000000|128|-128|
|10000001|129|-127|
|10000010|130|-126|
|11110001|241|-15|
|10010110|150|-106|
|11111111|255|-1|

---

# Why is the Signed Range Not Symmetric?

Notice:

```
Positive:

0 → 127
```

Negative:

```
-128 → -1
```

There is one extra negative number.

Why?

Because:

```
00000000

already represents zero.
```

If +128 also existed, we would need another bit.

Instead, Two's Complement uses that extra pattern to represent:

```
-128
```

---

# Largest and Smallest Values

### Unsigned (8-bit)

Minimum:

```
0
```

Maximum:

```
255
```

---

### Signed (8-bit)

Largest positive:

```
01111111

= 127
```

Smallest (most negative):

```
10000000

= -128
```

Largest negative:

```
11111111

= -1
```

---

# Comparing Negative Numbers

Remember:

```
-1  >  -5

-5  >  -10

-10 > -100
```

Therefore:

```
-128

is the smallest signed value.

NOT the largest.
```

Similarly:

```
-1

is the largest negative number because it is closest to zero.
```

---

# Summary

### Unsigned (8 bits)

```
Range:

0 → 255
```

### Signed (Two's Complement)

```
Range:

-128 → 127
```

### MSB

```
0 → Positive

1 → Negative
```

### Same Binary, Different Meaning

```
10000000

Unsigned:

128

Signed:

-128
```

The bits never change.

Only their interpretation changes.