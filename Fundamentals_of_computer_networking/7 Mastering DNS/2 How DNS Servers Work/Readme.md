# How DNS Servers Work

This document explains **how DNS servers resolve a domain name into an IP address**, step by step, in a simple and easy-to-understand way.

---

## What Happens When You Enter a Domain Name?

When you type a domain name (e.g., `www.google.com`) into your browser, a process called **DNS resolution** starts. This process finds the IP address associated with the domain so your browser can connect to the correct server.

---

## Step-by-Step DNS Resolution Process

### 1. DNS Request from Browser

* When a domain name is entered in the browser, the browser sends a **DNS request**
* This request follows the **DNS protocol**
* The request is sent to the **DNS server provided by the Internet Service Provider (ISP)**

---

### 2. ISP DNS Server & Caching

* Each locality or network usually uses a **common DNS server provided by the ISP**
* If the same domain was requested earlier by anyone on the network, the result is stored in the **cache**
* If the domain exists in cache:

  * The IP address is returned **immediately**
  * This makes DNS resolution **faster**

---

### 3. Cache Miss → Request Goes to Root Server

* If the requested domain is **not found in cache**, the process continues
* DNS data is **distributed across multiple servers** worldwide
* The ISP DNS server forwards the request to a **Root DNS Server**

---

### 4. Root Server → TLD Server

* Root servers manage information about **Top-Level Domains (TLDs)**
* Examples of TLDs:

  * `.com`
  * `.org`
  * `.net`
* The **Root Server does not know the actual IP address** of the domain
* It returns the **IP address of the TLD Name Server** (e.g., `.com` server)

---

### 5. TLD Server → Authoritative Name Server

* The ISP DNS server sends a request to the **TLD Name Server**
* The TLD server also does **not store the final IP address**
* Instead, it returns the **IP address of the Authoritative Name Server**

> **Authoritative Name Server** is the server that holds the actual DNS records for a domain

---

### 6. Authoritative Name Server → Final IP Address

* The ISP DNS server sends a final request to the **Authoritative Name Server**
* This server returns the **actual IP address** of the requested domain
* The ISP DNS server:

  * Sends the IP address back to the browser
  * Stores it in cache for future requests

---

## DNS Resolution Flow (Summary)

```
Browser
  ↓
ISP DNS Server (Cache check)
  ↓ (if not found)
Root DNS Server
  ↓
TLD DNS Server (.com, .org, etc.)
  ↓
Authoritative Name Server
  ↓
IP Address returned to Browser
```

---

## Key Points

* DNS uses a **distributed and hierarchical structure**
* Caching improves speed and reduces network load
* Root and TLD servers **guide the request**, but do not store final IP addresses
* Authoritative Name Server provides the **actual IP address**

---

## Summary

DNS resolution is a step-by-step journey that starts from your browser and ends at the authoritative name server. This layered approach makes DNS **scalable, fast, and reliable**, enabling the internet to work smoothly.

---