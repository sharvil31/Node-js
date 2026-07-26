// Transferring Files Using TCP

import { createReadStream, createWriteStream } from "node:fs";
import net from "node:net"

process.stdin.on("data", (input) => {
    const inputStr = input.toString().trim();
    if (inputStr === "send") {
        // transferring files from client to server - Upload functionality
        const readStream = createReadStream("E:\\Namaste DSA\\16-13 N Queens.mkv");

        readStream.pipe(socket);
        readStream.on("end", () => {
            console.log("File Ended");
        })
    }
})

const socket = net.createConnection({ host: "10.159.110.23", port: 4000 });

// transferring files from server to client - Download functionality
// const writeStream = createWriteStream("C:\\Users\\SHARVIL AMBURLE\\Desktop\\Video2.mp4");

// socket.pipe(writeStream);

socket.on("error", () => {
    console.log("Server Lost");
})