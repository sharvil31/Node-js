
// client.js
import dgram from "node:dgram"; 

const socket = dgram.createSocket("udp4")

socket.send("Hi from Client.js", 4000, "10.114.110.23", () => {
    console.log("Message Sent"); // udp just sends request it doesnt care if request is received or not
});

socket.on("message", (message, remoteAddress) => {
    console.log(message.toString());
    console.log(remoteAddress);
    socket.close()
});