# Static vs Dynamic IP Address & DHCP

This document explains the difference between **Static and Dynamic IP addresses** and the role of a **DHCP server** in computer networks.

---

## What is an IP Address?

An **IP (Internet Protocol) address** is a unique identifier assigned to a device so it can communicate over a network or the Internet.

---

## Static IP Address

A **Static IP address** is an IP address that **does not change** over time.

### Characteristics:

* Manually configured by the user or network administrator
* Remains fixed unless changed manually
* More control and stability

### Common Use Cases:

* Web servers
* Database servers
* Mail servers
* CCTV cameras
* Network devices (routers, switches)

### Example:

```
IP Address: 192.168.1.50
Subnet Mask: 255.255.255.0
Gateway: 192.168.1.1
```

---

## Dynamic IP Address

A **Dynamic IP address** is an IP address that **can change automatically**.

### Characteristics:

* Assigned automatically
* Provided by a **DHCP server**
* May change when:

  * Lease time expires
  * Device reconnects to the network
  * Router or network restarts

### Common Use Cases:

* Mobile phones
* Laptops
* Tablets
* Home computers

### Example:

```
Today:    192.168.1.12
Tomorrow: 192.168.1.20
```

---

## DHCP Server

### What is DHCP?

**DHCP** stands for **Dynamic Host Configuration Protocol**.

A **DHCP server** automatically provides network configuration to devices, including:

* IP address
* Subnet mask
* Default gateway
* DNS server

In most home networks, the **Wi‑Fi router acts as the DHCP server**.

---

## How DHCP Works (Simple Flow)

1. A device connects to the network
2. It requests an IP address
3. The DHCP server assigns:

   * An available IP address
   * Network configuration details
   * A lease time
4. The device uses the IP until the lease expires

This assigned IP address is called a **dynamic IP address**.

---

## Manual IP Assignment

A device can be manually configured with an IP address. This is known as **Static IP configuration**.

⚠️ Important:

* Manually assigning an IP that is already used by DHCP can cause an **IP conflict**.

---

## Static vs Dynamic IP (Comparison)

| Feature       | Static IP    | Dynamic IP     |
| ------------- | ------------ | -------------- |
| Assigned by   | User / Admin | DHCP Server    |
| IP Changes    | No           | Yes            |
| Configuration | Manual       | Automatic      |
| Stability     | High         | Medium         |
| Common Usage  | Servers      | Client devices |

---

## Key Takeaways

* Static IP addresses are fixed and manually assigned
* Dynamic IP addresses are automatically assigned by DHCP
* DHCP simplifies network management
* Most home and office devices use dynamic IPs

---