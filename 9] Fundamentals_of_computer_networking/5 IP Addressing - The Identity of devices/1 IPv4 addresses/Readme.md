# IPv4 Address & Subnetting Basics

This document explains the fundamentals of **IPv4 addressing**, **binary representation**, **IP classes**, and **subnet masks** in a simple and beginner‑friendly way.

---

## What is an IPv4 Address?

* An **IPv4 address** is assigned to devices that want to communicate over an IP‑based network (LAN or Internet).
* Without an IPv4 address, a device **cannot communicate on the Internet**.

---

## IPv4 Structure

* IPv4 is a **32‑bit number**.
* It is divided into **4 groups (octets)**.
* Each octet contains **8 bits**.
* Octets are separated by dots (`.`).

Example:

```
192.168.0.1
```

* Each 8‑bit octet can represent values from **0 to 255**.
* So the full IPv4 range is:

```
0.0.0.0  →  255.255.255.255
```

---

## Binary Representation

Each bit in an octet has a positional value (powers of 2):

```
2^7  2^6  2^5  2^4  2^3  2^2  2^1  2^0
128  64   32   16   8    4    2    1  

if we add them sum will be 255
```

### Logic: How Decimal to Binary Conversion Works

To convert a **decimal number to binary**:

1. Start from the **largest power of 2 (128)**.
2. Check if the number can subtract that value.
3. If **yes**, write `1` and subtract it.
4. If **no**, write `0` and move to the next power.
5. Continue until you reach `2^0`.

---

### Example: Convert 168 to Binary

Start with 168:

| Power of 2 | Value | Can subtract?        | Bit |
| ---------- | ----- | -------------------- | --- |
| 2^7        | 128   | Yes (168 − 128 = 40) | 1   |
| 2^6        | 64    | No                   | 0   |
| 2^5        | 32    | Yes (40 − 32 = 8)    | 1   |
| 2^4        | 16    | No                   | 0   |
| 2^3        | 8     | Yes (8 − 8 = 0)      | 1   |
| 2^2        | 4     | No                   | 0   |
| 2^1        | 2     | No                   | 0   |
| 2^0        | 1     | No                   | 0   |

So the binary representation becomes:

```
128 64 32 16 8 4 2 1
 1   0  1  0  1 0 0 0
```

Binary value:

```
10101000
```

---

## IPv4 Classes

IPv4 addresses were originally divided into classes:

| Class   | Range                       |
| ------- | --------------------------- |
| Class A | 1.0.0.0 – 126.255.255.255   |
| Class B | 128.0.0.0 – 191.255.255.255 |
| Class C | 192.0.0.0 – 223.255.255.255 |
| Class D | 224.0.0.0 – 239.255.255.255 |
| Class E | 240.0.0.0 – 255.255.255.255 |

### Notes:

* **Class D** → Multicast
* **Class E** → Experimental / Reserved
* **127.x.x.x** → Loopback addresses

---

## Subnet Mask

A **subnet mask** divides an IPv4 address into:

* **Network portion**
* **Host portion**

Example:

```
IP Address:   192.168.0.10
Subnet Mask:  255.255.255.0
```

### Binary Form of Subnet Mask

```
11111111.11111111.11111111.00000000
```

* `1s` → Network portion
* `0s` → Host portion

---

## Network & Host Portion

* All devices in the **same network** share the same network portion.
* The host portion is unique for every device.

Example:

```
192.168.0.1
192.168.0.2
192.168.0.3
```

Network part: `192.168.0`

---

## Number of Devices in a Subnet

For subnet mask `255.255.255.0`:

* Host bits = 8
* Total addresses = `2^8 = 256`
* Reserved addresses:

  * Network address → `.0`
  * Broadcast address → `.255`

### Usable devices:

```
256 - 2 = 254 devices
```

---

## Subnet Mask Rules

* Subnet mask must have **continuous 1s from the left**.
* Followed by **continuous 0s**.

❌ Invalid:

```
255.0.255.0
```

✅ Valid:

```
255.255.255.0
```

---

## Loopback Address

* The entire range `127.0.0.0 – 127.255.255.255` is reserved for **loopback**.
* Most commonly used:

```
127.0.0.1 → localhost
```

* Used to test networking on the **local machine**.

---

## Summary

* IPv4 is a 32‑bit addressing system.
* It uses binary internally and decimal for human readability.
* Subnet masks define network and host portions.
* Understanding IPv4 is fundamental for networking, backend, DevOps, and cloud computing.

---