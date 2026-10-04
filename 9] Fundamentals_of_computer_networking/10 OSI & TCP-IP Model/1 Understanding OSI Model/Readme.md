# Understanding the OSI Model

The **OSI Model (Open Systems Interconnection Model)** is a conceptual framework used to understand how data is transmitted over a network.  
It divides networking tasks into **7 layers**, making communication easier to design, understand, and troubleshoot.

> ⚠️ The OSI model is not mandatory to follow strictly. It is a **general guideline**, not an implementation rule.

---

## Why OSI Model?

- To divide complex networking tasks into smaller responsibilities
- To standardize communication between different systems
- To help in debugging and troubleshooting network issues

---

## OSI Model Layers (Top → Bottom)

7. Application Layer  
6. Presentation Layer  
5. Session Layer  
4. Transport Layer  
3. Network Layer  
2. Data Link Layer  
1. Physical Layer  

---

## Layer-wise Explanation

### 7️⃣ Application Layer
- Acts as an interface between the **user and the network**
- Provides network services to applications
- Displays data in **human-readable form**
- Examples: HTTP, FTP, SMTP, DNS

---

### 6️⃣ Presentation Layer
- Ensures data is understandable between systems
- Performs:
  - Encryption / Decryption
  - Compression / Decompression
  - Serialization
  - Data translation

---

### 5️⃣ Session Layer
- Establishes, manages, and terminates sessions
- Maintains synchronization between devices
- ❌ No operations are performed on data itself

---

### 4️⃣ Transport Layer
- Breaks data into **segments**
- Adds **port numbers** to identify applications
- Supports:
  - **TCP** (reliable, connection-oriented)
  - **UDP** (fast, connectionless)
- Uses:
  - Source Port
  - Destination Port

---

### 3️⃣ Network Layer
- Adds **IP addresses** to segments
- Includes:
  - Source IP Address
  - Destination IP Address
- Responsible for **routing**
- Data unit is called a **Packet**

---

### 2️⃣ Data Link Layer
- Adds **MAC addresses** to packets
- Includes:
  - Source MAC Address
  - Destination MAC Address
- Data unit becomes a **Frame**
- Responsible for **hop-to-hop delivery**

---

### 1️⃣ Physical Layer
- Converts frames into **physical signals**
- Signals can be:
  - Electrical
  - Optical
  - Wireless (Wi-Fi)
- Handles cables, voltages, and raw bits

---

## Encapsulation (Sender Side)

- Data moves from **Layer 7 → Layer 1**
- Each layer adds its own header
- Final output becomes a physical signal
- This process is called **Encapsulation**

---

## Router Role (Important)

- Router mainly works at:
  - **Layer 3 (Network Layer)**
- Uses **IP addresses** to route data

### What changes at each hop?
- **Frame (Layer 2)** → Changes at every hop
- **Packet (Layer 3)** → Remains the same (except TTL)

This is called **Hop-to-Hop Delivery**.

---

## Decapsulation (Receiver Side)

- Data moves from **Layer 1 → Layer 7**
- Steps:
  1. Physical Layer receives signal
  2. Data Link Layer checks MAC address
  3. Network Layer checks IP address
  4. Transport Layer checks port number
  5. Presentation Layer decrypts & decompresses
  6. Application Layer displays data

This process is called **Decapsulation**.

---

## Key Terminologies

| Term | Description |
|----|----|
| Segment | Transport Layer data |
| Packet | Network Layer data |
| Frame | Data Link Layer data |
| Encapsulation | Layer 7 → Layer 1 |
| Decapsulation | Layer 1 → Layer 7 |
| Hop-to-Hop | Frame delivery between devices |

---

## Conclusion

The OSI model helps us understand **how data travels**, **how routing works**, and **how different layers collaborate** to deliver information from one device to another.

---