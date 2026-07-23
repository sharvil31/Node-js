
// client.js
import dgram from "node:dgram"; 
import { readFile, writeFile } from "node:fs/promises";

const socket = dgram.createSocket("udp4")

socket.on("message", (message, remoteAddress) => {
    console.log(remoteAddress);
    socket.close()
});

const content = await readFile(
    // "C:\\Users\\SHARVIL AMBURLE\\Downloads\\num.txt", 
    "C:\\Users\\SHARVIL AMBURLE\\Downloads\\numbers.txt", 
    "utf-8");

socket.send(content, 4000, "10.114.110.23", () => {
    console.log("Message Sent"); // udp just sends request it doesnt care if request is received or not
});