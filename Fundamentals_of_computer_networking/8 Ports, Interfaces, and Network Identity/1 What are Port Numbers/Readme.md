# Port Numbers

## What Are Port Numbers?

An **IP address** identifies a device on a network. However, a single device can run **multiple network applications** at the same time.  
Port numbers help the system identify **which application** should receive a network request.

---

## Why Port Numbers Are Needed

Suppose three applications are running on your laptop:
- Web server
- Backend API
- Database service

If a request arrives at your laptop’s **IP address**, the system needs a way to decide **which application** should handle it.

👉 This is where **port numbers** come in.

---

## How Port Numbers Work

1. A client sends a request not only to an IP address but also to a **specific port number**.

   **Example:**
   `192.168.0.105:4000`


- `192.168.0.105` → IP address (device)
- `4000` → Port number (application)

2. The IP address and port number are separated by a **colon (:)**.

3. When the laptop receives the request:
- The operating system checks which application is listening on **port 4000**
- The request is forwarded to that application

---

## Port Numbers and Client–Server Communication

- Port numbers allow the system to correctly route **incoming requests**.
- They also help the client:
- Identify which application sent the response
- Send follow-up requests to the correct application

---

## Advantages of Port Numbers

- Allow multiple network applications to run on the same device
- Enable accurate request and response handling
- Prevent conflicts between applications using the same IP address

---

## Summary

- **IP Address** → Identifies the device  
- **Port Number** → Identifies the application on that device  
- **IP + Port** → Complete network endpoint for communication