import http from "http";
import fs from "fs/promises";

const server = http.createServer(async (req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  // res.setHeader("Content-Type", "text/txt");
  // res.setHeader("Content-Type", "image/webp");
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", "attachment; filename=[AO] Heaven s Feel I - Presage Flower [1080p] [Dual].mkv");

  // const fileHandle = await fs.open("abc.txt")
  // const fileHandle = await fs.open("river.webp")
  const fileHandle = await fs.open("E:\\[AO] Heaven s Feel I - Presage Flower [1080p] [Dual].mkv")
  // const readStream = fileHandle.createReadStream({ highWaterMark: 1000 });
  const { size } = await fileHandle.stat();
  res.setHeader("Content-Length", size);
  const readStream = fileHandle.createReadStream({ highWaterMark: 10 * 1024 * 1024 });

  readStream.on("data", (chunk) => {
    res.write(chunk);

    readStream.pause();

    setTimeout(() => {
      readStream.resume()
    }, 1000)
  })

  readStream.on("end", () => {
    res.end()
  })
});

// req - Readable, res - Writable

server.listen(4000, "localhost", () => {
  console.log("Server Started");
});
