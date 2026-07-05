// import fsPromises from "fs/promises";
import fs from "fs";

setTimeout(() => {
  console.log("Hii");
}, 0);

// Async I/O
// const fileContent = await fsPromises.readFile("text.txt", "utf-8"); // method 1

// fs.readFile("text.txt", "utf-8", (err, data) => {
//     console.log(data)
// }); // method 2

// Sync I/O
// const fileContent = fs.readFileSync("text.txt", "utf-8");
// console.log(fileContent);
