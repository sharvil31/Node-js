import fs from "fs";

console.time();

// time: 1.6s
// memory: 1888 mb
// CPU: 3%
// const contentBuffer = await fs.readFile(
//   "E:\[AO] Heaven's Feel III - Spring Song [1080p] [Dual].mkv",
// );
// // const a = contentBuffer.toString();
// fs.writeFile("base64.mp4", contentBuffer);

let readCount = 0;
const readStream = fs.createReadStream(
  //   "E:\\[AO] Heaven's Feel III - Spring Song [1080p] [Dual].mkv", // 1.82 gb file
  "E:\\[AO] Heaven s Feel I - Presage Flower [1080p] [Dual].mkv", // 2.14 gb file
  { highWaterMark: 1 * 1024 * 1024 }, // 100 mb size // by default 64 Kib (65536 bytes)
);

// readStream.on("data", (chunkBuffer) => {
//   console.log(chunkBuffer);
//   console.log(chunkBuffer.byteLength);
// });

// time: 24s
// memory: 50 mb
// CPU: 5-6%
readStream.on("data", (chunkBuffer) => {
  readCount++;
  //   fs.appendFileSync("base.mp4", chunkBuffer); // 1.82 gb file
  fs.appendFileSync("base2.mp4", chunkBuffer); // 2.14 gb file
//   if (chunkBuffer.byteLength < 1 * 1024 * 1024) {
//     console.timeEnd();
//   }
});

readStream.on("end", () => {
    console.log(readCount);
    console.timeEnd();
})

// const readStream = fs.createReadStream("chars.txt", { highWaterMark: 16 });
// readStream.on("data", (chunk) => {
//     console.log(chunk.byteLength)
// })

// console.log(contentBuffer.byteLength);
