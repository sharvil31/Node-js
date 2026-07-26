// Creating TCP Server in Node.js

import net from "node:net"

const socket = net.createConnection({ host: "10.159.110.23", port: 4000 });

socket.on("error", () => {
    console.log("Server Lost");
})

setTimeout(() => {
    socket.write("Hii");
    socket.end();
}, 2000);

socket.on("data", (chunk) => {
    console.log(chunk.toString());
});