import fs, { createWriteStream } from "fs";

// console.time();
// for (let i = 1; i <= 100000; i++) {
//     fs.appendFileSync("numbers.txt", `${i} `)
// }

// console.timeEnd();
// time: 23s

// with Streams

console.time();

const writeStream = createWriteStream("streamNumbers.txt")

for (let i = 1; i <= 100000; i++) {
    writeStream.write(`${i} `)
}

writeStream.end();

writeStream.on("finish", () => {
    console.timeEnd();
});

// time: 400ms