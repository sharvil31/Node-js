// Handling Multiple TCP Clients

import net from "node:net"

process.stdin.on("data", (input) => {
    const inputStr = input.toString();
    const [clientIndex] = inputStr.split(" ");
    if(typeof parseInt(clientIndex) === "number") {
        clientlists[parseInt(clientIndex)].write(inputStr.substring(1));
    } else {
        clientlists.forEach((socket) => socket.write(input));
    }
});

const clientlists = [];

const server = net.createServer((socket) => {
    clientlists.push(socket);
    console.log(clientlists.length);
    socket.on("data", (chunk) => {
        console.log(chunk.toString());
        // socket.write("Got your message");
        // clientlists.forEach((socket) => socket.write(chunk));
        // socket.end();
    });

    socket.on("close", () => {
        console.log(socket.remoteAddress, ": Client Disconnected");
    })

    socket.on("error", () => {
        console.log("Client Lost");
    })

    console.log("Client Connected: ", socket.remoteAddress);
});

server.listen(4000, "0.0.0.0", () => {
    console.log("Server started on port 4000");
});
