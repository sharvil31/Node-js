// Transferring Files Using UDP

import dgram from "node:dgram";
import { writeFile } from "node:fs/promises";

const socket = dgram.createSocket("udp4");

socket.on("message", async (message, remoteAddress) => {
    // await writeFile("num.txt", message);
    await writeFile("abc.txt", message);

    socket.send("Message Received Successfully on Server", remoteAddress.port, remoteAddress.address)
});

socket.bind({ port: 4000 }, () => {
    console.log(socket.address());
    const address = socket.address()
    console.log(`Listening on port ${address.port}`);
})