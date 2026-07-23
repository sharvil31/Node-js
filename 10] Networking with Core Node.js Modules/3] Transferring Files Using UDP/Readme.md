# Creating a UDP Server in Node.js

This project demonstrates how to create a UDP (User Datagram Protocol) server and client using Node.js' built-in `dgram` module. It also shows how a Node.js UDP server can communicate with a mobile device using a UDP Sender/Receiver application.

## What You'll Learn

- What UDP is
- Creating a UDP server
- Creating a UDP client
- Sending UDP packets
- Receiving UDP packets
- Understanding `remoteAddress`
- Sending responses back to the sender
- Communicating with mobile devices over UDP
- Difference between UDP and TCP

---

## Technologies Used

- Node.js
- dgram (Core Node.js Module)

No third-party packages are required.

---

## Project Structure

```
.
├── app.js        # UDP Server
└── client.js     # UDP Client
```

---

## Creating the UDP Server

```javascript
import dgram from "node:dgram";

const socket = dgram.createSocket("udp4");
```

Creates a UDP socket using IPv4.

---

## Listening for Messages

```javascript
socket.on("message", (message, remoteAddress) => {
  console.log(message.toString());
  console.log(remoteAddress);
});
```

Whenever a UDP packet reaches the server, this event is triggered.

`message`

Contains the received data as a Buffer.

```javascript
message.toString();
```

Converts the Buffer into a readable string.

Example:

```
Hi from Client.js
```

---

## Understanding remoteAddress

Example output:

```javascript
{
  address: "10.114.110.23",
  family: "IPv4",
  port: 60852,
  size: 17
}
```

Meaning:

- address → Sender's IP Address
- family → IPv4
- port → Sender's temporary UDP port
- size → Number of bytes received

---

## Sending a Response

```javascript
socket.send(
  "Message Received Successfully on Server",
  remoteAddress.port,
  remoteAddress.address,
);
```

The server sends the response back to the same device that sent the request.

---

## Binding the Server

```javascript
socket.bind({ port: 4000 }, () => {
  console.log("Listening on Port 4000");
});
```

The server starts listening for incoming UDP packets on port **4000**.

---

## Creating the UDP Client

```javascript
import dgram from "node:dgram";

const socket = dgram.createSocket("udp4");
```

---

## Sending a UDP Packet

```javascript
socket.send("Hi from Client.js", 4000, "10.114.110.23", () => {
  console.log("Message Sent");
});
```

The callback only indicates that Node.js handed the packet to the operating system. UDP does **not** guarantee that the packet reaches the server.

---

## Receiving the Server Response

```javascript
socket.on("message", (message, remoteAddress) => {
  console.log(message.toString());
  console.log(remoteAddress);

  socket.close();
});
```

The client receives the reply sent by the server.

---

## Communicating with a Mobile Device

This project also demonstrates communication with a mobile phone using a UDP Sender/Receiver application.

Mobile Configuration

```
Destination IP   : Your Computer IP
Destination Port : 4000
Message           : Hello from Android
```

The Node.js server receives the message and responds back to the mobile application.

Example Server Output

```
Hello from Android

{
    address: '10.114.110.45',
    family: 'IPv4',
    port: 51234,
    size: 18
}
```

The mobile app then receives:

```
Message Received Successfully on Server
```

---

## Communication Flow

```
                Node.js Client
                      |
                      | UDP Packet
                      ▼
             -----------------
             Node.js Server
             Port : 4000
             -----------------
                      ▲
                      |
                 UDP Response
```

Mobile Device

```
             Android Phone
         UDP Sender/Receiver
                |
                | UDP Packet
                ▼
         -----------------
         Node.js Server
         Port : 4000
         -----------------
                ▲
                |
          UDP Response
```

---

## UDP Characteristics

### Advantages

- Extremely fast
- Lightweight protocol
- Low latency
- No connection establishment
- Minimal overhead

### Limitations

- No delivery guarantee
- No packet ordering
- No retransmission
- No congestion control

---

## TCP vs UDP

| TCP                       | UDP                    |
| ------------------------- | ---------------------- |
| Connection-oriented       | Connectionless         |
| Reliable                  | Unreliable             |
| Ordered delivery          | No ordering            |
| Slower                    | Faster                 |
| Error checking & recovery | Minimal error checking |
| Larger overhead           | Very small overhead    |

---

## Real-World Applications

- DNS
- Online Multiplayer Games
- Video Streaming
- Voice Calls (VoIP)
- IoT Devices
- Live Broadcasting
- Device Discovery
- Network Monitoring

---

## Key Takeaways

- Created a UDP server using Node.js.
- Created a UDP client using Node.js.
- Sent and received UDP packets.
- Understood the `message` event and `remoteAddress`.
- Sent responses back to the sender.
- Communicated between Node.js and a mobile UDP Sender/Receiver application.
- Learned the differences between UDP and TCP.
- Explored how UDP is used in real-world networking applications.
