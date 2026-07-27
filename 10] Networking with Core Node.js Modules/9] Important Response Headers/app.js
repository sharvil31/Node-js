import { createReadStream } from "node:fs";
import { open } from "node:fs/promises";
import net from "node:net";

const server = net.createServer((socket) => {

  const fileHandle = await open("numbers.txt")

  socket.write("HTTP/1.1 200 OK\r\n");

  // important Response headers
  socket.write("Content-Type: text/txt; charset=utf-8\r\n"); // proper deoding of emojis
  socket.write("Content-Length: 7\r\n"); // if set content-length and passed content's length is equal then browser disconnects socket after he gets data. if its less or more then browser keeps connection alive
  socket.write("\r\n"); // End of headers

  const readStream = createReadStream("numbers.txt");

  // readStream.pipe(socket);
  socket.write("abcdefghi") 
  // socket.end();

  readStream.on("end", () => {
    console.log("File Ended");
  })

  socket.on("data", chunk => {
    console.log(chunk.toString());
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });

});

server.listen(4000, () => {
  console.log("Server started");
});