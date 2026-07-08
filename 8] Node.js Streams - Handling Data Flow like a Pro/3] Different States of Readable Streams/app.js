import fs from "fs";

const readStream = fs.createReadStream("chars.txt");

readStream.on("data", (chunk) => {
//   readStream.pause();
//   console.log(readStream.readableFlowing);
//   console.log(readStream.readableEnded);
//   console.log(readStream.isPaused());
});

readStream.on("end", () => {
    console.log(readStream.readableEnded);
    console.log(readStream.readableFlowing);
    console.log(readStream.isPaused());
});

// console.log(readStream.readableFlowing);
// console.log(readStream.readableEnded);
// // readStream.pause();
// console.log(readStream.isPaused());

