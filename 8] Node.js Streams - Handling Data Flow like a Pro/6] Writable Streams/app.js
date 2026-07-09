// Writable Streams

import fs from "fs";

// const writeStream = fs.createWriteStream("file.txt");

// console.log(writeStream.writableHighWaterMark) // 16kb (16384 bytes) internal Buffer

// writeStream.write("abc")
// writeStream.write("123")
// writeStream.write("abc")
console.time();

const readStream = fs.createReadStream(
  //   "E:\\[AO] Heaven's Feel III - Spring Song [1080p] [Dual].mkv", // 1.82 gb file
  "E:\\[AO] Heaven s Feel I - Presage Flower [1080p] [Dual].mkv", // 2.14 gb file
  { highWaterMark: 1 * 1024 * 1024 }, // 100 mb size // by default 64 Kib (65536 bytes)
);

// readStream.on("data", (chunkBuffer) => {
// time: 22s
// memory: max 65mb
// CPU: 3-4%
//   fs.appendFileSync("streams.mp4", chunkBuffer); // 2.14 gb file
// });

const writeStream = fs.createWriteStream("streams.mp4");

readStream.on("data", (chunkBuffer) => {
  // time: 6-10s
  // memory: 900-1000mb
  // CPU: max 24%
  writeStream.write(chunkBuffer);
});

readStream.on("end", () => {
  console.timeEnd();
});
