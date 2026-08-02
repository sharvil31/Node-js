import { createReadStream } from "node:fs";
import { open } from "node:fs/promises";
import net from "node:net";

const server = net.createServer(async (socket) => {

  // const fileHandle = await open("numbers.txt")
  // const fileHandle = await open("E:\\Namaste DSA\\6-6 Merge Sort.mkv")
  // const fileHandle = await open("Sharvil-Resume.pdf")
  const fileHandle = await open("river.webp")
  const { size } = await fileHandle.stat();
  const readStream = fileHandle.createReadStream();

  socket.write("HTTP/1.1 200 OK\r\n");

  // important Response headers
  // socket.write("Content-Type: text/txt; charset=utf-8\r\n"); // proper deoding of emojis
  // socket.write("Content-Type: video/mp4\r\n");
  // socket.write("Content-Type: application/pdf\r\n");
  socket.write("Content-Type: image/webp\r\n");
  socket.write(`Content-Length: ${size}\r\n`); // if set content-length and passed content's length is equal then browser disconnects socket after he gets data. if its less or more then browser keeps connection alive
  socket.write("Content-Disposition: attachment; filename=River.webp\r\n");
  socket.write("\r\n"); // End of headers

  readStream.pipe(socket);
  // socket.write("abcdefghi")
  // socket.end();

  readStream.on("end", () => {
    console.log("File Ended");
  })

  readStream.on("error", console.error);
  socket.on("error", console.error);

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