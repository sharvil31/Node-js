# Domain Name System (DNS)

The **Domain Name System (DNS)** is a hierarchical system that translates **human-readable domain names** into **IP addresses**, allowing browsers to locate servers on the internet.

---

## What is DNS?

Computers communicate using IP addresses (e.g., `142.250.182.14`), but humans find domain names easier to remember (e.g., `google.com`). DNS acts like the **phonebook of the internet**, mapping domain names to IP addresses.

---

## Parts of a Domain Name

Example:

```
www.google.com
```

A domain name is read **from right to left** and consists of the following parts:

### 1. Root Domain (`.`)

* The highest level in the DNS hierarchy
* Represented by a dot (`.`)
* Not typed by users, but browsers automatically add it

### 2. Top-Level Domain (TLD)

* Comes directly under the root domain
* Examples:

  * `.com`
  * `.org`
  * `.net`
  * `.in`

### 3. Second-Level Domain (SLD)

* Registered name under a TLD
* Usually represents a company, brand, or organization
* Example: `google`

### 4. Subdomain (Third-Level Domain)

* Comes under the SLD
* Used to organize different services or sections
* Example: `www`, `mail`, `docs`

> **Note:** `www` is optional and is just a common subdomain, not a requirement.

---

## DNS Hierarchy Structure

The DNS follows a tree-like hierarchical structure:

```
Root (.)
 └── TLD (com)
     └── SLD (google)
         └── Subdomain (www)
```

### Hierarchy Rules

* SLD comes under TLD
* TLD comes under the Root Domain
* Subdomain comes under SLD

Each level helps DNS resolve the domain name step-by-step to finally find the **IP address** of the server.

---

## Key Points

* Dots (`.`) act as separators between domain levels (except the last root dot)
* DNS resolution happens from **right to left**
* DNS makes the internet user-friendly by hiding complex IP addresses

---

## Example Breakdown

| Part      | Value    | Description                |
| --------- | -------- | -------------------------- |
| Root      | `.`      | Root of DNS hierarchy      |
| TLD       | `com`    | Top-Level Domain           |
| SLD       | `google` | Registered domain name     |
| Subdomain | `www`    | Service/section identifier |

---

## Summary

DNS is a critical part of how the internet works. It provides a structured and scalable way to convert domain names into IP addresses using a hierarchical system of Root → TLD → SLD → Subdomain.

---