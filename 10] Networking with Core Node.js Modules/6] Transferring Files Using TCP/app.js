// Transferring Files Using TCP

import { createReadStream, createWriteStream } from "node:fs";
import net from "node:net"

const server = net.createServer((socket) => { // Socket is a Duplex Stream

    // transferring files from client to server - Upload functionality
    const writeStream = createWriteStream("video.mp4");
    socket.pipe(writeStream)
    socket.on("data", () => {
        console.log("Got Data");
    })

    // transferring files from server to client - Download functionality
    // const readStream = createReadStream("video.mp4");
    // readStream.pipe(socket);

    // readStream.on("end", () => {
    //     console.log("File Ended");
    // })

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
