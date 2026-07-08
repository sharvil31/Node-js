import fs from "fs";

const readStream = fs.createReadStream("chars.txt", { highWaterMark: 4 });

readStream.on("data", (chunk) => {
  //   readStream.pause();
  //   console.log(readStream.readableFlowing);
  //   console.log(readStream.readableEnded);
  //   console.log(readStream.isPaused());
});

// readStream.on("end", () => {
//     console.log(readStream.readableEnded);
//     console.log(readStream.readableFlowing);
//     console.log(readStream.isPaused());
// });

// console.log(readStream.readableFlowing);
// console.log(readStream.readableEnded);
// // readStream.pause();
// console.log(readStream.isPaused());

if (fs.readFileSync("abc.txt").byteLength) {
  fs.writeFileSync("abc.txt", "");
}

readStream.on("data", (chunk) => {
//   console.log(chunk);

  fs.appendFileSync("abc.txt", chunk);
//   readStream.pause();
//   setTimeout(() => {
//     readStream.resume();
//   }, 500);
});

readStream.on("resume", () => {
    console.log("Stream Resumed")
})

readStream.on("pause", () => {
    console.log("Stream Paused")
})
