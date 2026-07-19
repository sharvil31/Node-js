// Handling Files Using Promises
import fs from "fs/promises";

// const fileHandle = await fs.open("text.txt");
const fileHandle = await fs.open("text.txt", "r+");

// const buff = await fileHandle.read();
const buff = await fileHandle.read({ buffer: Buffer.alloc(10) });
// console.log(buff);
// const { buffer, bytesWritten } = await fileHandle.write("Hii");
const { buffer, bytesWritten } = await fileHandle.write(Buffer.from("Hii"));

console.log({buffer});
console.log({bytesWritten});

fileHandle.close() // returns promise with value undefined