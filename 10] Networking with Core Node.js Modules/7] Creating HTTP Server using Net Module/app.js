// Creating HTTP Server using Net Module

import { createReadStream } from "node:fs";
import net from "node:net";


const server = net.createServer((socket) => {
  socket.write("HTTP/1.1\n\n"); // you can access content on any device using Ip of this device
  const readStream = createReadStream("river.webp");
  readStream.pipe(socket);
  readStream.on("end", () => {
    console.log("File ended");
  });

    socket.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  socket.on("close", () => {
    console.log(socket.remoteAddress, ": Client disconnected");
  });

  socket.on("error", () => {
    console.log("Client Lost");
  });
  console.log("Client Connected", socket.remoteAddress);
});

server.listen(4000, "0.0.0.0", () => {
  console.log("Server started on port 4000");
});
