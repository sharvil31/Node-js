// Writable Streams

import fs from "fs";

// const writeStream = fs.createWriteStream("file.txt");

// writeStream.write("abc")
// writeStream.write("123")
// writeStream.write("abc")
// console.time();

// const readStream = fs.createReadStream(
//   //   "E:\\[AO] Heaven's Feel III - Spring Song [1080p] [Dual].mkv", // 1.82 gb file
//   "E:\\[AO] Heaven s Feel I - Presage Flower [1080p] [Dual].mkv", // 2.14 gb file
//   { highWaterMark: 1 * 1024 * 1024 }, // 100 mb size // by default 64 Kib (65536 bytes)
// );

// // readStream.on("data", (chunkBuffer) => {
// // time: 22s
// // memory: max 65mb
// // CPU: 3-4%
// //   fs.appendFileSync("streams.mp4", chunkBuffer); // 2.14 gb file
// // });

// const writeStream = fs.createWriteStream("streams.mp4");

// readStream.on("data", (chunkBuffer) => {
//   // time: 6-10s
//   // memory: 900-1000mb
//   // CPU: max 24%
//   writeStream.write(chunkBuffer);
// });

// readStream.on("end", () => {
//   console.timeEnd();
// });

// BackPressure and Internal Buffer of WritableStream

// console.log(writeStream.writableHighWaterMark) // 16kb (16384 bytes) internal Buffer

const writeStream = fs.createWriteStream("file.txt", { highWaterMark: 4 });
// console.log(writeStream.writableHighWaterMark);
// console.log(writeStream.writableLength);

// for (let i = 1; i <= 10; i++) {
//   let isEmpty = writeStream.write("a");
//   console.log(writeStream.writableLength, isEmpty);
// }

// Give WriteStream some time to empty stream

// let i = 1;

// const write1000A = () => {
//   while (i <= 1000) {
//     console.log(writeStream.writableLength);
//     const isEmpty = writeStream.write("a");
//     i++;
//     if (!isEmpty) break;
//     console.log(isEmpty);
//   }
// };

// write1000A();

// writeStream.on("drain", () => {
//   console.log("Drained", writeStream.writableLength);
//   write1000A();
// });


// Closing Writable Streams

// Where readStream closes on his own after completed reading, writeStream doesn't close after done writing.

writeStream.write("a");

writeStream.on("open", (fd) => {
  console.log("fd", fd) // when a writeStream is created, a file discriptor is assigned to it. It is a number. When a writeStream doesn't close, this fd stays in 
                          // memory
})  

writeStream.on("finish", () => {
  console.log("Finished") // logs nothing without writeStream.end()
}) 

writeStream.on("close", () => {
  console.log("Closed")
}) 

writeStream.end("b"); // ends writeStream. Has a optional arguments which get write in file before ending. Fires finish event first then close event

writeStream.write("a"); // throws error cause writeStream is already ended