## What is a Firewall?

A **Firewall** is a network security system that monitors **incoming and outgoing network traffic** based on predefined security rules.  
It can be implemented as **hardware or software** and works like a **security guard** for your device or network.

---

## Types of Network Traffic

There are **two types of traffic** handled by a firewall:

### 1. Inbound Traffic
- Requests **coming into** your device from outside
- Example: Someone trying to access your system or server

### 2. Outbound Traffic
- Requests **going out** from your device to the internet
- Example: Opening a website or sending a request to an API

---

## Default Firewall Behavior

- 🚫 **Inbound traffic is blocked by default**  
  (To protect your system from unauthorized access)

- ✅ **Outbound traffic is allowed by default**  
  (That’s why we can freely browse the internet)

➡️ Every request you make first passes through the **Firewall**.  
If the firewall allows it, the request goes to the **router** and then to the internet.

---

### Firewall Filters Based On

A firewall can filter traffic using:
- IP Address (source / destination)
- Port number
- Protocol (TCP, UDP, ICMP)
- Application or program
- Domain or website
- Network profile (Public / Private)

---

### Firewall Profiles (Windows)

- **Public** – Strict rules (coffee shop, airport)
- **Private** – Relaxed rules (home network)
- **Domain** – Used in organizations

---

## Summary

- Firewall protects your system from unauthorized access
- Controls traffic using security rules
- Acts as the first line of defense in network security