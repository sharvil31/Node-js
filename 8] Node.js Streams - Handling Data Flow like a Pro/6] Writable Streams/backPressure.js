// backpressure

import fs from "fs";

const writeStream = fs.createWriteStream("file.txt");

console.time();
const readStream = fs.createReadStream(
  "E:\\[AO] Heaven s Feel I - Presage Flower [1080p] [Dual].mkv", // 2.14 gb file
  { highWaterMark: 1 * 1024 * 1024 },
);

readStream.on("data", (chunkBuffer) => {
  // time: 4-6s
  // memory: 90-100mb
  // CPU: max 12-17%
  const isEmpty = writeStream.write(chunkBuffer);
  if (!isEmpty) readStream.pause();
});

writeStream.on("drain", () => {
  readStream.resume();
});

readStream.on("end", () => {
  console.timeEnd();
});
