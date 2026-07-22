// Creating UDP Server in Node.js

import dgram from "node:dgram"; // UDP

const socket = dgram.createSocket("udp4");
// console.log(socket); // EventEmitter

// send udp request from UDP Sender/Receiver app from mobile
socket.on("message", (message, remoteAddress) => {
    console.log(message.toString());
    console.log(remoteAddress);

    socket.send("Message Received Successfully on Server", remoteAddress.port, remoteAddress.address)
});

// socket.on("listening", () => { // calls only on Bind method
//     console.log(socket.address());
//     console.log("listening");
// });

// server (receiving udp request) Multiple devices can send requests to this server
socket.bind({ port: 4000 }, () => {
    console.log(socket.address());
    const address = socket.address()
    console.log(`Listening on port ${address.port}`);
}) // Starts on a port. optional params(port, address, cb)

// sending udp request
// socket.send("Hi from Node.js", 3000, "10.114.110.68");

// We cannot open it on Browser cause browser only listens requests from Http server and this is a UDP server, 