// More about Readable Streams

import fs from "fs";

const readStream = fs.createReadStream("chars.txt", { highWaterMark: 4, encoding: "utf-8" });

readStream.on("data", (chunk) => {
  console.log(chunk); // before it was buffer now string
  // readStream.destroy(new Error("Err"))
});

// readStream.on("close", () => {
//   console.log("Closed"); // fires when finished reading // runs after close event
// });

// readStream.on("end", () => {
//   console.log("ended"); // fires when finished reading // runs before close event
// });

// readStream.on("error", (err) => {  // receive fron .destroy()
//   console.log(err)
// })

// readStream.on("open", (data) => {
//   console.log("opened", data)
// })

// readStream.on("ready", (data) => {
//   console.log("ready", data)
// })

// readStream.setEncoding("utf-8");
// readStream.destroy();
