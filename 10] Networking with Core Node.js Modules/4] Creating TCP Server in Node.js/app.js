// Creating TCP Server in Node.js

import net from "node:net"

// Creating Server
const server = net.createServer();

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

// new device connection
server.on("connection", (socket) => { // socket - duplex stream
    socket.on("data", (chunk) => {
        console.log(chunk.toString());
        socket.end("HTTP\n\nGot your message"); // brower can understand tcp request because http is based on tcp
    });

    socket.on("close", () => {
        console.log(socket.remoteAddress, ": Client Disconnected");
    })

    // console.log(socket.address());
    console.log("Client Connected: ", socket.remoteAddress);
    // console.log(socket.remotePort);
    // console.log(socket.remoteFamily);
    console.log("Client Connected");
})