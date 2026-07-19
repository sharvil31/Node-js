// Handling Files & Streams Using Promises
import fs from "fs/promises";

// Handling Files
// const fileHandle = await fs.open("text.txt");
// const fileHandle = await fs.open("text.txt", "r+");

// // const buff = await fileHandle.read();
// const buff = await fileHandle.read({ buffer: Buffer.alloc(10) });
// // console.log(buff);
// // const { buffer, bytesWritten } = await fileHandle.write("Hii");
// const { buffer, bytesWritten } = await fileHandle.write(Buffer.from("Hii"));

// console.log({buffer});
// console.log({bytesWritten});

// fileHandle.close() // returns promise with value undefined


// Handling Streams

// To use Streams with promises, we need to first open file to use createReadStream and createWriteStream

// const fileHandle = await fs.open("text.txt", "w+"); // open file

// Reading
// const readStream = fileHandle.createReadStream(); // directly returns readStream without wrapping in promise

// use all stream methods
// readStream.on("data", (chunk) => {
//     console.log(chunk);
// })

// Writing
// const writeStream = fileHandle.createWriteStream(); // directly returns writeStream without wrapping in promise

// writeStream.write("Hii");


// pipe - auto handles backpressure
const readFileHandle = await fs.open("E:\\[AO] Heaven s Feel I - Presage Flower [1080p] [Dual].mkv");
const writeFileHandle = await fs.open("streams.mp4", "w");

const readStream = readFileHandle.createReadStream();
const writeStream = writeFileHandle.createWriteStream();

readStream.pipe(writeStream);