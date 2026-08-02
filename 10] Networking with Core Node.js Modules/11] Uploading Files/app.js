import { createWriteStream } from "node:fs";
import { open } from "node:fs/promises";
import net from "node:net";

const server = net.createServer(async (socket) => {
  socket.write("HTTP/1.1 200 OK\n");  
  socket.write("Access-Control-Allow-Origin: *\n\n");

  const writeStream = createWriteStream("uploader-file.txt")

  // socket.on("data", (chunk) => console.log(chunk.toString()));
  // let count = 0
  socket.on("data", (chunk) => {
    writeStream.write(chunk);
    // console.log(++count);
    if(/WebKitFormBoundary.+--/.test(chunk.toString())) socket.end("Got the data");
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
