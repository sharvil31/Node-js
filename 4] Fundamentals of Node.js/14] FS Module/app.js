// import fs from "node:fs";
import fs from "node:fs/promises";

// const contentBuffer = fs.readFileSync("./index.html");
// const content = fs.readFileSync("./index.html", "utf-8");

// fs.readFile("./NPX-searching-steps.txt", (err, data) => {
//     const content = data.toString();
//     console.log(content);
// });

let i = 0;

console.time();
const timerId = setInterval(() => {
  console.log(i++);
  if (i === 50) {
    clearInterval(timerId);
    console.timeEnd()
  }
}, 5);

const a = await fs.readFile("./NPX-searching-steps.txt", "utf-8");
console.log("Reading Done");

// const content = contentBuffer.toString();

console.log("end");
