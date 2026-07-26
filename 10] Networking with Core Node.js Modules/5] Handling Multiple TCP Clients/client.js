// Handling Multiple TCP Clients

import net from "node:net"

process.stdin.on("data", (input) => {
    // process.stdout.write(`You typed: ${input}`);
    // console.log(input.toString());
    socket.write(input)
})

const socket = net.createConnection({ host: "10.159.110.23", port: 4000 });

socket.on("error", () => {
    console.log("Server Lost");
})


socket.on("data", (chunk) => {
    console.log(chunk.toString());
});