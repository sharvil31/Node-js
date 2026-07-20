import http from "http";

const server = http.createServer(async (req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("Content-Type", "text/txt");

  // res.end("Hello World");
  res.write("Hello World");
});

// req - Readable, res - Writable

server.listen(4000, "localhost", () => {
  console.log("Server Started");
});

