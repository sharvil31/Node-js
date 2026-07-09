import fs from "fs";

const readStream = fs.createReadStream("chars.txt", { highWaterMark: 4 });

// console.log(readStream.read());

// readStream.on("data", (chunk) => {
//   console.log(chunk);
// });

readStream.on("readable", () => {
  console.log(readStream.readableLength);
//   console.log(readStream.read());
//   console.log(readStream.read(1));
  console.log(readStream.read(3));
  console.log(readStream.readableLength);
});
