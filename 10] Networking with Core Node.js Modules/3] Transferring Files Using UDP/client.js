// Transferring Files Using UDP

// client.js
import dgram from "node:dgram";
import { createReadStream } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

const socket = dgram.createSocket("udp4")

socket.on("message", (message, remoteAddress) => {
    console.log(message.toString());
    console.log(remoteAddress);
    socket.close()
});

// const content = await readFile(
//     // "C:\\Users\\SHARVIL AMBURLE\\Downloads\\num.txt", // 6 kb
//     "C:\\Users\\SHARVIL AMBURLE\\Downloads\\numbers.txt", // 672 kb // has limited size so UDP drops it. need to read in chunks.
//     "utf-8"
// );

// socket.send(content, 4000, "10.114.110.23", () => {
//     console.log("Message Sent"); // udp just sends request it doesnt care if request is received or not
// });

// const readStream = createReadStream("C:\\Users\\SHARVIL AMBURLE\\Downloads\\numbers.txt", { highWaterMark: 1000 });
const readStream = createReadStream("E:\\Namaste DSA\\16-13 N Queens.mkv", { highWaterMark: 1000 }); // 263 MB file

readStream.on("data", (chunk) => {
    socket.send(chunk, 4000, "10.114.110.23", () => {
        // console.log("Message Sent"); // udp just sends request it doesnt care if request is received or not
    });
});

readStream.on("end", () => {
    socket.send("EOF", 4000, "10.114.110.23", () => {
        console.log("Message Sent"); // udp just sends request it doesnt care if request is received or not
    });
})