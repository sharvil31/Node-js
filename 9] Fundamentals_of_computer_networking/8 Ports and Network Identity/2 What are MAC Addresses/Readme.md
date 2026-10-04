# 🌐 MAC Addresses (Media Access Control)

This document explains **MAC Addresses**, their formats, and their role in computer networks.

---

## 📌 What is a MAC Address?

- **MAC** stands for **Media Access Control**
- A MAC address is a **48-bit unique identifier** assigned to a device’s **Network Interface Card (NIC)**
- It is **hardware-based** and usually **permanent**
- Because MAC addresses uniquely identify devices, leaking them can lead to:
  - Device tracking
  - MAC spoofing
  - Unauthorized network access

---

## 🧾 MAC Address Formats

MAC addresses are written in **hexadecimal (0–9, A–F)** and can be represented in multiple formats.

### Colon-separated
`00:1A:2B:3C:4D:5E`


### Dot-separated
`001A.2B3C.4D5E`


### Hyphen-separated
`00-1A-2B-3C-4D-5E`


> ✅ All formats represent the **same MAC address**

---

## 🏠 Role of MAC Address in LAN

- MAC addresses help **identify devices within a Local Area Network (LAN)**
- Routers and switches:
  - Detect devices using MAC addresses
  - Assign and track IP addresses using **ARP (Address Resolution Protocol)**
- All **local communication** happens using MAC addresses

---

## 🔄 MAC Address vs IP Address

| Feature | MAC Address | IP Address |
|-------|------------|-----------|
| Network Scope | LAN | Internet |
| Type | Hardware-based | Software-based |
| Changeable | Mostly No | Yes |
| Identifies | Device | Device location |

---

## 📝 Summary

- MAC Address → **Permanent hardware identity**
- Used for **local network communication**
- IP Address → **Logical address**
- Used for **global internet communication**

---