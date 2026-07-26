import { createReadStream } from "node:fs";
import net from "node:net";

const server = net.createServer((socket) => {

  socket.write("HTTP/1.1 200 OK\r\n");
  socket.write("Content-Type: text/plain\r\n");
  socket.write("Access-Control-Allow-Origin: *\r\n");
  socket.write("Access-Control-Expose-Headers: Hello, name\r\n");
  socket.write("Hello: World\r\n");
  socket.write("name: sharvil\r\n");
  socket.write("\r\n"); // End of headers

  const readStream = createReadStream("numbers.txt");

  readStream.pipe(socket);

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