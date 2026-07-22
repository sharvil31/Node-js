// Creating UDP Server in Node.js

import dgram from "node:dgram"; // UDP

const socket = dgram.createSocket("udp4");
// console.log(socket); // EventEmitter

socket.on("message", (a, b) => {
    console.log(a, b);
});

// socket.on("listening", () => { // calls only on Bind method
//     console.log(socket.address());
//     console.log("listening");
// });

socket.bind({ port: 4000 }, () => {
    console.log(socket.address());
    const address = socket.address()
    console.log(`Listening on port ${address.port}`);
}) // Starts on a port. optional params(port, address, cb)

// We cannot open it on Browser cause browser only listens requests from Http server and this is a UDP server, 