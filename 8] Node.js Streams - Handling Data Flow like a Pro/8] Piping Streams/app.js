// Piping Streams

import fs, { write } from "fs";

console.time()
const readStream = fs.createReadStream(
  "E:\\[AO] Heaven s Feel I - Presage Flower [1080p] [Dual].mkv",
  { highWaterMark: 1 * 1024 * 1024 },
);
const writeStream = fs.createWriteStream("streams.mp4", {
  highWaterMark: 1 * 1024 * 1024,
});

// readStream.on("data", (chunk) => {
//   const isEmpty = writeStream.write(chunk);
//   if (!isEmpty) readStream.pause();
// });

// writeStream.on("drain", () => {
//   readStream.resume();
// });

// We can do same task using .pipe
readStream.pipe(writeStream) // pipe handles writing, backpressure, pause, resume on his own. we dont need to handle anything.

setTimeout(() => {
    readStream.unpipe(writeStream); // Allows you to removing piping.
}, 1000);

writeStream.on("unpipe", () => {
    console.log("Unpiped"); // runs after unpiping the readStream;
})

readStream.on("end", () => {
    console.timeEnd()
})