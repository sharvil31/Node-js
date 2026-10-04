# Private IP Address vs Public IP Address & NAT

This document explains the difference between **Private and Public IP addresses**, why both exist, and how **NAT (Network Address Translation)** and **CG-NAT** help devices communicate on the Internet.

---

## Private IP Address

A **Private IP address** is used **inside a local network (LAN)**.

### Key Points:

* Used only within a private network (home, office, campus)
* Not routable on the Internet
* Internet access is **not required** for local communication

### Common Private IP Ranges:

```
10.0.0.0 – 10.255.255.255
172.16.0.0 – 172.31.255.255
192.168.0.0 – 192.168.255.255
```

### Examples of Devices Using Private IPs:

* Laptops
* Mobile phones
* Smart TVs
* Printers

---

## Public IP Address

A **Public IP address** is a **globally unique IP address** used on the Internet.

### Key Points:

* Accessible from anywhere in the world
* Required for Internet communication
* Assigned by an ISP (Internet Service Provider)

### Examples:

* Web servers
* Cloud servers
* ISP routers
* Home routers (in some cases)

---

## Why Do We Have Private and Public IPs?

### Early Internet Situation

* In the early days of the Internet, every device used a **public IP address**.
* As Internet usage grew, the number of connected devices increased rapidly.
* IPv4 has a limited address space (~4.3 billion addresses).

---

### Solution Introduced by IETF

* The **IETF (Internet Engineering Task Force)** reserved certain IP ranges as **private IP addresses**.
* Private IPs are **not routable on the Internet**.
* This allowed multiple networks to reuse the same private IPs.

✔️ This significantly slowed down IPv4 exhaustion.

---

## How Communication Works (Private → Public)

When you open a website from your computer:

```
Your Device → Router → Internet Server
```

### Behind the Scenes:

1. Your device has a **private IP address**
2. The server has a **public IP address**
3. Private IPs cannot directly communicate over the Internet

So a mediator is required.

---

## Role of the Router

* The router connects your **local network** to the **Internet**
* It can communicate with both private and public IPs
* Acts as a **bridge** between your device and the server

Flow:

```
Private Device → Router → Public Server
Public Server → Router → Private Device
```

---

## NAT (Network Address Translation)

### What is NAT?

**NAT (Network Address Translation)** converts:

* Private IP → Public IP (outgoing requests)
* Public IP → Private IP (incoming responses)

This allows:

* Multiple devices to share a single public IP
* Efficient usage of IPv4 addresses

---

## Public IP Cost

* Earlier, ISPs often assigned **one public IP per router** for free
* As IPv4 addresses became scarce:

  * Public IPs became limited
  * ISPs started charging extra for dedicated public IPs

---

## CG-NAT (Carrier Grade NAT)

### Modern Internet Scenario

Today, most ISPs use **CG-NAT**.

Flow:

```
Your Device (Private IP)
   ⇆
Your Router (Private IP from ISP)
   ⇆
ISP Router (Public IP)
   ⇆
Internet Server
```

### Key Characteristics:

* Your router does **not** get a public IP
* ISP’s main router holds the public IP
* Many users share the same public IP

### Limitations of CG-NAT:

* Port forwarding is difficult
* Online gaming issues
* Hosting servers becomes harder

---

## One-Line Summary

> **Private IPs are used inside local networks, public IPs are used on the Internet, NAT enables communication between them, and CG-NAT allows ISPs to conserve IPv4 addresses.**

---