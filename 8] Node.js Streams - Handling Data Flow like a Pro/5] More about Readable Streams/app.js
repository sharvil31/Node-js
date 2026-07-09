// More about Readable Streams

import fs from "fs";

const readStream = fs.createReadStream("chars.txt", { highWaterMark: 4 });

readStream.on("data", (chunk) => {
  console.log(chunk); // before it was buffer now string
});

readStream.on("close", () => {
  console.log("Closed"); // fires when finished reading // runs after close event
});

readStream.on("end", () => {
  console.log("ended"); // fires when finished reading // runs before close event
});

readStream.setEncoding("utf-8");
// readStream.destroy();
