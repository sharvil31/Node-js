import express from "express";
import http from "node:http";

const app = express();

app.disable("x-powered-by");

app.get("/", (req, res) => {
//   res.end("Hello World!");
  res.send("Hello World!");
  // send is equivalent to two lines
  // res.setHeader("Content-Type", "text/html: charset=utf8");
  // res.end("Hello World")
});

app.get("/test", (req, res) => {
  res.end("Hello Test!");
});

console.log(app);

const server = http.createServer(app)
server.listen(3000)

app.listen(4000, () => {
  console.log(`Example app listening on port 4000`);
});
