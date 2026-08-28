import express from "express";
import { open } from "fs/promises";

const app = express();

// Serving Static Files using Express
// app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.end("Home Route");
// });

// app.get("/test", async (req, res) => {
//   // const fileHandle = await open("download.mp4");
//   // const readStream = fileHandle.createReadStream();
//   // const stats = await fileHandle.stat();
//   // res.setHeader("Content-Length", stats.size);
//   // res.setHeader("Content-Type", "video/mp4");
//   // res.setHeader("Accept-Ranges", "bytes");
//   // readStream.pipe(res);
//   res.sendFile(`${import.meta.dirname}/download.mp4`);
// });

// Sending JSON using express
app.get("/", (req, res) => {
  // res.setHeader("Content-Type", "application/json");
  // res.end(JSON.stringify({message: "Hello World!!"}));
  // res.json({message: "Hello World!!"});
  res.status(201).json({message: "Hello World!!"});
});

app.listen(4000, () => {
  console.log(`Example app listening on port 4000`);
});
