// Creating TCP Server in Node.js

import net from "node:net"

// Creating Server
const server = net.createServer((socket) => { // socket - duplex stream
    // new device connection
    socket.on("data", (chunk) => {
        console.log(chunk.toString());
        socket.write("HTTP\n\nGot your message"); // brower can understand tcp request because http is based on tcp
        socket.end();
        // socket.end("HTTP\n\nGot your message"); 
    });

    // socket.write("HTTP\n\nGot your message");
    // socket.end();

    socket.on("close", () => {
        console.log(socket.remoteAddress, ": Client Disconnected");
    })

    socket.on("error", () => {
        console.log("Client Lost");
    })

    // console.log(socket.address());
    console.log("Client Connected: ", socket.remoteAddress);
    // console.log(socket.remotePort);
    // console.log(socket.remoteFamily);
});

// Starting a server
// server.listen(4000); // Starts on host 0.0.0.0 and runs on all available IP addresses
server.listen(4000, "0.0.0.0", () => { // by default Ipv6
    console.log("Server started on port 4000");
});
// OR use method
//fires when server starts
// server.on("listening", () => {
//     console.log("Server started on port 4000");
// });
