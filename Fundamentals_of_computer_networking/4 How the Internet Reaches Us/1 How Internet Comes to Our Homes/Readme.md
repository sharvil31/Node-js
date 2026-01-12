# 🌐 How Internet Comes to Our Home

This README explains **how the internet reaches our home**, step by step — from the global internet to our devices.

---

## 1️⃣ The Internet (Global Network)

The **Internet** is a huge network of interconnected networks across the world.

* Connected using **undersea fiber-optic cables**, land cables, and satellites
* Links **countries, data centers, and ISPs**

> Think of it as global highways for data.

---

## 2️⃣ Internet Service Provider (ISP)

Homes do **not connect directly** to the global internet.

Instead, we connect through an **ISP (Internet Service Provider)** such as:

* Jio
* Airtel
* BSNL
* ACT

### ISP Responsibilities

* Buys internet from global providers
* Manages routing and bandwidth
* Assigns **public IP addresses**
* Delivers internet to homes

---

## 3️⃣ Internet Backbone → Local ISP Network

The data flow looks like this:

```
Global Internet
   ↓
National Data Centers
   ↓
City ISP Office
   ↓
Local Distribution Point
```

> Similar to highways → city roads → local streets.

---

## 4️⃣ Last-Mile Connection (ISP to Home)

This is the **final physical connection** to your house.

### Common Types

* **Fiber (FTTH)** – very fast & stable
* **Copper / DSL** – slower, uses telephone lines
* **Coaxial Cable** – used by cable providers

---

## 5️⃣ Modem (Internet Entry Point)

The ISP cable connects to a **modem**.

### Modem Functions

* Converts ISP signal to digital data
* Authenticates your connection
* Talks directly with the ISP

> Without a modem, there is no internet access.

---

## 6️⃣ Router (Local Network Manager)

The modem connects to a **Wi‑Fi router**.

### Router Functions

* Creates a **LAN (Local Area Network)**
* Assigns **private IP addresses** using DHCP
* Routes traffic between devices and the internet
* Uses **NAT (Network Address Translation)**

```
Device → Router → Modem → ISP → Internet
```

---

## 7️⃣ Devices Inside Home

Devices such as:

* Mobile
* Laptop
* Tablet
* Smart TV

connect using **Wi‑Fi or LAN cable**.

* Each device gets a **private IP** (e.g., `192.168.1.5`)
* Router maps private IPs to one public IP

---

## 8️⃣ How a Website Opens (Example)

When you open `google.com`:

1. Device requests DNS to get IP address
2. Request goes to router
3. Router → Modem → ISP
4. ISP → Google server
5. Response returns back
6. Webpage loads

⏱ Happens in milliseconds

---

## 🧠 Summary

> Internet reaches our home through an ISP using fiber or cable, enters via a modem, is distributed by a router, and reaches devices through a local network.

---