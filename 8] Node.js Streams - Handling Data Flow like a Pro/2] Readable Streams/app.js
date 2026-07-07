import fs from "fs/promises";

console.time()
const contentBuffer = await fs.readFile("E:\[AO] Heaven's Feel III - Spring Song [1080p] [Dual].mkv");
// const a = contentBuffer.toString();

fs.writeFile("base64.mp4", contentBuffer)
console.timeEnd()
// console.log(contentBuffer.byteLength);

// time: 1.6s
// memory: 1888 mb
// CPU: 3%